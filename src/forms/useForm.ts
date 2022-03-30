import {useCallback, useEffect, useRef, useState} from 'react';
import isEqual from 'lodash/isEqual';
import {default as Axios} from 'axios'
import {hrefToUrl, mergeDataIntoQueryString, urlWithoutHash} from './url'
import {ActiveVisit, VisitOptions, VisitParams, Method, PendingVisit, RequestPayload, GlobalEventNames, GlobalEvent, GlobalEventResult} from "./types";
import {fireBeforeEvent, fireSuccessEvent, fireErrorEvent, fireExceptionEvent, fireFinishEvent, fireInvalidEvent, fireProgressEvent, fireStartEvent} from "./events";
import {objectToFormData} from "./formData";

export class Router {
    protected visitOptions!: VisitOptions
    protected activeVisit?: ActiveVisit

    public init({visitOptions}: { visitOptions: VisitOptions }): void {
        this.visitOptions = visitOptions
    }

    protected cancelVisit(
        activeVisit: ActiveVisit,
        {cancelled = false, interrupted = false}: { cancelled?: boolean, interrupted?: boolean },
    ): void {
        if (activeVisit && !activeVisit.completed && !activeVisit.cancelled && !activeVisit.interrupted) {
            activeVisit.cancelToken.cancel()
            activeVisit.onCancel()
            activeVisit.completed = false
            activeVisit.cancelled = cancelled
            activeVisit.interrupted = interrupted
            fireFinishEvent(activeVisit)
            activeVisit.onFinish(activeVisit)
        }
    }

    protected finishVisit(visit: ActiveVisit): void {
        if (!visit.cancelled && !visit.interrupted) {
            visit.completed = true
            visit.cancelled = false
            visit.interrupted = false
            fireFinishEvent(visit)
            visit.onFinish(visit)
        }
    }

    public visit(href: string | URL, params: VisitParams = {}): void {
        const options: Required<VisitParams> = {
            method: Method.GET,
            data: {},
            replace: false,
            only: [],
            headers: {},
            errorBag: '',
            forceFormData: false,
            queryStringArrayFormat: 'brackets',
            onCancelToken: () => {
            },
            onBefore: () => {
            },
            onStart: () => {
            },
            onProgress: () => {
            },
            onFinish: () => {
            },
            onCancel: () => {
            },
            onSuccess: () => {
            },
            onError: () => {
            },
            ...params,
        }

        let url = typeof href === 'string' ? hrefToUrl(href) : href

        const prepared = this.visitOptions(options, url) || options
        const {method, replace, only, headers, errorBag, forceFormData, queryStringArrayFormat, onCancelToken, onBefore, onStart, onProgress, onFinish, onCancel, onSuccess, onError} = prepared
        let {data} = prepared

        if (((data) || forceFormData) && !(data instanceof FormData)) {
            data = objectToFormData(data)
        }

        if (!(data instanceof FormData)) {
            const [_href, _data] = mergeDataIntoQueryString(method, url, data, queryStringArrayFormat)
            url = hrefToUrl(_href)
            data = _data
        }

        const visit: PendingVisit = {
            url,
            method,
            data,
            replace,
            only,
            headers,
            errorBag,
            forceFormData,
            queryStringArrayFormat,
            cancelled: false,
            completed: false,
            interrupted: false,
        }

        if (onBefore(visit) === false || !fireBeforeEvent(visit)) {
            return
        }

        if (this.activeVisit) {
            this.cancelVisit(this.activeVisit, {interrupted: true})
        }

        this.activeVisit = {...visit, onCancelToken, onBefore, onStart, onProgress, onFinish, onCancel, onSuccess, onError, queryStringArrayFormat, cancelToken: Axios.CancelToken.source()}

        onCancelToken({
            cancel: () => {
                if (this.activeVisit) {
                    this.cancelVisit(this.activeVisit, {cancelled: true})
                }
            },
        })

        fireStartEvent(visit)
        onStart(visit)

        // @ts-ignore
        // @ts-ignore
        Axios({
            method,
            url: urlWithoutHash(url).href,
            data: method === Method.GET ? {} : data,
            params: method === Method.GET ? data : {},
            cancelToken: this.activeVisit.cancelToken.token,
            headers: {
                ...headers,
                Accept: 'text/html, application/xhtml+xml',
                'X-Requested-With': 'XMLHttpRequest'
            },
            onUploadProgress: progress => {
                if (data instanceof FormData) {
                    progress.percentage = Math.round(progress.loaded / progress.total * 100)
                    fireProgressEvent(progress)
                    onProgress(progress)
                }
            },
        }).then((response) => {
            const errors = response.data.errors || {}
            if (Object.keys(errors).length > 0) {
                const scopedErrors = errorBag ? (errors[errorBag] ? errors[errorBag] : {}) : errors
                fireErrorEvent(scopedErrors)
                return onError(scopedErrors)
            }

            fireSuccessEvent(response);
            return onSuccess(response);
            // @ts-ignore
        }).catch(error => {
            if (error.response) {
                fireInvalidEvent(error.response)
            } else {
                return Promise.reject(error)
            }
        }).then(() => {
            if (this.activeVisit) {
                this.finishVisit(this.activeVisit)
            }

            // @ts-ignore
        }).catch(error => {
            if (!Axios.isCancel(error)) {
                const throwException = fireExceptionEvent(error)
                if (this.activeVisit) {
                    this.finishVisit(this.activeVisit)
                }
                if (throwException) {
                    return Promise.reject(error)
                }
            }
        })
    }

    public get(url: URL | string, data: RequestPayload = {}, options: Exclude<VisitParams, 'method' | 'data'> = {}): void {
        return this.visit(url, {...options, method: Method.GET, data})
    }

    public reload(options: Exclude<VisitParams, 'preserveScroll' | 'preserveState'> = {}): void {
        return this.visit(window.location.href, {...options})
    }

    public replace(url: URL | string, options: Exclude<VisitParams, 'replace'> = {}): void {
        console.warn(`Inertia.replace() has been deprecated and will be removed in a future release. Please use Inertia.${options.method ?? 'get'}() instead.`)
        return this.visit(url, {...options, replace: true})
    }

    public post(url: URL | string, data: RequestPayload = {}, options: Exclude<VisitParams, 'method' | 'data'> = {}): void {
        return this.visit(url, {...options, method: Method.POST, data})
    }

    public put(url: URL | string, data: RequestPayload = {}, options: Exclude<VisitParams, 'method' | 'data'> = {}): void {
        return this.visit(url, {...options, method: Method.PUT, data})
    }

    public patch(url: URL | string, data: RequestPayload = {}, options: Exclude<VisitParams, 'method' | 'data'> = {}): void {
        return this.visit(url, {...options, method: Method.PATCH, data})
    }

    public delete(url: URL | string, options: Exclude<VisitParams, 'method'> = {}): void {
        return this.visit(url, {...options, method: Method.DELETE})
    }

    public on<TEventName extends GlobalEventNames>(type: TEventName, callback: (event: GlobalEvent<TEventName>) => GlobalEventResult<TEventName>): VoidFunction {
        const listener = ((event: GlobalEvent<TEventName>) => {
            const response = callback(event)
            if (event.cancelable && !event.defaultPrevented && response === false) {
                event.preventDefault()
            }
        }) as EventListener

        document.addEventListener(`inertia:${type}`, listener)
        return () => document.removeEventListener(`inertia:${type}`, listener)
    }
}

const router = new Router();

export default function useForm(...args: any) {
    const isMounted = useRef(null)
    const [defaults, setDefaults] = useState((typeof args[0] === 'string' ? args[1] : args[0]) || {})
    const cancelToken = useRef(null)
    const [data, setData] = useState(defaults);
    const [errors, setErrors] = useState({});
    const [hasErrors, setHasErrors] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [progress, setProgress] = useState(null)
    const [wasSuccessful, setWasSuccessful] = useState(false)
    const [recentlySuccessful, setRecentlySuccessful] = useState(false)
    let transform = (data: any) => data

    useEffect(() => {
        // @ts-ignore
        isMounted.current = true
        return () => {
            // @ts-ignore
            isMounted.current = false
        }
    }, [])

    const submit = useCallback(
        (method, url, options = {}) => {
            const _options = {
                ...options,
                onCancelToken: (token: any) => {
                    cancelToken.current = token

                    if (options.onCancelToken) {
                        return options.onCancelToken(token)
                    }
                },
                onBefore: (visit: any) => {
                    setWasSuccessful(false)
                    setRecentlySuccessful(false)

                    if (options.onBefore) {
                        return options.onBefore(visit)
                    }
                },
                onStart: (visit: any) => {
                    setProcessing(true)

                    if (options.onStart) {
                        return options.onStart(visit)
                    }
                },
                onProgress: (event: any) => {
                    setProgress(event)

                    if (options.onProgress) {
                        return options.onProgress(event)
                    }
                },
                onSuccess: (page: any) => {
                    if (isMounted.current) {
                        setProcessing(false)
                        setProgress(null)
                        setErrors({})
                        setHasErrors(false)
                        setWasSuccessful(true)
                        setRecentlySuccessful(true)
                    }

                    if (options.onSuccess) {
                        return options.onSuccess(page)
                    }
                },
                onError: (errors: any) => {
                    if (isMounted.current) {
                        setProcessing(false)
                        setProgress(null)
                        setErrors(errors)
                        setHasErrors(true)
                    }

                    if (options.onError) {
                        return options.onError(errors)
                    }
                },
                onCancel: () => {
                    if (isMounted.current) {
                        setProcessing(false)
                        setProgress(null)
                    }

                    if (options.onCancel) {
                        return options.onCancel()
                    }
                },
                onFinish: () => {
                    if (isMounted.current) {
                        setProcessing(false)
                        setProgress(null)
                    }

                    cancelToken.current = null

                    if (options.onFinish) {
                        return options.onFinish()
                    }
                },
            }

            if (method === 'delete') {
                router.delete(url, {..._options, data: transform(data)})
            } else {
                router[method](url, transform(data), _options)
            }
        },
        [data, setErrors],
    )

    return {
        data,
        setData(key: any, value: any) {
            if (typeof key === 'string') {
                setData({...data, [key]: value})
            } else if (typeof key === 'function') {
                setData((data: any) => key(data))
            } else {
                setData(key)
            }
        },
        isDirty: !isEqual(data, defaults),
        errors,
        hasErrors,
        processing,
        progress,
        wasSuccessful,
        recentlySuccessful,
        transform(callback: any) {
            transform = callback
        },
        setDefaults(key: any, value: any) {
            if (typeof key === 'undefined') {
                setDefaults(() => data)
            } else {
                setDefaults((defaults: any) => ({
                    ...defaults,
                    ...(value ? {[key]: value} : key),
                }))
            }
        },
        reset(...fields: any) {
            if (fields.length === 0) {
                setData(defaults)
            } else {
                setData(
                    Object.keys(defaults)
                        .filter((key) => fields.includes(key))
                        .reduce((carry, key) => {
                            carry[key] = defaults[key]
                            return carry
                        }, {...data}),
                )
            }
        },
        setError(key: any, value: any) {
            setErrors(errors => {
                const newErrors = {
                    ...errors,
                    ...(value ? {[key]: value} : key),
                }
                setHasErrors(Object.keys(newErrors).length > 0)
                return newErrors
            })
        },
        clearErrors(...fields: any) {
            setErrors(errors => {
                const newErrors = Object.keys(errors).reduce(
                    (carry, field) => ({
                        ...carry,
                        ...(fields.length > 0 && !fields.includes(field) ? {[field]: errors[field]} : {}),
                    }),
                    {},
                )
                setHasErrors(Object.keys(newErrors).length > 0)
                return newErrors
            })
        },
        submit,
        get(url: any, options: any) {
            submit('get', url, options)
        },
        post(url: any, options: any) {
            submit('post', url, options)
        },
        put(url: any, options: any) {
            submit('put', url, options)
        },
        patch(url: any, options: any) {
            submit('patch', url, options)
        },
        delete(url: any, options: any) {
            submit('delete', url, options)
        }
    }
}

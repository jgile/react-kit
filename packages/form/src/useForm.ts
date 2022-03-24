import {useCallback, useEffect, useRef, useState} from 'react'
import isEqual from 'lodash.isequal';
import get from 'lodash.get';
import {hrefToUrl, mergeDataIntoQueryString, urlWithoutHash} from './lib/url';
import {Method} from './lib/types';
import {hasFiles} from "./lib/files";
import {objectToFormData} from "./lib/formData";
import axios from "axios";

type VisitConfig = {
    method: string
    data: object,
    replace: boolean,
    headers: object,
    errorBag: string
    forceFormData: boolean,
    onCancelToken: () => any,
    onBefore: (visit) => any,
    onStart: (visit) => any,
    onProgress: (percent) => any,
    onFinish: () => any,
    onSuccess: (data) => any,
    onError: (errors) => any,
    queryStringArrayFormat: string
};

const Visitor = {
    config: {},
    visitor: {
        visit(href, {
            method = Method.GET,
            data = {},
            replace = false,
            headers = {},
            errorBag = '',
            forceFormData = false,
            onCancelToken = () => {
            },
            onBefore = () => {
            },
            onStart = () => {
            },
            onProgress = () => {
            },
            onFinish = () => {
            },
            onSuccess = (response) => response,
            onError = () => {
            },
            queryStringArrayFormat = 'brackets',
        }: VisitConfig) {
            let url = typeof href === 'string' ? hrefToUrl(href) : href;

            if (this.activeVisit && this.activeVisit.processing) {
                return;
            }

            // Create form data if has files
            if ((hasFiles(data) || forceFormData) && !(data instanceof FormData)) {
                data = objectToFormData(data);
            }

            // If not FormData,
            if (!(data instanceof FormData)) {
                const [_href, _data] = mergeDataIntoQueryString(method, url, data, queryStringArrayFormat);
                url = hrefToUrl(_href);
                data = _data
            }

            const visit: {
                url: string,
                method: string,
                data: any,
                replace: any,
                headers: any,
                errorBag: any,
                forceFormData: boolean,
                queryStringArrayFormat: string,
                completed: boolean,
                interrupted: boolean,
                cancelled: boolean,
            } = {
                url,
                method,
                data,
                replace,
                headers,
                errorBag,
                forceFormData,
                queryStringArrayFormat,
                completed: false,
                interrupted: false,
                cancelled: false,
            };

            this.activeVisit = Object.assign(Object.assign({}, visit), {onCancelToken, onBefore, onStart, onProgress, onFinish, onSuccess, onError, queryStringArrayFormat});

            if (onBefore(visit) === false) {
                return;
            }

            onStart(visit);

            return Promise.resolve(this.config).then(config => {
                return new Promise((resolve, reject) => {
                    return axios({
                        method: method,
                        url: urlWithoutHash(url).href,
                        data: method === Method.GET ? {} : data,
                        params: method === Method.GET ? data : {},
                        headers: Object.assign(Object.assign({}, headers), {'X-Requested-With': 'XMLHttpRequest'}),
                        onUploadProgress: progress => {
                            if (data instanceof FormData) {
                                progress.percentage = Math.round(progress.loaded / progress.total * 100);
                                onProgress(progress);
                            }
                        },
                        ...config
                    }).then((response) => {
                        const errors = get(response, 'data.errors', {}) || {};

                        if (this.activeVisit) {
                            this.finishVisit(this.activeVisit);
                        }

                        if (Object.keys(errors).length > 0) {
                            const scopedErrors = errorBag ? (errors[errorBag] ? errors[errorBag] : {}) : errors;
                            return onError(scopedErrors);
                        }

                        onSuccess(response.data);

                        return resolve(response.data);
                    }).catch((error) => {
                        const errors = get(error, 'response.data.errors', {});

                        if (this.activeVisit) {
                            this.finishVisit(this.activeVisit);
                        }

                        if (Object.keys(errors).length > 0) {
                            const scopedErrors = errorBag ? (errors[errorBag] ? errors[errorBag] : {}) : errors;
                            return onError(scopedErrors);
                        }

                        return reject(error);
                    })
                });
            });
        },

        finishVisit(visit) {
            visit.completed = true;
            visit.cancelled = false;
            visit.interrupted = false;
            visit.onFinish(visit);
        },

        get(url, data = {}, options = {}) {
            return this.visit(url, Object.assign(Object.assign({}, options), {method: Method.GET, data}));
        },

        post(url, data = {}, options = {}) {
            return this.visit(url, Object.assign(Object.assign({preserveState: true}, options), {method: Method.POST, data}));
        },

        put(url, data = {}, options = {}) {
            return this.visit(url, Object.assign(Object.assign({preserveState: true}, options), {method: Method.PUT, data}));
        },

        patch(url, data = {}, options = {}) {
            return this.visit(url, Object.assign(Object.assign({preserveState: true}, options), {method: Method.PATCH, data}));
        },

        delete(url, options = {}) {
            return this.visit(url, Object.assign(Object.assign({preserveState: true}, options), {method: Method.DELETE}));
        }
    },
    useForm(...args) {
        const isMounted = useRef(null)
        const defaults = (typeof args[0] === 'string' ? args[1] : args[0]) || {}
        const cancelToken = useRef(null)
        const recentlySuccessfulTimeoutId = useRef(null)
        const [data, setData] = useState(defaults)
        const [response, setResponse] = useState({})
        const [errors, setErrors] = useState({})
        const [hasErrors, setHasErrors] = useState(false)
        const [processing, setProcessing] = useState(false)
        const [progress, setProgress] = useState(null)
        const [wasSuccessful, setWasSuccessful] = useState(false)
        const [recentlySuccessful, setRecentlySuccessful] = useState(false)

        let transform = (data) => data

        useEffect(() => {
            isMounted.current = true
            return () => {
                isMounted.current = false
            }
        }, [])

        const submit = useCallback(
            (method, url, options = {}) => {
                const _options = {
                    ...options,
                    onBefore: (visit) => {
                        setWasSuccessful(false)
                        setRecentlySuccessful(false)
                        clearTimeout(recentlySuccessfulTimeoutId.current)

                        if (options.onBefore) {
                            return options.onBefore(visit)
                        }
                    },
                    onStart: (visit) => {
                        setProcessing(true)

                        if (options.onStart) {
                            return options.onStart(visit)
                        }
                    },
                    onProgress: (event) => {
                        setProgress(event)

                        if (options.onProgress) {
                            return options.onProgress(event)
                        }
                    },
                    onSuccess: (response) => {
                        setResponse(response);

                        if (isMounted.current) {
                            setProcessing(false)
                            setProgress(null)
                            setErrors({})
                            setHasErrors(false)
                            setWasSuccessful(true)
                            setRecentlySuccessful(true)
                            recentlySuccessfulTimeoutId.current = setTimeout(() => {
                                if (isMounted.current) {
                                    setRecentlySuccessful(false)
                                }
                            }, 2000)
                        }

                        if (options.onSuccess) {
                            return options.onSuccess(response)
                        }
                    },
                    onError: (errors) => {
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

                        if (options.onFinish) {
                            return options.onFinish()
                        }
                    },
                }

                if (method === 'delete') {
                    return this.visitor.delete(url, {..._options, data: transform(data)})
                } else {
                    return this.visitor[method](url, transform(data), _options)
                }
            },
            [data, setErrors],
        )

        return {
            data,
            response,
            setData(key, value) {
                if (typeof value === 'object' && 'target' in value && value.target) {
                    value = value.target.value;
                }

                if (typeof key === 'string') {
                    setData({...data, [key]: value})
                } else if (typeof key === 'function') {
                    setData(data => key(data))
                } else {
                    setData(key)
                }

                return this;
            },
            isDirty: !isEqual(data, defaults),
            errors,
            hasErrors,
            processing,
            progress,
            wasSuccessful,
            recentlySuccessful,
            transform(callback) {
                transform = callback
            },
            reset(...fields) {
                if (!fields.length) {
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
            clearErrors(...fields) {
                setErrors(
                    Object.keys(errors).reduce(
                        (carry, field) => ({
                            ...carry,
                            ...(fields.length > 0 && !fields.includes(field) ? {[field]: errors[field]} : {}),
                        }),
                        {},
                    ),
                )
                setHasErrors(Object.keys(errors).length > 0)
            },
            submit,
            get(url, options) {
                return submit('get', url, options)
            },
            post(url, options) {
                return submit('post', url, options)
            },
            put(url, options) {
                return submit('put', url, options)
            },
            patch(url, options) {
                return submit('patch', url, options)
            },
            delete(url, options) {
                return submit('delete', url, options)
            },
            cancel() {
                if (cancelToken.current) {
                    cancelToken.current.cancel()
                }
            },
        }
    }
};

const useForm = Visitor.useForm;

export default useForm;
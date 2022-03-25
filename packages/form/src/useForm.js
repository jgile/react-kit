import {useCallback, useEffect, useRef, useState} from 'react'
import isEqual from 'lodash.isequal';
import get from 'lodash.get';
import {hrefToUrl, mergeDataIntoQueryString, urlWithoutHash} from './lib/url';
import {Method} from './lib/types';
import {hasFiles} from "./lib/files";
import {objectToFormData} from "./lib/formData";
import axios from "axios";

export const Visitor = {
    onBefore: (config) => config,

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
    },

    visit(href, {
        method = Method.GET,
        data = {},
        headers = {},
        errorBag = '',
        forceFormData = false,
        queryStringArrayFormat = 'brackets',
        onProgress = () => ({}),
        onFinish = () => ({}),
        onError = () => ({}),
        onBefore = () => ({}),
        onSuccess = (response) => response
    }) {
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

        const visit = {
            url,
            method,
            data,
            headers,
            errorBag,
            forceFormData,
            queryStringArrayFormat,
            onFinish,
            completed: false,
            interrupted: false,
            cancelled: false,
        };

        onBefore(visit)

        return Promise.resolve(this.onBefore(visit)).then(visit => {
            this.activeVisit = visit;
            return new Promise((resolve, reject) => {
                return axios({
                    method: visit.method,
                    url: urlWithoutHash(visit.url).href,
                    data: visit.method === Method.GET ? {} : visit.data,
                    params: visit.method === Method.GET ? visit.data : {},
                    headers: Object.assign(Object.assign({}, visit.headers), {'X-Requested-With': 'XMLHttpRequest'}),
                    onUploadProgress: progress => {
                        if (visit.data instanceof FormData) {
                            progress.percentage = Math.round(progress.loaded / progress.total * 100);
                            onProgress(progress);
                        }
                    },
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
};

export function createNewForm(http) {
    return function (...args) {
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

        useEffect(() => {
            isMounted.current = true
            return () => {
                isMounted.current = false
            }
        }, [])

        const submit = useCallback((method, url, options = {}) => {
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
                return http.delete(url, {..._options, data: data});
            }

            return http[method](url, data, _options)
        }, [data, setErrors]);

        return {
            data,
            response,
            isDirty: !isEqual(data, defaults),
            errors,
            hasErrors,
            processing,
            progress,
            wasSuccessful,
            recentlySuccessful,
            submit,
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
}

const useForm = createNewForm(Visitor);

export default useForm;

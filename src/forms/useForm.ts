import {useCallback, useEffect, useRef, useState} from 'react';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import {default as Axios} from 'axios'
import {hrefToUrl, mergeDataIntoQueryString, urlWithoutHash} from './url'
import {Errors, Method, Progress, VisitParams,} from "./types";
import {AxiosError} from 'axios';
import {objectToFormData} from "./formData";
import {hasFiles} from "./files";

export default function useForm(args: object = {}, options: object = {}, requestOptions: object = {}) {
    const isMounted = useRef(null)
    const [defaults, setDefaults] = useState(args)
    const [data, setData] = useState(args);
    const [errors, setErrors] = useState({});
    const [hasErrors, setHasErrors] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [progress, setProgress] = useState(null)
    const [wasSuccessful, setWasSuccessful] = useState(false)
    const [recentlySuccessful, setRecentlySuccessful] = useState(false)
    const [defaultOptions, setDefaultOptions] = useState(options);
    const [defaultRequestOptions, setDefaultRequestOptions] = useState(requestOptions)
    let transform = (data: object) => data

    useEffect(() => {
        //@ts-ignore
        isMounted.current = true
        return () => {
            //@ts-ignore
            isMounted.current = false
        }
    }, [])

    const submit = useCallback((method: Method, href: any, options: object = {}, requestOptions: object = {}) => {
        let url = typeof href === 'string' ? hrefToUrl(href) : href
        let transformedData: object = transform(data);

        const mergedOptions: VisitParams = {
            forceFormData: false,
            queryStringArrayFormat: 'brackets',
            onStart: (config: object) => config,
            onProgress: (progress: Progress) => progress,
            onSuccess: (response: any) => response,
            onCatch: (errors: AxiosError) => errors,
            onError: (errors: Errors) => errors,
            onFinish: () => ({}),
            ...defaultOptions,
            ...options
        };

        //@ts-ignore
        if ((hasFiles(transformedData) || mergedOptions.forceFormData) && !(transformedData instanceof FormData)) {
            //@ts-ignore
            transformedData = objectToFormData(transformedData)
        }

        if (!(transformedData instanceof FormData)) {
            //@ts-ignore
            const [_href, _data] = mergeDataIntoQueryString(method, url, transformedData, mergedOptions.queryStringArrayFormat)
            url = hrefToUrl(_href)
            transformedData = _data
        }

        const mergedConfig = {
            method: method,
            url: urlWithoutHash(url).href,
            data: method === Method.GET ? {} : transformedData,
            params: method === Method.GET ? transformedData : {},
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            onUploadProgress: (progress: Progress) => {
                if (data instanceof FormData) {
                    progress.percentage = Math.round(progress.loaded / progress.total * 100)
                    // @ts-ignore
                    mergedOptions.onProgress(progress)
                }
            },
            ...defaultRequestOptions,
            ...requestOptions,
        }

        setProcessing(true)
        setWasSuccessful(false)
        setRecentlySuccessful(false)

        // @ts-ignore
        return Promise.resolve(mergedOptions.onStart(mergedConfig)).then((newConfig) => {
            return Axios(newConfig ?? mergedConfig).then((response) => {
                if (isMounted.current) {
                    const errors = response.data.errors || {}
                    setProcessing(false)
                    setProgress(null)
                    setErrors(errors)

                    if (Object.keys(errors).length > 0) {
                        setHasErrors(true)
                        // @ts-ignore
                        mergedOptions.onError(errors)
                        return response;
                    }

                    setHasErrors(false)
                    setWasSuccessful(true)
                    setRecentlySuccessful(true)
                }

                // @ts-ignore
                mergedOptions.onSuccess(response);

                return response.data;
            }).catch((error: AxiosError) => {
                setHasErrors(true)
                setProcessing(false)
                setProgress(null)

                if (error.response) {
                    // @ts-ignore
                    setErrors(get(errors.response, 'data.errors', {}))
                    // @ts-ignore
                    mergedOptions.onCatch(errors);
                } else {
                    return Promise.reject(error)
                }

                return error;
            }).finally(() => {
                // @ts-ignore
                mergedOptions.onFinish();
            });
        });
    }, [data, defaultOptions, defaultRequestOptions]);

    return {
        submit,
        data,
        errors,
        hasErrors,
        processing,
        progress,
        wasSuccessful,
        recentlySuccessful,
        isDirty: !isEqual(data, defaults),
        setOptions(options: any = {}) {
            setDefaultOptions(options);
        },
        setRequestOptions(options: any = {}) {
            setDefaultRequestOptions(options);
        },
        setData(key: any, value: any) {
            if (typeof key === 'string') {
                if (value && value.target && value.target.value) {
                    value = value.target.value;
                }
                setData({...data, [key]: value})
            } else if (typeof key === 'function') {
                setData((data: any) => key(data))
            } else {
                setData(key)
            }
        },
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
        get(url: any, options: any = {}, requestOptions: any = {}) {
            return submit(Method.GET, url, options, requestOptions)
        },
        post(url: any, options: any = {}, requestOptions: any = {}) {
            return submit(Method.POST, url, options, requestOptions)
        },
        put(url: any, options: any = {}, requestOptions: any = {}) {
            return submit(Method.PUT, url, options, requestOptions)
        },
        patch(url: any, options: any = {}, requestOptions: any = {}) {
            return submit(Method.PATCH, url, options, requestOptions)
        },
        delete(url: any, options: any = {}, requestOptions: any = {}) {
            return submit(Method.DELETE, url, options, requestOptions)
        }
    }
}

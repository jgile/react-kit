import {useCallback, useEffect, useRef, useState} from 'react';
import isEqual from 'lodash/isEqual';
import axios, {AxiosRequestConfig, AxiosResponse} from 'axios'
import {hrefToUrl, mergeDataIntoQueryString, urlWithoutHash} from './url'
import {Errors, Progress, RequestPayload, VisitParams} from "./types";
import {AxiosError} from 'axios';
import {objectToFormData} from "./formData";
import {hasFiles} from "./files";

export function isFormData(payload: RequestPayload): payload is FormData {
    return typeof payload === 'object' && payload instanceof FormData;
}

export default function useForm<Args extends RequestPayload, S extends VisitParams, R extends AxiosRequestConfig>(args: Args = {} as Args, options: S = {} as S, requestOptions: R = {} as R) {
    const isMounted = useRef(null)
    const [defaults, setDefaults] = useState(args)
    const [data, setData] = useState<Args>(args);
    const [errors, setErrors] = useState({});
    const [response, setResponse] = useState({});
    const [hasErrors, setHasErrors] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [progress, setProgress] = useState(null)
    const [wasSuccessful, setWasSuccessful] = useState(false)
    const [recentlySuccessful, setRecentlySuccessful] = useState(false)
    const [defaultOptions, setDefaultOptions] = useState<S>(options);
    const [defaultRequestOptions, setDefaultRequestOptions] = useState<R>(requestOptions)
    let transform = (data: Args): any => data

    useEffect(() => {
        //@ts-ignore
        isMounted.current = true
        return () => {
            //@ts-ignore
            isMounted.current = false
        }
    }, [])

    const submit = useCallback((requestOptions: AxiosRequestConfig = {}, options: VisitParams = {}) => {
        let url: URL = hrefToUrl(requestOptions.url || '')
        let method = requestOptions.method || 'get'
        let transformedData = transform(data);

        const mergedOptions: VisitParams = {
            forceFormData: false,
            queryStringArrayFormat: 'brackets',
            onStart: (config: object) => config,
            onProgress: (progress: Progress) => progress,
            onSuccess: (response: AxiosResponse) => response,
            onCatch: (errors: AxiosError) => errors,
            onError: (errors: Errors) => errors,
            onFinish: () => ({}),
            ...defaultOptions,
            ...options
        };

        if ((hasFiles(transformedData) || mergedOptions.forceFormData) && !isFormData(transformedData)) {
            transformedData = objectToFormData(transformedData)
        }

        if (!(transformedData instanceof FormData)) {
            const [_href, _data] = mergeDataIntoQueryString(method, url, transformedData, mergedOptions.queryStringArrayFormat)
            url = hrefToUrl(_href)
            transformedData = _data
        }

        const mergedConfig = {
            method: method,
            url: urlWithoutHash(url).href,
            data: ['get', 'GET'].includes(method) ? {} : transformedData,
            params: ['get', 'GET'].includes(method) ? transformedData : {},
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                //@ts-ignore
                ...(window?.axios?.defaults?.headers?.common ?? {}),
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
            return axios(newConfig ?? mergedConfig).then((response) => {
                if (isMounted.current) {
                    const errors = response.data.errors || {}
                    setProcessing(false)
                    setProgress(null)
                    setResponse(response.data || {})
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

                return response;
            }).catch((error: AxiosError) => {
                setHasErrors(true)
                setProcessing(false)
                setProgress(null)

                if (error.response) {
                    setErrors(error.response.data.errors ?? {});
                    // @ts-ignore
                    mergedOptions.onCatch(error.response);
                    return error.response;
                }

                return Promise.reject(error);
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
        response,
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
        setData(key: ((data: any) => Args) | string | Args, value?: any) {
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
                            //@ts-ignore
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
        get(requestOptions: any = {}, options: any = {}) {
            return submit(requestOptions, options);
        },
        post(options: any = {}, requestOptions: any = {}) {
            requestOptions.method = 'POST'
            return submit(requestOptions, options)
        },
        put(options: any = {}, requestOptions: any = {}) {
            requestOptions.method = 'PUT'
            return submit(requestOptions, options)
        },
        patch(options: any = {}, requestOptions: any = {}) {
            requestOptions.method = 'PATCH'
            return submit(requestOptions, options)
        },
        delete(options: any = {}, requestOptions: any = {}) {
            requestOptions.method = 'DELETE'
            return submit(requestOptions, options)
        }
    }
}

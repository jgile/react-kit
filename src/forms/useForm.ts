import {useCallback, useEffect, useRef, useState} from 'react';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import set from 'lodash/set';
import axios, {AxiosRequestConfig, AxiosResponse} from 'axios'
import {hrefToUrl, mergeDataIntoQueryString, urlWithoutHash} from './url'
import {Errors, Progress, RequestPayload, VisitParams} from "./types";
import {AxiosError} from 'axios';
import {objectToFormData} from "./formData";
import {hasFiles} from "./files";

interface NestedObject {
    [key: string]: any | NestedObject;
}

export type UseFormObject = {
    submit: (requestOptions?: AxiosRequestConfig, options?: VisitParams) => Promise<unknown>;
    data: NestedObject;
    delete(requestOptions?: Partial<AxiosRequestConfig>, options?: Partial<VisitParams>): Promise<unknown>;
    put(requestOptions?: Partial<AxiosRequestConfig>, options?: Partial<VisitParams>): Promise<unknown>;
    patch(requestOptions?: Partial<AxiosRequestConfig>, options?: Partial<VisitParams>): Promise<unknown>;
    transform(callback: any): void;
    isDirty: boolean;
    post(requestOptions?: Partial<AxiosRequestConfig>, options?: Partial<VisitParams>): Promise<unknown>;
    bindField(name: string, defaultValue?: any): { onChange: (value: any) => void; name: string; value: any[string] };
    get(requestOptions?: Partial<AxiosRequestConfig>, options?: Partial<VisitParams>): Promise<unknown>;
    setOptions(options?: any): void;
    getData(key: string, defaultValue?: any): any;
    recentlySuccessful: boolean;
    hasErrors: boolean;
    setRequestOptions(options?: any): void;
    setData: (key: (((data: any) => any) | string | any), value?: any) => void;
    clearErrors(...fields: any): void;
    wasSuccessful: boolean;
    setDefaults(key: any, value: any): void;
    response: Partial<AxiosResponse<any, any>>;
    setError(key: any, value: any): void;
    processing: boolean;
    progress: any;
    reset(...fields: any): void;
    errors: {}
};

export function isFormData(payload: RequestPayload): payload is FormData {
    return typeof payload === 'object' && payload instanceof FormData;
}

export default function useForm<Args extends RequestPayload, S extends VisitParams, R extends AxiosRequestConfig>(
    args: Args = {} as Args,
    requestOptions: R = {} as R,
    formOptions: S = {} as S
): UseFormObject {
    const isMounted = useRef(null)
    const [defaults, setDefaults] = useState(args)
    const [data, setData] = useState<Args>(args);
    const [errors, setErrors] = useState({});
    const [response, setResponse] = useState<Partial<AxiosResponse>>({});
    const [hasErrors, setHasErrors] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [progress, setProgress] = useState(null)
    const [wasSuccessful, setWasSuccessful] = useState(false)
    const [recentlySuccessful, setRecentlySuccessful] = useState(false)
    const [defaultOptions, setDefaultOptions] = useState<S>(formOptions);
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

    const setDataFunction = (key: ((data: any) => Args) | string | Args, value?: any): void => {
        let state = {...data};
        if (typeof key === 'string') {
            if (value && value.target && typeof value.target.value !== 'undefined') {
                if (value.target.type === 'checkbox') {
                    value = value.target.checked;
                } else {
                    value = value.target.value;
                }
            }

            set(state, key, value);
        } else if (typeof key === 'function') {
            state = key(data);
        } else {
            state = key;
        }

        setData(state)
    };

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
        setData: setDataFunction,
        getData(key: string, defaultValue: any = null) {
            return get(data, key, defaultValue)
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
        bindField(name: string, defaultValue: any = null) {
            return {
                name: name,
                value: typeof data[name] !== "undefined" ? data[name] : defaultValue,
                onChange: (value: any) => {
                    // @ts-ignore
                    setDataFunction(name, value);
                },
            }
        },
        get(requestOptions: Partial<AxiosRequestConfig> = {}, options: Partial<VisitParams> = {}) {
            return submit(requestOptions, options);
        },
        post(requestOptions: Partial<AxiosRequestConfig> = {}, options: Partial<VisitParams> = {}) {
            requestOptions.method = 'POST'
            return submit(requestOptions, options)
        },
        put(requestOptions: Partial<AxiosRequestConfig> = {}, options: Partial<VisitParams> = {}) {
            requestOptions.method = 'PUT'
            return submit(requestOptions, options)
        },
        patch(requestOptions: Partial<AxiosRequestConfig> = {}, options: Partial<VisitParams> = {}) {
            requestOptions.method = 'PATCH'
            return submit(requestOptions, options)
        },
        delete(requestOptions: Partial<AxiosRequestConfig> = {}, options: Partial<VisitParams> = {}) {
            requestOptions.method = 'DELETE'
            return submit(requestOptions, options)
        }
    }
}

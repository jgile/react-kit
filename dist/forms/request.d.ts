import { FormDataConvertible } from "./types";
export declare function request<T extends Record<string, FormDataConvertible>>(requestOptions?: object, options?: object, data?: T): {
    submit: (requestOptions?: import("axios").AxiosRequestConfig<any>, options?: Partial<import("./types").Visit & {
        onCatch: (errors: import("axios").AxiosError<any, any>) => import("axios").AxiosError<any, any>;
        onStart: (config: any) => any;
        onProgress: (progress: import("./types").Progress) => any;
        onFinish: () => any;
        onSuccess: (response: import("axios").ResponseType) => any;
        onError: (errors: Record<string, string>) => any;
    }>) => Promise<import("axios").AxiosResponse<any, any>>;
    data: T;
    errors: {};
    response: Partial<import("axios").AxiosResponse<any, any>>;
    hasErrors: boolean;
    processing: boolean;
    progress: null;
    wasSuccessful: boolean;
    recentlySuccessful: boolean;
    isDirty: boolean;
    setOptions(options?: any): void;
    setRequestOptions(options?: any): void;
    setData: (key: string | T | ((data: any) => T), value?: any) => void;
    getData(key: string, defaultValue?: any): any;
    transform(callback: any): void;
    setDefaults(key: any, value: any): void;
    reset(...fields: any): void;
    setError(key: any, value: any): void;
    clearErrors(...fields: any): void;
    bindField(name: string, defaultValue?: any): {
        name: string;
        value: any;
        onChange: (value: any) => void;
    };
    get(requestOptions?: Partial<import("axios").AxiosRequestConfig<any>>, options?: Partial<Partial<import("./types").Visit & {
        onCatch: (errors: import("axios").AxiosError<any, any>) => import("axios").AxiosError<any, any>;
        onStart: (config: any) => any;
        onProgress: (progress: import("./types").Progress) => any;
        onFinish: () => any;
        onSuccess: (response: import("axios").ResponseType) => any;
        onError: (errors: Record<string, string>) => any;
    }>>): Promise<import("axios").AxiosResponse<any, any>>;
    post(requestOptions?: Partial<import("axios").AxiosRequestConfig<any>>, options?: Partial<Partial<import("./types").Visit & {
        onCatch: (errors: import("axios").AxiosError<any, any>) => import("axios").AxiosError<any, any>;
        onStart: (config: any) => any;
        onProgress: (progress: import("./types").Progress) => any;
        onFinish: () => any;
        onSuccess: (response: import("axios").ResponseType) => any;
        onError: (errors: Record<string, string>) => any;
    }>>): Promise<import("axios").AxiosResponse<any, any>>;
    put(requestOptions?: Partial<import("axios").AxiosRequestConfig<any>>, options?: Partial<Partial<import("./types").Visit & {
        onCatch: (errors: import("axios").AxiosError<any, any>) => import("axios").AxiosError<any, any>;
        onStart: (config: any) => any;
        onProgress: (progress: import("./types").Progress) => any;
        onFinish: () => any;
        onSuccess: (response: import("axios").ResponseType) => any;
        onError: (errors: Record<string, string>) => any;
    }>>): Promise<import("axios").AxiosResponse<any, any>>;
    patch(requestOptions?: Partial<import("axios").AxiosRequestConfig<any>>, options?: Partial<Partial<import("./types").Visit & {
        onCatch: (errors: import("axios").AxiosError<any, any>) => import("axios").AxiosError<any, any>;
        onStart: (config: any) => any;
        onProgress: (progress: import("./types").Progress) => any;
        onFinish: () => any;
        onSuccess: (response: import("axios").ResponseType) => any;
        onError: (errors: Record<string, string>) => any;
    }>>): Promise<import("axios").AxiosResponse<any, any>>;
    delete(requestOptions?: Partial<import("axios").AxiosRequestConfig<any>>, options?: Partial<Partial<import("./types").Visit & {
        onCatch: (errors: import("axios").AxiosError<any, any>) => import("axios").AxiosError<any, any>;
        onStart: (config: any) => any;
        onProgress: (progress: import("./types").Progress) => any;
        onFinish: () => any;
        onSuccess: (response: import("axios").ResponseType) => any;
        onError: (errors: Record<string, string>) => any;
    }>>): Promise<import("axios").AxiosResponse<any, any>>;
};
export declare function lazyRequest<T extends Record<string, FormDataConvertible>>(requestOptions?: object, options?: object, data?: T): {
    submit: (requestOptions?: import("axios").AxiosRequestConfig<any>, options?: Partial<import("./types").Visit & {
        onCatch: (errors: import("axios").AxiosError<any, any>) => import("axios").AxiosError<any, any>;
        onStart: (config: any) => any;
        onProgress: (progress: import("./types").Progress) => any;
        onFinish: () => any;
        onSuccess: (response: import("axios").ResponseType) => any;
        onError: (errors: Record<string, string>) => any;
    }>) => Promise<import("axios").AxiosResponse<any, any>>;
    data: T;
    errors: {};
    response: Partial<import("axios").AxiosResponse<any, any>>;
    hasErrors: boolean;
    processing: boolean;
    progress: null;
    wasSuccessful: boolean;
    recentlySuccessful: boolean;
    isDirty: boolean;
    setOptions(options?: any): void;
    setRequestOptions(options?: any): void;
    setData: (key: string | T | ((data: any) => T), value?: any) => void;
    getData(key: string, defaultValue?: any): any;
    transform(callback: any): void;
    setDefaults(key: any, value: any): void;
    reset(...fields: any): void;
    setError(key: any, value: any): void;
    clearErrors(...fields: any): void;
    bindField(name: string, defaultValue?: any): {
        name: string;
        value: any;
        onChange: (value: any) => void;
    };
    get(requestOptions?: Partial<import("axios").AxiosRequestConfig<any>>, options?: Partial<Partial<import("./types").Visit & {
        onCatch: (errors: import("axios").AxiosError<any, any>) => import("axios").AxiosError<any, any>;
        onStart: (config: any) => any;
        onProgress: (progress: import("./types").Progress) => any;
        onFinish: () => any;
        onSuccess: (response: import("axios").ResponseType) => any;
        onError: (errors: Record<string, string>) => any;
    }>>): Promise<import("axios").AxiosResponse<any, any>>;
    post(requestOptions?: Partial<import("axios").AxiosRequestConfig<any>>, options?: Partial<Partial<import("./types").Visit & {
        onCatch: (errors: import("axios").AxiosError<any, any>) => import("axios").AxiosError<any, any>;
        onStart: (config: any) => any;
        onProgress: (progress: import("./types").Progress) => any;
        onFinish: () => any;
        onSuccess: (response: import("axios").ResponseType) => any;
        onError: (errors: Record<string, string>) => any;
    }>>): Promise<import("axios").AxiosResponse<any, any>>;
    put(requestOptions?: Partial<import("axios").AxiosRequestConfig<any>>, options?: Partial<Partial<import("./types").Visit & {
        onCatch: (errors: import("axios").AxiosError<any, any>) => import("axios").AxiosError<any, any>;
        onStart: (config: any) => any;
        onProgress: (progress: import("./types").Progress) => any;
        onFinish: () => any;
        onSuccess: (response: import("axios").ResponseType) => any;
        onError: (errors: Record<string, string>) => any;
    }>>): Promise<import("axios").AxiosResponse<any, any>>;
    patch(requestOptions?: Partial<import("axios").AxiosRequestConfig<any>>, options?: Partial<Partial<import("./types").Visit & {
        onCatch: (errors: import("axios").AxiosError<any, any>) => import("axios").AxiosError<any, any>;
        onStart: (config: any) => any;
        onProgress: (progress: import("./types").Progress) => any;
        onFinish: () => any;
        onSuccess: (response: import("axios").ResponseType) => any;
        onError: (errors: Record<string, string>) => any;
    }>>): Promise<import("axios").AxiosResponse<any, any>>;
    delete(requestOptions?: Partial<import("axios").AxiosRequestConfig<any>>, options?: Partial<Partial<import("./types").Visit & {
        onCatch: (errors: import("axios").AxiosError<any, any>) => import("axios").AxiosError<any, any>;
        onStart: (config: any) => any;
        onProgress: (progress: import("./types").Progress) => any;
        onFinish: () => any;
        onSuccess: (response: import("axios").ResponseType) => any;
        onError: (errors: Record<string, string>) => any;
    }>>): Promise<import("axios").AxiosResponse<any, any>>;
};

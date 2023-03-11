import { FormDataConvertible } from "./types";
export default function visit<T extends Record<string, FormDataConvertible>>(requestOptions?: object, data?: T, options?: object): {
    submit: (requestOptions?: import("axios").AxiosRequestConfig<any>, options?: Partial<import("./types").Visit & {
        onCatch: (errors: import("axios").AxiosError<any, any>) => import("axios").AxiosError<any, any>;
        onStart: (config: any) => any;
        onProgress: (progress: import("./types").Progress) => void;
        onFinish: () => void;
        onSuccess: (response: import("axios").ResponseType) => import("axios").ResponseType;
        onError: (errors: Record<string, string>) => Record<string, string>;
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
    setData(key: string | T | ((data: any) => T), value?: any): void;
    transform(callback: any): void;
    setDefaults(key: any, value: any): void;
    reset(...fields: any): void;
    setError(key: any, value: any): void;
    clearErrors(...fields: any): void;
    get(requestOptions?: Partial<import("axios").AxiosRequestConfig<any>>, options?: Partial<Partial<import("./types").Visit & {
        onCatch: (errors: import("axios").AxiosError<any, any>) => import("axios").AxiosError<any, any>;
        onStart: (config: any) => any;
        onProgress: (progress: import("./types").Progress) => void;
        onFinish: () => void;
        onSuccess: (response: import("axios").ResponseType) => import("axios").ResponseType;
        onError: (errors: Record<string, string>) => Record<string, string>;
    }>>): Promise<import("axios").AxiosResponse<any, any>>;
    post(requestOptions?: Partial<import("axios").AxiosRequestConfig<any>>, options?: Partial<Partial<import("./types").Visit & {
        onCatch: (errors: import("axios").AxiosError<any, any>) => import("axios").AxiosError<any, any>;
        onStart: (config: any) => any;
        onProgress: (progress: import("./types").Progress) => void;
        onFinish: () => void;
        onSuccess: (response: import("axios").ResponseType) => import("axios").ResponseType;
        onError: (errors: Record<string, string>) => Record<string, string>;
    }>>): Promise<import("axios").AxiosResponse<any, any>>;
    put(requestOptions?: Partial<import("axios").AxiosRequestConfig<any>>, options?: Partial<Partial<import("./types").Visit & {
        onCatch: (errors: import("axios").AxiosError<any, any>) => import("axios").AxiosError<any, any>;
        onStart: (config: any) => any;
        onProgress: (progress: import("./types").Progress) => void;
        onFinish: () => void;
        onSuccess: (response: import("axios").ResponseType) => import("axios").ResponseType;
        onError: (errors: Record<string, string>) => Record<string, string>;
    }>>): Promise<import("axios").AxiosResponse<any, any>>;
    patch(requestOptions?: Partial<import("axios").AxiosRequestConfig<any>>, options?: Partial<Partial<import("./types").Visit & {
        onCatch: (errors: import("axios").AxiosError<any, any>) => import("axios").AxiosError<any, any>;
        onStart: (config: any) => any;
        onProgress: (progress: import("./types").Progress) => void;
        onFinish: () => void;
        onSuccess: (response: import("axios").ResponseType) => import("axios").ResponseType;
        onError: (errors: Record<string, string>) => Record<string, string>;
    }>>): Promise<import("axios").AxiosResponse<any, any>>;
    delete(requestOptions?: Partial<import("axios").AxiosRequestConfig<any>>, options?: Partial<Partial<import("./types").Visit & {
        onCatch: (errors: import("axios").AxiosError<any, any>) => import("axios").AxiosError<any, any>;
        onStart: (config: any) => any;
        onProgress: (progress: import("./types").Progress) => void;
        onFinish: () => void;
        onSuccess: (response: import("axios").ResponseType) => import("axios").ResponseType;
        onError: (errors: Record<string, string>) => Record<string, string>;
    }>>): Promise<import("axios").AxiosResponse<any, any>>;
};

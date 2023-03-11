import { Method } from "./types";
export default function visit(href: any, method?: Method, data?: object, options?: object, requestOptions?: object): {
    submit: (method: Method, href: any, options?: object, requestOptions?: object) => Promise<import("axios").AxiosResponse<any, any>>;
    data: object;
    errors: {};
    response: {};
    hasErrors: boolean;
    processing: boolean;
    progress: null;
    wasSuccessful: boolean;
    recentlySuccessful: boolean;
    isDirty: boolean;
    setOptions(options?: any): void;
    setRequestOptions(options?: any): void;
    setData(key: any, value: any): void;
    transform(callback: any): void;
    setDefaults(key: any, value: any): void;
    reset(...fields: any): void;
    setError(key: any, value: any): void;
    clearErrors(...fields: any): void;
    get(url: any, options?: any, requestOptions?: any): Promise<import("axios").AxiosResponse<any, any>>;
    post(url: any, options?: any, requestOptions?: any): Promise<import("axios").AxiosResponse<any, any>>;
    put(url: any, options?: any, requestOptions?: any): Promise<import("axios").AxiosResponse<any, any>>;
    patch(url: any, options?: any, requestOptions?: any): Promise<import("axios").AxiosResponse<any, any>>;
    delete(url: any, options?: any, requestOptions?: any): Promise<import("axios").AxiosResponse<any, any>>;
};

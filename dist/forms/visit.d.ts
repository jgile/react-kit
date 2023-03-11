import { Method } from "./types";
export default function visit(href: any, method?: Method, data?: object, options?: object, requestOptions?: object): {
    submit: (method: Method, href: string | URL, options?: object, requestOptions?: object) => Promise<import("axios").AxiosResponse<any, any>>;
    data: Record<string, import("./types").FormDataConvertible>;
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
    setData(key: string | Record<string, import("./types").FormDataConvertible> | ((data: any) => Record<string, import("./types").FormDataConvertible>), value: any): void;
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

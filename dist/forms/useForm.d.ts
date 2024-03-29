import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { RequestPayload, VisitParams } from "./types";
interface NestedObject {
    [key: string]: any | NestedObject;
}
export declare type UseFormObject = {
    submit: (requestOptions?: AxiosRequestConfig, options?: VisitParams) => Promise<unknown>;
    data: NestedObject;
    delete(requestOptions?: Partial<AxiosRequestConfig>, options?: Partial<VisitParams>): Promise<unknown>;
    put(requestOptions?: Partial<AxiosRequestConfig>, options?: Partial<VisitParams>): Promise<unknown>;
    patch(requestOptions?: Partial<AxiosRequestConfig>, options?: Partial<VisitParams>): Promise<unknown>;
    transform(callback: any): void;
    isDirty: boolean;
    post(requestOptions?: Partial<AxiosRequestConfig>, options?: Partial<VisitParams>): Promise<unknown>;
    bindField(name: string, defaultValue?: any): {
        onChange: (value: any) => void;
        name: string;
        value: any[string];
    };
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
    errors: {};
};
export declare function isFormData(payload: RequestPayload): payload is FormData;
export default function useForm<Args extends RequestPayload, S extends VisitParams, R extends AxiosRequestConfig>(args?: Args, requestOptions?: R, formOptions?: S): UseFormObject;
export {};

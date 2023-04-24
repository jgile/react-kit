import { ResponseType, AxiosError, Method } from 'axios';
export declare type GenericObject = {
    [key: string]: any;
};
export declare type Errors = Record<string, string>;
interface NestedObject {
    [key: string]: any | NestedObject;
}
export declare type FormDataConvertible = Array<FormDataConvertible> | NestedObject | Blob | FormDataEntryValue | Date | boolean | number | null;
export declare type RequestPayload = Record<string, FormDataConvertible> | FormData;
export declare type Progress = ProgressEvent & {
    percentage: number;
};
export declare type Visit = {
    method: Method;
    data: RequestPayload;
    replace: boolean;
    only: Array<string>;
    headers: Record<string, string>;
    errorBag: string | null;
    forceFormData: boolean;
    queryStringArrayFormat: 'indices' | 'brackets';
};
export declare type VisitParams = Partial<Visit & {
    onCatch: {
        (errors: AxiosError): AxiosError;
    };
    onStart: {
        (config: any): any;
    };
    onProgress: {
        (progress: Progress): any;
    };
    onFinish: {
        (): any;
    };
    onSuccess: {
        (response: ResponseType): any;
    };
    onError: {
        (errors: Errors): any;
    };
}>;
export declare type PendingVisit = Visit & {
    url: URL;
    completed: boolean;
    cancelled: boolean;
    interrupted: boolean;
};
export declare type InertiaAppResponse = Promise<{
    head: string[];
    body: string;
} | void>;
export {};

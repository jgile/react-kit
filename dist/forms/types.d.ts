import { ResponseType, AxiosError } from 'axios';
export declare type Errors = Record<string, string>;
export declare type FormDataConvertible = Array<FormDataConvertible> | Blob | FormDataEntryValue | Date | boolean | number | null;
export declare enum Method {
    GET = "get",
    POST = "post",
    PUT = "put",
    PATCH = "patch",
    DELETE = "delete"
}
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
        (progress: Progress): void;
    };
    onFinish: {
        (): void;
    };
    onSuccess: {
        (response: ResponseType): ResponseType;
    };
    onError: {
        (errors: Errors): Errors;
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

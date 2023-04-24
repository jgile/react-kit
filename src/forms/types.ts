import {ResponseType, AxiosError, Method} from 'axios';

export type GenericObject = {
    [key: string]: any
}

export type Errors = Record<string, string>

interface NestedObject {
    [key: string]: any | NestedObject;
}

export type FormDataConvertible =
    Array<FormDataConvertible>
    | NestedObject
    | Blob
    | FormDataEntryValue
    | Date
    | boolean
    | number
    | null

export type RequestPayload = Record<string, FormDataConvertible> | FormData

export type Progress = ProgressEvent & { percentage: number }

export type Visit = {
    method: Method,
    data: RequestPayload,
    replace: boolean,
    only: Array<string>,
    headers: Record<string, string>
    errorBag: string | null,
    forceFormData: boolean,
    queryStringArrayFormat: 'indices' | 'brackets',
}

export type VisitParams = Partial<Visit & {
    onCatch: { (errors: AxiosError): AxiosError },
    onStart: { (config: any): any },
    onProgress: { (progress: Progress): any },
    onFinish: { (): any },
    onSuccess: { (response: ResponseType): any },
    onError: { (errors: Errors): any }
}>

export type PendingVisit = Visit & {
    url: URL,
    completed: boolean,
    cancelled: boolean,
    interrupted: boolean,
};

export type InertiaAppResponse = Promise<{ head: string[], body: string } | void>

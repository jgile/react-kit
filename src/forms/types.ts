import {ResponseType} from 'axios';

export type Errors = Record<string, string>

export type FormDataConvertible = Array<FormDataConvertible> | Blob | FormDataEntryValue | Date | boolean | number | null

export enum Method {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    PATCH = 'patch',
    DELETE = 'delete',
}

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

// export type GlobalEventCallback<TEventName extends GlobalEventNames> = (...params: GlobalEventParameters<TEventName>) => GlobalEventResult<TEventName>

export type VisitParams = Partial<Visit & {
    onCatch: { (errors: Errors): Errors },
    onStart: { (config: any): any },
    onProgress: { (progress: Progress): void },
    onFinish: { (): void },
    onSuccess: { (response: ResponseType): ResponseType },
    onError: { (errors: Errors): Errors }
}>


export type PendingVisit = Visit & {
    url: URL,
    completed: boolean,
    cancelled: boolean,
    interrupted: boolean,
};


export type InertiaAppResponse = Promise<{ head: string[], body: string } | void>

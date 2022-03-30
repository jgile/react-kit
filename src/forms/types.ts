import {AxiosResponse, CancelTokenSource} from 'axios'

export type Errors = Record<string, string>

export type ErrorBag = Record<string, Errors>

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

export type GlobalEventsMap = {
    before: {
        parameters: [PendingVisit],
        details: {
            visit: PendingVisit,
        },
        result: boolean | void,
    },
    start: {
        parameters: [PendingVisit],
        details: {
            visit: PendingVisit,
        },
        result: void,
    },
    progress: {
        parameters: [Progress | undefined],
        details: {
            progress: Progress | undefined,
        },
        result: void,
    },
    finish: {
        parameters: [ActiveVisit],
        details: {
            visit: ActiveVisit,
        },
        result: void,
    },
    cancel: {
        parameters: [],
        details: {},
        result: void,
    },
    success: {
        parameters: [AxiosResponse],
        details: {
            response: AxiosResponse
        },
        result: boolean | void,
    },
    error: {
        parameters: [Errors],
        details: {
            errors: Errors
        },
        result: void,
    },
    invalid: {
        parameters: [AxiosResponse],
        details: {
            response: AxiosResponse
        },
        result: boolean | void,
    },
    exception: {
        parameters: [Error],
        details: {
            exception: Error
        },
        result: boolean | void,
    },
}

export type GlobalEventNames = keyof GlobalEventsMap

export type GlobalEvent<TEventName extends GlobalEventNames> = CustomEvent<GlobalEventDetails<TEventName>>

export type GlobalEventParameters<TEventName extends GlobalEventNames> = GlobalEventsMap[TEventName]['parameters']

export type GlobalEventResult<TEventName extends GlobalEventNames> = GlobalEventsMap[TEventName]['result']

export type GlobalEventDetails<TEventName extends GlobalEventNames> = GlobalEventsMap[TEventName]['details']

export type GlobalEventTrigger<TEventName extends GlobalEventNames> = (...params: GlobalEventParameters<TEventName>) => GlobalEventResult<TEventName>

export type GlobalEventCallback<TEventName extends GlobalEventNames> = (...params: GlobalEventParameters<TEventName>) => GlobalEventResult<TEventName>

export type VisitParams = Partial<Visit & {
    onCancelToken: { ({cancel}: { cancel: VoidFunction }): void },
    onBefore: GlobalEventCallback<'before'>,
    onStart: GlobalEventCallback<'start'>,
    onProgress: GlobalEventCallback<'progress'>,
    onFinish: GlobalEventCallback<'finish'>,
    onCancel: GlobalEventCallback<'cancel'>,
    onSuccess: GlobalEventCallback<'success'>,
    onError: GlobalEventCallback<'error'>,
}>

export type VisitOptions = (options: Required<VisitParams>, url: URL) => Required<VisitParams> | void;

export type PendingVisit = Visit & {
    url: URL,
    completed: boolean,
    cancelled: boolean,
    interrupted: boolean,
};

export type ActiveVisit = PendingVisit & Required<VisitParams> & {
    cancelToken: CancelTokenSource,
}

export type VisitId = unknown

export type Component = unknown

export type InertiaAppResponse = Promise<{ head: string[], body: string } | void>

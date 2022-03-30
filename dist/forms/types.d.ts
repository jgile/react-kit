import { AxiosResponse, CancelTokenSource } from 'axios';
export declare type Errors = Record<string, string>;
export declare type ErrorBag = Record<string, Errors>;
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
export declare type GlobalEventsMap = {
    before: {
        parameters: [PendingVisit];
        details: {
            visit: PendingVisit;
        };
        result: boolean | void;
    };
    start: {
        parameters: [PendingVisit];
        details: {
            visit: PendingVisit;
        };
        result: void;
    };
    progress: {
        parameters: [Progress | undefined];
        details: {
            progress: Progress | undefined;
        };
        result: void;
    };
    finish: {
        parameters: [ActiveVisit];
        details: {
            visit: ActiveVisit;
        };
        result: void;
    };
    cancel: {
        parameters: [];
        details: {};
        result: void;
    };
    success: {
        parameters: [AxiosResponse];
        details: {
            response: AxiosResponse;
        };
        result: boolean | void;
    };
    error: {
        parameters: [Errors];
        details: {
            errors: Errors;
        };
        result: void;
    };
    invalid: {
        parameters: [AxiosResponse];
        details: {
            response: AxiosResponse;
        };
        result: boolean | void;
    };
    exception: {
        parameters: [Error];
        details: {
            exception: Error;
        };
        result: boolean | void;
    };
};
export declare type GlobalEventNames = keyof GlobalEventsMap;
export declare type GlobalEvent<TEventName extends GlobalEventNames> = CustomEvent<GlobalEventDetails<TEventName>>;
export declare type GlobalEventParameters<TEventName extends GlobalEventNames> = GlobalEventsMap[TEventName]['parameters'];
export declare type GlobalEventResult<TEventName extends GlobalEventNames> = GlobalEventsMap[TEventName]['result'];
export declare type GlobalEventDetails<TEventName extends GlobalEventNames> = GlobalEventsMap[TEventName]['details'];
export declare type GlobalEventTrigger<TEventName extends GlobalEventNames> = (...params: GlobalEventParameters<TEventName>) => GlobalEventResult<TEventName>;
export declare type GlobalEventCallback<TEventName extends GlobalEventNames> = (...params: GlobalEventParameters<TEventName>) => GlobalEventResult<TEventName>;
export declare type VisitParams = Partial<Visit & {
    onCancelToken: {
        ({ cancel }: {
            cancel: VoidFunction;
        }): void;
    };
    onBefore: GlobalEventCallback<'before'>;
    onStart: GlobalEventCallback<'start'>;
    onProgress: GlobalEventCallback<'progress'>;
    onFinish: GlobalEventCallback<'finish'>;
    onCancel: GlobalEventCallback<'cancel'>;
    onSuccess: GlobalEventCallback<'success'>;
    onError: GlobalEventCallback<'error'>;
}>;
export declare type VisitOptions = (options: Required<VisitParams>, url: URL) => Required<VisitParams> | void;
export declare type PendingVisit = Visit & {
    url: URL;
    completed: boolean;
    cancelled: boolean;
    interrupted: boolean;
};
export declare type ActiveVisit = PendingVisit & Required<VisitParams> & {
    cancelToken: CancelTokenSource;
};
export declare type VisitId = unknown;
export declare type Component = unknown;
export declare type InertiaAppResponse = Promise<{
    head: string[];
    body: string;
} | void>;

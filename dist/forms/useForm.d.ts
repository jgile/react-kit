import { ActiveVisit, VisitOptions, VisitParams, RequestPayload, GlobalEventNames, GlobalEvent, GlobalEventResult } from "./types";
export declare class Router {
    protected visitOptions: VisitOptions;
    protected activeVisit?: ActiveVisit;
    init({ visitOptions }: {
        visitOptions: VisitOptions;
    }): void;
    protected cancelVisit(activeVisit: ActiveVisit, { cancelled, interrupted }: {
        cancelled?: boolean;
        interrupted?: boolean;
    }): void;
    protected finishVisit(visit: ActiveVisit): void;
    visit(href: string | URL, params?: VisitParams): void;
    get(url: URL | string, data?: RequestPayload, options?: Exclude<VisitParams, 'method' | 'data'>): void;
    reload(options?: Exclude<VisitParams, 'preserveScroll' | 'preserveState'>): void;
    replace(url: URL | string, options?: Exclude<VisitParams, 'replace'>): void;
    post(url: URL | string, data?: RequestPayload, options?: Exclude<VisitParams, 'method' | 'data'>): void;
    put(url: URL | string, data?: RequestPayload, options?: Exclude<VisitParams, 'method' | 'data'>): void;
    patch(url: URL | string, data?: RequestPayload, options?: Exclude<VisitParams, 'method' | 'data'>): void;
    delete(url: URL | string, options?: Exclude<VisitParams, 'method'>): void;
    on<TEventName extends GlobalEventNames>(type: TEventName, callback: (event: GlobalEvent<TEventName>) => GlobalEventResult<TEventName>): VoidFunction;
}
export default function useForm(...args: any): {
    data: any;
    setData(key: any, value: any): void;
    isDirty: boolean;
    errors: {};
    hasErrors: boolean;
    processing: boolean;
    progress: null;
    wasSuccessful: boolean;
    recentlySuccessful: boolean;
    transform(callback: any): void;
    setDefaults(key: any, value: any): void;
    reset(...fields: any): void;
    setError(key: any, value: any): void;
    clearErrors(...fields: any): void;
    submit: (method: any, url: any, options?: any) => void;
    get(url: any, options: any): void;
    post(url: any, options: any): void;
    put(url: any, options: any): void;
    patch(url: any, options: any): void;
    delete(url: any, options: any): void;
};

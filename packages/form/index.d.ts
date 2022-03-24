type VisitConfig = {
    method: string;
    data: object;
    replace: boolean;
    headers: object;
    errorBag: string;
    forceFormData: boolean;
    onCancelToken: () => any;
    onBefore: (visit: any) => any;
    onStart: (visit: any) => any;
    onProgress: (percent: any) => any;
    onFinish: () => any;
    onSuccess: (data: any) => any;
    onError: (errors: any) => any;
    queryStringArrayFormat: string;
};
export const Visitor: {
    config: () => {};
    visitor: {
        visit(href: any, { method, data, replace, headers, errorBag, forceFormData, onCancelToken, onBefore, onStart, onProgress, onFinish, onSuccess, onError, queryStringArrayFormat, }: VisitConfig): any;
        finishVisit(visit: any): void;
        get(url: any, data?: {}, options?: {}): any;
        post(url: any, data?: {}, options?: {}): any;
        put(url: any, data?: {}, options?: {}): any;
        patch(url: any, data?: {}, options?: {}): any;
        delete(url: any, options?: {}): any;
    };
    useForm(...args: any[]): {
        data: any;
        response: {};
        setData(key: any, value: any): any;
        isDirty: boolean;
        errors: {};
        hasErrors: boolean;
        processing: boolean;
        progress: any;
        wasSuccessful: boolean;
        recentlySuccessful: boolean;
        transform(callback: any): void;
        reset(...fields: any[]): void;
        clearErrors(...fields: any[]): void;
        submit: (method: any, url: any, options?: any) => any;
        get(url: any, options: any): any;
        post(url: any, options: any): any;
        put(url: any, options: any): any;
        patch(url: any, options: any): any;
        delete(url: any, options: any): any;
        cancel(): void;
    };
};
export const useForm: (...args: any[]) => {
    data: any;
    response: {};
    setData(key: any, value: any): any;
    isDirty: boolean;
    errors: {};
    hasErrors: boolean;
    processing: boolean;
    progress: any;
    wasSuccessful: boolean;
    recentlySuccessful: boolean;
    transform(callback: any): void;
    reset(...fields: any[]): void;
    clearErrors(...fields: any[]): void;
    submit: (method: any, url: any, options?: any) => any;
    get(url: any, options: any): any;
    post(url: any, options: any): any;
    put(url: any, options: any): any;
    patch(url: any, options: any): any;
    delete(url: any, options: any): any;
    cancel(): void;
};
export function useData(...args: any[]): {
    data: any;
    reset(...fields: any[]): void;
    setData(key: any, value: any): any;
    isDirty: boolean;
};

//# sourceMappingURL=index.d.ts.map

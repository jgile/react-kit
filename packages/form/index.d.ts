export function useForm(...args: any[]): {
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

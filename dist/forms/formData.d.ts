import { RequestPayload } from './types';
export declare function objectToFormData<S extends RequestPayload>(source: S, form?: FormData, parentKey?: string | null): FormData;

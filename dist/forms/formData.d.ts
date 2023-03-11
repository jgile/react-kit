import { FormDataConvertible } from './types';
export declare function objectToFormData<S extends Record<string, FormDataConvertible>>(source: S, form?: FormData, parentKey?: string | null): FormData;

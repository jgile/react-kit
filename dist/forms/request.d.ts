import { FormDataConvertible } from "./types";
export declare function request<T extends Record<string, FormDataConvertible>>(requestOptions?: object, options?: object, data?: T): import("./useForm").UseFormObject;
export declare function lazyRequest<T extends Record<string, FormDataConvertible>>(requestOptions?: object, options?: object, data?: T): import("./useForm").UseFormObject;

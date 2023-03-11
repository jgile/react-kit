import { FormDataConvertible } from './types';
import { Method } from "axios";
export declare function hrefToUrl(href: string | URL): URL;
export declare function mergeDataIntoQueryString<M extends Method, U extends URL | string, D extends Record<string, FormDataConvertible>>(method: M, href: U, data: D, qsArrayFormat?: 'indices' | 'brackets'): [string, D];
export declare function urlWithoutHash(url: URL | Location): URL;

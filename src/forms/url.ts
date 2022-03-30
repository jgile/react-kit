import * as qs from 'qs';
import deepmerge from 'deepmerge';
import { Method } from './types';

export function hrefToUrl(href: any) {
    return new URL(href.toString(), window.location.toString());
}

export function mergeDataIntoQueryString(method: any, href: any, data: any, qsArrayFormat: string = 'brackets') {
    const hasHost = /^https?:\/\//.test(href.toString());
    const hasAbsolutePath = hasHost || href.toString().startsWith('/');
    const hasRelativePath = !hasAbsolutePath && !href.toString().startsWith('#') && !href.toString().startsWith('?');
    const hasSearch = href.toString().includes('?') || (method === Method.GET && Object.keys(data).length);
    const hasHash = href.toString().includes('#');
    const url = new URL(href.toString(), 'http://localhost');
    if (method === Method.GET && Object.keys(data).length) {
        url.search = qs.stringify(deepmerge(qs.parse(url.search, { ignoreQueryPrefix: true }), data), {
            encodeValuesOnly: true,
            // @ts-ignore
            arrayFormat: qsArrayFormat
        });
        data = {};
    }
    return [
        [
            hasHost ? `${url.protocol}//${url.host}` : '',
            hasAbsolutePath ? url.pathname : '',
            hasRelativePath ? url.pathname.substring(1) : '',
            hasSearch ? url.search : '',
            hasHash ? url.hash : ''
        ].join(''),
        data
    ];
}

export function urlWithoutHash(url: any) {
    url = new URL(url.href);
    url.hash = '';
    return url;
}

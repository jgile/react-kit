import * as qs from 'qs'
import {default as deepmerge} from "deepmerge";
import {FormDataConvertible} from './types'
import {Method} from "axios";

export function hrefToUrl(href: string | URL): URL {
    if (href instanceof URL) {
        return href
    }

    return new URL(href.toString(), window.location.toString())
}

export function mergeDataIntoQueryString<M extends Method, U extends URL | string, D extends Record<string, FormDataConvertible>>(
    method: M,
    href: U,
    data: D,
    qsArrayFormat: 'indices' | 'brackets' = 'brackets',
): [string, D] {
    const hasHost = /^https?:\/\//.test(href.toString())
    const hasAbsolutePath = hasHost || href.toString().startsWith('/')
    const hasRelativePath = !hasAbsolutePath && !href.toString().startsWith('#') && !href.toString().startsWith('?')
    const hasSearch = href.toString().includes('?') || (['get', 'GET'].includes(method) && Object.keys(data).length)
    const hasHash = href.toString().includes('#')

    const url = new URL(href.toString(), 'http://localhost')

    if (['get', 'GET'].includes(method) && Object.keys(data).length) {
        //@ts-ignore
        url.search = qs.stringify(deepmerge(qs.parse(url.search, {ignoreQueryPrefix: true}), data), {
            encodeValuesOnly: true,
            arrayFormat: qsArrayFormat,
        })
        data = {} as D
    }

    return [
        [
            hasHost ? `${url.protocol}//${url.host}` : '',
            hasAbsolutePath ? url.pathname : '',
            hasRelativePath ? url.pathname.substring(1) : '',
            hasSearch ? url.search : '',
            hasHash ? url.hash : '',
        ].join(''),
        data,
    ]
}

export function urlWithoutHash(url: URL | Location): URL {
    url = new URL(url.href)
    url.hash = ''
    return url
}

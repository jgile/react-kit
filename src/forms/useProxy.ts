import {proxy as makeProxy, useSnapshot} from 'valtio'
import {derive} from 'valtio/utils'
import {useMemo} from "react";

interface Keyable {
    [key: string]: any;
}

export default function useProxy(args: Keyable = {}, computed?: Keyable) {
    const proxy = useMemo(() => makeProxy(args), []);
    const state = useSnapshot(proxy);

    if (computed) {
        derive(computed, {proxy: proxy})
    }

    return {
        proxy,
        state,
    }
}

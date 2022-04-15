import {proxy as makeProxy, useSnapshot} from 'valtio'
import {useMemo} from "react";

interface Keyable {
    [key: string]: any;
}

export default function useProxy(args: Keyable = {}) {
    const state = useMemo(() => makeProxy(args), []);
    const snap = useSnapshot(state);

    return {
        state,
        snap,
    }
}

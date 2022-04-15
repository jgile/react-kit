import {proxy as makeProxy, useSnapshot} from 'valtio'
import {derive} from 'valtio/utils'
import {useEffect, useMemo} from "react";
import forEach from "lodash/forEach";

interface Keyable {
    [key: string]: any;
}

export default function useProxy(args: Keyable = {}, computed?: Keyable) {
    const state = useMemo(() => makeProxy(args), []);
    const snap = useSnapshot(state);

    if (computed) {
        useEffect(() => {
            const comp = {};

            forEach(computed, (callback, name) => {
                //@ts-ignore
                comp[name] = (get) => {
                    return callback(get(state));
                }
            });

            derive(comp, {proxy: state});
        }, []);
    }

    return {
        state,
        snap,
    }
}

import {proxy as makeProxy, useSnapshot} from 'valtio'
import {derive} from 'valtio/utils'
import {useMemo} from "react";
import forEach from "lodash/forEach";

interface Keyable {
    [key: string]: any;
}

export default function useProxy(args: Keyable = {}, computed?: Keyable) {
    const state = useMemo(() => {
        const comp = {};
        const tmpState = makeProxy(args);

        if (computed) {
            forEach(computed, (callback, name) => {
                //@ts-ignore
                comp[name] = (get) => {
                    return callback(get(tmpState));
                }
            });
            derive(comp, {proxy: tmpState});
        }

        return tmpState;
    }, []);


    const snap = useSnapshot(state);

    return {
        state,
        snap,
    }
}

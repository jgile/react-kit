import {proxy as makeProxy, useSnapshot} from 'valtio'
import {derive} from 'valtio/utils'
import {useEffect, useMemo} from "react";
import forEach from "lodash/forEach";

interface Keyable {
    [key: string]: any;
}

export default function useProxy(args: Keyable = {}, computed?: Keyable) {
    const state = useMemo(() => {
        let tmpstate = makeProxy(args);

        if (computed) {
            useEffect(() => {
                const comp = {};
                forEach(computed, (callback, name) => {
                    //@ts-ignore
                    comp[name] = (get) => {
                        return callback(get(tmpstate));
                    }
                });

                derive(comp, {proxy: tmpstate});
            }, [computed]);
        }

        return tmpstate;
    }, []);


    const snap = useSnapshot(state);

    return {
        state,
        snap,
    }
}

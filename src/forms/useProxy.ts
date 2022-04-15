import {proxy, useSnapshot} from 'valtio'
import {derive} from 'valtio/utils'

interface Keyable {
    [key: string]: any;
}

export default function useProxy(args: Keyable = {}, computed?: Keyable) {
    const data = proxy(args);
    const state = useSnapshot(data);

    if (computed) {
        derive(computed, {proxy: data})
    }

    return {
        data,
        state,
    }
}

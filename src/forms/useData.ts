import {useState} from "react";
import isEqual from "lodash/isEqual";

export default function useData(...args: any) {
    const defaults = (typeof args[0] === 'string' ? args[1] : args[0]) || {};
    const [data, setData] = useState(defaults);

    return {
        data,
        isDirty: !isEqual(data, defaults),
        reset(...fields: any) {
            if (!fields.length) {
                setData(defaults)
            } else {
                setData(
                    Object.keys(defaults)
                        .filter((key) => fields.includes(key))
                        .reduce((carry, key) => {
                            carry[key] = defaults[key]
                            return carry
                        }, {...data}),
                )
            }
        },
        setData(key: any, value: any) {
            if (typeof value === 'object' && 'target' in value && value.target) {
                value = value.target.value;
            }

            if (typeof key === 'string') {
                setData({...data, [key]: value})
            } else if (typeof key === 'function') {
                setData((data: any) => key(data))
            } else {
                setData(key)
            }

            return this;
        },
    }
}

import {useState} from "react";
import isEqual from "lodash.isequal";

export default function useData(...args) {
    const defaults = (typeof args[0] === 'string' ? args[1] : args[0]) || {};
    const [data, setData] = useState(defaults);

    return {
        data,
        reset(...fields) {
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
        setData(key, value) {
            if (typeof value === 'object' && 'target' in value && value.target) {
                value = value.target.value;
            }

            if (typeof key === 'string') {
                setData({...data, [key]: value})
            } else if (typeof key === 'function') {
                setData(data => key(data))
            } else {
                setData(key)
            }

            return this;
        },
        isDirty: !isEqual(data, defaults)
    }
}
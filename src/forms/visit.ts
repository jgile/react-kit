import useForm from "./useForm";
import {FormDataConvertible} from "./types";
import {useEffect} from "react";

export default function visit<T extends Record<string, FormDataConvertible>>(requestOptions: object = {}, data: T = {} as T, options: object = {}) {
    const form = useForm(data);

    useEffect(() => {
        form.submit(requestOptions, options);
    }, []);

    return form;
}

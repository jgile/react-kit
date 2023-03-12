import useForm from "./useForm";
import {FormDataConvertible} from "./types";
import {useEffect} from "react";

export function request<T extends Record<string, FormDataConvertible>>(requestOptions: object = {}, options: object = {}, data: T = {} as T) {
    const form = useForm(data);

    useEffect(() => {
        form.submit(requestOptions, options);
    }, []);

    return form;
}

export function lazyRequest<T extends Record<string, FormDataConvertible>>(requestOptions: object = {}, options: object = {}, data: T = {} as T) {
    return useForm(data, requestOptions, options);
}

import useForm from "./useForm";
import {FormDataConvertible, Method} from "./types";
import {useEffect} from "react";

export default function visit<T extends Record<string, FormDataConvertible>>(href: string | URL, method: Method = Method.GET, data: T = {} as T, options: object = {}, requestOptions: object = {}) {
    const form = useForm(data);

    useEffect(() => {
        form.submit(method, href, options, requestOptions);
    }, []);

    return form;
}

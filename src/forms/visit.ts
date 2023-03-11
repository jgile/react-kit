import useForm from "./useForm";
import {Method} from "./types";
import {useEffect} from "react";

export default function visit(href: any, method: Method = Method.GET, data: object = {}, options: object = {}, requestOptions: object = {}) {
    const form = useForm(data);

    useEffect(() => {
        form.submit(method, href, options, requestOptions);
    });

    return form;
}

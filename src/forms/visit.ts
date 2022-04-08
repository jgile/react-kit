import useForm from "./useForm";
import {Method} from "./types";

export default function visit(method: Method, href: any, data: object = {}, options: object = {}, requestOptions: object = {}) {
    const form = useForm(data);

    form.submit(method, href, options, requestOptions);

    return form;
}

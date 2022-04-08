import useForm from "./useForm";

export default function visit(method, url, data, options, requestOptions) {
    const form = useForm(data);

    form.submit(method, url, options, requestOptions);

    return form;
}

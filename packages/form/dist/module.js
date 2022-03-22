import {useRef as $4goeQ$useRef, useState as $4goeQ$useState, useEffect as $4goeQ$useEffect, useCallback as $4goeQ$useCallback} from "react";
import $4goeQ$lodashisequal from "lodash.isequal";
import $4goeQ$lodashget from "lodash.get";
import $4goeQ$axios from "axios";
import {stringify as $4goeQ$stringify, parse as $4goeQ$parse} from "qs";
import $4goeQ$deepmerge from "deepmerge";






var $2d3745109575f12d$export$31bb55db0b3e4187;
(function($2d3745109575f12d$export$31bb55db0b3e4187) {
    $2d3745109575f12d$export$31bb55db0b3e4187["GET"] = "get";
    $2d3745109575f12d$export$31bb55db0b3e4187["POST"] = "post";
    $2d3745109575f12d$export$31bb55db0b3e4187["PUT"] = "put";
    $2d3745109575f12d$export$31bb55db0b3e4187["PATCH"] = "patch";
    $2d3745109575f12d$export$31bb55db0b3e4187["DELETE"] = "delete";
})($2d3745109575f12d$export$31bb55db0b3e4187 || ($2d3745109575f12d$export$31bb55db0b3e4187 = {}));


function $612bf3abab00ba2d$export$181d7b261dd21e46(href) {
    return new URL(href.toString(), window.location.toString());
}
function $612bf3abab00ba2d$export$44c8c586af913ff3(method, href, data, qsArrayFormat = 'brackets') {
    const hasHost = /^https?:\/\//.test(href.toString());
    const hasAbsolutePath = hasHost || href.toString().startsWith('/');
    const hasRelativePath = !hasAbsolutePath && !href.toString().startsWith('#') && !href.toString().startsWith('?');
    const hasSearch = href.toString().includes('?') || method === $2d3745109575f12d$export$31bb55db0b3e4187.GET && Object.keys(data).length;
    const hasHash = href.toString().includes('#');
    const url = new URL(href.toString(), 'http://localhost');
    if (method === $2d3745109575f12d$export$31bb55db0b3e4187.GET && Object.keys(data).length) {
        url.search = $4goeQ$stringify($4goeQ$deepmerge($4goeQ$parse(url.search, {
            ignoreQueryPrefix: true
        }), data), {
            encodeValuesOnly: true,
            arrayFormat: qsArrayFormat
        });
        data = {};
    }
    return [
        [
            hasHost ? `${url.protocol}//${url.host}` : '',
            hasAbsolutePath ? url.pathname : '',
            hasRelativePath ? url.pathname.substring(1) : '',
            hasSearch ? url.search : '',
            hasHash ? url.hash : '', 
        ].join(''),
        data, 
    ];
}
function $612bf3abab00ba2d$export$311fc32ea47c5ee1(url) {
    url = new URL(url.href);
    url.hash = '';
    return url;
}



function $d0063aff22c60270$export$d75e7764e3522d6d(data) {
    return data instanceof File || data instanceof Blob || data instanceof FileList && data.length > 0 || data instanceof FormData && Array.from(data.values()).some((value)=>$d0063aff22c60270$export$d75e7764e3522d6d(value)
    ) || typeof data === 'object' && data !== null && Object.values(data).some((value)=>$d0063aff22c60270$export$d75e7764e3522d6d(value)
    );
}


function $ce6f92d91cdc354d$export$c621c6e92c748156(source, form = new FormData(), parentKey = null) {
    source = source || {};
    for(const key in source)if (Object.prototype.hasOwnProperty.call(source, key)) $ce6f92d91cdc354d$var$append(form, $ce6f92d91cdc354d$var$composeKey(parentKey, key), source[key]);
    return form;
}
function $ce6f92d91cdc354d$var$composeKey(parent, key) {
    return parent ? parent + '[' + key + ']' : key;
}
function $ce6f92d91cdc354d$var$append(form, key, value) {
    if (Array.isArray(value)) return Array.from(value.keys()).forEach((index)=>$ce6f92d91cdc354d$var$append(form, $ce6f92d91cdc354d$var$composeKey(key, index.toString()), value[index])
    );
    else if (value instanceof Date) return form.append(key, value.toISOString());
    else if (value instanceof File) return form.append(key, value, value.name);
    else if (value instanceof Blob) return form.append(key, value);
    else if (typeof value === 'boolean') return form.append(key, value ? '1' : '0');
    else if (typeof value === 'string') return form.append(key, value);
    else if (typeof value === 'number') return form.append(key, `${value}`);
    else if (value === null || value === undefined) return form.append(key, '');
    $ce6f92d91cdc354d$export$c621c6e92c748156(value, form, key);
}



const $42b851bf19452363$export$9d54d4ec2dd4b364 = {
    visit (href, { method: method = $2d3745109575f12d$export$31bb55db0b3e4187.GET , data: data = {} , replace: replace = false , headers: headers = {} , errorBag: errorBag = '' , forceFormData: forceFormData = false , onCancelToken: onCancelToken = ()=>{} , onBefore: onBefore = ()=>{} , onStart: onStart = ()=>{} , onProgress: onProgress = ()=>{} , onFinish: onFinish = ()=>{} , onSuccess: onSuccess = (response)=>{
        return response;
    } , onError: onError = ()=>{} , queryStringArrayFormat: queryStringArrayFormat = 'brackets'  }) {
        let url = typeof href === 'string' ? $612bf3abab00ba2d$export$181d7b261dd21e46(href) : href;
        if (this.activeVisit && this.activeVisit.processing) return;
        // Create form data if has files
        if (($d0063aff22c60270$export$d75e7764e3522d6d(data) || forceFormData) && !(data instanceof FormData)) data = $ce6f92d91cdc354d$export$c621c6e92c748156(data);
        // If not FormData,
        if (!(data instanceof FormData)) {
            const [_href, _data] = $612bf3abab00ba2d$export$44c8c586af913ff3(method, url, data, queryStringArrayFormat);
            url = $612bf3abab00ba2d$export$181d7b261dd21e46(_href);
            data = _data;
        }
        const visit = {
            url: url,
            method: method,
            data: data,
            replace: replace,
            headers: headers,
            errorBag: errorBag,
            forceFormData: forceFormData,
            queryStringArrayFormat: queryStringArrayFormat,
            completed: false,
            interrupted: false,
            cancelled: false
        };
        this.activeVisit = Object.assign(Object.assign({}, visit), {
            onCancelToken: onCancelToken,
            onBefore: onBefore,
            onStart: onStart,
            onProgress: onProgress,
            onFinish: onFinish,
            onSuccess: onSuccess,
            onError: onError,
            queryStringArrayFormat: queryStringArrayFormat
        });
        if (onBefore(visit) === false) return;
        onStart(visit);
        return new Promise((resolve, reject)=>{
            // @ts-ignore
            return $4goeQ$axios({
                method: method,
                url: $612bf3abab00ba2d$export$311fc32ea47c5ee1(url).href,
                data: method === $2d3745109575f12d$export$31bb55db0b3e4187.GET ? {} : data,
                params: method === $2d3745109575f12d$export$31bb55db0b3e4187.GET ? data : {},
                headers: Object.assign(Object.assign({}, headers), {
                    'X-Requested-With': 'XMLHttpRequest'
                }),
                onUploadProgress: (progress)=>{
                    if (data instanceof FormData) {
                        progress.percentage = Math.round(progress.loaded / progress.total * 100);
                        onProgress(progress);
                    }
                }
            }).then((response)=>{
                const errors = $4goeQ$lodashget(response, 'data.errors', {}) || {};
                if (this.activeVisit) this.finishVisit(this.activeVisit);
                if (Object.keys(errors).length > 0) {
                    const scopedErrors = errorBag ? errors[errorBag] ? errors[errorBag] : {} : errors;
                    return onError(scopedErrors);
                }
                onSuccess(response.data);
                return resolve(response.data);
            }).catch((error)=>{
                const errors = $4goeQ$lodashget(error, 'response.data.errors', {});
                if (this.activeVisit) this.finishVisit(this.activeVisit);
                if (Object.keys(errors).length > 0) {
                    const scopedErrors = errorBag ? errors[errorBag] ? errors[errorBag] : {} : errors;
                    return onError(scopedErrors);
                }
                return reject(error);
            });
        });
    },
    finishVisit (visit) {
        visit.completed = true;
        visit.cancelled = false;
        visit.interrupted = false;
        visit.onFinish(visit);
    },
    get (url, data = {}, options = {}) {
        return this.visit(url, Object.assign(Object.assign({}, options), {
            method: $2d3745109575f12d$export$31bb55db0b3e4187.GET,
            data: data
        }));
    },
    post (url, data = {}, options = {}) {
        return this.visit(url, Object.assign(Object.assign({
            preserveState: true
        }, options), {
            method: $2d3745109575f12d$export$31bb55db0b3e4187.POST,
            data: data
        }));
    },
    put (url, data = {}, options = {}) {
        return this.visit(url, Object.assign(Object.assign({
            preserveState: true
        }, options), {
            method: $2d3745109575f12d$export$31bb55db0b3e4187.PUT,
            data: data
        }));
    },
    patch (url, data = {}, options = {}) {
        return this.visit(url, Object.assign(Object.assign({
            preserveState: true
        }, options), {
            method: $2d3745109575f12d$export$31bb55db0b3e4187.PATCH,
            data: data
        }));
    },
    delete (url, options = {}) {
        return this.visit(url, Object.assign(Object.assign({
            preserveState: true
        }, options), {
            method: $2d3745109575f12d$export$31bb55db0b3e4187.DELETE
        }));
    }
};
function $42b851bf19452363$export$2e2bcd8739ae039(...args) {
    const isMounted = $4goeQ$useRef(null);
    const defaults = (typeof args[0] === 'string' ? args[1] : args[0]) || {};
    const cancelToken = $4goeQ$useRef(null);
    const recentlySuccessfulTimeoutId = $4goeQ$useRef(null);
    const [data1, setData] = $4goeQ$useState(defaults);
    const [response1, setResponse] = $4goeQ$useState({});
    const [errors1, setErrors] = $4goeQ$useState({});
    const [hasErrors, setHasErrors] = $4goeQ$useState(false);
    const [processing, setProcessing] = $4goeQ$useState(false);
    const [progress, setProgress] = $4goeQ$useState(null);
    const [wasSuccessful, setWasSuccessful] = $4goeQ$useState(false);
    const [recentlySuccessful, setRecentlySuccessful] = $4goeQ$useState(false);
    let transform = (data)=>data
    ;
    $4goeQ$useEffect(()=>{
        isMounted.current = true;
        return ()=>{
            isMounted.current = false;
        };
    }, []);
    const submit = $4goeQ$useCallback((method, url, options = {})=>{
        const _options = {
            ...options,
            onBefore: (visit)=>{
                setWasSuccessful(false);
                setRecentlySuccessful(false);
                clearTimeout(recentlySuccessfulTimeoutId.current);
                if (options.onBefore) return options.onBefore(visit);
            },
            onStart: (visit)=>{
                setProcessing(true);
                if (options.onStart) return options.onStart(visit);
            },
            onProgress: (event)=>{
                setProgress(event);
                if (options.onProgress) return options.onProgress(event);
            },
            onSuccess: (response)=>{
                setResponse(response);
                if (isMounted.current) {
                    setProcessing(false);
                    setProgress(null);
                    setErrors({});
                    setHasErrors(false);
                    setWasSuccessful(true);
                    setRecentlySuccessful(true);
                    recentlySuccessfulTimeoutId.current = setTimeout(()=>{
                        if (isMounted.current) setRecentlySuccessful(false);
                    }, 2000);
                }
                if (options.onSuccess) return options.onSuccess(response);
            },
            onError: (errors)=>{
                if (isMounted.current) {
                    setProcessing(false);
                    setProgress(null);
                    setErrors(errors);
                    setHasErrors(true);
                }
                if (options.onError) return options.onError(errors);
            },
            onCancel: ()=>{
                if (isMounted.current) {
                    setProcessing(false);
                    setProgress(null);
                }
                if (options.onCancel) return options.onCancel();
            },
            onFinish: ()=>{
                if (isMounted.current) {
                    setProcessing(false);
                    setProgress(null);
                }
                if (options.onFinish) return options.onFinish();
            }
        };
        if (method === 'delete') return $42b851bf19452363$export$9d54d4ec2dd4b364.delete(url, {
            ..._options,
            data: transform(data1)
        });
        else return $42b851bf19452363$export$9d54d4ec2dd4b364[method](url, transform(data1), _options);
    }, [
        data1,
        setErrors
    ]);
    return {
        data: data1,
        response: response1,
        setData (key, value) {
            if (typeof value === 'object' && 'target' in value && value.target) value = value.target.value;
            if (typeof key === 'string') setData({
                ...data1,
                [key]: value
            });
            else if (typeof key === 'function') setData((data)=>key(data)
            );
            else setData(key);
            return this;
        },
        isDirty: !$4goeQ$lodashisequal(data1, defaults),
        errors: errors1,
        hasErrors: hasErrors,
        processing: processing,
        progress: progress,
        wasSuccessful: wasSuccessful,
        recentlySuccessful: recentlySuccessful,
        transform (callback) {
            transform = callback;
        },
        reset (...fields) {
            if (!fields.length) setData(defaults);
            else setData(Object.keys(defaults).filter((key)=>fields.includes(key)
            ).reduce((carry, key)=>{
                carry[key] = defaults[key];
                return carry;
            }, {
                ...data1
            }));
        },
        clearErrors (...fields) {
            setErrors(Object.keys(errors1).reduce((carry, field)=>({
                    ...carry,
                    ...fields.length > 0 && !fields.includes(field) ? {
                        [field]: errors1[field]
                    } : {}
                })
            , {}));
            setHasErrors(Object.keys(errors1).length > 0);
        },
        submit: submit,
        get (url, options) {
            return submit('get', url, options);
        },
        post (url, options) {
            return submit('post', url, options);
        },
        put (url, options) {
            return submit('put', url, options);
        },
        patch (url, options) {
            return submit('patch', url, options);
        },
        delete (url, options) {
            return submit('delete', url, options);
        },
        cancel () {
            if (cancelToken.current) cancelToken.current.cancel();
        }
    };
}




function $2bfdf19174b51c6d$export$2e2bcd8739ae039(...args) {
    const defaults = (typeof args[0] === 'string' ? args[1] : args[0]) || {};
    const [data1, setData] = $4goeQ$useState(defaults);
    return {
        data: data1,
        reset (...fields) {
            if (!fields.length) setData(defaults);
            else setData(Object.keys(defaults).filter((key)=>fields.includes(key)
            ).reduce((carry, key)=>{
                carry[key] = defaults[key];
                return carry;
            }, {
                ...data1
            }));
        },
        setData (key, value) {
            if (typeof value === 'object' && 'target' in value && value.target) value = value.target.value;
            if (typeof key === 'string') setData({
                ...data1,
                [key]: value
            });
            else if (typeof key === 'function') setData((data)=>key(data)
            );
            else setData(key);
            return this;
        },
        isDirty: !$4goeQ$lodashisequal(data1, defaults)
    };
}




export {$42b851bf19452363$export$2e2bcd8739ae039 as useForm, $2bfdf19174b51c6d$export$2e2bcd8739ae039 as useData};
//# sourceMappingURL=module.js.map

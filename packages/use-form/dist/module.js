import {useRef as $jOjOc$useRef, useState as $jOjOc$useState, useEffect as $jOjOc$useEffect, useCallback as $jOjOc$useCallback} from "react";
import $jOjOc$lodashisEqual from "lodash/isEqual";
import $jOjOc$lodashget from "lodash/get";
import $jOjOc$axios from "axios";
import {stringify as $jOjOc$stringify, parse as $jOjOc$parse} from "qs";
import $jOjOc$deepmerge from "deepmerge";






var $1ef838d7ae804564$export$31bb55db0b3e4187;
(function($1ef838d7ae804564$export$31bb55db0b3e4187) {
    $1ef838d7ae804564$export$31bb55db0b3e4187["GET"] = "get";
    $1ef838d7ae804564$export$31bb55db0b3e4187["POST"] = "post";
    $1ef838d7ae804564$export$31bb55db0b3e4187["PUT"] = "put";
    $1ef838d7ae804564$export$31bb55db0b3e4187["PATCH"] = "patch";
    $1ef838d7ae804564$export$31bb55db0b3e4187["DELETE"] = "delete";
})($1ef838d7ae804564$export$31bb55db0b3e4187 || ($1ef838d7ae804564$export$31bb55db0b3e4187 = {
}));


function $3e3dec84f08dc2a2$export$181d7b261dd21e46(href) {
    return new URL(href.toString(), window.location.toString());
}
function $3e3dec84f08dc2a2$export$44c8c586af913ff3(method, href, data, qsArrayFormat = 'brackets') {
    const hasHost = /^https?:\/\//.test(href.toString());
    const hasAbsolutePath = hasHost || href.toString().startsWith('/');
    const hasRelativePath = !hasAbsolutePath && !href.toString().startsWith('#') && !href.toString().startsWith('?');
    const hasSearch = href.toString().includes('?') || method === $1ef838d7ae804564$export$31bb55db0b3e4187.GET && Object.keys(data).length;
    const hasHash = href.toString().includes('#');
    const url = new URL(href.toString(), 'http://localhost');
    if (method === $1ef838d7ae804564$export$31bb55db0b3e4187.GET && Object.keys(data).length) {
        url.search = $jOjOc$stringify($jOjOc$deepmerge($jOjOc$parse(url.search, {
            ignoreQueryPrefix: true
        }), data), {
            encodeValuesOnly: true,
            arrayFormat: qsArrayFormat
        });
        data = {
        };
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
function $3e3dec84f08dc2a2$export$311fc32ea47c5ee1(url) {
    url = new URL(url.href);
    url.hash = '';
    return url;
}



function $fc990cd12e303e98$export$d75e7764e3522d6d(data) {
    return data instanceof File || data instanceof Blob || data instanceof FileList && data.length > 0 || data instanceof FormData && Array.from(data.values()).some((value)=>$fc990cd12e303e98$export$d75e7764e3522d6d(value)
    ) || typeof data === 'object' && data !== null && Object.values(data).some((value)=>$fc990cd12e303e98$export$d75e7764e3522d6d(value)
    );
}


function $509f4ca9f88c6492$export$c621c6e92c748156(source, form = new FormData(), parentKey = null) {
    source = source || {
    };
    for(const key in source)if (Object.prototype.hasOwnProperty.call(source, key)) $509f4ca9f88c6492$var$append(form, $509f4ca9f88c6492$var$composeKey(parentKey, key), source[key]);
    return form;
}
function $509f4ca9f88c6492$var$composeKey(parent, key) {
    return parent ? parent + '[' + key + ']' : key;
}
function $509f4ca9f88c6492$var$append(form, key, value) {
    if (Array.isArray(value)) return Array.from(value.keys()).forEach((index)=>$509f4ca9f88c6492$var$append(form, $509f4ca9f88c6492$var$composeKey(key, index.toString()), value[index])
    );
    else if (value instanceof Date) return form.append(key, value.toISOString());
    else if (value instanceof File) return form.append(key, value, value.name);
    else if (value instanceof Blob) return form.append(key, value);
    else if (typeof value === 'boolean') return form.append(key, value ? '1' : '0');
    else if (typeof value === 'string') return form.append(key, value);
    else if (typeof value === 'number') return form.append(key, `${value}`);
    else if (value === null || value === undefined) return form.append(key, '');
    $509f4ca9f88c6492$export$c621c6e92c748156(value, form, key);
}



const $cb45878a962ef02e$export$9d54d4ec2dd4b364 = {
    visit (href, { method: method = $1ef838d7ae804564$export$31bb55db0b3e4187.GET , data: data = {
    } , replace: replace = false , headers: headers = {
    } , errorBag: errorBag = '' , forceFormData: forceFormData = false , onCancelToken: onCancelToken = ()=>{
    } , onBefore: onBefore = ()=>{
    } , onStart: onStart = ()=>{
    } , onProgress: onProgress = ()=>{
    } , onFinish: onFinish = ()=>{
    } , onSuccess: onSuccess = (response)=>{
        return response;
    } , onError: onError = ()=>{
    } , queryStringArrayFormat: queryStringArrayFormat = 'brackets'  }) {
        let url = typeof href === 'string' ? $3e3dec84f08dc2a2$export$181d7b261dd21e46(href) : href;
        if (this.activeVisit && this.activeVisit.processing) return;
        // Create form data if has files
        if (($fc990cd12e303e98$export$d75e7764e3522d6d(data) || forceFormData) && !(data instanceof FormData)) data = $509f4ca9f88c6492$export$c621c6e92c748156(data);
        // If not FormData,
        if (!(data instanceof FormData)) {
            const [_href, _data] = $3e3dec84f08dc2a2$export$44c8c586af913ff3(method, url, data, queryStringArrayFormat);
            url = $3e3dec84f08dc2a2$export$181d7b261dd21e46(_href);
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
        this.activeVisit = Object.assign(Object.assign({
        }, visit), {
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
            return $jOjOc$axios({
                method: method,
                url: $3e3dec84f08dc2a2$export$311fc32ea47c5ee1(url).href,
                data: method === $1ef838d7ae804564$export$31bb55db0b3e4187.GET ? {
                } : data,
                params: method === $1ef838d7ae804564$export$31bb55db0b3e4187.GET ? data : {
                },
                headers: Object.assign(Object.assign({
                }, headers), {
                    'X-Requested-With': 'XMLHttpRequest'
                }),
                onUploadProgress: (progress)=>{
                    if (data instanceof FormData) {
                        progress.percentage = Math.round(progress.loaded / progress.total * 100);
                        onProgress(progress);
                    }
                }
            }).then((response)=>{
                const errors = $jOjOc$lodashget(response, 'data.errors', {
                }) || {
                };
                if (this.activeVisit) this.finishVisit(this.activeVisit);
                if (Object.keys(errors).length > 0) {
                    const scopedErrors = errorBag ? errors[errorBag] ? errors[errorBag] : {
                    } : errors;
                    return onError(scopedErrors);
                }
                onSuccess(response.data);
                return resolve(response.data);
            }).catch((error)=>{
                const errors = $jOjOc$lodashget(error, 'response.data.errors', {
                });
                if (this.activeVisit) this.finishVisit(this.activeVisit);
                if (Object.keys(errors).length > 0) {
                    const scopedErrors = errorBag ? errors[errorBag] ? errors[errorBag] : {
                    } : errors;
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
    get (url, data = {
    }, options = {
    }) {
        return this.visit(url, Object.assign(Object.assign({
        }, options), {
            method: $1ef838d7ae804564$export$31bb55db0b3e4187.GET,
            data: data
        }));
    },
    post (url, data = {
    }, options = {
    }) {
        return this.visit(url, Object.assign(Object.assign({
            preserveState: true
        }, options), {
            method: $1ef838d7ae804564$export$31bb55db0b3e4187.POST,
            data: data
        }));
    },
    put (url, data = {
    }, options = {
    }) {
        return this.visit(url, Object.assign(Object.assign({
            preserveState: true
        }, options), {
            method: $1ef838d7ae804564$export$31bb55db0b3e4187.PUT,
            data: data
        }));
    },
    patch (url, data = {
    }, options = {
    }) {
        return this.visit(url, Object.assign(Object.assign({
            preserveState: true
        }, options), {
            method: $1ef838d7ae804564$export$31bb55db0b3e4187.PATCH,
            data: data
        }));
    },
    delete (url, options = {
    }) {
        return this.visit(url, Object.assign(Object.assign({
            preserveState: true
        }, options), {
            method: $1ef838d7ae804564$export$31bb55db0b3e4187.DELETE
        }));
    }
};
function $cb45878a962ef02e$export$2e2bcd8739ae039(...args) {
    const isMounted = $jOjOc$useRef(null);
    const defaults = (typeof args[0] === 'string' ? args[1] : args[0]) || {
    };
    const cancelToken = $jOjOc$useRef(null);
    const recentlySuccessfulTimeoutId = $jOjOc$useRef(null);
    const [data1, setData] = $jOjOc$useState(defaults);
    const [response1, setResponse] = $jOjOc$useState({
    });
    const [errors1, setErrors] = $jOjOc$useState({
    });
    const [hasErrors, setHasErrors] = $jOjOc$useState(false);
    const [processing, setProcessing] = $jOjOc$useState(false);
    const [progress, setProgress] = $jOjOc$useState(null);
    const [wasSuccessful, setWasSuccessful] = $jOjOc$useState(false);
    const [recentlySuccessful, setRecentlySuccessful] = $jOjOc$useState(false);
    let transform = (data)=>data
    ;
    $jOjOc$useEffect(()=>{
        isMounted.current = true;
        return ()=>{
            isMounted.current = false;
        };
    }, []);
    const submit = $jOjOc$useCallback((method, url, options = {
    })=>{
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
                    setErrors({
                    });
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
        if (method === 'delete') return $cb45878a962ef02e$export$9d54d4ec2dd4b364.delete(url, {
            ..._options,
            data: transform(data1)
        });
        else return $cb45878a962ef02e$export$9d54d4ec2dd4b364[method](url, transform(data1), _options);
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
        isDirty: !$jOjOc$lodashisEqual(data1, defaults),
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
                    } : {
                    }
                })
            , {
            }));
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




function $ccf098f9d18c4080$export$2e2bcd8739ae039(...args) {
    const defaults = (typeof args[0] === 'string' ? args[1] : args[0]) || {
    };
    const [data1, setData] = $jOjOc$useState(defaults);
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
        isDirty: !$jOjOc$lodashisEqual(data1, defaults)
    };
}




export {$cb45878a962ef02e$export$2e2bcd8739ae039 as useForm, $ccf098f9d18c4080$export$2e2bcd8739ae039 as useData};
//# sourceMappingURL=module.js.map

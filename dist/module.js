import {useRef as $5OpyM$useRef, useState as $5OpyM$useState, useEffect as $5OpyM$useEffect, useCallback as $5OpyM$useCallback} from "react";
import $5OpyM$lodashisequal from "lodash.isequal";
import $5OpyM$lodashget from "lodash.get";
import $5OpyM$axios from "axios";
import {stringify as $5OpyM$stringify, parse as $5OpyM$parse} from "qs";
import $5OpyM$deepmerge from "deepmerge";
import {jsx as $5OpyM$jsx} from "react/jsx-runtime";
import $5OpyM$proptypes from "prop-types";






var $fe29b54e7b359275$export$31bb55db0b3e4187;
(function($fe29b54e7b359275$export$31bb55db0b3e4187) {
    $fe29b54e7b359275$export$31bb55db0b3e4187["GET"] = "get";
    $fe29b54e7b359275$export$31bb55db0b3e4187["POST"] = "post";
    $fe29b54e7b359275$export$31bb55db0b3e4187["PUT"] = "put";
    $fe29b54e7b359275$export$31bb55db0b3e4187["PATCH"] = "patch";
    $fe29b54e7b359275$export$31bb55db0b3e4187["DELETE"] = "delete";
})($fe29b54e7b359275$export$31bb55db0b3e4187 || ($fe29b54e7b359275$export$31bb55db0b3e4187 = {}));


function $b0bdb40000df2244$export$181d7b261dd21e46(href) {
    return new URL(href.toString(), window.location.toString());
}
function $b0bdb40000df2244$export$44c8c586af913ff3(method, href, data, qsArrayFormat = 'brackets') {
    const hasHost = /^https?:\/\//.test(href.toString());
    const hasAbsolutePath = hasHost || href.toString().startsWith('/');
    const hasRelativePath = !hasAbsolutePath && !href.toString().startsWith('#') && !href.toString().startsWith('?');
    const hasSearch = href.toString().includes('?') || method === $fe29b54e7b359275$export$31bb55db0b3e4187.GET && Object.keys(data).length;
    const hasHash = href.toString().includes('#');
    const url = new URL(href.toString(), 'http://localhost');
    if (method === $fe29b54e7b359275$export$31bb55db0b3e4187.GET && Object.keys(data).length) {
        url.search = $5OpyM$stringify($5OpyM$deepmerge($5OpyM$parse(url.search, {
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
function $b0bdb40000df2244$export$311fc32ea47c5ee1(url) {
    url = new URL(url.href);
    url.hash = '';
    return url;
}



function $9c2b2e2c8e33fef8$export$d75e7764e3522d6d(data) {
    return data instanceof File || data instanceof Blob || data instanceof FileList && data.length > 0 || data instanceof FormData && Array.from(data.values()).some((value)=>$9c2b2e2c8e33fef8$export$d75e7764e3522d6d(value)
    ) || typeof data === 'object' && data !== null && Object.values(data).some((value)=>$9c2b2e2c8e33fef8$export$d75e7764e3522d6d(value)
    );
}


function $09afd467f75359ec$export$c621c6e92c748156(source, form = new FormData(), parentKey = null) {
    source = source || {};
    for(const key in source)if (Object.prototype.hasOwnProperty.call(source, key)) $09afd467f75359ec$var$append(form, $09afd467f75359ec$var$composeKey(parentKey, key), source[key]);
    return form;
}
function $09afd467f75359ec$var$composeKey(parent, key) {
    return parent ? parent + '[' + key + ']' : key;
}
function $09afd467f75359ec$var$append(form, key, value) {
    if (Array.isArray(value)) return Array.from(value.keys()).forEach((index)=>$09afd467f75359ec$var$append(form, $09afd467f75359ec$var$composeKey(key, index.toString()), value[index])
    );
    else if (value instanceof Date) return form.append(key, value.toISOString());
    else if (value instanceof File) return form.append(key, value, value.name);
    else if (value instanceof Blob) return form.append(key, value);
    else if (typeof value === 'boolean') return form.append(key, value ? '1' : '0');
    else if (typeof value === 'string') return form.append(key, value);
    else if (typeof value === 'number') return form.append(key, `${value}`);
    else if (value === null || value === undefined) return form.append(key, '');
    $09afd467f75359ec$export$c621c6e92c748156(value, form, key);
}



const $f682545b599f3e80$export$9d54d4ec2dd4b364 = {
    onBefore: (config)=>config
    ,
    finishVisit (visit) {
        visit.completed = true;
        visit.cancelled = false;
        visit.interrupted = false;
        visit.onFinish(visit);
    },
    get (url, data = {}, options = {}) {
        return this.visit(url, Object.assign(Object.assign({}, options), {
            method: $fe29b54e7b359275$export$31bb55db0b3e4187.GET,
            data: data
        }));
    },
    post (url, data = {}, options = {}) {
        return this.visit(url, Object.assign(Object.assign({
            preserveState: true
        }, options), {
            method: $fe29b54e7b359275$export$31bb55db0b3e4187.POST,
            data: data
        }));
    },
    put (url, data = {}, options = {}) {
        return this.visit(url, Object.assign(Object.assign({
            preserveState: true
        }, options), {
            method: $fe29b54e7b359275$export$31bb55db0b3e4187.PUT,
            data: data
        }));
    },
    patch (url, data = {}, options = {}) {
        return this.visit(url, Object.assign(Object.assign({
            preserveState: true
        }, options), {
            method: $fe29b54e7b359275$export$31bb55db0b3e4187.PATCH,
            data: data
        }));
    },
    delete (url, options = {}) {
        return this.visit(url, Object.assign(Object.assign({
            preserveState: true
        }, options), {
            method: $fe29b54e7b359275$export$31bb55db0b3e4187.DELETE
        }));
    },
    visit (href, { method: method = $fe29b54e7b359275$export$31bb55db0b3e4187.GET , data: data = {} , headers: headers = {} , errorBag: errorBag = '' , forceFormData: forceFormData = false , queryStringArrayFormat: queryStringArrayFormat = 'brackets' , onProgress: onProgress = ()=>({})
     , onFinish: onFinish = ()=>({})
     , onError: onError = ()=>({})
     , onBefore: onBefore = ()=>({})
     , onSuccess: onSuccess = (response)=>response
      }) {
        let url = typeof href === 'string' ? $b0bdb40000df2244$export$181d7b261dd21e46(href) : href;
        if (this.activeVisit && this.activeVisit.processing) return;
        // Create form data if has files
        if (($9c2b2e2c8e33fef8$export$d75e7764e3522d6d(data) || forceFormData) && !(data instanceof FormData)) data = $09afd467f75359ec$export$c621c6e92c748156(data);
        // If not FormData,
        if (!(data instanceof FormData)) {
            const [_href, _data] = $b0bdb40000df2244$export$44c8c586af913ff3(method, url, data, queryStringArrayFormat);
            url = $b0bdb40000df2244$export$181d7b261dd21e46(_href);
            data = _data;
        }
        const visit1 = {
            url: url,
            method: method,
            data: data,
            headers: headers,
            errorBag: errorBag,
            forceFormData: forceFormData,
            queryStringArrayFormat: queryStringArrayFormat,
            onFinish: onFinish,
            completed: false,
            interrupted: false,
            cancelled: false
        };
        onBefore(visit1);
        return Promise.resolve(this.onBefore(visit1)).then((visit)=>{
            this.activeVisit = visit;
            return new Promise((resolve, reject)=>{
                return $5OpyM$axios({
                    method: visit.method,
                    url: $b0bdb40000df2244$export$311fc32ea47c5ee1(visit.url).href,
                    data: visit.method === $fe29b54e7b359275$export$31bb55db0b3e4187.GET ? {} : visit.data,
                    params: visit.method === $fe29b54e7b359275$export$31bb55db0b3e4187.GET ? visit.data : {},
                    headers: Object.assign(Object.assign({}, visit.headers), {
                        'X-Requested-With': 'XMLHttpRequest'
                    }),
                    onUploadProgress: (progress)=>{
                        if (visit.data instanceof FormData) {
                            progress.percentage = Math.round(progress.loaded / progress.total * 100);
                            onProgress(progress);
                        }
                    }
                }).then((response)=>{
                    const errors = $5OpyM$lodashget(response, 'data.errors', {}) || {};
                    if (this.activeVisit) this.finishVisit(this.activeVisit);
                    if (Object.keys(errors).length > 0) {
                        const scopedErrors = errorBag ? errors[errorBag] ? errors[errorBag] : {} : errors;
                        return onError(scopedErrors);
                    }
                    onSuccess(response.data);
                    return resolve(response.data);
                }).catch((error)=>{
                    const errors = $5OpyM$lodashget(error, 'response.data.errors', {});
                    if (this.activeVisit) this.finishVisit(this.activeVisit);
                    if (Object.keys(errors).length > 0) {
                        const scopedErrors = errorBag ? errors[errorBag] ? errors[errorBag] : {} : errors;
                        return onError(scopedErrors);
                    }
                    return reject(error);
                });
            });
        });
    }
};
function $f682545b599f3e80$export$2936a48690e5fc2f(http) {
    return function(...args) {
        const isMounted = $5OpyM$useRef(null);
        const defaults = (typeof args[0] === 'string' ? args[1] : args[0]) || {};
        const cancelToken = $5OpyM$useRef(null);
        const recentlySuccessfulTimeoutId = $5OpyM$useRef(null);
        const [data1, setData] = $5OpyM$useState(defaults);
        const [response1, setResponse] = $5OpyM$useState({});
        const [errors1, setErrors] = $5OpyM$useState({});
        const [hasErrors, setHasErrors] = $5OpyM$useState(false);
        const [processing, setProcessing] = $5OpyM$useState(false);
        const [progress, setProgress] = $5OpyM$useState(null);
        const [wasSuccessful, setWasSuccessful] = $5OpyM$useState(false);
        const [recentlySuccessful, setRecentlySuccessful] = $5OpyM$useState(false);
        $5OpyM$useEffect(()=>{
            isMounted.current = true;
            return ()=>{
                isMounted.current = false;
            };
        }, []);
        const submit = $5OpyM$useCallback((method, url, options = {})=>{
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
            if (method === 'delete') return http.delete(url, {
                ..._options,
                data: data1
            });
            return http[method](url, data1, _options);
        }, [
            data1,
            setErrors
        ]);
        return {
            data: data1,
            response: response1,
            isDirty: !$5OpyM$lodashisequal(data1, defaults),
            errors: errors1,
            hasErrors: hasErrors,
            processing: processing,
            progress: progress,
            wasSuccessful: wasSuccessful,
            recentlySuccessful: recentlySuccessful,
            submit: submit,
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
    };
}
const $f682545b599f3e80$var$useForm = $f682545b599f3e80$export$2936a48690e5fc2f($f682545b599f3e80$export$9d54d4ec2dd4b364);
var $f682545b599f3e80$export$2e2bcd8739ae039 = $f682545b599f3e80$var$useForm;




function $eb84438726e81eac$export$2e2bcd8739ae039(...args) {
    const defaults = (typeof args[0] === 'string' ? args[1] : args[0]) || {};
    const [data1, setData] = $5OpyM$useState(defaults);
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
        isDirty: !$5OpyM$lodashisequal(data1, defaults)
    };
}




function $e3f9cf6e5dac0086$var$Flex(props = {
    vertical: false,
    reverse: false,
    right: false,
    left: false,
    bottom: false,
    top: false,
    yCenter: false,
    xCenter: false,
    center: false,
    wrap: false,
    between: false,
    style: {}
}) {
    const styles = {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap'
    };
    if (props.vertical) {
        styles['flexDirection'] = 'column';
        if (props.reverse) styles['flexDirection'] = 'column-reverse';
        if (props.right) styles['alignItems'] = 'flex-end';
        if (props.left) styles['alignItems'] = 'flex-start';
        if (props.bottom) styles['justifyContent'] = 'flex-end';
        if (props.top) styles['justifyContent'] = 'flex-start';
        if (props.yCenter) styles['justifyContent'] = 'center';
        if (props.xCenter || props.center) styles['alignItems'] = 'center';
    } else {
        if (props.reverse) styles['flexDirection'] = 'row-reverse';
        if (props.right) styles['justifyContent'] = 'flex-end';
        if (props.left) styles['justifyContent'] = 'flex-start';
        if (props.bottom) styles['alignItems'] = 'flex-end';
        if (props.top) styles['alignItems'] = 'flex-start';
        if (props.xCenter) styles['justifyContent'] = 'center';
        if (props.yCenter || props.center) styles['alignItems'] = 'center';
    }
    if (props.between) styles['justifyContent'] = 'space-between';
    if (props.wrap) styles['flexWrap'] = 'wrap';
    return /*#__PURE__*/ $5OpyM$jsx("div", {
        style: {
            ...styles,
            ...props.style
        },
        children: props.children
    });
}
var $e3f9cf6e5dac0086$export$2e2bcd8739ae039 = $e3f9cf6e5dac0086$var$Flex;





function $54a02b9339185062$var$FlexItem(props) {
    const styles = {};
    if (props.flex) styles['display'] = 'flex';
    if (props.right) styles['alignSelf'] = 'flex-end';
    if (props.left) styles['alignSelf'] = 'flex-start';
    if (props.stretch) styles['alignSelf'] = 'stretch';
    if (props.center) styles['alignSelf'] = 'center';
    if (props.grow) styles['flexGrow'] = 1;
    if (props.shrink) styles['flexShrink'] = 1;
    if (props.first) styles['order'] = '-9999';
    if (props.nth) styles['order'] = props.nth;
    return /*#__PURE__*/ $5OpyM$jsx("div", {
        style: {
            ...styles,
            ...props.style
        },
        children: props.children
    });
}
$54a02b9339185062$var$FlexItem.defaultProps = {
    flex: false,
    right: false,
    left: false,
    shrink: false,
    center: false,
    stretch: false,
    first: false,
    last: false,
    grow: false,
    nth: null,
    style: {}
};
$54a02b9339185062$var$FlexItem.propTypes = {
    right: $5OpyM$proptypes.bool,
    left: $5OpyM$proptypes.bool,
    shrink: $5OpyM$proptypes.bool,
    center: $5OpyM$proptypes.bool,
    stretch: $5OpyM$proptypes.bool,
    first: $5OpyM$proptypes.bool,
    last: $5OpyM$proptypes.bool,
    grow: $5OpyM$proptypes.bool,
    nth: $5OpyM$proptypes.any,
    style: $5OpyM$proptypes.object
};
var $54a02b9339185062$export$2e2bcd8739ae039 = $54a02b9339185062$var$FlexItem;




export {$f682545b599f3e80$export$2e2bcd8739ae039 as useForm, $f682545b599f3e80$export$9d54d4ec2dd4b364 as Visitor, $f682545b599f3e80$export$2936a48690e5fc2f as createNewForm, $eb84438726e81eac$export$2e2bcd8739ae039 as useData, $e3f9cf6e5dac0086$export$2e2bcd8739ae039 as Flex, $54a02b9339185062$export$2e2bcd8739ae039 as FlexItem};
//# sourceMappingURL=module.js.map

var $gXNCa$react = require("react");
var $gXNCa$lodashisequal = require("lodash.isequal");
var $gXNCa$lodashget = require("lodash.get");
var $gXNCa$axios = require("axios");
var $gXNCa$qs = require("qs");
var $gXNCa$deepmerge = require("deepmerge");
var $gXNCa$reactjsxruntime = require("react/jsx-runtime");
var $gXNCa$proptypes = require("prop-types");

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

$parcel$export(module.exports, "useForm", () => $6a9a2e7eef1d0024$export$2e2bcd8739ae039);
$parcel$export(module.exports, "Visitor", () => $6a9a2e7eef1d0024$export$9d54d4ec2dd4b364);
$parcel$export(module.exports, "createNewForm", () => $6a9a2e7eef1d0024$export$2936a48690e5fc2f);
$parcel$export(module.exports, "useData", () => $5f46e41148821515$export$2e2bcd8739ae039);
$parcel$export(module.exports, "Flex", () => $1eb34a78d8cfe7fa$export$2e2bcd8739ae039);
$parcel$export(module.exports, "FlexItem", () => $a8a77246acb9f203$export$2e2bcd8739ae039);





var $d9d2427bf865e27c$export$31bb55db0b3e4187;
(function($d9d2427bf865e27c$export$31bb55db0b3e4187) {
    $d9d2427bf865e27c$export$31bb55db0b3e4187["GET"] = "get";
    $d9d2427bf865e27c$export$31bb55db0b3e4187["POST"] = "post";
    $d9d2427bf865e27c$export$31bb55db0b3e4187["PUT"] = "put";
    $d9d2427bf865e27c$export$31bb55db0b3e4187["PATCH"] = "patch";
    $d9d2427bf865e27c$export$31bb55db0b3e4187["DELETE"] = "delete";
})($d9d2427bf865e27c$export$31bb55db0b3e4187 || ($d9d2427bf865e27c$export$31bb55db0b3e4187 = {}));


function $45cbe7fd39aa3ef4$export$181d7b261dd21e46(href) {
    return new URL(href.toString(), window.location.toString());
}
function $45cbe7fd39aa3ef4$export$44c8c586af913ff3(method, href, data, qsArrayFormat = 'brackets') {
    const hasHost = /^https?:\/\//.test(href.toString());
    const hasAbsolutePath = hasHost || href.toString().startsWith('/');
    const hasRelativePath = !hasAbsolutePath && !href.toString().startsWith('#') && !href.toString().startsWith('?');
    const hasSearch = href.toString().includes('?') || method === $d9d2427bf865e27c$export$31bb55db0b3e4187.GET && Object.keys(data).length;
    const hasHash = href.toString().includes('#');
    const url = new URL(href.toString(), 'http://localhost');
    if (method === $d9d2427bf865e27c$export$31bb55db0b3e4187.GET && Object.keys(data).length) {
        url.search = $gXNCa$qs.stringify(($parcel$interopDefault($gXNCa$deepmerge))($gXNCa$qs.parse(url.search, {
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
function $45cbe7fd39aa3ef4$export$311fc32ea47c5ee1(url) {
    url = new URL(url.href);
    url.hash = '';
    return url;
}



function $858be8dde8579f73$export$d75e7764e3522d6d(data) {
    return data instanceof File || data instanceof Blob || data instanceof FileList && data.length > 0 || data instanceof FormData && Array.from(data.values()).some((value)=>$858be8dde8579f73$export$d75e7764e3522d6d(value)
    ) || typeof data === 'object' && data !== null && Object.values(data).some((value)=>$858be8dde8579f73$export$d75e7764e3522d6d(value)
    );
}


function $c50024cbefab0390$export$c621c6e92c748156(source, form = new FormData(), parentKey = null) {
    source = source || {};
    for(const key in source)if (Object.prototype.hasOwnProperty.call(source, key)) $c50024cbefab0390$var$append(form, $c50024cbefab0390$var$composeKey(parentKey, key), source[key]);
    return form;
}
function $c50024cbefab0390$var$composeKey(parent, key) {
    return parent ? parent + '[' + key + ']' : key;
}
function $c50024cbefab0390$var$append(form, key, value) {
    if (Array.isArray(value)) return Array.from(value.keys()).forEach((index)=>$c50024cbefab0390$var$append(form, $c50024cbefab0390$var$composeKey(key, index.toString()), value[index])
    );
    else if (value instanceof Date) return form.append(key, value.toISOString());
    else if (value instanceof File) return form.append(key, value, value.name);
    else if (value instanceof Blob) return form.append(key, value);
    else if (typeof value === 'boolean') return form.append(key, value ? '1' : '0');
    else if (typeof value === 'string') return form.append(key, value);
    else if (typeof value === 'number') return form.append(key, `${value}`);
    else if (value === null || value === undefined) return form.append(key, '');
    $c50024cbefab0390$export$c621c6e92c748156(value, form, key);
}



const $6a9a2e7eef1d0024$export$9d54d4ec2dd4b364 = {
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
            method: $d9d2427bf865e27c$export$31bb55db0b3e4187.GET,
            data: data
        }));
    },
    post (url, data = {}, options = {}) {
        return this.visit(url, Object.assign(Object.assign({
            preserveState: true
        }, options), {
            method: $d9d2427bf865e27c$export$31bb55db0b3e4187.POST,
            data: data
        }));
    },
    put (url, data = {}, options = {}) {
        return this.visit(url, Object.assign(Object.assign({
            preserveState: true
        }, options), {
            method: $d9d2427bf865e27c$export$31bb55db0b3e4187.PUT,
            data: data
        }));
    },
    patch (url, data = {}, options = {}) {
        return this.visit(url, Object.assign(Object.assign({
            preserveState: true
        }, options), {
            method: $d9d2427bf865e27c$export$31bb55db0b3e4187.PATCH,
            data: data
        }));
    },
    delete (url, options = {}) {
        return this.visit(url, Object.assign(Object.assign({
            preserveState: true
        }, options), {
            method: $d9d2427bf865e27c$export$31bb55db0b3e4187.DELETE
        }));
    },
    visit (href, { method: method = $d9d2427bf865e27c$export$31bb55db0b3e4187.GET , data: data = {} , headers: headers = {} , errorBag: errorBag = '' , forceFormData: forceFormData = false , queryStringArrayFormat: queryStringArrayFormat = 'brackets' , onProgress: onProgress = ()=>({})
     , onFinish: onFinish = ()=>({})
     , onError: onError = ()=>({})
     , onBefore: onBefore = ()=>({})
     , onSuccess: onSuccess = (response)=>response
      }) {
        let url = typeof href === 'string' ? $45cbe7fd39aa3ef4$export$181d7b261dd21e46(href) : href;
        if (this.activeVisit && this.activeVisit.processing) return;
        // Create form data if has files
        if (($858be8dde8579f73$export$d75e7764e3522d6d(data) || forceFormData) && !(data instanceof FormData)) data = $c50024cbefab0390$export$c621c6e92c748156(data);
        // If not FormData,
        if (!(data instanceof FormData)) {
            const [_href, _data] = $45cbe7fd39aa3ef4$export$44c8c586af913ff3(method, url, data, queryStringArrayFormat);
            url = $45cbe7fd39aa3ef4$export$181d7b261dd21e46(_href);
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
                return ($parcel$interopDefault($gXNCa$axios))({
                    method: visit.method,
                    url: $45cbe7fd39aa3ef4$export$311fc32ea47c5ee1(visit.url).href,
                    data: visit.method === $d9d2427bf865e27c$export$31bb55db0b3e4187.GET ? {} : visit.data,
                    params: visit.method === $d9d2427bf865e27c$export$31bb55db0b3e4187.GET ? visit.data : {},
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
                    const errors = ($parcel$interopDefault($gXNCa$lodashget))(response, 'data.errors', {}) || {};
                    if (this.activeVisit) this.finishVisit(this.activeVisit);
                    if (Object.keys(errors).length > 0) {
                        const scopedErrors = errorBag ? errors[errorBag] ? errors[errorBag] : {} : errors;
                        return onError(scopedErrors);
                    }
                    onSuccess(response.data);
                    return resolve(response.data);
                }).catch((error)=>{
                    const errors = ($parcel$interopDefault($gXNCa$lodashget))(error, 'response.data.errors', {});
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
function $6a9a2e7eef1d0024$export$2936a48690e5fc2f(http) {
    return function(...args) {
        const isMounted = $gXNCa$react.useRef(null);
        const defaults = (typeof args[0] === 'string' ? args[1] : args[0]) || {};
        const cancelToken = $gXNCa$react.useRef(null);
        const recentlySuccessfulTimeoutId = $gXNCa$react.useRef(null);
        const [data1, setData] = $gXNCa$react.useState(defaults);
        const [response1, setResponse] = $gXNCa$react.useState({});
        const [errors1, setErrors] = $gXNCa$react.useState({});
        const [hasErrors, setHasErrors] = $gXNCa$react.useState(false);
        const [processing, setProcessing] = $gXNCa$react.useState(false);
        const [progress, setProgress] = $gXNCa$react.useState(null);
        const [wasSuccessful, setWasSuccessful] = $gXNCa$react.useState(false);
        const [recentlySuccessful, setRecentlySuccessful] = $gXNCa$react.useState(false);
        $gXNCa$react.useEffect(()=>{
            isMounted.current = true;
            return ()=>{
                isMounted.current = false;
            };
        }, []);
        const submit = $gXNCa$react.useCallback((method, url, options = {})=>{
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
            isDirty: !($parcel$interopDefault($gXNCa$lodashisequal))(data1, defaults),
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
const $6a9a2e7eef1d0024$var$useForm = $6a9a2e7eef1d0024$export$2936a48690e5fc2f($6a9a2e7eef1d0024$export$9d54d4ec2dd4b364);
var $6a9a2e7eef1d0024$export$2e2bcd8739ae039 = $6a9a2e7eef1d0024$var$useForm;




function $5f46e41148821515$export$2e2bcd8739ae039(...args) {
    const defaults = (typeof args[0] === 'string' ? args[1] : args[0]) || {};
    const [data1, setData] = $gXNCa$react.useState(defaults);
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
        isDirty: !($parcel$interopDefault($gXNCa$lodashisequal))(data1, defaults)
    };
}




function $1eb34a78d8cfe7fa$var$Flex(props = {
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
    return /*#__PURE__*/ $gXNCa$reactjsxruntime.jsx("div", {
        style: {
            ...styles,
            ...props.style
        },
        children: props.children
    });
}
var $1eb34a78d8cfe7fa$export$2e2bcd8739ae039 = $1eb34a78d8cfe7fa$var$Flex;





function $a8a77246acb9f203$var$FlexItem(props) {
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
    return /*#__PURE__*/ $gXNCa$reactjsxruntime.jsx("div", {
        style: {
            ...styles,
            ...props.style
        },
        children: props.children
    });
}
$a8a77246acb9f203$var$FlexItem.defaultProps = {
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
$a8a77246acb9f203$var$FlexItem.propTypes = {
    right: ($parcel$interopDefault($gXNCa$proptypes)).bool,
    left: ($parcel$interopDefault($gXNCa$proptypes)).bool,
    shrink: ($parcel$interopDefault($gXNCa$proptypes)).bool,
    center: ($parcel$interopDefault($gXNCa$proptypes)).bool,
    stretch: ($parcel$interopDefault($gXNCa$proptypes)).bool,
    first: ($parcel$interopDefault($gXNCa$proptypes)).bool,
    last: ($parcel$interopDefault($gXNCa$proptypes)).bool,
    grow: ($parcel$interopDefault($gXNCa$proptypes)).bool,
    nth: ($parcel$interopDefault($gXNCa$proptypes)).any,
    style: ($parcel$interopDefault($gXNCa$proptypes)).object
};
var $a8a77246acb9f203$export$2e2bcd8739ae039 = $a8a77246acb9f203$var$FlexItem;




//# sourceMappingURL=index.js.map

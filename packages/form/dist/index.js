var $9vnn7$react = require("react");
var $9vnn7$lodashisequal = require("lodash.isequal");
var $9vnn7$lodashget = require("lodash.get");
var $9vnn7$axios = require("axios");
var $9vnn7$qs = require("qs");
var $9vnn7$deepmerge = require("deepmerge");

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

$parcel$export(module.exports, "useForm", () => $11cceea5fc5ebf19$export$2e2bcd8739ae039);
$parcel$export(module.exports, "Visitor", () => $11cceea5fc5ebf19$export$9d54d4ec2dd4b364);
$parcel$export(module.exports, "useData", () => $20909e36cb1e260b$export$2e2bcd8739ae039);





var $ed7f0e2735eeba9c$export$31bb55db0b3e4187;
(function($ed7f0e2735eeba9c$export$31bb55db0b3e4187) {
    $ed7f0e2735eeba9c$export$31bb55db0b3e4187["GET"] = "get";
    $ed7f0e2735eeba9c$export$31bb55db0b3e4187["POST"] = "post";
    $ed7f0e2735eeba9c$export$31bb55db0b3e4187["PUT"] = "put";
    $ed7f0e2735eeba9c$export$31bb55db0b3e4187["PATCH"] = "patch";
    $ed7f0e2735eeba9c$export$31bb55db0b3e4187["DELETE"] = "delete";
})($ed7f0e2735eeba9c$export$31bb55db0b3e4187 || ($ed7f0e2735eeba9c$export$31bb55db0b3e4187 = {}));


function $5f1668bda460d77e$export$181d7b261dd21e46(href) {
    return new URL(href.toString(), window.location.toString());
}
function $5f1668bda460d77e$export$44c8c586af913ff3(method, href, data, qsArrayFormat = 'brackets') {
    const hasHost = /^https?:\/\//.test(href.toString());
    const hasAbsolutePath = hasHost || href.toString().startsWith('/');
    const hasRelativePath = !hasAbsolutePath && !href.toString().startsWith('#') && !href.toString().startsWith('?');
    const hasSearch = href.toString().includes('?') || method === $ed7f0e2735eeba9c$export$31bb55db0b3e4187.GET && Object.keys(data).length;
    const hasHash = href.toString().includes('#');
    const url = new URL(href.toString(), 'http://localhost');
    if (method === $ed7f0e2735eeba9c$export$31bb55db0b3e4187.GET && Object.keys(data).length) {
        url.search = $9vnn7$qs.stringify(($parcel$interopDefault($9vnn7$deepmerge))($9vnn7$qs.parse(url.search, {
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
function $5f1668bda460d77e$export$311fc32ea47c5ee1(url) {
    url = new URL(url.href);
    url.hash = '';
    return url;
}



function $628e11d833c5f1a6$export$d75e7764e3522d6d(data) {
    return data instanceof File || data instanceof Blob || data instanceof FileList && data.length > 0 || data instanceof FormData && Array.from(data.values()).some((value)=>$628e11d833c5f1a6$export$d75e7764e3522d6d(value)
    ) || typeof data === 'object' && data !== null && Object.values(data).some((value)=>$628e11d833c5f1a6$export$d75e7764e3522d6d(value)
    );
}


function $e1888736b8750eb9$export$c621c6e92c748156(source, form = new FormData(), parentKey = null) {
    source = source || {};
    for(const key in source)if (Object.prototype.hasOwnProperty.call(source, key)) $e1888736b8750eb9$var$append(form, $e1888736b8750eb9$var$composeKey(parentKey, key), source[key]);
    return form;
}
function $e1888736b8750eb9$var$composeKey(parent, key) {
    return parent ? parent + '[' + key + ']' : key;
}
function $e1888736b8750eb9$var$append(form, key, value) {
    if (Array.isArray(value)) return Array.from(value.keys()).forEach((index)=>$e1888736b8750eb9$var$append(form, $e1888736b8750eb9$var$composeKey(key, index.toString()), value[index])
    );
    else if (value instanceof Date) return form.append(key, value.toISOString());
    else if (value instanceof File) return form.append(key, value, value.name);
    else if (value instanceof Blob) return form.append(key, value);
    else if (typeof value === 'boolean') return form.append(key, value ? '1' : '0');
    else if (typeof value === 'string') return form.append(key, value);
    else if (typeof value === 'number') return form.append(key, `${value}`);
    else if (value === null || value === undefined) return form.append(key, '');
    $e1888736b8750eb9$export$c621c6e92c748156(value, form, key);
}



const $11cceea5fc5ebf19$export$9d54d4ec2dd4b364 = {
    onBefore: (config)=>config
    ,
    visit (href, { method: method = $ed7f0e2735eeba9c$export$31bb55db0b3e4187.GET , data: data = {} , headers: headers = {} , errorBag: errorBag = '' , forceFormData: forceFormData = false , queryStringArrayFormat: queryStringArrayFormat = 'brackets' , onProgress: onProgress = ()=>({})
     , onFinish: onFinish = ()=>({})
     , onError: onError = ()=>({})
     , onBefore: onBefore = (config)=>config
     , onSuccess: onSuccess = (response)=>response
      }) {
        const self = this;
        let url = typeof href === 'string' ? $5f1668bda460d77e$export$181d7b261dd21e46(href) : href;
        if (this.activeVisit && this.activeVisit.processing) return;
        // Create form data if has files
        if (($628e11d833c5f1a6$export$d75e7764e3522d6d(data) || forceFormData) && !(data instanceof FormData)) data = $e1888736b8750eb9$export$c621c6e92c748156(data);
        // If not FormData,
        if (!(data instanceof FormData)) {
            const [_href, _data] = $5f1668bda460d77e$export$44c8c586af913ff3(method, url, data, queryStringArrayFormat);
            url = $5f1668bda460d77e$export$181d7b261dd21e46(_href);
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
        return Promise.resolve(onBefore(this.onBefore(visit1))).then((visit)=>{
            this.activeVisit = visit;
            return new Promise((resolve, reject)=>{
                return ($parcel$interopDefault($9vnn7$axios))({
                    method: visit.method,
                    url: $5f1668bda460d77e$export$311fc32ea47c5ee1(visit.url).href,
                    data: visit.method === $ed7f0e2735eeba9c$export$31bb55db0b3e4187.GET ? {} : visit.data,
                    params: visit.method === $ed7f0e2735eeba9c$export$31bb55db0b3e4187.GET ? visit.data : {},
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
                    const errors = ($parcel$interopDefault($9vnn7$lodashget))(response, 'data.errors', {}) || {};
                    if (this.activeVisit) this.finishVisit(this.activeVisit);
                    if (Object.keys(errors).length > 0) {
                        const scopedErrors = errorBag ? errors[errorBag] ? errors[errorBag] : {} : errors;
                        return onError(scopedErrors);
                    }
                    onSuccess(response.data);
                    return resolve(response.data);
                }).catch((error)=>{
                    const errors = ($parcel$interopDefault($9vnn7$lodashget))(error, 'response.data.errors', {});
                    if (this.activeVisit) this.finishVisit(this.activeVisit);
                    if (Object.keys(errors).length > 0) {
                        const scopedErrors = errorBag ? errors[errorBag] ? errors[errorBag] : {} : errors;
                        return onError(scopedErrors);
                    }
                    return reject(error);
                });
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
            method: $ed7f0e2735eeba9c$export$31bb55db0b3e4187.GET,
            data: data
        }));
    },
    post (url, data = {}, options = {}) {
        return this.visit(url, Object.assign(Object.assign({
            preserveState: true
        }, options), {
            method: $ed7f0e2735eeba9c$export$31bb55db0b3e4187.POST,
            data: data
        }));
    },
    put (url, data = {}, options = {}) {
        return this.visit(url, Object.assign(Object.assign({
            preserveState: true
        }, options), {
            method: $ed7f0e2735eeba9c$export$31bb55db0b3e4187.PUT,
            data: data
        }));
    },
    patch (url, data = {}, options = {}) {
        return this.visit(url, Object.assign(Object.assign({
            preserveState: true
        }, options), {
            method: $ed7f0e2735eeba9c$export$31bb55db0b3e4187.PATCH,
            data: data
        }));
    },
    delete (url, options = {}) {
        return this.visit(url, Object.assign(Object.assign({
            preserveState: true
        }, options), {
            method: $ed7f0e2735eeba9c$export$31bb55db0b3e4187.DELETE
        }));
    },
    useForm (...args) {
        const isMounted = $9vnn7$react.useRef(null);
        const defaults = (typeof args[0] === 'string' ? args[1] : args[0]) || {};
        const cancelToken = $9vnn7$react.useRef(null);
        const recentlySuccessfulTimeoutId = $9vnn7$react.useRef(null);
        const [data1, setData] = $9vnn7$react.useState(defaults);
        const [response1, setResponse] = $9vnn7$react.useState({});
        const [errors1, setErrors] = $9vnn7$react.useState({});
        const [hasErrors, setHasErrors] = $9vnn7$react.useState(false);
        const [processing, setProcessing] = $9vnn7$react.useState(false);
        const [progress, setProgress] = $9vnn7$react.useState(null);
        const [wasSuccessful, setWasSuccessful] = $9vnn7$react.useState(false);
        const [recentlySuccessful, setRecentlySuccessful] = $9vnn7$react.useState(false);
        let transform = (data)=>data
        ;
        $9vnn7$react.useEffect(()=>{
            isMounted.current = true;
            return ()=>{
                isMounted.current = false;
            };
        }, []);
        const submit = $9vnn7$react.useCallback((method, url, options = {})=>{
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
            if (method === 'delete') return this.visitor.delete(url, {
                ..._options,
                data: transform(data1)
            });
            else return this.visitor[method](url, transform(data1), _options);
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
            isDirty: !($parcel$interopDefault($9vnn7$lodashisequal))(data1, defaults),
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
};
const $11cceea5fc5ebf19$var$useForm = $11cceea5fc5ebf19$export$9d54d4ec2dd4b364.useForm;
var $11cceea5fc5ebf19$export$2e2bcd8739ae039 = $11cceea5fc5ebf19$var$useForm;




function $20909e36cb1e260b$export$2e2bcd8739ae039(...args) {
    const defaults = (typeof args[0] === 'string' ? args[1] : args[0]) || {};
    const [data1, setData] = $9vnn7$react.useState(defaults);
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
        isDirty: !($parcel$interopDefault($9vnn7$lodashisequal))(data1, defaults)
    };
}




//# sourceMappingURL=index.js.map

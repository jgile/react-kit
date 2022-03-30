function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var isEqual = _interopDefault(require('lodash/isEqual'));
var Axios = _interopDefault(require('axios'));
var qs = require('qs');
var deepmerge = _interopDefault(require('deepmerge'));

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

var Method;

(function (Method) {
  Method["GET"] = "get";
  Method["POST"] = "post";
  Method["PUT"] = "put";
  Method["PATCH"] = "patch";
  Method["DELETE"] = "delete";
})(Method || (Method = {}));

function hrefToUrl(href) {
  return new URL(href.toString(), window.location.toString());
}
function mergeDataIntoQueryString(method, href, data, qsArrayFormat) {
  if (qsArrayFormat === void 0) {
    qsArrayFormat = 'brackets';
  }

  var hasHost = /^https?:\/\//.test(href.toString());
  var hasAbsolutePath = hasHost || href.toString().startsWith('/');
  var hasRelativePath = !hasAbsolutePath && !href.toString().startsWith('#') && !href.toString().startsWith('?');
  var hasSearch = href.toString().includes('?') || method === Method.GET && Object.keys(data).length;
  var hasHash = href.toString().includes('#');
  var url = new URL(href.toString(), 'http://localhost');

  if (method === Method.GET && Object.keys(data).length) {
    url.search = qs.stringify(deepmerge(qs.parse(url.search, {
      ignoreQueryPrefix: true
    }), data), {
      encodeValuesOnly: true,
      arrayFormat: qsArrayFormat
    });
    data = {};
  }

  return [[hasHost ? url.protocol + "//" + url.host : '', hasAbsolutePath ? url.pathname : '', hasRelativePath ? url.pathname.substring(1) : '', hasSearch ? url.search : '', hasHash ? url.hash : ''].join(''), data];
}
function urlWithoutHash(url) {
  url = new URL(url.href);
  url.hash = '';
  return url;
}

function fireEvent(name, options) {
  return document.dispatchEvent(new CustomEvent("form:" + name, options));
}

var fireBeforeEvent = function fireBeforeEvent(visit) {
  return fireEvent('before', {
    cancelable: true,
    detail: {
      visit: visit
    }
  });
};
var fireErrorEvent = function fireErrorEvent(errors) {
  return fireEvent('error', {
    detail: {
      errors: errors
    }
  });
};
var fireExceptionEvent = function fireExceptionEvent(exception) {
  return fireEvent('exception', {
    cancelable: true,
    detail: {
      exception: exception
    }
  });
};
var fireFinishEvent = function fireFinishEvent(visit) {
  return fireEvent('finish', {
    detail: {
      visit: visit
    }
  });
};
var fireInvalidEvent = function fireInvalidEvent(response) {
  return fireEvent('invalid', {
    cancelable: true,
    detail: {
      response: response
    }
  });
};
var fireProgressEvent = function fireProgressEvent(progress) {
  return fireEvent('progress', {
    detail: {
      progress: progress
    }
  });
};
var fireStartEvent = function fireStartEvent(visit) {
  return fireEvent('start', {
    detail: {
      visit: visit
    }
  });
};
var fireSuccessEvent = function fireSuccessEvent(response) {
  return fireEvent('success', {
    detail: {
      response: response
    }
  });
};

function objectToFormData(source, form, parentKey) {
  if (form === void 0) {
    form = new FormData();
  }

  if (parentKey === void 0) {
    parentKey = null;
  }

  source = source || {};

  for (var key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      append(form, composeKey(parentKey, key), source[key]);
    }
  }

  return form;
}

function composeKey(parent, key) {
  return parent ? parent + '[' + key + ']' : key;
}

function append(form, key, value) {
  if (Array.isArray(value)) {
    return Array.from(value.keys()).forEach(function (index) {
      return append(form, composeKey(key, index.toString()), value[index]);
    });
  } else if (value instanceof Date) {
    return form.append(key, value.toISOString());
  } else if (value instanceof File) {
    return form.append(key, value, value.name);
  } else if (value instanceof Blob) {
    return form.append(key, value);
  } else if (typeof value === 'boolean') {
    return form.append(key, value ? '1' : '0');
  } else if (typeof value === 'string') {
    return form.append(key, value);
  } else if (typeof value === 'number') {
    return form.append(key, "" + value);
  } else if (value === null || value === undefined) {
    return form.append(key, '');
  }

  objectToFormData(value, form, key);
}

var Router = /*#__PURE__*/function () {
  function Router() {}

  var _proto = Router.prototype;

  _proto.init = function init(_ref) {
    var visitOptions = _ref.visitOptions;
    this.visitOptions = visitOptions;
  };

  _proto.cancelVisit = function cancelVisit(activeVisit, _ref2) {
    var _ref2$cancelled = _ref2.cancelled,
        cancelled = _ref2$cancelled === void 0 ? false : _ref2$cancelled,
        _ref2$interrupted = _ref2.interrupted,
        interrupted = _ref2$interrupted === void 0 ? false : _ref2$interrupted;

    if (activeVisit && !activeVisit.completed && !activeVisit.cancelled && !activeVisit.interrupted) {
      activeVisit.cancelToken.cancel();
      activeVisit.onCancel();
      activeVisit.completed = false;
      activeVisit.cancelled = cancelled;
      activeVisit.interrupted = interrupted;
      fireFinishEvent(activeVisit);
      activeVisit.onFinish(activeVisit);
    }
  };

  _proto.finishVisit = function finishVisit(visit) {
    if (!visit.cancelled && !visit.interrupted) {
      visit.completed = true;
      visit.cancelled = false;
      visit.interrupted = false;
      fireFinishEvent(visit);
      visit.onFinish(visit);
    }
  };

  _proto.visit = function visit(href, params) {
    var _this = this;

    if (params === void 0) {
      params = {};
    }

    var options = _extends({
      method: Method.GET,
      data: {},
      replace: false,
      only: [],
      headers: {},
      errorBag: '',
      forceFormData: false,
      queryStringArrayFormat: 'brackets',
      onCancelToken: function onCancelToken() {},
      onBefore: function onBefore() {},
      onStart: function onStart() {},
      onProgress: function onProgress() {},
      onFinish: function onFinish() {},
      onCancel: function onCancel() {},
      onSuccess: function onSuccess() {},
      onError: function onError() {}
    }, params);

    var url = typeof href === 'string' ? hrefToUrl(href) : href;
    var prepared = this.visitOptions(options, url) || options;
    var method = prepared.method,
        replace = prepared.replace,
        only = prepared.only,
        headers = prepared.headers,
        errorBag = prepared.errorBag,
        forceFormData = prepared.forceFormData,
        queryStringArrayFormat = prepared.queryStringArrayFormat,
        onCancelToken = prepared.onCancelToken,
        onBefore = prepared.onBefore,
        onStart = prepared.onStart,
        onProgress = prepared.onProgress,
        onFinish = prepared.onFinish,
        onCancel = prepared.onCancel,
        onSuccess = prepared.onSuccess,
        onError = prepared.onError;
    var data = prepared.data;

    if ((data || forceFormData) && !(data instanceof FormData)) {
      data = objectToFormData(data);
    }

    if (!(data instanceof FormData)) {
      var _mergeDataIntoQuerySt = mergeDataIntoQueryString(method, url, data, queryStringArrayFormat),
          _href = _mergeDataIntoQuerySt[0],
          _data = _mergeDataIntoQuerySt[1];

      url = hrefToUrl(_href);
      data = _data;
    }

    var visit = {
      url: url,
      method: method,
      data: data,
      replace: replace,
      only: only,
      headers: headers,
      errorBag: errorBag,
      forceFormData: forceFormData,
      queryStringArrayFormat: queryStringArrayFormat,
      cancelled: false,
      completed: false,
      interrupted: false
    };

    if (onBefore(visit) === false || !fireBeforeEvent(visit)) {
      return;
    }

    if (this.activeVisit) {
      this.cancelVisit(this.activeVisit, {
        interrupted: true
      });
    }

    this.activeVisit = _extends({}, visit, {
      onCancelToken: onCancelToken,
      onBefore: onBefore,
      onStart: onStart,
      onProgress: onProgress,
      onFinish: onFinish,
      onCancel: onCancel,
      onSuccess: onSuccess,
      onError: onError,
      queryStringArrayFormat: queryStringArrayFormat,
      cancelToken: Axios.CancelToken.source()
    });
    onCancelToken({
      cancel: function cancel() {
        if (_this.activeVisit) {
          _this.cancelVisit(_this.activeVisit, {
            cancelled: true
          });
        }
      }
    });
    fireStartEvent(visit);
    onStart(visit);
    Axios({
      method: method,
      url: urlWithoutHash(url).href,
      data: method === Method.GET ? {} : data,
      params: method === Method.GET ? data : {},
      cancelToken: this.activeVisit.cancelToken.token,
      headers: _extends({}, headers, {
        Accept: 'text/html, application/xhtml+xml',
        'X-Requested-With': 'XMLHttpRequest'
      }),
      onUploadProgress: function onUploadProgress(progress) {
        if (data instanceof FormData) {
          progress.percentage = Math.round(progress.loaded / progress.total * 100);
          fireProgressEvent(progress);
          onProgress(progress);
        }
      }
    }).then(function (response) {
      var errors = response.data.errors || {};

      if (Object.keys(errors).length > 0) {
        var scopedErrors = errorBag ? errors[errorBag] ? errors[errorBag] : {} : errors;
        fireErrorEvent(scopedErrors);
        return onError(scopedErrors);
      }

      fireSuccessEvent(response);
      return onSuccess(response);
    })["catch"](function (error) {
      if (error.response) {
        fireInvalidEvent(error.response);
      } else {
        return Promise.reject(error);
      }
    }).then(function () {
      if (_this.activeVisit) {
        _this.finishVisit(_this.activeVisit);
      }
    })["catch"](function (error) {
      if (!Axios.isCancel(error)) {
        var throwException = fireExceptionEvent(error);

        if (_this.activeVisit) {
          _this.finishVisit(_this.activeVisit);
        }

        if (throwException) {
          return Promise.reject(error);
        }
      }
    });
  };

  _proto.get = function get(url, data, options) {
    if (data === void 0) {
      data = {};
    }

    if (options === void 0) {
      options = {};
    }

    return this.visit(url, _extends({}, options, {
      method: Method.GET,
      data: data
    }));
  };

  _proto.reload = function reload(options) {
    if (options === void 0) {
      options = {};
    }

    return this.visit(window.location.href, _extends({}, options));
  };

  _proto.replace = function replace(url, options) {
    var _options$method;

    if (options === void 0) {
      options = {};
    }

    console.warn("Inertia.replace() has been deprecated and will be removed in a future release. Please use Inertia." + ((_options$method = options.method) != null ? _options$method : 'get') + "() instead.");
    return this.visit(url, _extends({}, options, {
      replace: true
    }));
  };

  _proto.post = function post(url, data, options) {
    if (data === void 0) {
      data = {};
    }

    if (options === void 0) {
      options = {};
    }

    return this.visit(url, _extends({}, options, {
      method: Method.POST,
      data: data
    }));
  };

  _proto.put = function put(url, data, options) {
    if (data === void 0) {
      data = {};
    }

    if (options === void 0) {
      options = {};
    }

    return this.visit(url, _extends({}, options, {
      method: Method.PUT,
      data: data
    }));
  };

  _proto.patch = function patch(url, data, options) {
    if (data === void 0) {
      data = {};
    }

    if (options === void 0) {
      options = {};
    }

    return this.visit(url, _extends({}, options, {
      method: Method.PATCH,
      data: data
    }));
  };

  _proto["delete"] = function _delete(url, options) {
    if (options === void 0) {
      options = {};
    }

    return this.visit(url, _extends({}, options, {
      method: Method.DELETE
    }));
  };

  _proto.on = function on(type, callback) {
    var listener = function listener(event) {
      var response = callback(event);

      if (event.cancelable && !event.defaultPrevented && response === false) {
        event.preventDefault();
      }
    };

    document.addEventListener("inertia:" + type, listener);
    return function () {
      return document.removeEventListener("inertia:" + type, listener);
    };
  };

  return Router;
}();
var router = new Router();
function useForm() {
  var isMounted = React.useRef(null);

  var _useState = React.useState((typeof (arguments.length <= 0 ? undefined : arguments[0]) === 'string' ? arguments.length <= 1 ? undefined : arguments[1] : arguments.length <= 0 ? undefined : arguments[0]) || {}),
      defaults = _useState[0],
      _setDefaults = _useState[1];

  var cancelToken = React.useRef(null);

  var _useState2 = React.useState(defaults),
      data = _useState2[0],
      _setData = _useState2[1];

  var _useState3 = React.useState({}),
      errors = _useState3[0],
      setErrors = _useState3[1];

  var _useState4 = React.useState(false),
      hasErrors = _useState4[0],
      setHasErrors = _useState4[1];

  var _useState5 = React.useState(false),
      processing = _useState5[0],
      setProcessing = _useState5[1];

  var _useState6 = React.useState(null),
      progress = _useState6[0],
      setProgress = _useState6[1];

  var _useState7 = React.useState(false),
      wasSuccessful = _useState7[0],
      setWasSuccessful = _useState7[1];

  var _useState8 = React.useState(false),
      recentlySuccessful = _useState8[0],
      setRecentlySuccessful = _useState8[1];

  var _transform = function transform(data) {
    return data;
  };

  React.useEffect(function () {
    isMounted.current = true;
    return function () {
      isMounted.current = false;
    };
  }, []);
  var submit = React.useCallback(function (method, url, options) {
    if (options === void 0) {
      options = {};
    }

    var _options = _extends({}, options, {
      onCancelToken: function onCancelToken(token) {
        cancelToken.current = token;

        if (options.onCancelToken) {
          return options.onCancelToken(token);
        }
      },
      onBefore: function onBefore(visit) {
        setWasSuccessful(false);
        setRecentlySuccessful(false);

        if (options.onBefore) {
          return options.onBefore(visit);
        }
      },
      onStart: function onStart(visit) {
        setProcessing(true);

        if (options.onStart) {
          return options.onStart(visit);
        }
      },
      onProgress: function onProgress(event) {
        setProgress(event);

        if (options.onProgress) {
          return options.onProgress(event);
        }
      },
      onSuccess: function onSuccess(page) {
        if (isMounted.current) {
          setProcessing(false);
          setProgress(null);
          setErrors({});
          setHasErrors(false);
          setWasSuccessful(true);
          setRecentlySuccessful(true);
        }

        if (options.onSuccess) {
          return options.onSuccess(page);
        }
      },
      onError: function onError(errors) {
        if (isMounted.current) {
          setProcessing(false);
          setProgress(null);
          setErrors(errors);
          setHasErrors(true);
        }

        if (options.onError) {
          return options.onError(errors);
        }
      },
      onCancel: function onCancel() {
        if (isMounted.current) {
          setProcessing(false);
          setProgress(null);
        }

        if (options.onCancel) {
          return options.onCancel();
        }
      },
      onFinish: function onFinish() {
        if (isMounted.current) {
          setProcessing(false);
          setProgress(null);
        }

        cancelToken.current = null;

        if (options.onFinish) {
          return options.onFinish();
        }
      }
    });

    if (method === 'delete') {
      return router["delete"](url, _extends({}, _options, {
        data: _transform(data)
      }));
    } else {
      return router[method](url, _transform(data), _options);
    }
  }, [data, setErrors]);
  return {
    data: data,
    setData: function setData(key, value) {
      if (typeof key === 'string') {
        var _extends2;

        _setData(_extends({}, data, (_extends2 = {}, _extends2[key] = value, _extends2)));
      } else if (typeof key === 'function') {
        _setData(function (data) {
          return key(data);
        });
      } else {
        _setData(key);
      }
    },
    isDirty: !isEqual(data, defaults),
    errors: errors,
    hasErrors: hasErrors,
    processing: processing,
    progress: progress,
    wasSuccessful: wasSuccessful,
    recentlySuccessful: recentlySuccessful,
    transform: function transform(callback) {
      _transform = callback;
    },
    setDefaults: function setDefaults(key, value) {
      if (typeof key === 'undefined') {
        _setDefaults(function () {
          return data;
        });
      } else {
        _setDefaults(function (defaults) {
          var _ref3;

          return _extends({}, defaults, value ? (_ref3 = {}, _ref3[key] = value, _ref3) : key);
        });
      }
    },
    reset: function reset() {
      for (var _len = arguments.length, fields = new Array(_len), _key = 0; _key < _len; _key++) {
        fields[_key] = arguments[_key];
      }

      if (fields.length === 0) {
        _setData(defaults);
      } else {
        _setData(Object.keys(defaults).filter(function (key) {
          return fields.includes(key);
        }).reduce(function (carry, key) {
          carry[key] = defaults[key];
          return carry;
        }, _extends({}, data)));
      }
    },
    setError: function setError(key, value) {
      setErrors(function (errors) {
        var _ref4;

        var newErrors = _extends({}, errors, value ? (_ref4 = {}, _ref4[key] = value, _ref4) : key);

        setHasErrors(Object.keys(newErrors).length > 0);
        return newErrors;
      });
    },
    clearErrors: function clearErrors() {
      for (var _len2 = arguments.length, fields = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        fields[_key2] = arguments[_key2];
      }

      setErrors(function (errors) {
        var newErrors = Object.keys(errors).reduce(function (carry, field) {
          var _ref5;

          return _extends({}, carry, fields.length > 0 && !fields.includes(field) ? (_ref5 = {}, _ref5[field] = errors[field], _ref5) : {});
        }, {});
        setHasErrors(Object.keys(newErrors).length > 0);
        return newErrors;
      });
    },
    submit: submit,
    get: function get(url, options) {
      return submit('get', url, options);
    },
    post: function post(url, options) {
      return submit('post', url, options);
    },
    put: function put(url, options) {
      return submit('put', url, options);
    },
    patch: function patch(url, options) {
      return submit('patch', url, options);
    },
    "delete": function _delete(url, options) {
      return submit('delete', url, options);
    }
  };
}

function useData() {
  var defaults = (typeof (arguments.length <= 0 ? undefined : arguments[0]) === 'string' ? arguments.length <= 1 ? undefined : arguments[1] : arguments.length <= 0 ? undefined : arguments[0]) || {};

  var _useState = React.useState(defaults),
      data = _useState[0],
      _setData = _useState[1];

  return {
    data: data,
    reset: function reset() {
      for (var _len = arguments.length, fields = new Array(_len), _key = 0; _key < _len; _key++) {
        fields[_key] = arguments[_key];
      }

      if (!fields.length) {
        _setData(defaults);
      } else {
        _setData(Object.keys(defaults).filter(function (key) {
          return fields.includes(key);
        }).reduce(function (carry, key) {
          carry[key] = defaults[key];
          return carry;
        }, _extends({}, data)));
      }
    },
    setData: function setData(key, value) {
      if (typeof value === 'object' && 'target' in value && value.target) {
        value = value.target.value;
      }

      if (typeof key === 'string') {
        var _extends2;

        _setData(_extends({}, data, (_extends2 = {}, _extends2[key] = value, _extends2)));
      } else if (typeof key === 'function') {
        _setData(function (data) {
          return key(data);
        });
      } else {
        _setData(key);
      }

      return this;
    },
    isDirty: !isEqual(data, defaults)
  };
}

function Flex(props) {
  if (props === void 0) {
    props = {
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
      style: {},
      children: null
    };
  }

  var styles = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap'
  };

  if (props.vertical) {
    styles.flexDirection = 'column';

    if (props.reverse) {
      styles.flexDirection = 'column-reverse';
    }

    if (props.right) {
      styles.alignItems = 'flex-end';
    }

    if (props.left) {
      styles.alignItems = 'flex-start';
    }

    if (props.bottom) {
      styles.justifyContent = 'flex-end';
    }

    if (props.top) {
      styles.justifyContent = 'flex-start';
    }

    if (props.yCenter) {
      styles.justifyContent = 'center';
    }

    if (props.xCenter || props.center) {
      styles.alignItems = 'center';
    }
  } else {
    if (props.reverse) {
      styles.flexDirection = 'row-reverse';
    }

    if (props.right) {
      styles.justifyContent = 'flex-end';
    }

    if (props.left) {
      styles.justifyContent = 'flex-start';
    }

    if (props.bottom) {
      styles.alignItems = 'flex-end';
    }

    if (props.top) {
      styles.alignItems = 'flex-start';
    }

    if (props.xCenter) {
      styles.justifyContent = 'center';
    }

    if (props.yCenter || props.center) {
      styles.alignItems = 'center';
    }
  }

  if (props.between) {
    styles.justifyContent = 'space-between';
  }

  if (props.wrap) {
    styles.flexWrap = 'wrap';
  }

  return React__default.createElement("div", {
    style: _extends({}, styles, props.style)
  }, props.children);
}

function FlexItem(props) {
  if (props === void 0) {
    props = {
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
      style: {},
      children: null
    };
  }

  var styles = {};

  if (props.flex) {
    styles['display'] = 'flex';
  }

  if (props.right) {
    styles['alignSelf'] = 'flex-end';
  }

  if (props.left) {
    styles['alignSelf'] = 'flex-start';
  }

  if (props.stretch) {
    styles['alignSelf'] = 'stretch';
  }

  if (props.center) {
    styles['alignSelf'] = 'center';
  }

  if (props.grow) {
    styles['flexGrow'] = 1;
  }

  if (props.shrink) {
    styles['flexShrink'] = 1;
  }

  if (props.first) {
    styles['order'] = '-9999';
  }

  if (props.nth) {
    styles['order'] = props.nth;
  }

  return React__default.createElement("div", {
    style: _extends({}, styles, props.style)
  }, props.children);
}

exports.Flex = Flex;
exports.FlexItem = FlexItem;
exports.Router = Router;
exports.useData = useData;
exports.useForm = useForm;
//# sourceMappingURL=index.js.map

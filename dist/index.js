function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var valtio = require('valtio');
var utils = require('valtio/utils');
var React = require('react');
var React__default = _interopDefault(React);
var forEach = _interopDefault(require('lodash/forEach'));
var isEqual = _interopDefault(require('lodash/isEqual'));
var axios = _interopDefault(require('axios'));
var qs = require('qs');
var deepmerge = _interopDefault(require('deepmerge'));

function useProxy(args, computed) {
  if (args === void 0) {
    args = {};
  }

  var state = React.useMemo(function () {
    var comp = {};
    var tmpState = valtio.proxy(args);

    if (computed) {
      forEach(computed, function (callback, name) {
        comp[name] = function (get) {
          return callback(get(tmpState));
        };
      });
      utils.derive(comp, {
        proxy: tmpState
      });
    }

    return tmpState;
  }, []);
  var snap = valtio.useSnapshot(state);
  return {
    state: state,
    snap: snap
  };
}

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

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function hrefToUrl(href) {
  if (href instanceof URL) {
    return href;
  }

  return new URL(href.toString(), window.location.toString());
}
function mergeDataIntoQueryString(method, href, data, qsArrayFormat) {
  if (qsArrayFormat === void 0) {
    qsArrayFormat = 'brackets';
  }

  var hasHost = /^https?:\/\//.test(href.toString());
  var hasAbsolutePath = hasHost || href.toString().startsWith('/');
  var hasRelativePath = !hasAbsolutePath && !href.toString().startsWith('#') && !href.toString().startsWith('?');
  var hasSearch = href.toString().includes('?') || ['get', 'GET'].includes(method) && Object.keys(data).length;
  var hasHash = href.toString().includes('#');
  var url = new URL(href.toString(), 'http://localhost');

  if (['get', 'GET'].includes(method) && Object.keys(data).length) {
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

function hasFiles(data) {
  return data instanceof File || data instanceof Blob || data instanceof FileList && data.length > 0 || data instanceof FormData && Array.from(data.values()).some(function (value) {
    return hasFiles(value);
  }) || typeof data === 'object' && data !== null && Object.values(data).some(function (value) {
    return hasFiles(value);
  });
}

function isFormData(payload) {
  return typeof payload === 'object' && payload instanceof FormData;
}
function useForm(args, requestOptions, formOptions) {
  if (args === void 0) {
    args = {};
  }

  if (requestOptions === void 0) {
    requestOptions = {};
  }

  if (formOptions === void 0) {
    formOptions = {};
  }

  var isMounted = React.useRef(null);

  var _useState = React.useState(args),
      defaults = _useState[0],
      _setDefaults = _useState[1];

  var _useState2 = React.useState(args),
      data = _useState2[0],
      setData = _useState2[1];

  var _useState3 = React.useState({}),
      errors = _useState3[0],
      setErrors = _useState3[1];

  var _useState4 = React.useState({}),
      response = _useState4[0],
      setResponse = _useState4[1];

  var _useState5 = React.useState(false),
      hasErrors = _useState5[0],
      setHasErrors = _useState5[1];

  var _useState6 = React.useState(false),
      processing = _useState6[0],
      setProcessing = _useState6[1];

  var _useState7 = React.useState(null),
      progress = _useState7[0],
      setProgress = _useState7[1];

  var _useState8 = React.useState(false),
      wasSuccessful = _useState8[0],
      setWasSuccessful = _useState8[1];

  var _useState9 = React.useState(false),
      recentlySuccessful = _useState9[0],
      setRecentlySuccessful = _useState9[1];

  var _useState10 = React.useState(formOptions),
      defaultOptions = _useState10[0],
      setDefaultOptions = _useState10[1];

  var _useState11 = React.useState(requestOptions),
      defaultRequestOptions = _useState11[0],
      setDefaultRequestOptions = _useState11[1];

  var _transform = function transform(data) {
    return data;
  };

  React.useEffect(function () {
    isMounted.current = true;
    return function () {
      isMounted.current = false;
    };
  }, []);
  var submit = React.useCallback(function (requestOptions, options) {
    var _window$axios$default, _window, _window$axios, _window$axios$default2, _window$axios$default3;

    if (requestOptions === void 0) {
      requestOptions = {};
    }

    if (options === void 0) {
      options = {};
    }

    var url = hrefToUrl(requestOptions.url || '');
    var method = requestOptions.method || 'get';

    var transformedData = _transform(data);

    var mergedOptions = _extends({
      forceFormData: false,
      queryStringArrayFormat: 'brackets',
      onStart: function onStart(config) {
        return config;
      },
      onProgress: function onProgress(progress) {
        return progress;
      },
      onSuccess: function onSuccess(response) {
        return response;
      },
      onCatch: function onCatch(errors) {
        return errors;
      },
      onError: function onError(errors) {
        return errors;
      },
      onFinish: function onFinish() {
        return {};
      }
    }, defaultOptions, options);

    if ((hasFiles(transformedData) || mergedOptions.forceFormData) && !isFormData(transformedData)) {
      transformedData = objectToFormData(transformedData);
    }

    if (!(transformedData instanceof FormData)) {
      var _mergeDataIntoQuerySt = mergeDataIntoQueryString(method, url, transformedData, mergedOptions.queryStringArrayFormat),
          _href = _mergeDataIntoQuerySt[0],
          _data = _mergeDataIntoQuerySt[1];

      url = hrefToUrl(_href);
      transformedData = _data;
    }

    var mergedConfig = _extends({
      method: method,
      url: urlWithoutHash(url).href,
      data: ['get', 'GET'].includes(method) ? {} : transformedData,
      params: ['get', 'GET'].includes(method) ? transformedData : {},
      headers: _extends({
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }, (_window$axios$default = (_window = window) === null || _window === void 0 ? void 0 : (_window$axios = _window.axios) === null || _window$axios === void 0 ? void 0 : (_window$axios$default2 = _window$axios.defaults) === null || _window$axios$default2 === void 0 ? void 0 : (_window$axios$default3 = _window$axios$default2.headers) === null || _window$axios$default3 === void 0 ? void 0 : _window$axios$default3.common) != null ? _window$axios$default : {}),
      onUploadProgress: function onUploadProgress(progress) {
        if (data instanceof FormData) {
          progress.percentage = Math.round(progress.loaded / progress.total * 100);
          mergedOptions.onProgress(progress);
        }
      }
    }, defaultRequestOptions, requestOptions);

    setProcessing(true);
    setWasSuccessful(false);
    setRecentlySuccessful(false);
    return Promise.resolve(mergedOptions.onStart(mergedConfig)).then(function (newConfig) {
      return axios(newConfig != null ? newConfig : mergedConfig).then(function (response) {
        if (isMounted.current) {
          var _errors = response.data.errors || {};

          setProcessing(false);
          setProgress(null);
          setResponse(response.data || {});
          setErrors(_errors);

          if (Object.keys(_errors).length > 0) {
            setHasErrors(true);
            mergedOptions.onError(_errors);
            return response;
          }

          setHasErrors(false);
          setWasSuccessful(true);
          setRecentlySuccessful(true);
        }

        mergedOptions.onSuccess(response);
        return response;
      })["catch"](function (error) {
        setHasErrors(true);
        setProcessing(false);
        setProgress(null);

        if (error.response) {
          var _error$response$data$;

          setErrors((_error$response$data$ = error.response.data.errors) != null ? _error$response$data$ : {});
          mergedOptions.onCatch(error.response);
          return error.response;
        }

        return Promise.reject(error);
      })["finally"](function () {
        mergedOptions.onFinish();
      });
    });
  }, [data, defaultOptions, defaultRequestOptions]);

  var setDataFunction = function setDataFunction(key, value) {
    if (typeof key === 'string') {
      var _extends2;

      if (value && value.target && value.target.value) {
        value = value.target.value;
      }

      setData(_extends({}, data, (_extends2 = {}, _extends2[key] = value, _extends2)));
    } else if (typeof key === 'function') {
      setData(function (data) {
        return key(data);
      });
    } else {
      setData(key);
    }
  };

  return {
    submit: submit,
    data: data,
    errors: errors,
    response: response,
    hasErrors: hasErrors,
    processing: processing,
    progress: progress,
    wasSuccessful: wasSuccessful,
    recentlySuccessful: recentlySuccessful,
    isDirty: !isEqual(data, defaults),
    setOptions: function setOptions(options) {
      if (options === void 0) {
        options = {};
      }

      setDefaultOptions(options);
    },
    setRequestOptions: function setRequestOptions(options) {
      if (options === void 0) {
        options = {};
      }

      setDefaultRequestOptions(options);
    },
    setData: setDataFunction,
    getData: function getData(key, defaultValue) {
      var _data$key;

      if (defaultValue === void 0) {
        defaultValue = null;
      }

      return (_data$key = data[key]) != null ? _data$key : defaultValue;
    },
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
          var _ref;

          return _extends({}, defaults, value ? (_ref = {}, _ref[key] = value, _ref) : key);
        });
      }
    },
    reset: function reset() {
      for (var _len = arguments.length, fields = new Array(_len), _key = 0; _key < _len; _key++) {
        fields[_key] = arguments[_key];
      }

      if (fields.length === 0) {
        setData(defaults);
      } else {
        setData(Object.keys(defaults).filter(function (key) {
          return fields.includes(key);
        }).reduce(function (carry, key) {
          carry[key] = defaults[key];
          return carry;
        }, _extends({}, data)));
      }
    },
    setError: function setError(key, value) {
      setErrors(function (errors) {
        var _ref2;

        var newErrors = _extends({}, errors, value ? (_ref2 = {}, _ref2[key] = value, _ref2) : key);

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
          var _ref3;

          return _extends({}, carry, fields.length > 0 && !fields.includes(field) ? (_ref3 = {}, _ref3[field] = errors[field], _ref3) : {});
        }, {});
        setHasErrors(Object.keys(newErrors).length > 0);
        return newErrors;
      });
    },
    bindField: function bindField(name, defaultValue) {
      var _data$name;

      if (defaultValue === void 0) {
        defaultValue = null;
      }

      return {
        name: name,
        value: (_data$name = data[name]) != null ? _data$name : defaultValue,
        onChange: function onChange(value) {
          setDataFunction(name, value);
        }
      };
    },
    get: function get(requestOptions, options) {
      if (requestOptions === void 0) {
        requestOptions = {};
      }

      if (options === void 0) {
        options = {};
      }

      return submit(requestOptions, options);
    },
    post: function post(requestOptions, options) {
      if (requestOptions === void 0) {
        requestOptions = {};
      }

      if (options === void 0) {
        options = {};
      }

      requestOptions.method = 'POST';
      return submit(requestOptions, options);
    },
    put: function put(requestOptions, options) {
      if (requestOptions === void 0) {
        requestOptions = {};
      }

      if (options === void 0) {
        options = {};
      }

      requestOptions.method = 'PUT';
      return submit(requestOptions, options);
    },
    patch: function patch(requestOptions, options) {
      if (requestOptions === void 0) {
        requestOptions = {};
      }

      if (options === void 0) {
        options = {};
      }

      requestOptions.method = 'PATCH';
      return submit(requestOptions, options);
    },
    "delete": function _delete(requestOptions, options) {
      if (requestOptions === void 0) {
        requestOptions = {};
      }

      if (options === void 0) {
        options = {};
      }

      requestOptions.method = 'DELETE';
      return submit(requestOptions, options);
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
    isDirty: !isEqual(data, defaults),
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
    }
  };
}

function visit(requestOptions, data, options) {
  if (requestOptions === void 0) {
    requestOptions = {};
  }

  if (data === void 0) {
    data = {};
  }

  if (options === void 0) {
    options = {};
  }

  var form = useForm(data);
  React.useEffect(function () {
    form.submit(requestOptions, options);
  }, []);
  return form;
}

var _excluded = ["vertical", "reverse", "right", "left", "bottom", "top", "yCenter", "xCenter", "center", "wrap", "between", "grow", "style", "children"];

function Flex(_ref) {
  var _ref$vertical = _ref.vertical,
      vertical = _ref$vertical === void 0 ? false : _ref$vertical,
      _ref$reverse = _ref.reverse,
      reverse = _ref$reverse === void 0 ? false : _ref$reverse,
      _ref$right = _ref.right,
      right = _ref$right === void 0 ? false : _ref$right,
      _ref$left = _ref.left,
      left = _ref$left === void 0 ? false : _ref$left,
      _ref$bottom = _ref.bottom,
      bottom = _ref$bottom === void 0 ? false : _ref$bottom,
      _ref$top = _ref.top,
      top = _ref$top === void 0 ? false : _ref$top,
      _ref$yCenter = _ref.yCenter,
      yCenter = _ref$yCenter === void 0 ? false : _ref$yCenter,
      _ref$xCenter = _ref.xCenter,
      xCenter = _ref$xCenter === void 0 ? false : _ref$xCenter,
      _ref$center = _ref.center,
      center = _ref$center === void 0 ? false : _ref$center,
      _ref$wrap = _ref.wrap,
      wrap = _ref$wrap === void 0 ? false : _ref$wrap,
      _ref$between = _ref.between,
      between = _ref$between === void 0 ? false : _ref$between,
      _ref$grow = _ref.grow,
      grow = _ref$grow === void 0 ? false : _ref$grow,
      _ref$style = _ref.style,
      style = _ref$style === void 0 ? {} : _ref$style,
      _ref$children = _ref.children,
      children = _ref$children === void 0 ? null : _ref$children,
      rest = _objectWithoutPropertiesLoose(_ref, _excluded);

  var styles = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap'
  };

  if (vertical) {
    styles.flexDirection = 'column';

    if (reverse) {
      styles.flexDirection = 'column-reverse';
    }

    if (right) {
      styles.alignItems = 'flex-end';
    }

    if (left) {
      styles.alignItems = 'flex-start';
    }

    if (bottom) {
      styles.justifyContent = 'flex-end';
    }

    if (top) {
      styles.justifyContent = 'flex-start';
    }

    if (yCenter) {
      styles.justifyContent = 'center';
    }

    if (xCenter || center) {
      styles.alignItems = 'center';
    }
  } else {
    if (reverse) {
      styles.flexDirection = 'row-reverse';
    }

    if (right) {
      styles.justifyContent = 'flex-end';
    }

    if (left) {
      styles.justifyContent = 'flex-start';
    }

    if (bottom) {
      styles.alignItems = 'flex-end';
    }

    if (top) {
      styles.alignItems = 'flex-start';
    }

    if (xCenter) {
      styles.justifyContent = 'center';
    }

    if (yCenter || center) {
      styles.alignItems = 'center';
    }
  }

  if (grow) {
    styles['flexGrow'] = 1;
  }

  if (between) {
    styles.justifyContent = 'space-between';
  }

  if (wrap) {
    styles.flexWrap = 'wrap';
  }

  return React__default.createElement("div", Object.assign({}, rest, {
    style: _extends({}, styles, style)
  }), children);
}

var _excluded$1 = ["flex", "right", "left", "shrink", "center", "stretch", "first", "last", "grow", "nth", "style", "children"];

function FlexItem(_ref) {
  var _ref$flex = _ref.flex,
      flex = _ref$flex === void 0 ? false : _ref$flex,
      _ref$right = _ref.right,
      right = _ref$right === void 0 ? false : _ref$right,
      _ref$left = _ref.left,
      left = _ref$left === void 0 ? false : _ref$left,
      _ref$shrink = _ref.shrink,
      shrink = _ref$shrink === void 0 ? false : _ref$shrink,
      _ref$center = _ref.center,
      center = _ref$center === void 0 ? false : _ref$center,
      _ref$stretch = _ref.stretch,
      stretch = _ref$stretch === void 0 ? false : _ref$stretch,
      _ref$first = _ref.first,
      first = _ref$first === void 0 ? false : _ref$first,
      _ref$last = _ref.last,
      last = _ref$last === void 0 ? false : _ref$last,
      _ref$grow = _ref.grow,
      grow = _ref$grow === void 0 ? false : _ref$grow,
      _ref$nth = _ref.nth,
      nth = _ref$nth === void 0 ? null : _ref$nth,
      _ref$style = _ref.style,
      style = _ref$style === void 0 ? {} : _ref$style,
      _ref$children = _ref.children,
      children = _ref$children === void 0 ? null : _ref$children,
      rest = _objectWithoutPropertiesLoose(_ref, _excluded$1);

  var styles = {};

  if (flex) {
    styles['display'] = 'flex';
  }

  if (right) {
    styles['alignSelf'] = 'flex-end';
  }

  if (left) {
    styles['alignSelf'] = 'flex-start';
  }

  if (stretch) {
    styles['alignSelf'] = 'stretch';
  }

  if (center) {
    styles['alignSelf'] = 'center';
  }

  if (grow) {
    styles['flexGrow'] = 1;
  }

  if (shrink) {
    styles['flexShrink'] = 1;
  }

  if (first) {
    styles['order'] = '-9999';
  }

  if (last) {
    styles['order'] = '9999';
  }

  if (nth) {
    styles['order'] = nth;
  }

  return React__default.createElement("div", Object.assign({}, rest, {
    style: _extends({}, styles, style)
  }), children);
}

exports.Flex = Flex;
exports.FlexItem = FlexItem;
exports.useData = useData;
exports.useForm = useForm;
exports.useProxy = useProxy;
exports.visit = visit;
//# sourceMappingURL=index.js.map

import { proxy, useSnapshot } from 'valtio';
import { derive } from 'valtio/utils';
import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import forEach from 'lodash/forEach';
import isEqual from 'lodash/isEqual';
import Axios from 'axios';
import { stringify, parse } from 'qs';
import deepmerge from 'deepmerge';

function useProxy(args, computed) {
  if (args === void 0) {
    args = {};
  }

  var state = useMemo(function () {
    var comp = {};
    var tmpState = proxy(args);

    if (computed) {
      forEach(computed, function (callback, name) {
        comp[name] = function (get) {
          return callback(get(tmpState));
        };
      });
      derive(comp, {
        proxy: tmpState
      });
    }

    return tmpState;
  }, []);
  var snap = useSnapshot(state);
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
    url.search = stringify(deepmerge(parse(url.search, {
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

function useForm(args, options, requestOptions) {
  if (args === void 0) {
    args = {};
  }

  if (options === void 0) {
    options = {};
  }

  if (requestOptions === void 0) {
    requestOptions = {};
  }

  var isMounted = useRef(null);

  var _useState = useState(args),
      defaults = _useState[0],
      _setDefaults = _useState[1];

  var _useState2 = useState(args),
      data = _useState2[0],
      _setData = _useState2[1];

  var _useState3 = useState({}),
      errors = _useState3[0],
      setErrors = _useState3[1];

  var _useState4 = useState({}),
      response = _useState4[0],
      setResponse = _useState4[1];

  var _useState5 = useState(false),
      hasErrors = _useState5[0],
      setHasErrors = _useState5[1];

  var _useState6 = useState(false),
      processing = _useState6[0],
      setProcessing = _useState6[1];

  var _useState7 = useState(null),
      progress = _useState7[0],
      setProgress = _useState7[1];

  var _useState8 = useState(false),
      wasSuccessful = _useState8[0],
      setWasSuccessful = _useState8[1];

  var _useState9 = useState(false),
      recentlySuccessful = _useState9[0],
      setRecentlySuccessful = _useState9[1];

  var _useState10 = useState(options),
      defaultOptions = _useState10[0],
      setDefaultOptions = _useState10[1];

  var _useState11 = useState(requestOptions),
      defaultRequestOptions = _useState11[0],
      setDefaultRequestOptions = _useState11[1];

  var _transform = function transform(data) {
    return data;
  };

  useEffect(function () {
    isMounted.current = true;
    return function () {
      isMounted.current = false;
    };
  }, []);
  var submit = useCallback(function (method, href, options, requestOptions) {
    if (options === void 0) {
      options = {};
    }

    if (requestOptions === void 0) {
      requestOptions = {};
    }

    var url = typeof href === 'string' ? hrefToUrl(href) : href;

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

    if ((hasFiles(transformedData) || mergedOptions.forceFormData) && !(transformedData instanceof FormData)) {
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
      data: method === Method.GET ? {} : transformedData,
      params: method === Method.GET ? transformedData : {},
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
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
      return Axios(newConfig != null ? newConfig : mergedConfig).then(function (response) {
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
    setData: function setData(key, value) {
      if (typeof key === 'string') {
        var _extends2;

        if (value && value.target && value.target.value) {
          value = value.target.value;
        }

        _setData(_extends({}, data, (_extends2 = {}, _extends2[key] = value, _extends2)));
      } else if (typeof key === 'function') {
        _setData(function (data) {
          return key(data);
        });
      } else {
        _setData(key);
      }
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
    get: function get(url, options, requestOptions) {
      if (options === void 0) {
        options = {};
      }

      if (requestOptions === void 0) {
        requestOptions = {};
      }

      return submit(Method.GET, url, options, requestOptions);
    },
    post: function post(url, options, requestOptions) {
      if (options === void 0) {
        options = {};
      }

      if (requestOptions === void 0) {
        requestOptions = {};
      }

      return submit(Method.POST, url, options, requestOptions);
    },
    put: function put(url, options, requestOptions) {
      if (options === void 0) {
        options = {};
      }

      if (requestOptions === void 0) {
        requestOptions = {};
      }

      return submit(Method.PUT, url, options, requestOptions);
    },
    patch: function patch(url, options, requestOptions) {
      if (options === void 0) {
        options = {};
      }

      if (requestOptions === void 0) {
        requestOptions = {};
      }

      return submit(Method.PATCH, url, options, requestOptions);
    },
    "delete": function _delete(url, options, requestOptions) {
      if (options === void 0) {
        options = {};
      }

      if (requestOptions === void 0) {
        requestOptions = {};
      }

      return submit(Method.DELETE, url, options, requestOptions);
    }
  };
}

function useData() {
  var defaults = (typeof (arguments.length <= 0 ? undefined : arguments[0]) === 'string' ? arguments.length <= 1 ? undefined : arguments[1] : arguments.length <= 0 ? undefined : arguments[0]) || {};

  var _useState = useState(defaults),
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

function visit(method, href, data, options, requestOptions) {
  if (data === void 0) {
    data = {};
  }

  if (options === void 0) {
    options = {};
  }

  if (requestOptions === void 0) {
    requestOptions = {};
  }

  var form = useForm(data);
  form.submit(method, href, options, requestOptions);
  return form;
}

var defaultProps = {
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
  grow: false,
  style: {},
  children: null
};

function Flex(props) {
  if (props === void 0) {
    props = defaultProps;
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

  if (props.grow) {
    styles['flexGrow'] = 1;
  }

  if (props.between) {
    styles.justifyContent = 'space-between';
  }

  if (props.wrap) {
    styles.flexWrap = 'wrap';
  }

  return React.createElement("div", {
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

  return React.createElement("div", {
    style: _extends({}, styles, props.style)
  }, props.children);
}

export { Flex, FlexItem, useData, useForm, useProxy, visit };
//# sourceMappingURL=index.modern.js.map

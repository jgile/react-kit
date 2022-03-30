import React, { useRef, useState, useEffect, useCallback } from 'react';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import { stringify, parse } from 'qs';
import deepmerge from 'deepmerge';
import axios from 'axios';

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
  Method['GET'] = 'get';
  Method['POST'] = 'post';
  Method['PUT'] = 'put';
  Method['PATCH'] = 'patch';
  Method['DELETE'] = 'delete';
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

function hasFiles(data) {
  return data instanceof File || data instanceof Blob || data instanceof FileList && data.length > 0 || data instanceof FormData && Array.from(data.values()).some(function (value) {
    return hasFiles(value);
  }) || typeof data === 'object' && data !== null && Object.values(data).some(function (value) {
    return hasFiles(value);
  });
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

var Visitor = {
  activeVisit: {
    processing: false
  },
  onBefore: function onBefore(config) {
    return config;
  },
  finishVisit: function finishVisit(visit) {
    visit.completed = true;
    visit.cancelled = false;
    visit.interrupted = false;
    visit.onFinish(visit);
  },
  get: function get(url, data, options) {
    if (data === void 0) {
      data = {};
    }

    if (options === void 0) {
      options = {};
    }

    return this.visit(url, Object.assign(Object.assign({}, options), {
      method: Method.GET,
      data: data
    }));
  },
  post: function post(url, data, options) {
    if (data === void 0) {
      data = {};
    }

    if (options === void 0) {
      options = {};
    }

    return this.visit(url, Object.assign(Object.assign({
      preserveState: true
    }, options), {
      method: Method.POST,
      data: data
    }));
  },
  put: function put(url, data, options) {
    if (data === void 0) {
      data = {};
    }

    if (options === void 0) {
      options = {};
    }

    return this.visit(url, Object.assign(Object.assign({
      preserveState: true
    }, options), {
      method: Method.PUT,
      data: data
    }));
  },
  patch: function patch(url, data, options) {
    if (data === void 0) {
      data = {};
    }

    if (options === void 0) {
      options = {};
    }

    return this.visit(url, Object.assign(Object.assign({
      preserveState: true
    }, options), {
      method: Method.PATCH,
      data: data
    }));
  },
  "delete": function _delete(url, options) {
    if (options === void 0) {
      options = {};
    }

    return this.visit(url, Object.assign(Object.assign({
      preserveState: true
    }, options), {
      method: Method.DELETE
    }));
  },
  visit: function visit(href, _ref) {
    var _this = this;

    var _ref$method = _ref.method,
        method = _ref$method === void 0 ? Method.GET : _ref$method,
        _ref$data = _ref.data,
        data = _ref$data === void 0 ? {} : _ref$data,
        _ref$headers = _ref.headers,
        headers = _ref$headers === void 0 ? {} : _ref$headers,
        _ref$errorBag = _ref.errorBag,
        errorBag = _ref$errorBag === void 0 ? '' : _ref$errorBag,
        _ref$forceFormData = _ref.forceFormData,
        forceFormData = _ref$forceFormData === void 0 ? false : _ref$forceFormData,
        _ref$queryStringArray = _ref.queryStringArrayFormat,
        queryStringArrayFormat = _ref$queryStringArray === void 0 ? 'brackets' : _ref$queryStringArray,
        _ref$onProgress = _ref.onProgress,
        onProgress = _ref$onProgress === void 0 ? function (progress) {
      return progress;
    } : _ref$onProgress,
        _ref$onFinish = _ref.onFinish,
        onFinish = _ref$onFinish === void 0 ? function () {
      return {};
    } : _ref$onFinish,
        _ref$onError = _ref.onError,
        onError = _ref$onError === void 0 ? function (errors) {
      return errors;
    } : _ref$onError,
        _ref$onBefore = _ref.onBefore,
        onBefore = _ref$onBefore === void 0 ? function (visit) {
      return visit;
    } : _ref$onBefore,
        _ref$onSuccess = _ref.onSuccess,
        onSuccess = _ref$onSuccess === void 0 ? function (response) {
      return response;
    } : _ref$onSuccess;
    var url = typeof href === 'string' ? hrefToUrl(href) : href;

    if (this.activeVisit && this.activeVisit.processing) {
      return;
    }

    if ((hasFiles(data) || forceFormData) && !(data instanceof FormData)) {
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
      headers: headers,
      errorBag: errorBag,
      forceFormData: forceFormData,
      queryStringArrayFormat: queryStringArrayFormat,
      onFinish: onFinish,
      completed: false,
      interrupted: false,
      cancelled: false
    };
    onBefore(visit);
    return Promise.resolve(this.onBefore(visit)).then(function (visit) {
      _this.activeVisit = visit;
      return new Promise(function (resolve, reject) {
        return axios({
          method: visit.method,
          url: urlWithoutHash(visit.url).href,
          data: visit.method === Method.GET ? {} : visit.data,
          params: visit.method === Method.GET ? visit.data : {},
          headers: Object.assign(Object.assign({}, visit.headers), {
            'X-Requested-With': 'XMLHttpRequest'
          }),
          onUploadProgress: function onUploadProgress(progress) {
            if (visit.data instanceof FormData) {
              progress.percentage = Math.round(progress.loaded / progress.total * 100);
              onProgress(progress);
            }
          }
        }).then(function (response) {
          var errors = get(response, 'data.errors', {}) || {};

          if (_this.activeVisit) {
            _this.finishVisit(_this.activeVisit);
          }

          if (Object.keys(errors).length > 0) {
            var scopedErrors = errorBag ? errors[errorBag] ? errors[errorBag] : {} : errors;
            return onError(scopedErrors);
          }

          onSuccess(response.data);
          return resolve(response.data);
        })["catch"](function (error) {
          var errors = get(error, 'response.data.errors', {});

          if (_this.activeVisit) {
            _this.finishVisit(_this.activeVisit);
          }

          if (Object.keys(errors).length > 0) {
            var scopedErrors = errorBag ? errors[errorBag] ? errors[errorBag] : {} : errors;
            return onError(scopedErrors);
          }

          return reject(error);
        });
      });
    });
  }
};
function createNewForm(http) {
  return function () {
    var isMounted = useRef(null);
    var defaults = (typeof (arguments.length <= 0 ? undefined : arguments[0]) === 'string' ? arguments.length <= 1 ? undefined : arguments[1] : arguments.length <= 0 ? undefined : arguments[0]) || {};
    var cancelToken = useRef(null);
    var recentlySuccessfulTimeoutId = useRef(null);

    var _useState = useState(defaults),
        data = _useState[0],
        _setData = _useState[1];

    var _useState2 = useState({}),
        response = _useState2[0],
        setResponse = _useState2[1];

    var _useState3 = useState({}),
        errors = _useState3[0],
        setErrors = _useState3[1];

    var _useState4 = useState(false),
        hasErrors = _useState4[0],
        setHasErrors = _useState4[1];

    var _useState5 = useState(false),
        processing = _useState5[0],
        setProcessing = _useState5[1];

    var _useState6 = useState(null),
        progress = _useState6[0],
        setProgress = _useState6[1];

    var _useState7 = useState(false),
        wasSuccessful = _useState7[0],
        setWasSuccessful = _useState7[1];

    var _useState8 = useState(false),
        recentlySuccessful = _useState8[0],
        setRecentlySuccessful = _useState8[1];

    useEffect(function () {
      isMounted.current = true;
      return function () {
        isMounted.current = false;
      };
    }, []);
    var submit = useCallback(function (method, url, options) {
      if (options === void 0) {
        options = {};
      }

      var _options = _extends({}, options, {
        onBefore: function onBefore(visit) {
          setWasSuccessful(false);
          setRecentlySuccessful(false);
          clearTimeout(recentlySuccessfulTimeoutId.current);

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
        onSuccess: function onSuccess(response) {
          setResponse(response);

          if (isMounted.current) {
            setProcessing(false);
            setProgress(null);
            setErrors({});
            setHasErrors(false);
            setWasSuccessful(true);
            setRecentlySuccessful(true);
            recentlySuccessfulTimeoutId.current = setTimeout(function () {
              if (isMounted.current) {
                setRecentlySuccessful(false);
              }
            }, 2000);
          }

          if (options.onSuccess) {
            return options.onSuccess(response);
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

          if (options.onFinish) {
            return options.onFinish();
          }
        }
      });

      if (method === 'delete') {
        return http["delete"](url, _extends({}, _options, {
          data: data
        }));
      }

      return http[method](url, data, _options);
    }, [data, setErrors]);
    return {
      data: data,
      response: response,
      isDirty: !isEqual(data, defaults),
      errors: errors,
      hasErrors: hasErrors,
      processing: processing,
      progress: progress,
      wasSuccessful: wasSuccessful,
      recentlySuccessful: recentlySuccessful,
      submit: submit,
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
      clearErrors: function clearErrors() {
        for (var _len2 = arguments.length, fields = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          fields[_key2] = arguments[_key2];
        }

        setErrors(Object.keys(errors).reduce(function (carry, field) {
          var _ref2;

          return _extends({}, carry, fields.length > 0 && !fields.includes(field) ? (_ref2 = {}, _ref2[field] = errors[field], _ref2) : {});
        }, {}));
        setHasErrors(Object.keys(errors).length > 0);
      },
      get: function get(url, options) {
        if (options === void 0) {
          options = {};
        }

        return submit('get', url, options);
      },
      post: function post(url, options) {
        if (options === void 0) {
          options = {};
        }

        return submit('post', url, options);
      },
      put: function put(url, options) {
        if (options === void 0) {
          options = {};
        }

        return submit('put', url, options);
      },
      patch: function patch(url, options) {
        if (options === void 0) {
          options = {};
        }

        return submit('patch', url, options);
      },
      "delete": function _delete(url, options) {
        if (options === void 0) {
          options = {};
        }

        return submit('delete', url, options);
      },
      cancel: function cancel() {
        if (cancelToken.current) {
          cancelToken.current.cancel();
        }
      }
    };
  };
}
var useForm = createNewForm(Visitor);

function useData() {
  var defaults = (typeof (arguments.length <= 0 ? undefined : arguments[0]) === 'string' ? arguments.length <= 1 ? undefined : arguments[1] : arguments.length <= 0 ? undefined : arguments[0]) || {};

  var _useState = useState(defaults),
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

export { Flex, FlexItem, Visitor, createNewForm, useData, useForm };
//# sourceMappingURL=index.modern.js.map

"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NetworkError = NetworkError;
exports.default = exports.getFormData = exports.getHeaders = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function NetworkError(response, status) {
  this.name = 'NetworkError';
  this.status = status;
  this.response = response;
} // $FlowFixMe


NetworkError.prototype = Error.prototype;

var tryParseJSON = function tryParseJSON(json) {
  if (!json) {
    return null;
  }

  try {
    return JSON.parse(json);
  } catch (e) {
    throw new Error("Failed to parse unexpected JSON response: ".concat(json));
  }
};

var getResponseBody = function getResponseBody(res) {
  var contentType = res.headers.get('content-type') || false;

  if (contentType && contentType.indexOf('json') >= 0) {
    return res.text().then(tryParseJSON);
  }

  return res.text();
};

var getHeaders = function getHeaders(headers) {
  var _ref = headers || {},
      contentTypeCapitalized = _ref['Content-Type'],
      contentTypeLowerCase = _ref['content-type'],
      restOfHeaders = (0, _objectWithoutProperties2.default)(_ref, ["Content-Type", "content-type"]);

  var contentType = contentTypeCapitalized || contentTypeLowerCase || 'application/json';
  return _objectSpread(_objectSpread({}, restOfHeaders), {}, {
    'content-type': contentType
  });
};

exports.getHeaders = getHeaders;

var getFormData = function getFormData(object) {
  var formData = new FormData();
  Object.keys(object).forEach(function (key) {
    Object.keys(object[key]).forEach(function (innerObj) {
      var newObj = object[key][innerObj];
      formData.append(newObj[0], newObj[1]);
    });
  });
  return formData;
}; // eslint-disable-next-line no-unused-vars


exports.getFormData = getFormData;

var _default = function _default(effect, _action) {
  var url = effect.url,
      json = effect.json,
      options = (0, _objectWithoutProperties2.default)(effect, ["url", "json"]);
  var headers = getHeaders(options.headers);

  if (!(options.body instanceof FormData) && Object.prototype.hasOwnProperty.call(headers, 'content-type') && headers['content-type'].toLowerCase().includes('multipart/form-data')) {
    options.body = getFormData(options.body);
  }

  if (json !== null && json !== undefined) {
    try {
      options.body = JSON.stringify(json);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  return fetch(url, _objectSpread(_objectSpread({}, options), {}, {
    headers: headers
  })).then(function (res) {
    if (res.ok) {
      return getResponseBody(res);
    }

    return getResponseBody(res).then(function (body) {
      throw new NetworkError(body || '', res.status);
    });
  });
};

exports.default = _default;
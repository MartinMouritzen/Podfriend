"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _effect = require("./effect");

var _default = function _default(error, action) {
  var _retries = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  // not a network error -> discard
  if (!('status' in error)) {
    return true;
  } // discard http 4xx errors
  // $FlowFixMe


  return error.status >= 400 && error.status < 500;
};

exports.default = _default;
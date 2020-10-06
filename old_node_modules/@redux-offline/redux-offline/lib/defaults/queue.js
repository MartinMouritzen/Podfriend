"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toArray"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

/* eslint-disable no-unused-vars */
function enqueue(array, item, context) {
  return [].concat((0, _toConsumableArray2.default)(array), [item]);
}

function dequeue(array, item, context) {
  var _array = (0, _toArray2.default)(array),
      rest = _array.slice(1);

  return rest;
}

function peek(array, item, context) {
  return array[0];
}

var _default = {
  enqueue: enqueue,
  dequeue: dequeue,
  peek: peek
};
exports.default = _default;
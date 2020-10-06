"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _persist = _interopRequireDefault(require("./persist"));

var _detectNetwork = _interopRequireDefault(require("./detectNetwork"));

var _effect = _interopRequireDefault(require("./effect"));

var _retry = _interopRequireDefault(require("./retry"));

var _discard = _interopRequireDefault(require("./discard"));

var _defaultCommit = _interopRequireDefault(require("./defaultCommit"));

var _defaultRollback = _interopRequireDefault(require("./defaultRollback"));

var _persistAutoRehydrate = _interopRequireDefault(require("./persistAutoRehydrate"));

var _offlineStateLens = _interopRequireDefault(require("./offlineStateLens"));

var _queue = _interopRequireDefault(require("./queue"));

var _default = {
  rehydrate: true,
  // backward compatibility, TODO remove in the next breaking change version
  persist: _persist.default,
  detectNetwork: _detectNetwork.default,
  effect: _effect.default,
  retry: _retry.default,
  discard: _discard.default,
  defaultCommit: _defaultCommit.default,
  defaultRollback: _defaultRollback.default,
  persistAutoRehydrate: _persistAutoRehydrate.default,
  offlineStateLens: _offlineStateLens.default,
  queue: _queue.default,
  returnPromises: false
};
exports.default = _default;
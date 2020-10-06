"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.busy = exports.completeRetry = exports.scheduleRetry = exports.networkStatusChanged = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _constants = require("./constants");

var networkStatusChanged = function networkStatusChanged(params) {
  var payload;

  if ((0, _typeof2.default)(params) === 'object') {
    payload = params;
  } else {
    payload = {
      online: params
    };
  }

  return {
    type: _constants.OFFLINE_STATUS_CHANGED,
    payload: payload
  };
};

exports.networkStatusChanged = networkStatusChanged;

var scheduleRetry = function scheduleRetry() {
  var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  return {
    type: _constants.OFFLINE_SCHEDULE_RETRY,
    payload: {
      delay: delay
    }
  };
};

exports.scheduleRetry = scheduleRetry;

var completeRetry = function completeRetry(action) {
  return {
    type: _constants.OFFLINE_COMPLETE_RETRY,
    payload: action
  };
};

exports.completeRetry = completeRetry;

var busy = function busy(isBusy) {
  return {
    type: _constants.OFFLINE_BUSY,
    payload: {
      busy: isBusy
    }
  };
};

exports.busy = busy;
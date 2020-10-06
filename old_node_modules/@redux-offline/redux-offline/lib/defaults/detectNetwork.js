"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var handle = function handle(callback, online) {
  // NetInfo is not supported in browsers, hence we only pass online status
  if (window.requestAnimationFrame) {
    window.requestAnimationFrame(function () {
      return callback({
        online: online
      });
    });
  } else {
    setTimeout(function () {
      return callback({
        online: online
      });
    }, 0);
  }
};

var _default = function _default(callback) {
  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('online', function () {
      return handle(callback, true);
    });
    window.addEventListener('offline', function () {
      return handle(callback, false);
    });
    handle(callback, window.navigator.onLine);
  }
};

exports.default = _default;
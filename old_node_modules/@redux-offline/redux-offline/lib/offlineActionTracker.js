"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var subscriptions = {};

function registerAction(transaction) {
  return new Promise(function (resolve, reject) {
    subscriptions[transaction] = {
      resolve: resolve,
      reject: reject
    };
  });
}

function resolveAction(transaction, value) {
  var subscription = subscriptions[transaction];

  if (subscription) {
    subscription.resolve(value);
    delete subscriptions[transaction];
  }
}

function rejectAction(transaction, error) {
  var subscription = subscriptions[transaction];

  if (subscription) {
    subscription.reject(error);
    delete subscriptions[transaction];
  }
}

var withPromises = {
  registerAction: registerAction,
  resolveAction: resolveAction,
  rejectAction: rejectAction
};
var withoutPromises = {
  registerAction: function registerAction() {},
  resolveAction: function resolveAction() {},
  rejectAction: function rejectAction() {}
};
var _default = {
  withPromises: withPromises,
  withoutPromises: withoutPromises
};
exports.default = _default;
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createOfflineMiddleware = void 0;

var _constants = require("./constants");

var _actions = require("./actions");

var _send = _interopRequireDefault(require("./send"));

var after = function after() {
  var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  return new Promise(function (resolve) {
    return setTimeout(resolve, timeout);
  });
};

var createOfflineMiddleware = function createOfflineMiddleware(config) {
  return function (store) {
    return function (next) {
      return function (action) {
        // allow other middleware to do their things
        var result = next(action);
        var promise; // find any actions to send, if any

        var state = store.getState();
        var offline = config.offlineStateLens(state).get;
        var context = {
          offline: offline
        };
        var offlineAction = config.queue.peek(offline.outbox, action, context); // create promise to return on enqueue offline action

        if (action.meta && action.meta.offline) {
          var registerAction = config.offlineActionTracker.registerAction;
          promise = registerAction(offline.lastTransaction);
        } // if there are any actions in the queue that we are not
        // yet processing, send those actions


        if (offlineAction && !offline.busy && !offline.retryScheduled && offline.online) {
          (0, _send.default)(offlineAction, store.dispatch, config, offline.retryCount);
        }

        if (action.type === _constants.OFFLINE_SCHEDULE_RETRY) {
          after(action.payload.delay).then(function () {
            store.dispatch((0, _actions.completeRetry)(offlineAction));
          });
        }

        if (action.type === _constants.OFFLINE_SEND && offlineAction && !offline.busy) {
          (0, _send.default)(offlineAction, store.dispatch, config, offline.retryCount);
        }

        return promise || result;
      };
    };
  };
};

exports.createOfflineMiddleware = createOfflineMiddleware;
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _actions = require("./actions");

var _constants = require("./constants");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var complete = function complete(action, result, offlineAction, config) {
  var _config$offlineAction = config.offlineActionTracker,
      resolveAction = _config$offlineAction.resolveAction,
      rejectAction = _config$offlineAction.rejectAction;

  if (result.success) {
    resolveAction(offlineAction.meta.transaction, result.payload);
  } else if (result.payload) {
    rejectAction(offlineAction.meta.transaction, result.payload);
  }

  return _objectSpread(_objectSpread({}, action), {}, {
    payload: result.payload,
    meta: _objectSpread(_objectSpread({}, action.meta), {}, {
      success: result.success,
      completed: true
    })
  });
};

var handleJsError = function handleJsError(error) {
  return {
    type: _constants.JS_ERROR,
    meta: {
      error: error,
      success: false,
      completed: true
    }
  };
};

var send = function send(action, dispatch, config) {
  var retries = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var metadata = action.meta.offline;
  dispatch((0, _actions.busy)(true));
  return config.effect(metadata.effect, action).then(function (result) {
    var commitAction = metadata.commit || _objectSpread(_objectSpread({}, config.defaultCommit), {}, {
      meta: _objectSpread(_objectSpread({}, config.defaultCommit.meta), {}, {
        offlineAction: action
      })
    });

    try {
      return dispatch(complete(commitAction, {
        success: true,
        payload: result
      }, action, config));
    } catch (error) {
      return dispatch(handleJsError(error));
    }
  }).catch( /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(error) {
      var rollbackAction, mustDiscard, delay;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              rollbackAction = metadata.rollback || _objectSpread(_objectSpread({}, config.defaultRollback), {}, {
                meta: _objectSpread(_objectSpread({}, config.defaultRollback.meta), {}, {
                  offlineAction: action
                })
              }); // discard

              mustDiscard = true;
              _context.prev = 2;
              _context.next = 5;
              return config.discard(error, action, retries);

            case 5:
              mustDiscard = _context.sent;
              _context.next = 11;
              break;

            case 8:
              _context.prev = 8;
              _context.t0 = _context["catch"](2);
              console.warn(_context.t0);

            case 11:
              if (mustDiscard) {
                _context.next = 15;
                break;
              }

              delay = config.retry(action, retries);

              if (!(delay != null)) {
                _context.next = 15;
                break;
              }

              return _context.abrupt("return", dispatch((0, _actions.scheduleRetry)(delay)));

            case 15:
              return _context.abrupt("return", dispatch(complete(rollbackAction, {
                success: false,
                payload: error
              }, action, config)));

            case 16:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[2, 8]]);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }()).finally(function () {
    return dispatch((0, _actions.busy)(false));
  });
};

var _default = send;
exports.default = _default;
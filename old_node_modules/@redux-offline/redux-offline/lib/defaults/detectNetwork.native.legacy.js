"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _reactNative = require("react-native");

/* eslint no-underscore-dangle: 0 */
// eslint-disable-line
var LegacyDetectNetwork = /*#__PURE__*/function () {
  function LegacyDetectNetwork(callback) {
    var _this = this;

    (0, _classCallCheck2.default)(this, LegacyDetectNetwork);
    (0, _defineProperty2.default)(this, "_hasChanged", function (reach) {
      if (_this._reach !== reach) {
        return true;
      }

      if (_this._isConnected !== _this._getConnection(reach)) {
        return true;
      }

      return false;
    });
    (0, _defineProperty2.default)(this, "_setReach", function (reach) {
      _this._reach = reach;
      _this._isConnected = _this._getConnection(reach);
    });
    (0, _defineProperty2.default)(this, "_getConnection", function (reach) {
      return reach !== 'NONE' && reach !== 'UNKNOWN';
    });
    (0, _defineProperty2.default)(this, "_setIsConnectionExpensive", /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return _reactNative.NetInfo.isConnectionExpensive();

            case 3:
              _this._isConnectionExpensive = _context.sent;
              _context.next = 9;
              break;

            case 6:
              _context.prev = 6;
              _context.t0 = _context["catch"](0);
              // err means that isConnectionExpensive is not supported in iOS
              _this._isConnectionExpensive = null;

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 6]]);
    })));
    (0, _defineProperty2.default)(this, "_setShouldInitUpdateReach", function (shouldUpdate) {
      _this._shouldInitUpdateReach = shouldUpdate;
    });
    (0, _defineProperty2.default)(this, "_init", /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
      var reach;
      return _regenerator.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _reactNative.NetInfo.fetch();

            case 2:
              reach = _context2.sent;

              if (_this._shouldInitUpdateReach) {
                _this._update(reach);
              }

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })));
    (0, _defineProperty2.default)(this, "_update", function (reach) {
      var normalizedReach = reach.toUpperCase();

      if (_this._hasChanged(normalizedReach)) {
        _this._setReach(normalizedReach);

        _this._dispatch();
      }
    });
    (0, _defineProperty2.default)(this, "_dispatch", /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
      return _regenerator.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return _this._setIsConnectionExpensive();

            case 2:
              _this._callback({
                online: _this._isConnected,
                netInfo: {
                  isConnectionExpensive: _this._isConnectionExpensive,
                  reach: _this._reach
                }
              });

            case 3:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })));
    this._reach = null;
    this._isConnected = null;
    this._isConnectionExpensive = null;
    this._callback = callback;
    this._shouldInitUpdateReach = true;

    this._init();

    this._addListeners();
  }
  /**
   * Check props for changes
   * @param {string} reach - connection reachability.
   *     - iOS: [none, wifi, cell, unknown]
   *     - Android: [NONE, BLUETOOTH, DUMMY, ETHERNET, MOBILE, MOBILE_DUN, MOBILE_HIPRI,
   *                MOBILE_MMS, MOBILE_SUPL, VPN, WIFI, WIMAX, UNKNOWN]
   * @returns {boolean} - Whether the connection reachability or the connection props have changed
   * @private
   */


  (0, _createClass2.default)(LegacyDetectNetwork, [{
    key: "_addListeners",

    /**
     * Adds listeners for when connection reachability and app state changes to update props
     * @returns {void}
     * @private
     */
    value: function _addListeners() {
      var _this2 = this;

      _reactNative.NetInfo.addEventListener('change', function (reach) {
        _this2._setShouldInitUpdateReach(false);

        _this2._update(reach);
      });

      _reactNative.AppState.addEventListener('change', /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4() {
        var reach;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _this2._setShouldInitUpdateReach(false);

                _context4.next = 3;
                return _reactNative.NetInfo.fetch();

              case 3:
                reach = _context4.sent;

                _this2._update(reach);

              case 5:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      })));
    }
    /**
     * Executes the given callback to update redux's store with the new internal props
     * @returns {Promise.<void>} Resolves after fetching the isConnectionExpensive
     * and dispatches actions
     * @private
     */

  }]);
  return LegacyDetectNetwork;
}();

var _default = LegacyDetectNetwork;
exports.default = _default;
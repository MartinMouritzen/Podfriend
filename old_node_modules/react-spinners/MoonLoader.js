"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/** @jsx jsx */
var React = __importStar(require("react"));
var core_1 = require("@emotion/core");
var helpers_1 = require("./helpers");
var moon = core_1.keyframes(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  100% {transform: rotate(360deg)}\n"], ["\n  100% {transform: rotate(360deg)}\n"])));
var Loader = /** @class */ (function (_super) {
    __extends(Loader, _super);
    function Loader() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.moonSize = function () {
            var size = _this.props.size;
            var value = helpers_1.parseLengthAndUnit(size).value;
            return value / 7;
        };
        _this.ballStyle = function (size) {
            return core_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      width: ", ";\n      height: ", ";\n      border-radius: 100%;\n    "], ["\n      width: ", ";\n      height: ", ";\n      border-radius: 100%;\n    "])), helpers_1.cssValue(size), helpers_1.cssValue(size));
        };
        _this.wrapper = function () {
            var size = _this.props.size;
            var _a = helpers_1.parseLengthAndUnit(size), value = _a.value, unit = _a.unit;
            return core_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      position: relative;\n      width: ", ";\n      height: ", ";\n      animation: ", " 0.6s 0s infinite linear;\n      animation-fill-mode: forwards;\n    "], ["\n      position: relative;\n      width: ", ";\n      height: ", ";\n      animation: ", " 0.6s 0s infinite linear;\n      animation-fill-mode: forwards;\n    "])), "" + (value + _this.moonSize() * 2) + unit, "" + (value + _this.moonSize() * 2) + unit, moon);
        };
        _this.ball = function () {
            var _a = _this.props, color = _a.color, size = _a.size;
            var _b = helpers_1.parseLengthAndUnit(size), value = _b.value, unit = _b.unit;
            return core_1.css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      ", ";\n      background-color: ", ";\n      opacity: 0.8;\n      position: absolute;\n      top: ", ";\n      animation: ", " 0.6s 0s infinite linear;\n      animation-fill-mode: forwards;\n    "], ["\n      ", ";\n      background-color: ", ";\n      opacity: 0.8;\n      position: absolute;\n      top: ", ";\n      animation: ", " 0.6s 0s infinite linear;\n      animation-fill-mode: forwards;\n    "])), _this.ballStyle(_this.moonSize()), color, "" + (value / 2 - _this.moonSize() / 2) + unit, moon);
        };
        _this.circle = function () {
            var _a = _this.props, size = _a.size, color = _a.color;
            var value = helpers_1.parseLengthAndUnit(size).value;
            return core_1.css(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n      ", ";\n      border: ", "px solid ", ";\n      opacity: 0.1;\n      box-sizing: content-box;\n    "], ["\n      ", ";\n      border: ", "px solid ", ";\n      opacity: 0.1;\n      box-sizing: content-box;\n    "])), _this.ballStyle(value), _this.moonSize(), color);
        };
        return _this;
    }
    Loader.prototype.render = function () {
        var _a = this.props, loading = _a.loading, css = _a.css;
        return loading ? (core_1.jsx("div", { css: [this.wrapper(), css] },
            core_1.jsx("div", { css: this.ball() }),
            core_1.jsx("div", { css: this.circle() }))) : null;
    };
    Loader.defaultProps = helpers_1.sizeDefaults(60);
    return Loader;
}(React.PureComponent));
exports.default = Loader;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;

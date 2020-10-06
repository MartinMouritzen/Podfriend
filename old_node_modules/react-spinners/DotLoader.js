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
var rotate = core_1.keyframes(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  100% {transform: rotate(360deg)}\n"], ["\n  100% {transform: rotate(360deg)}\n"])));
var bounce = core_1.keyframes(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  0%, 100% {transform: scale(0)}\n  50% {transform: scale(1.0)}\n"], ["\n  0%, 100% {transform: scale(0)}\n  50% {transform: scale(1.0)}\n"])));
var Loader = /** @class */ (function (_super) {
    __extends(Loader, _super);
    function Loader() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.style = function (i) {
            var _a = _this.props, size = _a.size, color = _a.color;
            var _b = helpers_1.parseLengthAndUnit(size), value = _b.value, unit = _b.unit;
            return core_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      position: absolute;\n      top: ", ";\n      bottom: ", ";\n      height: ", ";\n      width: ", ";\n      background-color: ", ";\n      border-radius: 100%;\n      animation-fill-mode: forwards;\n      animation: ", " 2s ", " infinite linear;\n    "], ["\n      position: absolute;\n      top: ", ";\n      bottom: ", ";\n      height: ", ";\n      width: ", ";\n      background-color: ", ";\n      border-radius: 100%;\n      animation-fill-mode: forwards;\n      animation: ", " 2s ", " infinite linear;\n    "])), i % 2 ? "0" : "auto", i % 2 ? "auto" : "0", "" + value / 2 + unit, "" + value / 2 + unit, color, bounce, i === 2 ? "-1s" : "0s");
        };
        _this.wrapper = function () {
            var size = _this.props.size;
            return core_1.css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      position: relative;\n      width: ", ";\n      height: ", ";\n      animation-fill-mode: forwards;\n      animation: ", " 2s 0s infinite linear;\n    "], ["\n      position: relative;\n      width: ", ";\n      height: ", ";\n      animation-fill-mode: forwards;\n      animation: ", " 2s 0s infinite linear;\n    "])), helpers_1.cssValue(size), helpers_1.cssValue(size), rotate);
        };
        return _this;
    }
    Loader.prototype.render = function () {
        var _a = this.props, loading = _a.loading, css = _a.css;
        return loading ? (core_1.jsx("div", { css: [this.wrapper(), css] },
            core_1.jsx("div", { css: this.style(1) }),
            core_1.jsx("div", { css: this.style(2) }))) : null;
    };
    Loader.defaultProps = helpers_1.sizeDefaults(60);
    return Loader;
}(React.PureComponent));
exports.default = Loader;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;

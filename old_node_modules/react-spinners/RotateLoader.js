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
var rotate = core_1.keyframes(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  0% {transform: rotate(0deg)}\n  50% {transform: rotate(180deg)}\n  100% {transform: rotate(360deg)}\n"], ["\n  0% {transform: rotate(0deg)}\n  50% {transform: rotate(180deg)}\n  100% {transform: rotate(360deg)}\n"])));
var Loader = /** @class */ (function (_super) {
    __extends(Loader, _super);
    function Loader() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.style = function (i) {
            var margin = _this.props.margin;
            var value = helpers_1.parseLengthAndUnit(margin).value;
            var left = (i % 2 ? -1 : 1) * (26 + value);
            return core_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      opacity: 0.8;\n      position: absolute;\n      top: 0;\n      left: ", "px;\n    "], ["\n      opacity: 0.8;\n      position: absolute;\n      top: 0;\n      left: ", "px;\n    "])), left);
        };
        _this.ball = function () {
            var _a = _this.props, color = _a.color, size = _a.size;
            return core_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      background-color: ", ";\n      width: ", ";\n      height: ", ";\n      border-radius: 100%;\n    "], ["\n      background-color: ", ";\n      width: ", ";\n      height: ", ";\n      border-radius: 100%;\n    "])), color, helpers_1.cssValue(size), helpers_1.cssValue(size));
        };
        _this.wrapper = function () {
            return core_1.css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      ", ";\n      display: inline-block;\n      position: relative;\n      animation-fill-mode: both;\n      animation: ", " 1s 0s infinite cubic-bezier(0.7, -0.13, 0.22, 0.86);\n    "], ["\n      ", ";\n      display: inline-block;\n      position: relative;\n      animation-fill-mode: both;\n      animation: ", " 1s 0s infinite cubic-bezier(0.7, -0.13, 0.22, 0.86);\n    "])), _this.ball(), rotate);
        };
        _this.long = function () { return core_1.css(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n    ", ";\n    ", ";\n  "], ["\n    ", ";\n    ", ";\n  "])), _this.ball(), _this.style(1)); };
        _this.short = function () { return core_1.css(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n    ", ";\n    ", ";\n  "], ["\n    ", ";\n    ", ";\n  "])), _this.ball(), _this.style(2)); };
        return _this;
    }
    Loader.prototype.render = function () {
        var _a = this.props, loading = _a.loading, css = _a.css;
        return loading ? (core_1.jsx("div", { css: [this.wrapper(), css] },
            core_1.jsx("div", { css: this.long() }),
            core_1.jsx("div", { css: this.short() }))) : null;
    };
    Loader.defaultProps = helpers_1.sizeMarginDefaults(15);
    return Loader;
}(React.PureComponent));
exports.default = Loader;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;

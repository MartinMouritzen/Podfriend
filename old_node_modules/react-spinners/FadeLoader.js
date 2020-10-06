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
var fade = core_1.keyframes(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  50% {opacity: 0.3}\n  100% {opacity: 1}\n"], ["\n  50% {opacity: 0.3}\n  100% {opacity: 1}\n"])));
var Loader = /** @class */ (function (_super) {
    __extends(Loader, _super);
    function Loader() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.radius = function () {
            var margin = _this.props.margin;
            var value = helpers_1.parseLengthAndUnit(margin).value;
            return value + 18;
        };
        _this.quarter = function () {
            return _this.radius() / 2 + _this.radius() / 5.5;
        };
        _this.style = function (i) {
            var _a = _this.props, height = _a.height, width = _a.width, margin = _a.margin, color = _a.color, radius = _a.radius;
            return core_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      position: absolute;\n      width: ", ";\n      height: ", ";\n      margin: ", ";\n      background-color: ", ";\n      border-radius: ", ";\n      transition: 2s;\n      animation-fill-mode: \"both\";\n      animation: ", " 1.2s ", "s infinite ease-in-out;\n    "], ["\n      position: absolute;\n      width: ", ";\n      height: ", ";\n      margin: ", ";\n      background-color: ", ";\n      border-radius: ", ";\n      transition: 2s;\n      animation-fill-mode: \"both\";\n      animation: ", " 1.2s ", "s infinite ease-in-out;\n    "])), helpers_1.cssValue(width), helpers_1.cssValue(height), helpers_1.cssValue(margin), color, helpers_1.cssValue(radius), fade, i * 0.12);
        };
        _this.wrapper = function () {
            return core_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      position: relative;\n      font-size: 0;\n      top: ", "px;\n      left: ", "px;\n      width: ", "px;\n      height: ", "px;\n    "], ["\n      position: relative;\n      font-size: 0;\n      top: ", "px;\n      left: ", "px;\n      width: ", "px;\n      height: ", "px;\n    "])), _this.radius(), _this.radius(), _this.radius() * 3, _this.radius() * 3);
        };
        _this.a = function () { return core_1.css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    ", ";\n    top: ", "px;\n    left: 0;\n  "], ["\n    ", ";\n    top: ", "px;\n    left: 0;\n  "])), _this.style(1), _this.radius()); };
        _this.b = function () { return core_1.css(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n    ", ";\n    top: ", "px;\n    left: ", "px;\n    transform: rotate(-45deg);\n  "], ["\n    ", ";\n    top: ", "px;\n    left: ", "px;\n    transform: rotate(-45deg);\n  "])), _this.style(2), _this.quarter(), _this.quarter()); };
        _this.c = function () { return core_1.css(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n    ", ";\n    top: 0;\n    left: ", "px;\n    transform: rotate(90deg);\n  "], ["\n    ", ";\n    top: 0;\n    left: ", "px;\n    transform: rotate(90deg);\n  "])), _this.style(3), _this.radius()); };
        _this.d = function () { return core_1.css(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n    ", ";\n    top: ", "px;\n    left: ", "px;\n    transform: rotate(45deg);\n  "], ["\n    ", ";\n    top: ", "px;\n    left: ", "px;\n    transform: rotate(45deg);\n  "])), _this.style(4), -_this.quarter(), _this.quarter()); };
        _this.e = function () { return core_1.css(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n    ", ";\n    top: ", "px;\n    left: 0;\n  "], ["\n    ", ";\n    top: ", "px;\n    left: 0;\n  "])), _this.style(5), -_this.radius()); };
        _this.f = function () { return core_1.css(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n    ", ";\n    top: ", "px;\n    left: ", "px;\n    transform: rotate(-45deg);\n  "], ["\n    ", ";\n    top: ", "px;\n    left: ", "px;\n    transform: rotate(-45deg);\n  "])), _this.style(6), -_this.quarter(), -_this.quarter()); };
        _this.g = function () { return core_1.css(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n    ", ";\n    top: 0;\n    left: ", "px;\n    transform: rotate(90deg);\n  "], ["\n    ", ";\n    top: 0;\n    left: ", "px;\n    transform: rotate(90deg);\n  "])), _this.style(7), -_this.radius()); };
        _this.h = function () { return core_1.css(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n    ", ";\n    top: ", "px;\n    left: ", "px;\n    transform: rotate(45deg);\n  "], ["\n    ", ";\n    top: ", "px;\n    left: ", "px;\n    transform: rotate(45deg);\n  "])), _this.style(8), _this.quarter(), -_this.quarter()); };
        return _this;
    }
    Loader.prototype.render = function () {
        var _a = this.props, loading = _a.loading, css = _a.css;
        return loading ? (core_1.jsx("div", { css: [this.wrapper(), css] },
            core_1.jsx("div", { css: this.a() }),
            core_1.jsx("div", { css: this.b() }),
            core_1.jsx("div", { css: this.c() }),
            core_1.jsx("div", { css: this.d() }),
            core_1.jsx("div", { css: this.e() }),
            core_1.jsx("div", { css: this.f() }),
            core_1.jsx("div", { css: this.g() }),
            core_1.jsx("div", { css: this.h() }))) : null;
    };
    Loader.defaultProps = helpers_1.heightWidthRadiusDefaults(15, 5, 2);
    return Loader;
}(React.PureComponent));
exports.default = Loader;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11;

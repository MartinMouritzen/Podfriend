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
var exec = require('cordova/exec');
var XHREventTarget = /** @class */ (function () {
    function XHREventTarget() {
        this.onprogress = null;
        this.onload = null;
        this.onloadstart = null;
        this.onloadend = null;
        this.onreadystatechange = null;
        this.onerror = null;
        this.onabort = null;
        this.ontimeout = null;
        this.listeners = {
            progress: [],
            load: [],
            loadstart: [],
            loadend: [],
            readystatechange: [],
            error: [],
            abort: [],
            timeout: []
        };
    }
    XHREventTarget.prototype.addEventListener = function (eventName, listener) {
        this.listeners[eventName].push(listener);
        if (typeof Zone !== 'undefined') {
            this.zone = Zone.current;
        }
    };
    XHREventTarget.prototype.dispatchEvent = function (event) {
        this.fireEvent(event.type, event);
        return true;
    };
    XHREventTarget.prototype.removeEventListener = function (eventName) {
        this.listeners[eventName] = [];
    };
    XHREventTarget.prototype.fireEvent = function (eventName, event) {
        this.call(this['on' + eventName], event);
        for (var _i = 0, _a = this.listeners[eventName]; _i < _a.length; _i++) {
            var listener = _a[_i];
            this.call(listener, event);
        }
    };
    XHREventTarget.prototype.call = function (func, event) {
        if (!func) {
            return;
        }
        !!this.zone ? this.zone.run(func, this, [event]) : func.call(this, event);
    };
    return XHREventTarget;
}());
var XHR = /** @class */ (function (_super) {
    __extends(XHR, _super);
    function XHR() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.UNSENT = 0;
        _this.OPENED = 1;
        _this.HEADERS_RECEIVED = 2;
        _this.LOADING = 3;
        _this.DONE = 4;
        _this.status = 0;
        _this.statusText = null;
        _this.response = null;
        _this.responseText = null;
        _this.responseXML = null;
        _this._responseType = '';
        // TODO: Support these.
        _this.timeout = 60;
        _this.withCredentials = false;
        _this.responseURL = null;
        _this.upload = null;
        _this.msCachingEnabled = function () { return false; };
        _this.msCaching = null;
        _this._readyState = XMLHttpRequest.UNSENT;
        _this.path = null;
        _this.method = null;
        _this.requestHeaders = { 'User-Agent': navigator.userAgent };
        _this.responseHeaders = {};
        _this.allResponseHeaders = null;
        return _this;
    }
    Object.defineProperty(XHR.prototype, "responseType", {
        get: function () {
            return this._responseType;
        },
        set: function (responseType) {
            if (this.status >= XHR.LOADING) {
                throw new DOMException('Object state must be unsent, opened or headers received.', 'InvalidStateError');
            }
            this._responseType = responseType.toLowerCase();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XHR.prototype, "readyState", {
        // ---
        get: function () {
            return this._readyState;
        },
        set: function (readyState) {
            this._readyState = readyState;
            this.dispatchEvent(new ProgressEvent('readystatechange'));
        },
        enumerable: true,
        configurable: true
    });
    XHR.prototype.open = function (method, path) {
        if (this.readyState !== XMLHttpRequest.UNSENT) {
            throw 'XHR is already opened';
        }
        this.readyState = XMLHttpRequest.OPENED;
        this.path = this.makeAbsolute(path);
        this.method = method;
    };
    XHR.prototype.send = function (data) {
        var _this = this;
        if (this.readyState !== XMLHttpRequest.OPENED) {
            if (this.readyState === XMLHttpRequest.UNSENT) {
                throw new DOMException('State is UNSENT but it should be OPENED.', 'InvalidStateError');
            }
            throw new DOMException('The object is in an invalid state (should be OPENED).', 'InvalidStateError');
        }
        this.readyState = XMLHttpRequest.LOADING;
        var promise;
        if (data instanceof FormData) {
            this.requestHeaders['Content-Type'] = 'multipart/form-data';
            promise = this.requestBodyWithFormData(data);
        }
        else {
            promise = Promise.resolve(data);
        }
        promise.then(function (body) { return exec(function (response) {
            _this.status = response.status;
            _this.statusText = response.statusText;
            _this.response = response.responseText;
            _this.responseText = response.responseText;
            _this.responseHeaders = response.responseHeaders;
            _this.allResponseHeaders = response.allResponseHeaders;
            _this.readyState = XMLHttpRequest.DONE;
            if (_this.responseType === 'arraybuffer') {
                _this.response = new Uint8Array(JSON.parse(response.response)).buffer;
            }
            _this.dispatchEvent(new ProgressEvent('load'));
            _this.dispatchEvent(new ProgressEvent('loadend'));
        }, function (error) {
            _this.dispatchEvent(new ProgressEvent('error'));
            _this.readyState = XMLHttpRequest.DONE;
        }, 'CORS', 'send', [_this.method, _this.path, _this.requestHeaders, body, _this._responseType || 'text']); });
    };
    XHR.prototype.abort = function () {
        // Ignored.
    };
    XHR.prototype.overrideMimeType = function (mimeType) {
        throw new Error('overrideMimeType method is not supported');
    };
    XHR.prototype.setRequestHeader = function (header, value) {
        if (value != null) {
            this.requestHeaders[header] = "" + value;
        }
        else {
            delete this.requestHeaders[header];
        }
    };
    XHR.prototype.getResponseHeader = function (header) {
        return this.responseHeaders[header];
    };
    XHR.prototype.getAllResponseHeaders = function () {
        return this.allResponseHeaders;
    };
    XHR.prototype.makeAbsolute = function (relativeUrl) {
        var anchor = document.createElement('a');
        anchor.href = relativeUrl;
        return anchor.href;
    };
    /**
     * Creates the request body using the given form data.
     *
     * @param formData Form data to send.
     */
    XHR.prototype.requestBodyWithFormData = function (formData) {
        var promises = [];
        formData.forEach(function (value, key) {
            if (XHR.isFile(value)) {
                promises.push(new Promise(function (resolve, reject) {
                    var fileReader = new FileReader();
                    fileReader.onload = function () {
                        resolve({
                            type: 'file',
                            key: key,
                            value: XHR.toBase64(fileReader.result),
                            fileName: value.name,
                            mimeType: value.type
                        });
                    };
                    fileReader.onerror = function () {
                        reject(fileReader.error);
                    };
                    fileReader.readAsDataURL(value);
                }));
            }
            else {
                promises.push(Promise.resolve({
                    type: 'string',
                    key: key,
                    value: value
                }));
            }
        });
        return Promise.all(promises);
    };
    /**
     * Convert the given data URL into a properly encoded base64 string.
     * Removes the `data:` prefixe and adds the padding.
     *
     * @param dataURL Data URL to convert.
     */
    XHR.toBase64 = function (dataURL) {
        dataURL = dataURL.replace(/^data:.*?base64,/, '');
        switch (dataURL.length % 4) {
            case 2:
                return dataURL + '==';
            case 3:
                return dataURL + '=';
            default:
                return dataURL;
        }
    };
    /**
     * Returns `true` if `value` is an instance of `File`.
     * Not using `instanceof` because of Cordova custom File type.
     * @see https://github.com/Raphcal/cordova-plugin-cors/issues/5
     *
     * @param value Value to evaluate.
     */
    XHR.isFile = function (value) {
        return typeof value === 'object'
            && 'name' in value
            && 'type' in value;
    };
    XHR.UNSENT = 0;
    XHR.OPENED = 1;
    XHR.HEADERS_RECEIVED = 2;
    XHR.LOADING = 3;
    XHR.DONE = 4;
    return XHR;
}(XHREventTarget));
window.XMLHttpRequestEventTarget = XHREventTarget;
module.exports = XHR;

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNetSession = getNetSession;
exports.ElectronHttpExecutor = exports.NET_SESSION_NAME = void 0;

function _builderUtilRuntime() {
  const data = require("builder-util-runtime");

  _builderUtilRuntime = function () {
    return data;
  };

  return data;
}

function _electron() {
  const data = require("electron");

  _electron = function () {
    return data;
  };

  return data;
}

const NET_SESSION_NAME = "electron-updater";
exports.NET_SESSION_NAME = NET_SESSION_NAME;

function getNetSession() {
  return _electron().session.fromPartition(NET_SESSION_NAME, {
    cache: false
  });
}

class ElectronHttpExecutor extends _builderUtilRuntime().HttpExecutor {
  constructor(proxyLoginCallback) {
    super();
    this.proxyLoginCallback = proxyLoginCallback;
    this.cachedSession = null;
  }

  async download(url, destination, options) {
    return await options.cancellationToken.createPromise((resolve, reject, onCancel) => {
      const requestOptions = {
        headers: options.headers || undefined,
        redirect: "manual"
      };
      (0, _builderUtilRuntime().configureRequestUrl)(url, requestOptions);
      (0, _builderUtilRuntime().configureRequestOptions)(requestOptions);
      this.doDownload(requestOptions, {
        destination,
        options,
        onCancel,
        callback: error => {
          if (error == null) {
            resolve(destination);
          } else {
            reject(error);
          }
        },
        responseHandler: null
      }, 0);
    });
  }

  createRequest(options, callback) {
    // fix (node 7+) for making electron updater work when using AWS private buckets, check if headers contain Host property
    if (options.headers && options.headers.Host) {
      // set host value from headers.Host
      options.host = options.headers.Host; // remove header property 'Host', if not removed causes net::ERR_INVALID_ARGUMENT exception

      delete options.headers.Host;
    } // differential downloader can call this method very often, so, better to cache session


    if (this.cachedSession == null) {
      this.cachedSession = getNetSession();
    }

    const request = _electron().net.request({ ...options,
      session: this.cachedSession
    });

    request.on("response", callback);

    if (this.proxyLoginCallback != null) {
      request.on("login", this.proxyLoginCallback);
    }

    return request;
  }

  addRedirectHandlers(request, options, reject, redirectCount, handler) {
    request.on("redirect", (statusCode, method, redirectUrl) => {
      // no way to modify request options, abort old and make a new one
      // https://github.com/electron/electron/issues/11505
      request.abort();

      if (redirectCount > this.maxRedirects) {
        reject(this.createMaxRedirectError());
      } else {
        handler(_builderUtilRuntime().HttpExecutor.prepareRedirectUrlOptions(redirectUrl, options));
      }
    });
  }

} exports.ElectronHttpExecutor = ElectronHttpExecutor;
// __ts-babel@6.0.4
//# sourceMappingURL=electronHttpExecutor.js.map
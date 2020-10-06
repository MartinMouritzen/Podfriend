"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppImageUpdater = void 0;

function _builderUtilRuntime() {
  const data = require("builder-util-runtime");

  _builderUtilRuntime = function () {
    return data;
  };

  return data;
}

function _child_process() {
  const data = require("child_process");

  _child_process = function () {
    return data;
  };

  return data;
}

function _fsExtra() {
  const data = require("fs-extra");

  _fsExtra = function () {
    return data;
  };

  return data;
}

var _fs = require("fs");

var path = _interopRequireWildcard(require("path"));

function _BaseUpdater() {
  const data = require("./BaseUpdater");

  _BaseUpdater = function () {
    return data;
  };

  return data;
}

function _FileWithEmbeddedBlockMapDifferentialDownloader() {
  const data = require("./differentialDownloader/FileWithEmbeddedBlockMapDifferentialDownloader");

  _FileWithEmbeddedBlockMapDifferentialDownloader = function () {
    return data;
  };

  return data;
}

function _Provider() {
  const data = require("./providers/Provider");

  _Provider = function () {
    return data;
  };

  return data;
}

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class AppImageUpdater extends _BaseUpdater().BaseUpdater {
  constructor(options, app) {
    super(options, app);
  }

  isUpdaterActive() {
    if (process.env.APPIMAGE == null) {
      if (process.env.SNAP == null) {
        this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage");
      } else {
        this._logger.info("SNAP env is defined, updater is disabled");
      }

      return false;
    }

    return super.isUpdaterActive();
  }
  /*** @private */


  doDownloadUpdate(downloadUpdateOptions) {
    const provider = downloadUpdateOptions.updateInfoAndProvider.provider;
    const fileInfo = (0, _Provider().findFile)(provider.resolveFiles(downloadUpdateOptions.updateInfoAndProvider.info), "AppImage");
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo,
      downloadUpdateOptions,
      task: async (updateFile, downloadOptions) => {
        const oldFile = process.env.APPIMAGE;

        if (oldFile == null) {
          throw (0, _builderUtilRuntime().newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        }

        let isDownloadFull = false;

        try {
          await new (_FileWithEmbeddedBlockMapDifferentialDownloader().FileWithEmbeddedBlockMapDifferentialDownloader)(fileInfo.info, this.httpExecutor, {
            newUrl: fileInfo.url,
            oldFile,
            logger: this._logger,
            newFile: updateFile,
            isUseMultipleRangeRequest: provider.isUseMultipleRangeRequest,
            requestHeaders: downloadUpdateOptions.requestHeaders
          }).download();
        } catch (e) {
          this._logger.error(`Cannot download differentially, fallback to full download: ${e.stack || e}`); // during test (developer machine mac) we must throw error


          isDownloadFull = process.platform === "linux";
        }

        if (isDownloadFull) {
          await this.httpExecutor.download(fileInfo.url, updateFile, downloadOptions);
        }

        await (0, _fsExtra().chmod)(updateFile, 0o755);
      }
    });
  }

  doInstall(options) {
    const appImageFile = process.env.APPIMAGE;

    if (appImageFile == null) {
      throw (0, _builderUtilRuntime().newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    } // https://stackoverflow.com/a/1712051/1910191


    (0, _fs.unlinkSync)(appImageFile);
    let destination;
    const existingBaseName = path.basename(appImageFile); // https://github.com/electron-userland/electron-builder/issues/2964
    // if no version in existing file name, it means that user wants to preserve current custom name

    if (path.basename(options.installerPath) === existingBaseName || !/\d+\.\d+\.\d+/.test(existingBaseName)) {
      // no version in the file name, overwrite existing
      destination = appImageFile;
    } else {
      destination = path.join(path.dirname(appImageFile), path.basename(options.installerPath));
    }

    (0, _child_process().execFileSync)("mv", ["-f", options.installerPath, destination]);
    const env = { ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };

    if (options.isForceRunAfter) {
      (0, _child_process().spawn)(destination, [], {
        detached: true,
        stdio: "ignore",
        env
      }).unref();
    } else {
      env.APPIMAGE_EXIT_AFTER_INSTALL = "true";
      (0, _child_process().execFileSync)(destination, [], {
        env
      });
    }

    return true;
  }

} exports.AppImageUpdater = AppImageUpdater;
// __ts-babel@6.0.4
//# sourceMappingURL=AppImageUpdater.js.map
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseUpdater = void 0;

function _AppUpdater() {
  const data = require("./AppUpdater");

  _AppUpdater = function () {
    return data;
  };

  return data;
}

class BaseUpdater extends _AppUpdater().AppUpdater {
  constructor(options, app) {
    super(options, app);
    this.quitAndInstallCalled = false;
    this.quitHandlerAdded = false;
  }

  quitAndInstall(isSilent = false, isForceRunAfter = false) {
    this._logger.info(`Install on explicit quitAndInstall`);

    const isInstalled = this.install(isSilent, isSilent ? isForceRunAfter : true);

    if (isInstalled) {
      setImmediate(() => {
        this.app.quit();
      });
    } else {
      this.quitAndInstallCalled = false;
    }
  }

  executeDownload(taskOptions) {
    return super.executeDownload({ ...taskOptions,
      done: async event => {
        this.dispatchUpdateDownloaded(event);
        this.addQuitHandler();
      }
    });
  } // must be sync (because quit even handler is not async)


  install(isSilent, isForceRunAfter) {
    if (this.quitAndInstallCalled) {
      this._logger.warn("install call ignored: quitAndInstallCalled is set to true");

      return false;
    }

    const downloadedUpdateHelper = this.downloadedUpdateHelper;
    const installerPath = downloadedUpdateHelper == null ? null : downloadedUpdateHelper.file;
    const downloadedFileInfo = downloadedUpdateHelper == null ? null : downloadedUpdateHelper.downloadedFileInfo;

    if (installerPath == null || downloadedFileInfo == null) {
      this.dispatchError(new Error("No valid update available, can't quit and install"));
      return false;
    } // prevent calling several times


    this.quitAndInstallCalled = true;

    try {
      this._logger.info(`Install: isSilent: ${isSilent}, isForceRunAfter: ${isForceRunAfter}`);

      return this.doInstall({
        installerPath,
        isSilent,
        isForceRunAfter,
        isAdminRightsRequired: downloadedFileInfo.isAdminRightsRequired
      });
    } catch (e) {
      this.dispatchError(e);
      return false;
    }
  }

  addQuitHandler() {
    if (this.quitHandlerAdded || !this.autoInstallOnAppQuit) {
      return;
    }

    this.quitHandlerAdded = true;
    this.app.onQuit(exitCode => {
      if (this.quitAndInstallCalled) {
        this._logger.info("Update installer has already been triggered. Quitting application.");

        return;
      }

      if (exitCode !== 0) {
        this._logger.info(`Update will be not installed on quit because application is quitting with exit code ${exitCode}`);

        return;
      }

      this._logger.info("Auto install update on quit");

      this.install(true, false);
    });
  }

} exports.BaseUpdater = BaseUpdater;
// __ts-babel@6.0.4
//# sourceMappingURL=BaseUpdater.js.map
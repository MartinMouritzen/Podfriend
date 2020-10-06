"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTempUpdateFile = createTempUpdateFile;
exports.DownloadedUpdateHelper = void 0;

function _crypto() {
  const data = require("crypto");

  _crypto = function () {
    return data;
  };

  return data;
}

var _fs = require("fs");

function _lodash() {
  const data = _interopRequireDefault(require("lodash.isequal"));

  _lodash = function () {
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

var path = _interopRequireWildcard(require("path"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @private **/
class DownloadedUpdateHelper {
  constructor(cacheDir) {
    this.cacheDir = cacheDir;
    this._file = null;
    this._packageFile = null;
    this.versionInfo = null;
    this.fileInfo = null;
    this._downloadedFileInfo = null;
  }

  get downloadedFileInfo() {
    return this._downloadedFileInfo;
  }

  get file() {
    return this._file;
  }

  get packageFile() {
    return this._packageFile;
  }

  get cacheDirForPendingUpdate() {
    return path.join(this.cacheDir, "pending");
  }

  async validateDownloadedPath(updateFile, updateInfo, fileInfo, logger) {
    if (this.versionInfo != null && this.file === updateFile && this.fileInfo != null) {
      // update has already been downloaded from this running instance
      // check here only existence, not checksum
      if ((0, _lodash().default)(this.versionInfo, updateInfo) && (0, _lodash().default)(this.fileInfo.info, fileInfo.info) && (await (0, _fsExtra().pathExists)(updateFile))) {
        return updateFile;
      } else {
        return null;
      }
    } // update has already been downloaded from some previous app launch


    const cachedUpdateFile = await this.getValidCachedUpdateFile(fileInfo, logger);

    if (cachedUpdateFile === null) {
      return null;
    }

    logger.info(`Update has already been downloaded to ${updateFile}).`);
    this._file = cachedUpdateFile;
    return cachedUpdateFile;
  }

  async setDownloadedFile(downloadedFile, packageFile, versionInfo, fileInfo, updateFileName, isSaveCache) {
    this._file = downloadedFile;
    this._packageFile = packageFile;
    this.versionInfo = versionInfo;
    this.fileInfo = fileInfo;
    this._downloadedFileInfo = {
      fileName: updateFileName,
      sha512: fileInfo.info.sha512,
      isAdminRightsRequired: fileInfo.info.isAdminRightsRequired === true
    };

    if (isSaveCache) {
      await (0, _fsExtra().outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
    }
  }

  async clear() {
    this._file = null;
    this._packageFile = null;
    this.versionInfo = null;
    this.fileInfo = null;
    await this.cleanCacheDirForPendingUpdate();
  }

  async cleanCacheDirForPendingUpdate() {
    try {
      // remove stale data
      await (0, _fsExtra().emptyDir)(this.cacheDirForPendingUpdate);
    } catch (ignore) {// ignore
    }
  }
  /**
   * Returns "update-info.json" which is created in the update cache directory's "pending" subfolder after the first update is downloaded.  If the update file does not exist then the cache is cleared and recreated.  If the update file exists then its properties are validated.
   * @param fileInfo
   * @param logger
   */


  async getValidCachedUpdateFile(fileInfo, logger) {
    var _a;

    const updateInfoFilePath = this.getUpdateInfoFile();
    const doesUpdateInfoFileExist = await (0, _fsExtra().pathExistsSync)(updateInfoFilePath);

    if (!doesUpdateInfoFileExist) {
      return null;
    }

    let cachedInfo;

    try {
      cachedInfo = await (0, _fsExtra().readJson)(updateInfoFilePath);
    } catch (error) {
      let message = `No cached update info available`;

      if (error.code !== "ENOENT") {
        await this.cleanCacheDirForPendingUpdate();
        message += ` (error on read: ${error.message})`;
      }

      logger.info(message);
      return null;
    }

    const isCachedInfoFileNameValid = (_a = (cachedInfo === null || cachedInfo === void 0 ? void 0 : cachedInfo.fileName) !== null) !== null && _a !== void 0 ? _a : false;

    if (!isCachedInfoFileNameValid) {
      logger.warn(`Cached update info is corrupted: no fileName, directory for cached update will be cleaned`);
      await this.cleanCacheDirForPendingUpdate();
      return null;
    }

    if (fileInfo.info.sha512 !== cachedInfo.sha512) {
      logger.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${cachedInfo.sha512}, expected: ${fileInfo.info.sha512}. Directory for cached update will be cleaned`);
      await this.cleanCacheDirForPendingUpdate();
      return null;
    }

    const updateFile = path.join(this.cacheDirForPendingUpdate, cachedInfo.fileName);

    if (!(await (0, _fsExtra().pathExists)(updateFile))) {
      logger.info("Cached update file doesn't exist, directory for cached update will be cleaned");
      await this.cleanCacheDirForPendingUpdate();
      return null;
    }

    const sha512 = await hashFile(updateFile);

    if (fileInfo.info.sha512 !== sha512) {
      logger.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${sha512}, expected: ${fileInfo.info.sha512}`);
      await this.cleanCacheDirForPendingUpdate();
      return null;
    }

    this._downloadedFileInfo = cachedInfo;
    return updateFile;
  }

  getUpdateInfoFile() {
    return path.join(this.cacheDirForPendingUpdate, "update-info.json");
  }

}

exports.DownloadedUpdateHelper = DownloadedUpdateHelper;

function hashFile(file, algorithm = "sha512", encoding = "base64", options) {
  return new Promise((resolve, reject) => {
    const hash = (0, _crypto().createHash)(algorithm);
    hash.on("error", reject).setEncoding(encoding);
    (0, _fs.createReadStream)(file, { ...options,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */

    }).on("error", reject).on("end", () => {
      hash.end();
      resolve(hash.read());
    }).pipe(hash, {
      end: false
    });
  });
}

async function createTempUpdateFile(name, cacheDir, log) {
  // https://github.com/electron-userland/electron-builder/pull/2474#issuecomment-366481912
  let nameCounter = 0;
  let result = path.join(cacheDir, name);

  for (let i = 0; i < 3; i++) {
    try {
      await (0, _fsExtra().unlink)(result);
      return result;
    } catch (e) {
      if (e.code === "ENOENT") {
        return result;
      }

      log.warn(`Error on remove temp update file: ${e}`);
      result = path.join(cacheDir, `${nameCounter++}-${name}`);
    }
  }

  return result;
} 
// __ts-babel@6.0.4
//# sourceMappingURL=DownloadedUpdateHelper.js.map
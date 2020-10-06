"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;

function _fsExtra() {
  const data = require("fs-extra");

  _fsExtra = function () {
    return data;
  };

  return data;
}

function _DifferentialDownloader() {
  const data = require("./DifferentialDownloader");

  _DifferentialDownloader = function () {
    return data;
  };

  return data;
}

function _zlib() {
  const data = require("zlib");

  _zlib = function () {
    return data;
  };

  return data;
}

class FileWithEmbeddedBlockMapDifferentialDownloader extends _DifferentialDownloader().DifferentialDownloader {
  async download() {
    const packageInfo = this.blockAwareFileInfo;
    const fileSize = packageInfo.size;
    const offset = fileSize - (packageInfo.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(offset, fileSize - 1);
    const newBlockMap = readBlockMap(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload((await readEmbeddedBlockMapData(this.options.oldFile)), newBlockMap);
  }

}

exports.FileWithEmbeddedBlockMapDifferentialDownloader = FileWithEmbeddedBlockMapDifferentialDownloader;

function readBlockMap(data) {
  return JSON.parse((0, _zlib().inflateRawSync)(data).toString());
}

async function readEmbeddedBlockMapData(file) {
  const fd = await (0, _fsExtra().open)(file, "r");

  try {
    const fileSize = (await (0, _fsExtra().fstat)(fd)).size;
    const sizeBuffer = Buffer.allocUnsafe(4);
    await (0, _fsExtra().read)(fd, sizeBuffer, 0, sizeBuffer.length, fileSize - sizeBuffer.length);
    const dataBuffer = Buffer.allocUnsafe(sizeBuffer.readUInt32BE(0));
    await (0, _fsExtra().read)(fd, dataBuffer, 0, dataBuffer.length, fileSize - sizeBuffer.length - dataBuffer.length);
    await (0, _fsExtra().close)(fd);
    return readBlockMap(dataBuffer);
  } catch (e) {
    await (0, _fsExtra().close)(fd);
    throw e;
  }
} 
// __ts-babel@6.0.4
//# sourceMappingURL=FileWithEmbeddedBlockMapDifferentialDownloader.js.map
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAppCacheDir = getAppCacheDir;

var path = _interopRequireWildcard(require("path"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function getAppCacheDir() {
  const homedir = require("os").homedir(); // https://github.com/electron/electron/issues/1404#issuecomment-194391247


  let result;

  if (process.platform === "win32") {
    result = process.env.LOCALAPPDATA || path.join(homedir, "AppData", "Local");
  } else if (process.platform === "darwin") {
    result = path.join(homedir, "Library", "Application Support", "Caches");
  } else {
    result = process.env.XDG_CACHE_HOME || path.join(homedir, ".cache");
  }

  return result;
} 
// __ts-babel@6.0.4
//# sourceMappingURL=AppAdapter.js.map
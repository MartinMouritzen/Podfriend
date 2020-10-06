"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ElectronAppAdapter = void 0;

var path = _interopRequireWildcard(require("path"));

function _AppAdapter() {
  const data = require("./AppAdapter");

  _AppAdapter = function () {
    return data;
  };

  return data;
}

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class ElectronAppAdapter {
  constructor(app = require("electron").app) {
    this.app = app;
  }

  whenReady() {
    return this.app.whenReady();
  }

  get version() {
    return this.app.getVersion();
  }

  get name() {
    return this.app.getName();
  }

  get isPackaged() {
    return this.app.isPackaged === true;
  }

  get appUpdateConfigPath() {
    return this.isPackaged ? path.join(process.resourcesPath, "app-update.yml") : path.join(this.app.getAppPath(), "dev-app-update.yml");
  }

  get userDataPath() {
    return this.app.getPath("userData");
  }

  get baseCachePath() {
    return (0, _AppAdapter().getAppCacheDir)();
  }

  quit() {
    this.app.quit();
  }

  onQuit(handler) {
    this.app.once("quit", (_, exitCode) => handler(exitCode));
  }

} exports.ElectronAppAdapter = ElectronAppAdapter;
// __ts-babel@6.0.4
//# sourceMappingURL=ElectronAppAdapter.js.map
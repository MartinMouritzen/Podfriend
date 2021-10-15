# Changelog
All notable changes to this project will be documented in this file.

## [1.2.1] - 2021-02-08
### Fixed
- Replaced call to `valueForHTTPHeaderField` by `allHeaderFields objectForKey:` to allow usage with iOS 12 (and under), fixes [#12](https://github.com/Raphcal/cordova-plugin-cors/issues/12).

## [1.2.0] - 2021-01-05
### Added
- Added support for `arraybuffer` response type.

### Fixed
- Fixed crash when `responseText` contains binary data, closes [#9](https://github.com/Raphcal/cordova-plugin-cors/issues/9).

## [1.1.3] - 2020-11-29
### Added
- Added support for non string header types.

## [1.1.2] - 2020-11-27
### Fixed
- Using `onload` and `onerror` method instead of `addEventListener` to support incomplete `FileReader` implementation, closes [#5](https://github.com/Raphcal/cordova-plugin-cors/issues/5).
- Added `isFile` method to verify if `FormDataEntryValue` is a `File` instead of using `instanceof` to support custom `File` implementation, closes [#5](https://github.com/Raphcal/cordova-plugin-cors/issues/5).

### Changed
- `toBase64` method is now static.

## [1.1.1] - 2020-10-08
### Added
- `User-Agent` HTTP header is now set by default to Cordova user agent, closes [#4](https://github.com/Raphcal/cordova-plugin-cors/issues/4).

### Changed
- Removed the compiled version of `xhr.ts` from the repository. Build is now done before publishing a new version.

## [1.1.0] - 2020-09-30
### Added
- Added support for `FormData` request body, closes [#2](https://github.com/Raphcal/cordova-plugin-cors/issues/2).
- Added an Xcode project and CordovaLib headers to have better code completion when working on Objective-C files.

## [1.0.6] - 2020-09-03
### Changed
- Properly divided `XMLHttpRequestEventTarget` and `XMLHttpRequest` responsabilities between `XHREventTarget` and `XHR`.

## [1.0.5] - 2020-09-02
### Fixed
- Added a simple implementation of `XMLHttpRequestEventTarget` to fix a compatibility issue with Angular 10.

### Changed
- Using `readystate` values from `XMLHttpRequest` instead of `this`.

## [1.0.4] - 2019-11-25
### Fixed
- Fixed `Zone is undefined` error for projects not using Zone.js, closes [#1](https://github.com/Raphcal/cordova-plugin-cors/issues/1).
- Added missing readystate constants (UNSENT, OPENED, HEADERS_RECEIVED, LOADING, DONE) on XHR object.

## [1.0.3] - 2019-10-08
### Fixed
- Removed error thrown when giving a `false` value to the `async` param of `open()` to avoid regressions.

## [1.0.2] - 2019-10-08
### Added
- Throwing an error when `async` parameter of `open()` is `false`.

### Fixed
- Fixed crash when accessing headers through `getResponseHeader()` method.

## [1.0.1] - 2017-12-01
### Added
- POST data support.

## [1.0.0] - 2017-07-10
Initial version

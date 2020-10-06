"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var decaySchedule = [1000, // After 1 seconds
1000 * 5, // After 5 seconds
1000 * 15, // After 15 seconds
1000 * 30, // After 30 seconds
1000 * 60, // After 1 minute
1000 * 60 * 3, // After 3 minutes
1000 * 60 * 5, // After 5 minutes
1000 * 60 * 10, // After 10 minutes
1000 * 60 * 30, // After 30 minutes
1000 * 60 * 60 // After 1 hour
];

var _default = function _default(action, retries) {
  return decaySchedule[retries] || null;
};

exports.default = _default;
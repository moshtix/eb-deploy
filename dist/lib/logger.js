"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* eslint no-console: 0 */

var root = {
  logError: function logError(params) {
    return root.log({ message: "Error: " + params.error.stack });
  },
  logWarning: function logWarning(params) {
    return root.log({ message: "Warning: " + params.message });
  },
  logDebug: function logDebug(params) {
    return root.log({ message: "Debug: " + params.message });
  },
  logInfo: function logInfo(params) {
    return root.log({ message: "Info: " + params.message });
  },
  log: function log(params) {
    return new Promise(function (resolve) {
      console.log(params.message);
      resolve();
    });
  }
};

exports.default = root;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _helperLogger = require('@moshtix/helper-logger');

var _helperLogger2 = _interopRequireDefault(_helperLogger);

var _gitRev = require('git-rev');

var _gitRev2 = _interopRequireDefault(_gitRev);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getGitTag = function getGitTag() {
  return new Promise(function (resolve) {
    _gitRev2.default.tag(function (tagStr) {
      resolve(tagStr);
    });
  });
};

var createArchive = function createArchive(branch, version, type) {
  var exec = _child_process2.default.exec;

  return new Promise(function (resolve, reject) {
    _helperLogger2.default.logDebug({ message: 'Creating project archive @ from branch ' + branch + ' ' + _path2.default.join(process.cwd(), 'release.' + version + '.zip') });

    exec('rm release.zip', function (err) {
      if (err) {
        _helperLogger2.default.logDebug({ message: err });
      } else {
        _helperLogger2.default.logDebug({ message: 'removed existing zip file' });
      }
    });

    if (type === 'git') {
      var fileName = '' + _path2.default.join(process.cwd(), 'release.zip');
      exec('git archive -o ' + fileName + ' ' + branch, function (err) {
        if (err) {
          _helperLogger2.default.logDebug({ message: err });
          reject(err);
        }
        _helperLogger2.default.logDebug({ message: 'Zip created' + fileName });
        resolve();
      });
    }
  });
};

var root = {
  getGitTag: getGitTag,
  createArchive: createArchive
};

exports.default = root;
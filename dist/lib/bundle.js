'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _helperLogger = require('@moshtix/helper-logger');

var _helperLogger2 = _interopRequireDefault(_helperLogger);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _package = require('../../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var run = function run(params) {
  var args = params.args,
      branch = params.branch;

  _helperLogger2.default.logDebug({ message: 'package bundler run ' + JSON.stringify(args.type) });

  var project = {
    name: args.applicationName || process.env.npm_package_name || 'my-app'
  };

  return new Promise(function (resolve, reject) {
    _utils2.default.getGitTag(branch).then(function (tag) {
      project.version = args.packageVersionOrigin === 'package.json' ? _package2.default.version : tag;
      _helperLogger2.default.logDebug({ message: 'Project version @' + project.version });
      return _utils2.default.createArchive(args.branch, project.version, 'git');
    }).then(function () {
      _helperLogger2.default.logDebug({ message: 'Successfully packaged ' + project.name + ' (' + project.version + ') to EB' });
      resolve();
    }).fail(function (error) {
      _helperLogger2.default.logDebug({ message: error });
      reject(error);
      process.exit(1);
    });
  });
};

var root = {
  run: run
};

exports.default = root;
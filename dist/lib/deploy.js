'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _elasticBeanstalk = require('elastic-beanstalk.js');

var _elasticBeanstalk2 = _interopRequireDefault(_elasticBeanstalk);

var _helperLogger = require('@moshtix/helper-logger');

var _helperLogger2 = _interopRequireDefault(_helperLogger);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var run = function run(params) {
  var args = params.args;


  var project = {
    name: args.applicationName || process.env.npm_package_name || 'my-app'
  };

  return new Promise(function (resolve, reject) {
    var elasticBeanstalk = new _elasticBeanstalk2.default({
      aws: {
        accessKeyId: _commander2.default.accessKeyId,
        secretAccessKey: _commander2.default.secretAccessKey,
        region: _commander2.default.region,
        applicationName: _commander2.default.applicationName || 'my-app',
        versionsBucket: _commander2.default.bucketName
      }
    });

    var zipFile = 'release.zip';

    _helperLogger2.default.logDebug({ message: 'Uploading file ' + zipFile });
    _utils2.default.getGitTag().then(function (tag) {
      elasticBeanstalk.createVersionAndDeploy({
        environment: _commander2.default.environment,
        filename: zipFile,
        remoteFilename: zipFile,
        versionLabel: tag
      }).then(function () {
        _helperLogger2.default.logDebug({ message: 'Successfully deployed ' + project.name + ' (' + project.version + ') to EB' });
        resolve();
      }).fail(function (error) {
        _helperLogger2.default.logDebug({ message: JSON.stringify(error) });
        reject(error);
        process.exit(1);
      });
    });
  });
};

var root = {
  run: run
};

exports.default = root;
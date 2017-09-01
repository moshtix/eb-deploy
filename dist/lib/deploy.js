'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _elasticBeanstalk = require('elastic-beanstalk.js');

var _elasticBeanstalk2 = _interopRequireDefault(_elasticBeanstalk);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var run = function run() {
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

    _utils2.default.getGitTag().then(function (tag) {
      elasticBeanstalk.createVersionAndDeploy({
        environment: _commander2.default.environment,
        filename: zipFile,
        remoteFilename: zipFile,
        versionLabel: tag
      }).then(function () {
        resolve();
      }).fail(function (error) {
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
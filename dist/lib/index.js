'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _bundle = require('./bundle');

var _bundle2 = _interopRequireDefault(_bundle);

var _deploy = require('./deploy');

var _deploy2 = _interopRequireDefault(_deploy);

var _package = require('../../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.version(_package2.default.version).option('-a, --accessKeyId <key>', 'Set AWS Access Key').option('-s, --secretAccessKey <key>', 'Set AWS Secret Access Key').option('-r, --region <region>', 'Set AWS Region [eu-west-1]', 'eu-west-1').option('-A, --applicationName <name>', 'The name of your Elastic Beanstalk Application').option('-e, --environment <name>', 'Which environment should this application be deployed to?').option('-b, --bucketName <name>', 'The name of the *existing* S3 bucket to store your version').option('-B, --branch <name>', 'The branch that should be used to generate the archive [master]', 'master').option('-m, --mode <mode>', 'package, deploy or all [all]', 'all').parse(process.argv);

if (!_commander2.default.accessKeyId) {
  _logger2.default.logDebug({ message: 'AWS Access Key must be set!' });
  process.exit(1);
}

if (!_commander2.default.secretAccessKey) {
  _logger2.default.logDebug({ message: 'AWS Secret Access Key must be set!' });
  process.exit(1);
}

if (!_commander2.default.applicationName) {
  _logger2.default.logDebug({ message: 'Application name must be set!' });
  process.exit(1);
}

if (!_commander2.default.environment) {
  _logger2.default.logDebug({ message: 'EB Environment must be set!' });
  process.exit(1);
}

if (!_commander2.default.bucketName) {
  _logger2.default.logDebug({ message: 'EB Bucket Name must be set!' });
  process.exit(1);
}

var bundlePromise = new Promise(function (resolve) {
  resolve();
});
var packagePromise = new Promise(function (resolve) {
  resolve();
});
if (_commander2.default.mode === 'package' || _commander2.default.mode === 'all') {
  bundlePromise = _bundle2.default.run({ args: _commander2.default });
}
if (_commander2.default.mode === 'deploy' || _commander2.default.mode === 'all') {
  packagePromise = _deploy2.default.run({ args: _commander2.default });
}

bundlePromise.then(function () {
  packagePromise.then(function () {
    _logger2.default.logDebug({ message: 'Complete' });
  });
});
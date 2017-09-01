import logger from '@moshtix/helper-logger';
import ebArgs from 'commander';
import bundle from './bundle';
import deploy from './deploy';
import jsonPackage from '../../package.json';

ebArgs
  .version(jsonPackage.version)
  .option('-a, --accessKeyId <key>', 'Set AWS Access Key')
  .option('-s, --secretAccessKey <key>', 'Set AWS Secret Access Key')
  .option('-r, --region <region>', 'Set AWS Region [eu-west-1]', 'eu-west-1')
  .option('-A, --applicationName <name>', 'The name of your Elastic Beanstalk Application')
  .option('-e, --environment <name>', 'Which environment should this application be deployed to?')
  .option('-b, --bucketName <name>', 'The name of the *existing* S3 bucket to store your version')
  .option('-B, --branch <name>', 'The branch that should be used to generate the archive [master]', 'master')
  .option('-m, --mode <mode>', 'package, deploy or all [all]', 'all')
  .parse(process.argv);

if (!ebArgs.accessKeyId) {
  logger.logDebug({ message: 'AWS Access Key must be set!' });
  process.exit(1);
}

if (!ebArgs.secretAccessKey) {
  logger.logDebug({ message: 'AWS Secret Access Key must be set!' });
  process.exit(1);
}

if (!ebArgs.applicationName) {
  logger.logDebug({ message: 'Application name must be set!' });
  process.exit(1);
}

if (!ebArgs.environment) {
  logger.logDebug({ message: 'EB Environment must be set!' });
  process.exit(1);
}

if (!ebArgs.bucketName) {
  logger.logDebug({ message: 'EB Bucket Name must be set!' });
  process.exit(1);
}

let bundlePromise = new Promise((resolve) => { resolve(); });
let packagePromise = new Promise((resolve) => { resolve(); });
if (ebArgs.mode === 'package' || ebArgs.mode === 'all') {
  bundlePromise = bundle.run({ args: ebArgs });
}
if (ebArgs.mode === 'deploy' || ebArgs.mode === 'all') {
  packagePromise = deploy.run({ args: ebArgs });
}

bundlePromise.then(() => {
  packagePromise.then(() => {
    logger.logDebug({ message: 'Complete' });
  });
});

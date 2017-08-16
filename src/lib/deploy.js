import ebArgs from 'commander';
import ElasticBeanstalk from 'elastic-beanstalk.js';
import logger from '@moshtix/helper-logger';
import utils from './utils';

const run = (params) => {
  const { args } = params;

  const project = {
    name: (args.applicationName || process.env.npm_package_name || 'my-app'),
  };

  return new Promise((resolve, reject) => {
    const elasticBeanstalk = new ElasticBeanstalk({
      aws: {
        accessKeyId: ebArgs.accessKeyId,
        secretAccessKey: ebArgs.secretAccessKey,
        region: ebArgs.region,
        applicationName: ebArgs.applicationName || 'my-app',
        versionsBucket: ebArgs.bucketName,
      },
    });

    const zipFile = 'release.zip';

    logger.logDebug({ message: `Uploading file ${zipFile}` });
    utils.getGitTag().then((tag) => {
      elasticBeanstalk.createVersionAndDeploy({
        environment: ebArgs.environment,
        filename: zipFile,
        remoteFilename: zipFile,
        versionLabel: tag,
      }).then(() => {
        logger.logDebug({ message: `Successfully deployed ${project.name} (${project.version}) to EB` });
        resolve();
      }).fail((error) => {
        logger.logDebug({ message: JSON.stringify(error) });
        reject(error);
        process.exit(1);
      });
    });
  });
};

const root = {
  run,
};

export default root;


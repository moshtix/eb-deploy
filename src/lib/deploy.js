import ebArgs from 'commander';
import ElasticBeanstalk from 'elastic-beanstalk.js';
import utils from './utils';

const run = () => new Promise((resolve, reject) => {
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

  utils.getGitTag().then((tag) => {
    elasticBeanstalk.createVersionAndDeploy({
      environment: ebArgs.environment,
      filename: zipFile,
      remoteFilename: zipFile,
      versionLabel: tag,
    }).then(() => {
      resolve();
    }).fail((error) => {
      reject(error);
      process.exit(1);
    });
  });
});

const root = {
  run,
};

export default root;

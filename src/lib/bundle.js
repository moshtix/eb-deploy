import logger from '@moshtix/helper-logger';
import utils from './utils';
import jsonPackage from '../../package.json';

const run = (params) => {
  const { args, branch } = params;
  logger.logDebug({ message: `package bundler run ${JSON.stringify(args.type)}` });

  const project = {
    name: (args.applicationName || process.env.npm_package_name || 'my-app'),
  };

  return new Promise((resolve, reject) => {
    utils.getGitTag(branch)
        .then((tag) => {
          project.version = (args.packageVersionOrigin === 'package.json' ? jsonPackage.version : tag);
          logger.logDebug({ message: `Project version @${project.version}` });
          return utils.createArchive(args.branch, project.version, 'git');
        })
        .then(() => {
          logger.logDebug({ message: `Successfully packaged ${project.name} (${project.version}) to EB` });
          resolve();
        })
        .fail((error) => {
          logger.logDebug({ message: error });
          reject(error);
          process.exit(1);
        });
  });
};

const root = {
  run,
};

export default root;

import logger from '@moshtix/helper-logger';
import gitRev from 'git-rev';
import childProcess from 'child_process';
import path from 'path';

const getGitTag = () => new Promise((resolve) => {
  gitRev.tag((tagStr) => {
    resolve(tagStr);
  });
});

const createArchive = (branch, version, type) => {
  const exec = childProcess.exec;

  return new Promise((resolve, reject) => {
    logger.logDebug({ message: `Creating project archive @ from branch ${branch} ${path.join(process.cwd(), `release.${version}.zip`)}` });

    exec('rm release.zip', (err) => {
      if (err) {
        logger.logDebug({ message: err });
      } else {
        logger.logDebug({ message: 'removed existing zip file' });
      }
    });

    if (type === 'git') {
      const fileName = `${path.join(process.cwd(), 'release.zip')}`;
      exec(`git archive -o ${fileName} ${branch}`, (err) => {
        if (err) {
          logger.logDebug({ message: err });
          reject(err);
        }
        logger.logDebug({ message: `Zip created${fileName}` });
        resolve();
      });
    }
  });
};

const root = {
  getGitTag,
  createArchive,
};

export default root;

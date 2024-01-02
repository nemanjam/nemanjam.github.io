const execSync = require('child_process').execSync;
const resolve = require('path').resolve;

// __dirname - folder of current js file (this file)
const currentDir = resolve(__dirname);

// this way project root dir is related to folder structure
const projectRootDir = resolve(`${__dirname}/../..`);

// run per package, in current dir .
module.exports = () => {
  execSync(
    `${projectRootDir}/node_modules/.bin/prettier --config ${currentDir}/.prettierrc.js -w --ignore-path ${currentDir}/.prettierignore . --cache`,
    {
      stdio: 'inherit',
    }
  );
};

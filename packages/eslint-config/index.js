const execSync = require('child_process').execSync;
const resolve = require('path').resolve;
const existsSync = require('fs').existsSync;

const currentDir = resolve(__dirname);
const projectRootDir = resolve(`${__dirname}/../..`);
const eslintConfigPath = `${process.cwd()}/.eslintrc.js`;

if (!existsSync(eslintConfigPath)) {
  console.error(`.eslintrc.js expected but not found on path: ${eslintConfigPath}`);
  process.exit(1);
}

module.exports = () => {
  execSync(
    `${projectRootDir}/node_modules/.bin/eslint --config ${eslintConfigPath} --ignore-path ${currentDir}/.eslintignore .`,
    {
      stdio: 'inherit',
    }
  );
};

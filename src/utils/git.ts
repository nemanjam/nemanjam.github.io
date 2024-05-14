import { execSync } from 'child_process';

export interface GitResult {
  time: string;
  hash: string;
  message: string;
}

export const getLatestCommitInfo = (): GitResult => {
  const separator = '___';
  const command = `git log -1 --pretty=format:"%ad${separator}%h${separator}%s" --date=format:'%Y-%m-%d %H:%M:%S'`;
  const output = execSync(command).toString().trim().split(separator);

  if (output.length !== 3) {
    throw new Error('Could not parse the latest Git commit output.');
  }

  const result = {
    time: output[0],
    hash: output[1],
    message: output[2],
  };

  return result;
};

export const getLatestCommitInfoAsString = (): string => {
  const commitInfo = getLatestCommitInfo();

  const commitInfoString = Object.entries(commitInfo)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');

  return commitInfoString;
};

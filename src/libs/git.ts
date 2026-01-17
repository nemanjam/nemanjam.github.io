import { execSync } from 'child_process';

import { BLANK_GIT_RESULT } from '@/constants/git';
import { CONFIG_CLIENT } from '@/config/client';

import type { GitResult } from '@/types/git';

const { REPO_URL } = CONFIG_CLIENT;

/** Cached result, once per build process. */
let _cachedCommitInfo: GitResult | null = null;

/**
 * Runs ONLY once per BUILD.
 * Cache it to prevent GitHub api rate limit.
 * Otherwise it would run once per each page.
 */
export const getLatestCommitInfo = async (): Promise<GitResult> => {
  // return even cached blank result
  if (_cachedCommitInfo) return _cachedCommitInfo;

  let commitInfo: GitResult = BLANK_GIT_RESULT;

  try {
    // local Git
    commitInfo = getLatestCommitInfoLocal();
  } catch (localError: unknown) {
    console.error('Failed to get local Git commit info:', localError);
    console.log('Retrying with GitHub...');

    try {
      // Github fallback
      commitInfo = await getLatestCommitInfoGitHub();
      console.log('Github commit info: ', commitInfo);
    } catch (githubError: unknown) {
      console.error('Failed to get GitHub commit info:', githubError);
      console.log('Fallback to blank commit info.');
    }
  }

  // cache for future calls
  _cachedCommitInfo = commitInfo;

  return commitInfo;
};

export const getLatestCommitInfoLocal = (): GitResult => {
  const separator = '___';
  const command = `git log -1 --pretty=format:"%ad${separator}%h${separator}%H${separator}%s" --date=format:'%Y-%m-%d %H:%M:%S'`;
  const output = execSync(command).toString().trim().split(separator);

  if (output.length !== 4) {
    throw new Error('Could not parse the latest Git commit output.');
  }

  const result = {
    time: output[0],
    shortHash: output[1],
    fullHash: output[2],
    message: output[3],
  };

  return result;
};

/**
 * Used only as a fallback for local Git.
 * Needed for vercel.
 * main branch only
 */
export const getLatestCommitInfoGitHub = async (): Promise<GitResult> => {
  const repoPath = REPO_URL.replace(/^https:\/\/github\.com\//, '');
  const apiUrl = `https://api.github.com/repos/${repoPath}/commits/main`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`GitHub API request failed: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    time: data.commit.author.date,
    shortHash: data.sha.slice(0, 7),
    fullHash: data.sha,
    message: data.commit.message,
  };
};

// unused directly
export const getLatestCommitInfoAsString = (): string => {
  const commitInfo = getLatestCommitInfo();

  const commitInfoString = Object.entries(commitInfo)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');

  return commitInfoString;
};

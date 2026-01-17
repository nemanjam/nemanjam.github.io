import type { GitResult } from '@/types/git';

export const BLANK_GIT_RESULT: GitResult = {
  time: new Date().toString(),
  shortHash: 'unknown',
  fullHash: 'unknown',
  message: 'unknown',
};

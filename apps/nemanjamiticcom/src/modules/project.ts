import { COLLECTIONS } from '../constants/collections';
import { getAllEntries } from './common';

/*-------------------------------- getAllProjects ------------------------------*/

export const getAllProjects = () => getAllEntries(COLLECTIONS.PROJECT);

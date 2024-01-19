import dotenv from 'dotenv';

// todo: write zod validation for env vars
const envFileName = `.env.${process.env.NODE_ENV}`;
dotenv.config({ path: envFileName });

const Config = {
  SITE_URL: process.env.SITE_URL,
  SITE_TITLE: 'John Doe',
  SITE_DESCRIPTION: 'I am John Doe, eat at Joe',
  PAGE_SIZE: 2,
  AUTHOR_NAME: 'Nemanja Mitic',
  AUTHOR_EMAIL: 'email@email.com',
  // github, linkedin...
};

export default Config;

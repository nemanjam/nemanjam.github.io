import dotenv from 'dotenv';
import { z } from 'zod';

/*------------------ load correct .env file -----------------*/

const nodeEnvValues = ['development', 'test', 'production'] as const;
const NODE_ENV = process.env.NODE_ENV;

if (!nodeEnvValues.includes(NODE_ENV)) {
  console.error('Invalid process.env.NODE_ENV: ', NODE_ENV);
  throw new Error('Invalid process.env.NODE_ENV');
}

const envFileName = `.env.${NODE_ENV}`;
dotenv.config({ path: envFileName });

/*------------------ load and validate config -----------------*/

const configSchema = z.object({
  NODE_ENV: z.enum(nodeEnvValues),
  SITE_URL: z.string().url(),
  SITE_TITLE: z.string().min(1),
  SITE_DESCRIPTION: z.string().min(1),
  PAGE_SIZE: z.number(),
  AUTHOR_NAME: z.string().min(1),
  AUTHOR_EMAIL: z.string().email(),
});

type ConfigSchemaType = typeof configSchema;
export type ConfigType = z.infer<ConfigSchemaType>;

const config: ConfigType = {
  NODE_ENV: process.env.NODE_ENV,
  SITE_URL: process.env.SITE_URL,
  SITE_TITLE: 'John Doe',
  SITE_DESCRIPTION: 'I am John Doe, eat at Joe',
  PAGE_SIZE: 2,
  AUTHOR_NAME: 'Nemanja Mitic',
  AUTHOR_EMAIL: 'email@email.com',
  // github, linkedin...
};

const validateConfig = (
  config: ConfigType,
  schema: ConfigSchemaType,
  isDebug = true
): ConfigType => {
  const parsedConfig = schema.safeParse(config);

  if (!parsedConfig.success) {
    console.error('Invalid config: ', parsedConfig.error.flatten().fieldErrors);
    throw new Error('Invalid config');
  }

  const { data: parsedConfigData } = parsedConfig;

  if (isDebug) {
    const stringData = JSON.stringify(parsedConfigData, null, 2).replace(/[{}\t ]/g, '');
    console.log('parsedConfigData: ', stringData);
  }

  return parsedConfigData;
};

const validatedConfig = validateConfig(config, configSchema);

// todo: Config should go into import.meta.env in astro.config.ts

export default validatedConfig;

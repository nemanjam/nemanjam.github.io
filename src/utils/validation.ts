import { z, ZodSchema } from 'zod';

export const validateData = <T extends ZodSchema>(config: z.infer<T>, schema: T): z.infer<T> => {
  const parsedConfig = schema.safeParse(config);

  if (!parsedConfig.success) {
    console.error('Validation failed: ', parsedConfig.error.flatten().fieldErrors);
    throw new Error('Validation failed');
  }

  const { data: parsedConfigData } = parsedConfig;

  return parsedConfigData;
};

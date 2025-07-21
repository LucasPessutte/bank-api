import { z } from 'zod';

/**
 * Schema for validating environment variables.
 *
 * @remarks
 * This schema uses Zod for validation and transformation of environment variables.
 */
export const envSchema = z.object({
  PORT: z.coerce.number().min(1).max(65_535).default(3000),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  // CORS_ORIGIN: z.string(),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(8),
  ADMIN_KEY: z.string(),
  JWT_EXPIRES_IN: z.coerce.number().min(60).default(3600),
});

export type EnvVars = z.infer<typeof envSchema>;

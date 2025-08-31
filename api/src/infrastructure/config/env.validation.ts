import { z } from 'zod';

export const envSchema = z.object({
  // Application
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z
    .string()
    .transform(val => parseInt(val, 10))
    .refine(val => val > 0 && val < 65536, {
      message: 'PORT must be a valid port number (1-65535)',
    })
    .default('3001'),

  // Database
  DATABASE_URL: z
    .string()
    .url()
    .refine(url => url.startsWith('postgresql://'), {
      message: 'DATABASE_URL must be a valid PostgreSQL connection string',
    }),
  DATABASE_HOST: z.string().min(1, 'DATABASE_HOST is required'),
  DATABASE_PORT: z
    .string()
    .transform(val => parseInt(val, 10))
    .refine(val => val > 0 && val < 65536, {
      message: 'DATABASE_PORT must be a valid port number',
    })
    .default('5432'),
  DATABASE_NAME: z.string().min(1, 'DATABASE_NAME is required'),
  DATABASE_USER: z.string().min(1, 'DATABASE_USER is required'),
  DATABASE_PASSWORD: z.string().min(1, 'DATABASE_PASSWORD is required'),

  // CORS
  WEB_ORIGIN: z
    .string()
    .url()
    .refine(url => url.startsWith('http'), {
      message: 'WEB_ORIGIN must be a valid HTTP/HTTPS URL',
    })
    .default('http://localhost:3000'),
  
  // Legacy support for CORS_ORIGIN (fallback)
  CORS_ORIGIN: z.string().optional(),

  // Security
  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET must be at least 32 characters long'),
  JWT_EXPIRES_IN: z.string().default('7d'),

  // Logging
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
    .default('info'),
  LOG_PRETTY: z
    .string()
    .transform(val => val === 'true')
    .default('true'),

  // API Documentation
  SWAGGER_PATH: z.string().default('api/docs'),
  SWAGGER_TITLE: z.string().default('Acueducto API'),
  SWAGGER_DESCRIPTION: z
    .string()
    .default('API documentation for Acueducto application'),
  SWAGGER_VERSION: z.string().default('1.0.0'),

  // Rate limiting
  THROTTLE_TTL: z
    .string()
    .transform(val => parseInt(val, 10))
    .default('60'),
  THROTTLE_LIMIT: z
    .string()
    .transform(val => parseInt(val, 10))
    .default('10'),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnvironment(config: Record<string, unknown>): EnvConfig {
  try {
    const validated = envSchema.parse(config);
    
    // Handle WEB_ORIGIN fallback to CORS_ORIGIN for backward compatibility
    if (!validated.WEB_ORIGIN && validated.CORS_ORIGIN) {
      validated.WEB_ORIGIN = validated.CORS_ORIGIN;
    }
    
    return validated;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(
        err => `${err.path.join('.')}: ${err.message}`,
      );
      throw new Error(
        `Environment validation failed:\n${errorMessages.join('\n')}`,
      );
    }
    throw error;
  }
}
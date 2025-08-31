import { Params } from 'nestjs-pino';
import { EnvConfig } from './env.validation';

export function createLoggerConfig(config: EnvConfig): Params {
  const isProduction = config.NODE_ENV === 'production';
  const isDevelopment = config.NODE_ENV === 'development';

  return {
    pinoHttp: {
      level: config.LOG_LEVEL,
      
      // Pretty print in development, structured JSON in production
      ...(isDevelopment && config.LOG_PRETTY ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: true,
            ignore: 'pid,hostname',
            messageFormat: '[{context}] {msg}',
            errorLikeObjectKeys: ['err', 'error'],
          },
        },
      } : {}),

      // Custom serializers
      serializers: {
        req: (req: any) => ({
          id: req.id,
          method: req.method,
          url: req.url,
          remoteAddress: req.socket?.remoteAddress,
          remotePort: req.socket?.remotePort,
          userAgent: req.headers?.['user-agent'],
        }),
        res: (res: any) => ({
          statusCode: res.statusCode,
          responseTime: res.responseTime,
        }),
        err: (err: any) => err,
      },

      // Custom log level based on status code
      customLogLevel: (req: any, res: any, err?: Error) => {
        if (err) return 'error';
        if (res.statusCode >= 400) return 'warn';
        if (res.statusCode >= 300) return 'info';
        return 'info';
      },

      // Enable auto-logging
      autoLogging: true,

      // Custom success/error messages
      customSuccessMessage: (req: any, res: any) => {
        return `${req.method} ${req.url} - ${res.statusCode}`;
      },
      customErrorMessage: (req: any, res: any, err: Error) => {
        return `${req.method} ${req.url} - ${res.statusCode} - ${err.message}`;
      },

      // Additional base configuration
      base: {
        pid: false, // Don't log process ID
        hostname: isProduction, // Log hostname only in production
      },

      // Request ID generation
      genReqId: (req: any) => req.headers['x-request-id'] || 
        Math.random().toString(36).substring(2, 15),

      // Redact sensitive information
      redact: [
        'req.headers.authorization',
        'req.headers.cookie',
        'req.body.password',
        'req.body.token',
        'res.headers["set-cookie"]',
      ],
    },
  };
}
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = Number(process.env.PORT ?? 3001);

  // CORS configuration - allow all in development
  const isDevelopment = process.env.NODE_ENV !== 'production';

  app.enableCors({
    origin: isDevelopment
      ? true
      : [
          /^http:\/\/localhost:\d+$/,
          /^https:\/\/localhost:\d+$/,
          /^http:\/\/127\.0\.0\.1:\d+$/,
          /^https:\/\/127\.0\.0\.1:\d+$/,
        ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers',
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    preflightContinue: false,
  });

  const prefix = process.env.API_PREFIX?.trim();
  if (prefix) {
    app.setGlobalPrefix(prefix);
  }

  app.set('trust proxy', true);
  await app.listen(port, '0.0.0.0');
}
bootstrap();

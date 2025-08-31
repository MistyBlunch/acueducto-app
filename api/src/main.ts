import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { RequestMethod } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = Number(process.env.PORT ?? 3001);

  const prefix = process.env.API_PREFIX?.trim();
  if (prefix) {
    app.setGlobalPrefix(prefix, {
      exclude: [{ path: 'health', method: RequestMethod.GET }],
    });
  }

  app.set('trust proxy', true);
  await app.listen(port, '0.0.0.0');
}
bootstrap();
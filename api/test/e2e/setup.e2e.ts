// Set test environment variables before importing modules
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.LOG_LEVEL = 'warn';
process.env.LOG_PRETTY = 'false';
process.env.PORT = '3001';
process.env.WEB_ORIGIN = 'http://localhost:3000';
process.env.JWT_SECRET = 'test-secret-key-for-testing-only-very-long-string';

import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { setupTestDatabase, cleanupTestDatabase, getTestPrismaClient } from '../helpers/test-database';
import { PrismaService } from '../../src/infrastructure/database/prisma.service';
import { AppModule } from '../../src/app.module';
import { HttpExceptionFilter } from '../../src/infrastructure/http/filters/http-exception.filter';

let app: INestApplication;

export async function setupE2EApp(): Promise<INestApplication> {
  // Setup test database
  const testPrismaClient = await setupTestDatabase();

  // Create testing module
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(ConfigService)
    .useValue({
      get: jest.fn((key: string) => {
        const config: Record<string, any> = {
          NODE_ENV: 'test',
          DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
          PORT: 3001,
          WEB_ORIGIN: 'http://localhost:3000',
          LOG_LEVEL: 'warn',
          LOG_PRETTY: false,
          JWT_SECRET: 'test-secret-key-for-testing-only-very-long-string',
          SWAGGER_PATH: 'api/docs',
          SWAGGER_TITLE: 'Test API',
          SWAGGER_DESCRIPTION: 'Test API',
          SWAGGER_VERSION: '1.0.0',
        };
        return config[key];
      }),
    })
    .overrideProvider(PrismaService)
    .useValue(testPrismaClient)
    .compile();

  app = moduleFixture.createNestApplication();

  // Configure app similar to main.ts but for testing
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Enable CORS for tests
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  });

  await app.init();
  return app;
}

export async function cleanupE2EApp(): Promise<void> {
  await cleanupTestDatabase();
}

export function getE2EApp(): INestApplication {
  return app;
}

// Global setup for each test
beforeEach(async () => {
  await cleanupTestDatabase();
});
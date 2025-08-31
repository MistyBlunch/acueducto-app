import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { ProductsModule } from './products/products.module';
import { validateEnvironment, EnvConfig } from './infrastructure/config/env.validation';
import { createLoggerConfig } from './infrastructure/config/logger.config';

@Module({
  imports: [
    // Configuration with validation
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvironment,
      cache: true,
      expandVariables: true,
    }),

    // Logger configuration
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvConfig>) => {
        const config = {
          NODE_ENV: configService.get('NODE_ENV', { infer: true })!,
          LOG_LEVEL: configService.get('LOG_LEVEL', { infer: true })!,
          LOG_PRETTY: configService.get('LOG_PRETTY', { infer: true })!,
        } as EnvConfig;
        
        return createLoggerConfig(config);
      },
    }),

    // Feature modules
    ProductsModule,
  ],
  controllers: [],
})
export class AppModule {}
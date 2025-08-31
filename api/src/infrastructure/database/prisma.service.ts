import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    
    // Enable pg_trgm extension if not already enabled
    await this.$executeRaw`CREATE EXTENSION IF NOT EXISTS pg_trgm;`;
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
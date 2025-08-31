import { PrismaClient } from '@prisma/test-client';
import { execSync } from 'child_process';
import { join } from 'path';

let prismaClient: PrismaClient;

export async function setupTestDatabase(): Promise<PrismaClient> {
  // Generate test client from schema-test.prisma
  execSync('npx prisma generate --schema=prisma/schema-test.prisma', {
    stdio: 'inherit',
  });
  
  // Create new client instance
  prismaClient = new PrismaClient({
    log: process.env.NODE_ENV === 'test-debug' ? ['query', 'info', 'warn', 'error'] : [],
  });

  await prismaClient.$connect();
  
  // Run migrations for SQLite
  await prismaClient.$executeRaw`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      brand TEXT NOT NULL,
      description TEXT NOT NULL,
      priceCents INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'USD',
      stock INTEGER NOT NULL DEFAULT 0,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;

  return prismaClient;
}

export async function cleanupTestDatabase(): Promise<void> {
  if (prismaClient) {
    await prismaClient.$executeRaw`DELETE FROM products`;
  }
}

export async function teardownTestDatabase(): Promise<void> {
  if (prismaClient) {
    await prismaClient.$disconnect();
  }
}

export function getTestPrismaClient(): PrismaClient {
  return prismaClient;
}

// Test data factory
export const testProducts = [
  {
    id: 'test-product-1',
    title: 'Nike Air Max 270',
    brand: 'Nike',
    description: 'Comfortable running shoes with air cushioning technology',
    priceCents: 12999,
    currency: 'USD',
    stock: 25,
  },
  {
    id: 'test-product-2',
    title: 'Adidas Ultraboost',
    brand: 'Adidas',
    description: 'Premium running shoes with Boost technology',
    priceCents: 18000,
    currency: 'USD',
    stock: 15,
  },
  {
    id: 'test-product-3',
    title: 'Converse Chuck Taylor',
    brand: 'Converse',
    description: 'Classic canvas sneakers with timeless design',
    priceCents: 5500,
    currency: 'USD',
    stock: 50,
  },
  {
    id: 'test-product-4',
    title: 'ana', // Palindrome title for testing
    brand: 'TestBrand',
    description: 'Test product with palindrome title',
    priceCents: 10000,
    currency: 'USD',
    stock: 10,
  },
  {
    id: 'test-product-5',
    title: 'oso', // Another palindrome
    brand: 'TestBrand',
    description: 'Another test product with palindrome title',
    priceCents: 8000,
    currency: 'USD',
    stock: 5,
  },
];

export async function seedTestDatabase(): Promise<void> {
  const client = getTestPrismaClient();
  
  for (const product of testProducts) {
    await client.product.create({
      data: product,
    });
  }
}
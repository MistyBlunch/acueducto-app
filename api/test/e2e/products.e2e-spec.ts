import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { setupE2EApp, cleanupE2EApp } from './setup.e2e';
import { seedTestDatabase, testProducts } from '../helpers/test-database';

describe('Products (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await setupE2EApp();
  });

  afterAll(async () => {
    await cleanupE2EApp();
    await app.close();
  });

  beforeEach(async () => {
    await seedTestDatabase();
  });

  describe('GET /products', () => {
    it('should return all products when no query is provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/products')
        .expect(200);

      expect(response.body).toEqual({
        items: expect.any(Array),
        pagination: expect.objectContaining({
          page: 1,
          pageSize: 10,
          total: testProducts.length,
          totalPages: 1,
          hasPreviousPage: false,
          hasNextPage: false,
        }),
        meta: expect.objectContaining({
          query: undefined,
          isPalindrome: false,
          executedAt: expect.any(String),
          executionTimeMs: expect.any(Number),
        }),
      });

      expect(response.body.items).toHaveLength(testProducts.length);
      expect(response.body.items[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          title: expect.any(String),
          brand: expect.any(String),
          description: expect.any(String),
          priceCents: expect.any(Number),
          currency: 'USD',
          stock: expect.any(Number),
          createdAt: expect.any(String),
        }),
      );
    });

    it('should return exact match when query matches title exactly (case insensitive)', async () => {
      const response = await request(app.getHttpServer())
        .get('/products')
        .query({ query: 'nike air max 270' })
        .expect(200);

      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0]).toEqual(
        expect.objectContaining({
          title: 'Nike Air Max 270',
          brand: 'Nike',
          priceCents: 12999,
          finalPriceCents: undefined,
          palindromeDiscountApplied: undefined,
        }),
      );

      expect(response.body.meta).toEqual(
        expect.objectContaining({
          query: 'nike air max 270',
          isPalindrome: false,
        }),
      );
    });

    it('should apply palindrome discount for exact match with palindrome query', async () => {
      const response = await request(app.getHttpServer())
        .get('/products')
        .query({ query: 'ana' })
        .expect(200);

      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0]).toEqual(
        expect.objectContaining({
          title: 'ana',
          priceCents: 10000,
          finalPriceCents: 5000, // 50% discount
          palindromeDiscountApplied: true,
        }),
      );

      expect(response.body.meta).toEqual(
        expect.objectContaining({
          query: 'ana',
          isPalindrome: true,
        }),
      );
    });

    it('should search by brand when query length >= 4 and no exact match', async () => {
      const response = await request(app.getHttpServer())
        .get('/products')
        .query({ query: 'Nike' })
        .expect(200);

      expect(response.body.items.length).toBeGreaterThan(0);
      
      // Should find products with Nike brand
      const nikeProducts = response.body.items.filter(
        (product: any) => product.brand.toLowerCase().includes('nike')
      );
      expect(nikeProducts.length).toBeGreaterThan(0);

      expect(response.body.meta).toEqual(
        expect.objectContaining({
          query: 'Nike',
          isPalindrome: false,
        }),
      );
    });

    it('should search by description when query length >= 4 and no exact match', async () => {
      const response = await request(app.getHttpServer())
        .get('/products')
        .query({ query: 'shoes' })
        .expect(200);

      expect(response.body.items.length).toBeGreaterThan(0);
      
      // Should find products with "shoes" in description
      const shoeProducts = response.body.items.filter(
        (product: any) => product.description.toLowerCase().includes('shoes')
      );
      expect(shoeProducts.length).toBeGreaterThan(0);
    });

    it('should apply palindrome discount to search results when query is palindrome', async () => {
      const response = await request(app.getHttpServer())
        .get('/products')
        .query({ query: 'reconocer' }) // palindrome, but no exact title match
        .expect(200);

      // All results should have palindrome discount applied
      response.body.items.forEach((product: any) => {
        expect(product.finalPriceCents).toBeDefined();
        expect(product.palindromeDiscountApplied).toBe(true);
        expect(product.finalPriceCents).toBe(Math.round(product.priceCents * 0.5));
      });

      expect(response.body.meta.isPalindrome).toBe(true);
    });

    it('should return empty results for short queries (< 4 chars) with no exact match', async () => {
      const response = await request(app.getHttpServer())
        .get('/products')
        .query({ query: 'abc' })
        .expect(200);

      expect(response.body.items).toHaveLength(0);
      expect(response.body.pagination.total).toBe(0);
      expect(response.body.meta.query).toBe('abc');
    });

    it('should handle pagination correctly', async () => {
      const response = await request(app.getHttpServer())
        .get('/products')
        .query({ page: 1, pageSize: 2 })
        .expect(200);

      expect(response.body.items).toHaveLength(2);
      expect(response.body.pagination).toEqual({
        page: 1,
        pageSize: 2,
        total: testProducts.length,
        totalPages: Math.ceil(testProducts.length / 2),
        hasPreviousPage: false,
        hasNextPage: true,
      });
    });

    it('should handle second page pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/products')
        .query({ page: 2, pageSize: 2 })
        .expect(200);

      expect(response.body.pagination).toEqual({
        page: 2,
        pageSize: 2,
        total: testProducts.length,
        totalPages: Math.ceil(testProducts.length / 2),
        hasPreviousPage: true,
        hasNextPage: expect.any(Boolean),
      });
    });

    it('should validate query parameters', async () => {
      const response = await request(app.getHttpServer())
        .get('/products')
        .query({ page: 0 }) // invalid page
        .expect(400);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: 'Validation failed',
          error: 'VALIDATION_ERROR',
        }),
      );
    });

    it('should handle complex palindromes with spaces and punctuation', async () => {
      const response = await request(app.getHttpServer())
        .get('/products')
        .query({ query: 'A man, a plan, a canal: Panama!' })
        .expect(200);

      expect(response.body.meta.isPalindrome).toBe(true);
      
      // All results should have palindrome discount
      response.body.items.forEach((product: any) => {
        if (product.palindromeDiscountApplied) {
          expect(product.finalPriceCents).toBeDefined();
          expect(product.finalPriceCents).toBe(Math.round(product.priceCents * 0.5));
        }
      });
    });

    it('should handle case insensitive palindrome detection in meta', async () => {
      const response = await request(app.getHttpServer())
        .get('/products')
        .query({ query: 'RADAR' })
        .expect(200);

      expect(response.body.meta).toEqual(
        expect.objectContaining({
          query: 'RADAR',
          isPalindrome: true,
        }),
      );
    });

    it('should return proper execution time in meta', async () => {
      const response = await request(app.getHttpServer())
        .get('/products')
        .query({ query: 'test' })
        .expect(200);

      expect(response.body.meta.executionTimeMs).toBeGreaterThan(0);
      expect(response.body.meta.executedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/); // ISO date format
    });

    it('should handle Unicode characters in palindrome detection', async () => {
      const response = await request(app.getHttpServer())
        .get('/products')
        .query({ query: 'ábbá' })
        .expect(200);

      expect(response.body.meta.isPalindrome).toBe(true);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(200);

      expect(response.body).toEqual({
        status: 'ok',
        timestamp: expect.any(String),
        uptime: expect.any(Number),
        version: expect.any(String),
        environment: 'test',
      });
    });
  });
});
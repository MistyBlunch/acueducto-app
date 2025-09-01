import { test as base, expect } from '@playwright/test';

// Extend the base test with MSW setup
export const test = base.extend({
  page: async ({ page }, use) => {
    // Set up MSW before each test
    await page.route('**/products/search*', async route => {
      const url = new URL(route.request().url());
      const query = url.searchParams.get('query') || '';

      // Mock API responses
      const isPalindromeQuery = (str: string): boolean => {
        const normalized = str.toLowerCase().replace(/[^a-z0-9]/g, '');
        return normalized === normalized.split('').reverse().join('');
      };

      const isQueryPalindrome = isPalindromeQuery(query);

      let mockResponse;

      if (query.toLowerCase() === 'oso' || query.toLowerCase() === 'ana') {
        // Palindrome search response
        mockResponse = {
          items: [
            {
              id: '1',
              title: 'Raqueta Wilson Pro Staff',
              brand: 'Wilson',
              description:
                'Raqueta profesional utilizada por los mejores jugadores del mundo.',
              priceCents: 25000,
              finalPriceCents: 12500,
              currency: 'EUR',
              stock: 5,
              createdAt: new Date().toISOString(),
              palindromeDiscountApplied: true,
            },
            {
              id: '2',
              title: 'Pelotas Penn Championship',
              brand: 'Penn',
              description: 'Pack de 3 pelotas oficiales para torneos.',
              priceCents: 800,
              finalPriceCents: 400,
              currency: 'EUR',
              stock: 25,
              createdAt: new Date().toISOString(),
              palindromeDiscountApplied: true,
            },
          ],
          pagination: {
            page: 1,
            pageSize: 10,
            total: 2,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
          },
          meta: {
            query,
            isPalindrome: true,
            executedAt: new Date().toISOString(),
            executionTimeMs: 45,
          },
        };
      } else if (query.toLowerCase() === 'raqueta') {
        // Non-palindrome search response
        mockResponse = {
          items: [
            {
              id: '3',
              title: 'Zapatillas Nike Court',
              brand: 'Nike',
              description: 'Zapatillas de tenis cómodas y duraderas.',
              priceCents: 12000,
              currency: 'EUR',
              stock: 15,
              createdAt: new Date().toISOString(),
            },
          ],
          pagination: {
            page: 1,
            pageSize: 10,
            total: 1,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
          },
          meta: {
            query,
            isPalindrome: false,
            executedAt: new Date().toISOString(),
            executionTimeMs: 32,
          },
        };
      } else if (query.toLowerCase() === 'noexiste') {
        // Empty response
        mockResponse = {
          items: [],
          pagination: {
            page: 1,
            pageSize: 10,
            total: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          },
          meta: {
            query,
            isPalindrome: false,
            executedAt: new Date().toISOString(),
            executionTimeMs: 15,
          },
        };
      } else if (query.toLowerCase() === 'error') {
        // Error response
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            statusCode: 500,
            message: 'Internal server error',
            error: 'Internal Server Error',
            timestamp: new Date().toISOString(),
            path: '/products/search',
          }),
        });
        return;
      } else {
        // Default response
        mockResponse = {
          items: [],
          pagination: {
            page: 1,
            pageSize: 10,
            total: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          },
          meta: {
            query,
            isPalindrome: isQueryPalindrome,
            executedAt: new Date().toISOString(),
            executionTimeMs: 20,
          },
        };
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResponse),
      });
    });

    await use(page);
  },
});

export { expect } from '@playwright/test';

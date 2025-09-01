import { test as base } from '@playwright/test';

// Extend the base test with MSW setup
export const test = base.extend({
  page: async ({ page }, use) => {
    // Set up API mocking before each test
    await page.route('**/products*', async route => {
      const url = new URL(route.request().url());
      const query = url.searchParams.get('query') || '';
      const page_param = parseInt(url.searchParams.get('page') || '1');
      const pageSize = parseInt(url.searchParams.get('pageSize') || '12');

      // Mock API responses
      const isPalindromeQuery = (str: string): boolean => {
        const normalized = str.toLowerCase().replace(/[^a-z0-9]/g, '');
        return normalized === normalized.split('').reverse().join('');
      };

      const isQueryPalindrome = isPalindromeQuery(query);

      // Mock products data
      const palindromeProducts = [
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
      ];

      const regularProducts = [
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
        {
          id: '4',
          title: 'Camiseta Adidas Performance',
          brand: 'Adidas',
          description: 'Camiseta técnica de tenis con tecnología Climalite.',
          priceCents: 4500,
          currency: 'EUR',
          stock: 30,
          createdAt: new Date().toISOString(),
        },
      ];

      let products = [];

      // Determine which products to return based on query
      if (!query || query.trim() === '') {
        // getAllProducts - return all products
        products = [...regularProducts, ...palindromeProducts];
      } else if (
        query.toLowerCase() === 'oso' ||
        query.toLowerCase() === 'ana'
      ) {
        // Palindrome search response
        products = palindromeProducts;
      } else if (query.toLowerCase() === 'raqueta') {
        // Non-palindrome search response
        products = [regularProducts[0]]; // Just Nike shoes
      } else if (query.toLowerCase() === 'noexiste') {
        // Empty response
        products = [];
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
            path: '/products',
          }),
        });
        return;
      } else {
        // Default search - return some products
        products = regularProducts;
      }

      // Apply pagination
      const startIndex = (page_param - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedProducts = products.slice(startIndex, endIndex);

      const mockResponse = {
        items: paginatedProducts,
        pagination: {
          page: page_param,
          pageSize,
          total: products.length,
          totalPages: Math.ceil(products.length / pageSize),
          hasNextPage: endIndex < products.length,
          hasPreviousPage: page_param > 1,
        },
        meta: {
          query: query || undefined,
          isPalindrome: query ? isQueryPalindrome : false,
          executedAt: new Date().toISOString(),
          executionTimeMs: Math.floor(Math.random() * 50) + 10,
        },
      };

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

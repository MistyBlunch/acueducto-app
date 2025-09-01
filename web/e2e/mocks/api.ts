import { http, HttpResponse } from 'msw';
import { type ProductsResponse } from '@/types/api';

// Mock data
const mockProducts = {
  palindrome: [
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
  nonPalindrome: [
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
  ],
};

function isPalindrome(str: string): boolean {
  const normalized = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return normalized === normalized.split('').reverse().join('');
}

export const apiHandlers = [
  // Search products endpoint
  http.get('*/products/search', ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('query') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');

    // Determine if query is palindrome
    const isQueryPalindrome = isPalindrome(query);

    // Select appropriate products
    let products: ProductsResponse['items'] = [];
    if (
      query.toLowerCase() === 'oso' ||
      query.toLowerCase() === 'ana' ||
      query.toLowerCase() === 'radar'
    ) {
      products = mockProducts.palindrome;
    } else if (
      query.toLowerCase().includes('raqueta') ||
      query.toLowerCase().includes('wilson')
    ) {
      products = isQueryPalindrome
        ? mockProducts.palindrome
        : mockProducts.nonPalindrome;
    } else if (
      query.toLowerCase().includes('zapatillas') ||
      query.toLowerCase().includes('nike')
    ) {
      products = mockProducts.nonPalindrome;
    } else if (query.toLowerCase() === 'error') {
      // Simulate server error for testing
      return HttpResponse.json(
        {
          statusCode: 500,
          message: 'Internal server error',
          error: 'Internal Server Error',
          timestamp: new Date().toISOString(),
          path: '/products/search',
        },
        { status: 500 },
      );
    } else if (query.toLowerCase() === 'notfound') {
      // Simulate empty results
      products = [];
    } else if (query.trim() === '') {
      products = [];
    } else {
      // Default search results
      products = [
        ...mockProducts.nonPalindrome,
        ...mockProducts.palindrome,
      ].slice(0, 4);
    }

    // Apply pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProducts = products.slice(startIndex, endIndex);

    const response: ProductsResponse = {
      items: paginatedProducts,
      pagination: {
        page,
        pageSize,
        total: products.length,
        totalPages: Math.ceil(products.length / pageSize),
        hasNextPage: endIndex < products.length,
        hasPreviousPage: page > 1,
      },
      meta: {
        query,
        isPalindrome: isQueryPalindrome,
        executedAt: new Date().toISOString(),
        executionTimeMs: Math.floor(Math.random() * 100) + 10, // Random execution time
      },
    };

    return HttpResponse.json(response, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }),

  // Health check endpoint for testing
  http.get('*/health', () => {
    return HttpResponse.json({ status: 'ok' });
  }),
];

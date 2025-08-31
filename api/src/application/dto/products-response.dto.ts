import { ApiProperty } from '@nestjs/swagger';
import { ProductView } from './product-view.dto';
import { PaginationDto } from './pagination.dto';
import { MetaDto } from './meta.dto';

export class ProductsResponseDto {
  @ApiProperty({
    description: 'Array of product items',
    type: [ProductView],
  })
  items: ProductView[];

  @ApiProperty({
    description: 'Pagination information',
    type: PaginationDto,
  })
  pagination: PaginationDto;

  @ApiProperty({
    description: 'Search metadata and execution information',
    type: MetaDto,
  })
  meta: MetaDto;
}

// Examples for Swagger documentation
export const PRODUCT_EXAMPLES = {
  withPalindromeDiscount: {
    summary: 'Products with palindrome discount',
    description: 'Response when search query is a palindrome (e.g., "ana", "oso")',
    value: {
      items: [
        {
          id: 'clp1234567890abcdef01',
          title: 'Nike Air Max 270',
          brand: 'Nike',
          description: 'Comfortable running shoes with air cushioning technology and breathable mesh upper',
          priceCents: 12999,
          finalPriceCents: 6499, // 50% discount applied
          currency: 'USD',
          stock: 25,
          createdAt: '2023-12-01T10:30:00.000Z',
          palindromeDiscountApplied: true,
        },
      ],
      pagination: {
        page: 1,
        pageSize: 10,
        total: 1,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      },
      meta: {
        query: 'ana',
        isPalindrome: true,
        executedAt: '2023-12-01T15:30:00.000Z',
        executionTimeMs: 12.5,
      },
    },
  },
  withoutDiscount: {
    summary: 'Products without palindrome discount',
    description: 'Response when search query is not a palindrome (e.g., "nike", "running")',
    value: {
      items: [
        {
          id: 'clp1234567890abcdef01',
          title: 'Nike Air Max 270',
          brand: 'Nike',
          description: 'Comfortable running shoes with air cushioning technology and breathable mesh upper',
          priceCents: 12999,
          currency: 'USD',
          stock: 25,
          createdAt: '2023-12-01T10:30:00.000Z',
        },
        {
          id: 'clp1234567890abcdef02',
          title: 'Adidas Ultraboost 22',
          brand: 'Adidas',
          description: 'Premium running shoes featuring Boost midsole for energy return and Primeknit upper',
          priceCents: 18000,
          currency: 'USD',
          stock: 15,
          createdAt: '2023-11-28T14:20:00.000Z',
        },
      ],
      pagination: {
        page: 1,
        pageSize: 10,
        total: 2,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      },
      meta: {
        query: 'nike',
        isPalindrome: false,
        executedAt: '2023-12-01T15:30:00.000Z',
        executionTimeMs: 18.2,
      },
    },
  },
  emptyResults: {
    summary: 'No products found',
    description: 'Response when no products match the search criteria',
    value: {
      items: [],
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      },
      meta: {
        query: 'nonexistent',
        isPalindrome: false,
        executedAt: '2023-12-01T15:30:00.000Z',
        executionTimeMs: 8.1,
      },
    },
  },
};
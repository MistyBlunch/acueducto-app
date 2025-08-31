import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({
    description: 'Product unique identifier',
    example: 'clp1234567890abcdef',
  })
  id: string;

  @ApiProperty({
    description: 'Product title',
    example: 'Nike Air Max 270',
  })
  title: string;

  @ApiProperty({
    description: 'Product brand',
    example: 'Nike',
  })
  brand: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Comfortable running shoes with air cushioning technology',
  })
  description: string;

  @ApiProperty({
    description: 'Original price in cents',
    example: 12999,
  })
  priceCents: number;

  @ApiPropertyOptional({
    description: 'Final price after discounts in cents',
    example: 6499,
  })
  finalPriceCents?: number;

  @ApiProperty({
    description: 'Currency code',
    example: 'USD',
  })
  currency: string;

  @ApiProperty({
    description: 'Available stock quantity',
    example: 25,
  })
  stock: number;

  @ApiProperty({
    description: 'Product creation date',
    example: '2023-12-01T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiPropertyOptional({
    description: 'Whether palindrome discount was applied',
    example: true,
  })
  palindromeDiscountApplied?: boolean;
}

export class PaginatedProductResponseDto {
  @ApiProperty({
    description: 'Array of products',
    type: [ProductResponseDto],
  })
  data: ProductResponseDto[];

  @ApiProperty({
    description: 'Total number of products found',
    example: 150,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of products per page',
    example: 10,
  })
  pageSize: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 15,
  })
  totalPages: number;
}
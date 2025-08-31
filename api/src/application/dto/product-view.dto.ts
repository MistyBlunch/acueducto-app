import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductView {
  @ApiProperty({
    description: 'Product unique identifier',
    example: 'clp1234567890abcdef01',
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
    example: 'Comfortable running shoes with air cushioning technology and breathable mesh upper',
  })
  description: string;

  @ApiProperty({
    description: 'Original price in cents (USD)',
    example: 12999,
    minimum: 0,
  })
  priceCents: number;

  @ApiPropertyOptional({
    description: 'Final price after discounts in cents (only present when discount applied)',
    example: 6499,
    minimum: 0,
  })
  finalPriceCents?: number;

  @ApiProperty({
    description: 'Currency code (ISO 4217)',
    example: 'USD',
    pattern: '^[A-Z]{3}$',
  })
  currency: string;

  @ApiProperty({
    description: 'Available stock quantity',
    example: 25,
    minimum: 0,
  })
  stock: number;

  @ApiProperty({
    description: 'Product creation timestamp',
    example: '2023-12-01T10:30:00.000Z',
    format: 'date-time',
  })
  createdAt: Date;

  @ApiPropertyOptional({
    description: 'Whether palindrome discount was applied (50% off)',
    example: true,
  })
  palindromeDiscountApplied?: boolean;
}
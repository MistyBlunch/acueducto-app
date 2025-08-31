import { z } from 'zod';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export const searchProductsSchema = z.object({
  query: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(10),
});

export type SearchProductsInput = z.infer<typeof searchProductsSchema>;

export class SearchProductsDto {
  @ApiPropertyOptional({
    description: 'Search query for product title, brand or description',
    example: 'nike',
  })
  query?: string;

  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @Transform(({ value }) => parseInt(value) || 1)
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Number of products per page',
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @Transform(({ value }) => parseInt(value) || 10)
  pageSize: number = 10;
}
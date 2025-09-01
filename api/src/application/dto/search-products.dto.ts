import { z } from 'zod';
import { Transform } from 'class-transformer';

export const searchProductsSchema = z.object({
  query: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

export type SearchProductsInput = z.infer<typeof searchProductsSchema>;

export class SearchProductsDto {
  query?: string;

  @Transform(({ value }) => parseInt(value, 10))
  page: number = 1;

  @Transform(({ value }) => parseInt(value, 10))
  pageSize: number = 10;
}

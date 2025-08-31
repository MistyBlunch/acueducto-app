import { z } from 'zod'

// Product schema
export const ProductSchema = z.object({
  id: z.string(),
  title: z.string(),
  brand: z.string(),
  description: z.string(),
  priceCents: z.number().int().min(0),
  finalPriceCents: z.number().int().min(0).optional(),
  currency: z.string(),
  stock: z.number().int().min(0),
  createdAt: z.string().datetime(),
  palindromeDiscountApplied: z.boolean().optional(),
})

// Pagination schema
export const PaginationSchema = z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1).max(100),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasPreviousPage: z.boolean(),
  hasNextPage: z.boolean(),
})

// Meta schema
export const MetaSchema = z.object({
  query: z.string().optional(),
  isPalindrome: z.boolean(),
  executedAt: z.string().datetime(),
  executionTimeMs: z.number().min(0),
})

// Products response schema
export const ProductsResponseSchema = z.object({
  items: z.array(ProductSchema),
  pagination: PaginationSchema,
  meta: MetaSchema,
})

// Search params schema
export const SearchParamsSchema = z.object({
  query: z.string().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
})

// Type exports
export type Product = z.infer<typeof ProductSchema>
export type Pagination = z.infer<typeof PaginationSchema>
export type Meta = z.infer<typeof MetaSchema>
export type ProductsResponse = z.infer<typeof ProductsResponseSchema>
export type SearchParams = z.infer<typeof SearchParamsSchema>

// API Error schema
export const ApiErrorSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  error: z.string(),
  timestamp: z.string(),
  path: z.string(),
  requestId: z.string().optional(),
  details: z.unknown().optional(),
})

export type ApiError = z.infer<typeof ApiErrorSchema>

// Custom error class for API errors
export class ApiException extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly error: string,
    public readonly details?: unknown,
    public readonly requestId?: string
  ) {
    super(`API Error ${statusCode}: ${error}`)
    this.name = 'ApiException'
  }

  static fromResponse(response: ApiError): ApiException {
    return new ApiException(
      response.statusCode,
      response.error,
      response.details,
      response.requestId
    )
  }
}
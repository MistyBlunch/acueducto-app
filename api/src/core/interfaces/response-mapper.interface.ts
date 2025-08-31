import { Product } from '../entities/product.entity'
import { SearchResult } from '../value-objects/search-result.vo'
import { SearchMetadata } from '../value-objects/search-metadata.vo'

export interface ProductView {
  id: string
  title: string
  brand: string
  description: string
  priceCents: number
  finalPriceCents?: number
  currency: string
  stock: number
  createdAt: string
  palindromeDiscountApplied?: boolean
}

export interface PaginationView {
  page: number
  pageSize: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface SearchMetadataView {
  query?: string
  isPalindrome: boolean
  executedAt: string
  executionTimeMs: number
}

export interface ProductsResponseView {
  items: ProductView[]
  pagination: PaginationView
  meta: SearchMetadataView
}

export interface ProductResponseMapper {
  mapProductToView(product: Product, discountApplied?: boolean, finalPrice?: number): ProductView
  mapSearchResultToResponse(
    result: SearchResult,
    metadata: SearchMetadata
  ): ProductsResponseView
}

export const PRODUCT_RESPONSE_MAPPER = Symbol('ProductResponseMapper')
import { Product } from '../entities/product.entity'
import { SearchQuery } from '../value-objects/search-query.vo'
import { PaginationParams } from '../value-objects/pagination-params.vo'

export interface ProductReader {
  findById(id: string): Promise<Product | null>
  searchProducts(
    query: SearchQuery,
    pagination: PaginationParams
  ): Promise<Product[]>
  countSearchResults(query: SearchQuery): Promise<number>
}

export const PRODUCT_READER = Symbol('ProductReader')
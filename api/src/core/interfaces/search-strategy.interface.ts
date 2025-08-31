import { Product } from '../entities/product.entity'
import { SearchQuery } from '../value-objects/search-query.vo'
import { PaginationParams } from '../value-objects/pagination-params.vo'

export interface SearchStrategy {
  canHandle(query: SearchQuery): boolean
  search(query: SearchQuery, pagination: PaginationParams): Promise<Product[]>
}

export interface SearchStrategyFactory {
  getStrategy(query: SearchQuery): SearchStrategy
}

export const SEARCH_STRATEGY_FACTORY = Symbol('SearchStrategyFactory')
import { Injectable, Inject } from '@nestjs/common'
import { SearchStrategy } from '../../core/interfaces/search-strategy.interface'
import { ProductReader, PRODUCT_READER } from '../../core/interfaces/product-reader.interface'
import { Product } from '../../core/entities/product.entity'
import { SearchQuery } from '../../core/value-objects/search-query.vo'
import { PaginationParams } from '../../core/value-objects/pagination-params.vo'

@Injectable()
export class ExactMatchSearchStrategy implements SearchStrategy {
  constructor(
    @Inject(PRODUCT_READER)
    private readonly productReader: ProductReader
  ) {}

  canHandle(query: SearchQuery): boolean {
    return !query.isEmpty()
  }

  async search(query: SearchQuery, pagination: PaginationParams): Promise<Product[]> {
    return this.productReader.searchProducts(query, pagination)
  }
}
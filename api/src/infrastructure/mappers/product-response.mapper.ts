import { Injectable } from '@nestjs/common'
import { 
  ProductResponseMapper, 
  ProductView, 
  PaginationView, 
  SearchMetadataView, 
  ProductsResponseView 
} from '../../core/interfaces/response-mapper.interface'
import { Product } from '../../core/entities/product.entity'
import { SearchResult } from '../../core/value-objects/search-result.vo'
import { SearchMetadata } from '../../core/value-objects/search-metadata.vo'

@Injectable()
export class ProductResponseMapperImpl implements ProductResponseMapper {
  mapProductToView(product: Product, discountApplied = false, finalPrice?: number): ProductView {
    return {
      id: product.id,
      title: product.title,
      brand: product.brand,
      description: product.description,
      priceCents: product.priceCents,
      finalPriceCents: finalPrice && finalPrice !== product.priceCents ? finalPrice : undefined,
      currency: product.currency,
      stock: product.stock,
      createdAt: product.createdAt.toISOString(),
      palindromeDiscountApplied: discountApplied,
    }
  }

  mapSearchResultToResponse(
    result: SearchResult,
    metadata: SearchMetadata
  ): ProductsResponseView {
    return {
      items: result.data.map(product => 
        this.mapProductToView(product, metadata.isPalindrome, this.calculateFinalPrice(product, metadata))
      ),
      pagination: this.mapPagination(result),
      meta: this.mapMetadata(metadata),
    }
  }

  private mapPagination(result: SearchResult): PaginationView {
    return {
      page: result.page,
      pageSize: result.pageSize,
      total: result.total,
      totalPages: result.totalPages,
      hasNextPage: result.hasNextPage,
      hasPreviousPage: result.hasPreviousPage,
    }
  }

  private mapMetadata(metadata: SearchMetadata): SearchMetadataView {
    return {
      query: metadata.query,
      isPalindrome: metadata.isPalindrome,
      executedAt: metadata.executedAt.toISOString(),
      executionTimeMs: metadata.executionTimeMs,
    }
  }

  private calculateFinalPrice(product: Product, metadata: SearchMetadata): number {
    if (metadata.isPalindrome) {
      return Math.round(product.priceCents * 0.5) // 50% discount
    }
    return product.priceCents
  }
}
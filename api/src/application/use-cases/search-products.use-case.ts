import { Injectable, Inject } from '@nestjs/common'
import { SearchQuery } from '../../core/value-objects/search-query.vo'
import { PaginationParams, normalizePagination } from '../../core/value-objects/pagination-params.vo'
import { SearchResult } from '../../core/value-objects/search-result.vo'
import { SearchMetadata } from '../../core/value-objects/search-metadata.vo'
import { ProductReader, PRODUCT_READER } from '../../core/interfaces/product-reader.interface'
import { PalindromeDetector, PALINDROME_DETECTOR } from '../../core/interfaces/palindrome-detector.interface'
import { DiscountCalculatorFactory, DISCOUNT_CALCULATOR_FACTORY } from '../../core/interfaces/discount-calculator.interface'
import { SearchProductsInput } from '../dto/search-products.dto'

@Injectable()
export class SearchProductsUseCase {
  constructor(
    @Inject(PRODUCT_READER)
    private readonly productReader: ProductReader,
    @Inject(PALINDROME_DETECTOR)
    private readonly palindromeDetector: PalindromeDetector,
    @Inject(DISCOUNT_CALCULATOR_FACTORY)
    private readonly discountCalculatorFactory: DiscountCalculatorFactory
  ) {}

  async execute(input: SearchProductsInput): Promise<{ result: SearchResult; metadata: SearchMetadata }> {
    const startTime = Date.now()
    const { query, page, pageSize } = input
    
    const searchQuery = SearchQuery.create(query || '')
    const pagination = normalizePagination({ page, pageSize })
    
    // Determine if query is palindrome
    const isPalindrome = query ? this.palindromeDetector.isPalindrome(query) : false

    // Execute search
    const products = await this.productReader.searchProducts(searchQuery, pagination)
    const total = await this.productReader.countSearchResults(searchQuery)

    // Create search result
    const result = new SearchResult(products, total, pagination.page, pagination.pageSize)
    
    // Create metadata
    const executionTime = Date.now() - startTime
    const metadata = new SearchMetadata(query, isPalindrome, executionTime)

    return { result, metadata }
  }
}
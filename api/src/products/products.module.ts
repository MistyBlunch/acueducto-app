import { Module } from '@nestjs/common'
import { PrismaService } from '../infrastructure/database/prisma.service'
import { ProductController } from '../infrastructure/http/controllers/product.controller'
import { SearchProductsUseCase } from '../application/use-cases/search-products.use-case'
import { PrismaProductReader } from '../infrastructure/repositories/prisma-product-reader'
import { PrismaProductWriter } from '../infrastructure/repositories/prisma-product-writer'
import { PalindromeDetectorService } from '../infrastructure/services/palindrome-detector.service'
import { ProductResponseMapperImpl } from '../infrastructure/mappers/product-response.mapper'
import { PalindromeDiscountCalculator } from '../infrastructure/discount/palindrome-discount-calculator'
import { DiscountCalculatorFactoryImpl } from '../infrastructure/discount/discount-calculator-factory'
import { ExactMatchSearchStrategy } from '../infrastructure/search-strategies/exact-match-strategy'
import { SearchStrategyFactoryImpl } from '../infrastructure/search-strategies/search-strategy-factory'
import { PRODUCT_READER } from '../core/interfaces/product-reader.interface'
import { PRODUCT_WRITER } from '../core/interfaces/product-writer.interface'
import { PALINDROME_DETECTOR } from '../core/interfaces/palindrome-detector.interface'
import { PRODUCT_RESPONSE_MAPPER } from '../core/interfaces/response-mapper.interface'
import { DISCOUNT_CALCULATOR_FACTORY } from '../core/interfaces/discount-calculator.interface'
import { SEARCH_STRATEGY_FACTORY } from '../core/interfaces/search-strategy.interface'

@Module({
  imports: [],
  controllers: [ProductController],
  providers: [
    PrismaService,
    
    {
      provide: PRODUCT_READER,
      useClass: PrismaProductReader,
    },
    {
      provide: PRODUCT_WRITER,
      useClass: PrismaProductWriter,
    },
    
    {
      provide: PALINDROME_DETECTOR,
      useClass: PalindromeDetectorService,
    },
    
    {
      provide: PRODUCT_RESPONSE_MAPPER,
      useClass: ProductResponseMapperImpl,
    },
    
    PalindromeDiscountCalculator,
    {
      provide: DISCOUNT_CALCULATOR_FACTORY,
      useClass: DiscountCalculatorFactoryImpl,
    },
    
    ExactMatchSearchStrategy,
    {
      provide: SEARCH_STRATEGY_FACTORY,
      useClass: SearchStrategyFactoryImpl,
    },
    
    SearchProductsUseCase,
  ],
  exports: [
    PRODUCT_READER,
    PRODUCT_WRITER,
    PALINDROME_DETECTOR,
    SearchProductsUseCase,
  ],
})
export class ProductsModule {}
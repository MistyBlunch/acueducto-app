import {
  Controller,
  Get,
  Query,
  UsePipes,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common'
import { SearchProductsUseCase } from '../../../application/use-cases/search-products.use-case'
import {
  SearchProductsDto,
  searchProductsSchema,
} from '../../../application/dto/search-products.dto'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import {
  ProductResponseMapper,
  PRODUCT_RESPONSE_MAPPER,
  ProductsResponseView,
} from '../../../core/interfaces/response-mapper.interface'

@Controller('products')
export class ProductController {
  constructor(
    private readonly searchProductsUseCase: SearchProductsUseCase,
    @Inject(PRODUCT_RESPONSE_MAPPER)
    private readonly responseMapper: ProductResponseMapper,
  ) {}

  @Get()
  @UsePipes(new ZodValidationPipe(searchProductsSchema))
  async searchProducts(
    @Query() query: SearchProductsDto,
  ): Promise<ProductsResponseView> {
    try {
      const { result, metadata } =
        await this.searchProductsUseCase.execute(query);
      return this.responseMapper.mapSearchResultToResponse(result, metadata);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to search products',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

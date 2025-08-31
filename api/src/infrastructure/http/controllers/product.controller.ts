import {
  Controller,
  Get,
  Query,
  UsePipes,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiOkResponse,
} from '@nestjs/swagger'
import { SearchProductsUseCase } from '../../../application/use-cases/search-products.use-case'
import {
  SearchProductsDto,
  searchProductsSchema,
} from '../../../application/dto/search-products.dto'
import { ProductsResponseDto, PRODUCT_EXAMPLES } from '../../../application/dto/products-response.dto'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { ProductResponseMapper, PRODUCT_RESPONSE_MAPPER, ProductsResponseView } from '../../../core/interfaces/response-mapper.interface'

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly searchProductsUseCase: SearchProductsUseCase,
    @Inject(PRODUCT_RESPONSE_MAPPER)
    private readonly responseMapper: ProductResponseMapper
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Search products with intelligent filtering',
    description: `
    **Search Algorithm:**
    1. **Exact Title Match**: Case-insensitive exact match returns single product
    2. **Fuzzy Search**: Query length ≥ 4 chars searches brand/description with ILIKE
    3. **Palindrome Discount**: Palindromic queries get 50% price reduction
    
    **Ordering**: Results ordered by relevance, then createdAt DESC
    
    **Palindrome Examples**: "ana", "oso", "reconocer", "A man a plan a canal Panama"
    `,
  })
  @ApiQuery({
    name: 'query',
    required: false,
    type: String,
    description: 'Search term for product title, brand, or description',
    examples: {
      brand: {
        summary: 'Brand search',
        value: 'nike',
      },
      palindrome: {
        summary: 'Palindrome query (gets 50% discount)',
        value: 'ana',
      },
      exactTitle: {
        summary: 'Exact title match',
        value: 'Nike Air Max 270',
      },
    },
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (1-based)',
    example: 1,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Number of products per page (1-100)',
    example: 10,
  })
  @ApiOkResponse({
    description: 'Products retrieved successfully with pagination and metadata',
    type: ProductsResponseDto,
    schema: {
      example: PRODUCT_EXAMPLES,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Validation failed',
        },
        errors: {
          type: 'array',
          items: { type: 'string' },
          example: ['page: Expected number, received nan'],
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 500,
        },
        message: {
          type: 'string',
          example: 'Failed to search products',
        },
        error: {
          type: 'string',
          example: 'Database connection timeout',
        },
      },
    },
  })
  @UsePipes(new ZodValidationPipe(searchProductsSchema))
  async searchProducts(@Query() query: SearchProductsDto): Promise<ProductsResponseView> {
    try {
      const { result, metadata } = await this.searchProductsUseCase.execute(query)
      return this.responseMapper.mapSearchResultToResponse(result, metadata)
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to search products',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
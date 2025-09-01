import { SearchProductsUseCase } from '../../src/application/use-cases/search-products.use-case';
import { ProductReader } from '../../src/core/interfaces/product-reader.interface';
import { PalindromeDetector } from '../../src/core/interfaces/palindrome-detector.interface';
import { DiscountCalculatorFactory } from '../../src/core/interfaces/discount-calculator.interface';
import { Product } from '../../src/core/entities/product.entity';

describe('SearchProductsUseCase', () => {
  let useCase: SearchProductsUseCase;
  let mockProductReader: jest.Mocked<ProductReader>;
  let mockPalindromeDetector: jest.Mocked<PalindromeDetector>;
  let mockDiscountCalculatorFactory: jest.Mocked<DiscountCalculatorFactory>;

  // Test data
  const testProduct = Product.create({
    id: 'test-id-1',
    title: 'Nike Air Max 270',
    brand: 'Nike',
    description: 'Comfortable running shoes with air cushioning technology',
    priceCents: 12999,
    currency: 'USD',
    stock: 25,
    createdAt: new Date('2023-01-01'),
  });

  const palindromeProduct = Product.create({
    id: 'test-id-2',
    title: 'ana',
    brand: 'TestBrand',
    description: 'Test product with palindrome title',
    priceCents: 10000,
    currency: 'USD',
    stock: 10,
    createdAt: new Date('2023-01-02'),
  });

  beforeEach(() => {
    // Create mock dependencies
    mockProductReader = {
      findById: jest.fn(),
      searchProducts: jest.fn(),
      countSearchResults: jest.fn(),
    };

    mockPalindromeDetector = {
      isPalindrome: jest.fn(),
      normalizeText: jest.fn(),
    };

    mockDiscountCalculatorFactory = {
      getCalculators: jest.fn(),
    };

    useCase = new SearchProductsUseCase(
      mockProductReader,
      mockPalindromeDetector,
      mockDiscountCalculatorFactory
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return all products when no query is provided', async () => {
      // Arrange
      const mockProducts = [testProduct];
      mockProductReader.searchProducts.mockResolvedValue(mockProducts);
      mockProductReader.countSearchResults.mockResolvedValue(1);
      mockPalindromeDetector.isPalindrome.mockReturnValue(false);

      // Act
      const response = await useCase.execute({
        page: 1,
        pageSize: 10,
      });

      // Assert
      expect(response.result.data).toHaveLength(1);
      expect(response.result.data[0]).toEqual(testProduct);
      expect(response.result.total).toBe(1);
      expect(response.result.page).toBe(1);
      expect(response.result.pageSize).toBe(10);
      expect(response.metadata.query).toBe(undefined);
      expect(response.metadata.isPalindrome).toBe(false);
      
      expect(mockProductReader.searchProducts).toHaveBeenCalledWith(
        expect.any(Object), // SearchQuery
        { page: 1, pageSize: 10 }
      );
    });

    it('should search products with a query', async () => {
      // Arrange
      const mockProducts = [testProduct];
      mockProductReader.searchProducts.mockResolvedValue(mockProducts);
      mockProductReader.countSearchResults.mockResolvedValue(1);
      mockPalindromeDetector.isPalindrome.mockReturnValue(false);

      // Act
      const response = await useCase.execute({
        query: 'nike',
        page: 1,
        pageSize: 10,
      });

      // Assert
      expect(response.result.data).toHaveLength(1);
      expect(response.result.data[0]).toEqual(testProduct);
      expect(response.metadata.query).toBe('nike');
      expect(response.metadata.isPalindrome).toBe(false);
      expect(mockPalindromeDetector.isPalindrome).toHaveBeenCalledWith('nike');
    });

    it('should detect palindrome queries', async () => {
      // Arrange
      const mockProducts = [palindromeProduct];
      mockProductReader.searchProducts.mockResolvedValue(mockProducts);
      mockProductReader.countSearchResults.mockResolvedValue(1);
      mockPalindromeDetector.isPalindrome.mockReturnValue(true);

      // Act
      const response = await useCase.execute({
        query: 'ana',
        page: 1,
        pageSize: 10,
      });

      // Assert
      expect(response.result.data).toHaveLength(1);
      expect(response.metadata.query).toBe('ana');
      expect(response.metadata.isPalindrome).toBe(true);
      expect(mockPalindromeDetector.isPalindrome).toHaveBeenCalledWith('ana');
    });

    it('should respect pagination parameters', async () => {
      // Arrange
      const mockProducts = [testProduct];
      mockProductReader.searchProducts.mockResolvedValue(mockProducts);
      mockProductReader.countSearchResults.mockResolvedValue(25);
      mockPalindromeDetector.isPalindrome.mockReturnValue(false);

      // Act
      const response = await useCase.execute({
        query: 'shoes',
        page: 2,
        pageSize: 5,
      });

      // Assert
      expect(response.result.data).toHaveLength(1);
      expect(response.result.total).toBe(25);
      expect(response.result.page).toBe(2);
      expect(response.result.pageSize).toBe(5);
      expect(response.result.totalPages).toBe(5);
      
      expect(mockProductReader.searchProducts).toHaveBeenCalledWith(
        expect.any(Object), // SearchQuery
        { page: 2, pageSize: 5 }
      );
    });
  });
});
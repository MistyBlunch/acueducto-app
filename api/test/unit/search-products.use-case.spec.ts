import { SearchProductsUseCase } from '../../src/application/use-cases/search-products.use-case';
import { ProductRepository } from '../../src/core/repositories/product.repository';
import { Product } from '../../src/core/entities/product.entity';

describe('SearchProductsUseCase', () => {
  let useCase: SearchProductsUseCase;
  let mockProductRepository: jest.Mocked<ProductRepository>;

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
    // Create mock repository
    mockProductRepository = {
      findById: jest.fn(),
      findByExactTitle: jest.fn(),
      searchProducts: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new SearchProductsUseCase(mockProductRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return all products when no query is provided', async () => {
      // Arrange
      const mockResult = {
        data: [testProduct],
        total: 1,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      };
      mockProductRepository.searchProducts.mockResolvedValue(mockResult);

      // Act
      const result = await useCase.execute({
        page: 1,
        pageSize: 10,
      });

      // Assert
      expect(result).toEqual({
        data: expect.arrayContaining([
          expect.objectContaining({
            id: 'test-id-1',
            title: 'Nike Air Max 270',
            priceCents: 12999,
            finalPriceCents: undefined,
            palindromeDiscountApplied: undefined,
          }),
        ]),
        total: 1,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      });
      expect(mockProductRepository.searchProducts).toHaveBeenCalledWith({}, { page: 1, pageSize: 10 });
    });

    it('should return exact match when query matches title exactly', async () => {
      // Arrange
      mockProductRepository.findByExactTitle.mockResolvedValue(testProduct);

      // Act
      const result = await useCase.execute({
        query: 'nike air max 270',
        page: 1,
        pageSize: 10,
      });

      // Assert
      expect(result).toEqual({
        data: expect.arrayContaining([
          expect.objectContaining({
            id: 'test-id-1',
            title: 'Nike Air Max 270',
            priceCents: 12999,
            finalPriceCents: undefined,
            palindromeDiscountApplied: undefined,
          }),
        ]),
        total: 1,
        page: 1,
        pageSize: 1,
        totalPages: 1,
      });
      expect(mockProductRepository.findByExactTitle).toHaveBeenCalledWith('nike air max 270');
    });

    it('should apply palindrome discount when query is palindrome and matches exactly', async () => {
      // Arrange
      mockProductRepository.findByExactTitle.mockResolvedValue(palindromeProduct);

      // Act
      const result = await useCase.execute({
        query: 'ana',
        page: 1,
        pageSize: 10,
      });

      // Assert
      expect(result.data[0]).toEqual(
        expect.objectContaining({
          id: 'test-id-2',
          title: 'ana',
          priceCents: 10000,
          finalPriceCents: 5000, // 50% discount
          palindromeDiscountApplied: true,
        }),
      );
      expect(mockProductRepository.findByExactTitle).toHaveBeenCalledWith('ana');
    });

    it('should search by brand/description when query length >= 4 and no exact match', async () => {
      // Arrange
      mockProductRepository.findByExactTitle.mockResolvedValue(null);
      const mockResult = {
        data: [testProduct],
        total: 1,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      };
      mockProductRepository.searchProducts.mockResolvedValue(mockResult);

      // Act
      const result = await useCase.execute({
        query: 'nike',
        page: 1,
        pageSize: 10,
      });

      // Assert
      expect(result).toEqual({
        data: expect.arrayContaining([
          expect.objectContaining({
            id: 'test-id-1',
            title: 'Nike Air Max 270',
            priceCents: 12999,
            finalPriceCents: undefined,
            palindromeDiscountApplied: undefined,
          }),
        ]),
        total: 1,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      });
      expect(mockProductRepository.findByExactTitle).toHaveBeenCalledWith('nike');
      expect(mockProductRepository.searchProducts).toHaveBeenCalledWith(
        { query: 'nike' },
        { page: 1, pageSize: 10 },
      );
    });

    it('should apply palindrome discount to search results when query is palindrome', async () => {
      // Arrange
      mockProductRepository.findByExactTitle.mockResolvedValue(null);
      const mockResult = {
        data: [palindromeProduct],
        total: 1,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      };
      mockProductRepository.searchProducts.mockResolvedValue(mockResult);

      // Act
      const result = await useCase.execute({
        query: 'reconocer', // palindrome
        page: 1,
        pageSize: 10,
      });

      // Assert
      expect(result.data[0]).toEqual(
        expect.objectContaining({
          priceCents: 10000,
          finalPriceCents: 5000, // 50% discount applied
          palindromeDiscountApplied: true,
        }),
      );
    });

    it('should return empty results when query length < 4 and no exact match', async () => {
      // Arrange
      mockProductRepository.findByExactTitle.mockResolvedValue(null);

      // Act
      const result = await useCase.execute({
        query: 'abc', // length < 4
        page: 1,
        pageSize: 10,
      });

      // Assert
      expect(result).toEqual({
        data: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
      });
      expect(mockProductRepository.findByExactTitle).toHaveBeenCalledWith('abc');
      expect(mockProductRepository.searchProducts).not.toHaveBeenCalled();
    });

    it('should handle case insensitive palindrome detection', async () => {
      // Arrange
      mockProductRepository.findByExactTitle.mockResolvedValue(testProduct);

      // Act
      const result = await useCase.execute({
        query: 'AnA', // palindrome with mixed case
        page: 1,
        pageSize: 10,
      });

      // Assert
      expect(result.data[0]).toEqual(
        expect.objectContaining({
          finalPriceCents: expect.any(Number), // Should have discount
          palindromeDiscountApplied: true,
        }),
      );
    });

    it('should handle complex palindromes with spaces and punctuation', async () => {
      // Arrange
      mockProductRepository.findByExactTitle.mockResolvedValue(null);
      const mockResult = {
        data: [testProduct],
        total: 1,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      };
      mockProductRepository.searchProducts.mockResolvedValue(mockResult);

      // Act
      const result = await useCase.execute({
        query: 'a man a plan a canal panama', // complex palindrome
        page: 1,
        pageSize: 10,
      });

      // Assert
      expect(result.data[0]).toEqual(
        expect.objectContaining({
          finalPriceCents: expect.any(Number), // Should have discount
          palindromeDiscountApplied: true,
        }),
      );
    });

    it('should respect pagination parameters', async () => {
      // Arrange
      mockProductRepository.findByExactTitle.mockResolvedValue(null);
      const mockResult = {
        data: [testProduct],
        total: 25,
        page: 2,
        pageSize: 5,
        totalPages: 5,
      };
      mockProductRepository.searchProducts.mockResolvedValue(mockResult);

      // Act
      const result = await useCase.execute({
        query: 'shoes',
        page: 2,
        pageSize: 5,
      });

      // Assert
      expect(result).toEqual(
        expect.objectContaining({
          page: 2,
          pageSize: 5,
          total: 25,
          totalPages: 5,
        }),
      );
      expect(mockProductRepository.searchProducts).toHaveBeenCalledWith(
        { query: 'shoes' },
        { page: 2, pageSize: 5 },
      );
    });
  });
});
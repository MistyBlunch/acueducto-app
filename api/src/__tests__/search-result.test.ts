import { SearchResult } from '../core/value-objects/search-result.vo';
import { Product, ProductProps } from '../core/entities/product.entity';

describe('SearchResult', () => {
  const createMockProduct = (id: string, title: string): Product => {
    const props: ProductProps = {
      id,
      title,
      brand: 'TestBrand',
      description: 'Test product description',
      priceCents: 10000,
      currency: 'USD',
      stock: 10,
      createdAt: new Date('2023-01-01'),
    };
    return Product.create(props);
  };

  const mockProducts = [
    createMockProduct('1', 'Product 1'),
    createMockProduct('2', 'Product 2'),
    createMockProduct('3', 'Product 3'),
  ];

  describe('constructor', () => {
    it('should create SearchResult with all properties', () => {
      const result = new SearchResult(mockProducts, 25, 2, 10);

      expect(result.data).toEqual(mockProducts);
      expect(result.total).toBe(25);
      expect(result.page).toBe(2);
      expect(result.pageSize).toBe(10);
    });

    it('should create SearchResult with empty data array', () => {
      const result = new SearchResult([], 0, 1, 10);

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
    });
  });

  describe('totalPages', () => {
    it('should calculate total pages correctly for exact division', () => {
      const result = new SearchResult(mockProducts, 20, 1, 10);
      expect(result.totalPages).toBe(2); // 20 / 10 = 2
    });

    it('should calculate total pages correctly with remainder', () => {
      const result = new SearchResult(mockProducts, 25, 1, 10);
      expect(result.totalPages).toBe(3); // Math.ceil(25 / 10) = 3
    });

    it('should return 0 pages when total is 0', () => {
      const result = new SearchResult([], 0, 1, 10);
      expect(result.totalPages).toBe(0); // Math.ceil(0 / 10) = 0
    });

    it('should handle single item correctly', () => {
      const result = new SearchResult([mockProducts[0]], 1, 1, 10);
      expect(result.totalPages).toBe(1); // Math.ceil(1 / 10) = 1
    });

    it('should handle different page sizes', () => {
      const result = new SearchResult(mockProducts, 25, 1, 5);
      expect(result.totalPages).toBe(5); // Math.ceil(25 / 5) = 5
    });
  });

  describe('hasNextPage', () => {
    it('should return true when current page is less than total pages', () => {
      const result = new SearchResult(mockProducts, 25, 2, 10);
      expect(result.hasNextPage).toBe(true); // page 2 of 3
    });

    it('should return false when current page equals total pages', () => {
      const result = new SearchResult(mockProducts, 20, 2, 10);
      expect(result.hasNextPage).toBe(false); // page 2 of 2
    });

    it('should return false when on single page result', () => {
      const result = new SearchResult(mockProducts, 5, 1, 10);
      expect(result.hasNextPage).toBe(false); // page 1 of 1
    });

    it('should return true when on first page with multiple pages', () => {
      const result = new SearchResult(mockProducts, 25, 1, 10);
      expect(result.hasNextPage).toBe(true); // page 1 of 3
    });

    it('should return false when total is 0', () => {
      const result = new SearchResult([], 0, 1, 10);
      expect(result.hasNextPage).toBe(false); // page 1 of 0
    });
  });

  describe('hasPreviousPage', () => {
    it('should return true when current page is greater than 1', () => {
      const result = new SearchResult(mockProducts, 25, 2, 10);
      expect(result.hasPreviousPage).toBe(true); // page 2
    });

    it('should return false when current page is 1', () => {
      const result = new SearchResult(mockProducts, 25, 1, 10);
      expect(result.hasPreviousPage).toBe(false); // page 1
    });

    it('should return true when on last page of multiple pages', () => {
      const result = new SearchResult(mockProducts, 25, 3, 10);
      expect(result.hasPreviousPage).toBe(true); // page 3 of 3
    });

    it('should return false when total is 0', () => {
      const result = new SearchResult([], 0, 1, 10);
      expect(result.hasPreviousPage).toBe(false); // page 1
    });
  });

  describe('isEmpty', () => {
    it('should return true when data array is empty', () => {
      const result = new SearchResult([], 0, 1, 10);
      expect(result.isEmpty).toBe(true);
    });

    it('should return false when data array has items', () => {
      const result = new SearchResult(mockProducts, 25, 1, 10);
      expect(result.isEmpty).toBe(false);
    });

    it('should return false when data array has single item', () => {
      const result = new SearchResult([mockProducts[0]], 1, 1, 10);
      expect(result.isEmpty).toBe(false);
    });

    it('should return true regardless of total when data is empty', () => {
      const result = new SearchResult([], 25, 1, 10);
      expect(result.isEmpty).toBe(true);
    });
  });

  describe('pagination edge cases', () => {
    it('should handle page size larger than total', () => {
      const result = new SearchResult(mockProducts, 5, 1, 20);
      
      expect(result.totalPages).toBe(1); // Math.ceil(5 / 20) = 1
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPreviousPage).toBe(false);
    });

    it('should handle exact division boundary', () => {
      const result = new SearchResult(mockProducts, 30, 3, 10);
      
      expect(result.totalPages).toBe(3); // Math.ceil(30 / 10) = 3
      expect(result.hasNextPage).toBe(false); // on last page
      expect(result.hasPreviousPage).toBe(true); // not on first page
    });
  });
});
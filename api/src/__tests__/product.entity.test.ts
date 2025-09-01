import { Product, ProductProps } from '../core/entities/product.entity';

describe('Product Entity', () => {
  const mockProductProps: ProductProps = {
    id: 'product-1',
    title: 'Nike Air Max 270',
    brand: 'Nike',
    description: 'Comfortable running shoes',
    priceCents: 12999,
    currency: 'USD',
    stock: 25,
    createdAt: new Date('2023-01-01T00:00:00Z'),
  };

  describe('create', () => {
    it('should create a product with valid properties', () => {
      const product = Product.create(mockProductProps);

      expect(product.id).toBe('product-1');
      expect(product.title).toBe('Nike Air Max 270');
      expect(product.brand).toBe('Nike');
      expect(product.description).toBe('Comfortable running shoes');
      expect(product.priceCents).toBe(12999);
      expect(product.currency).toBe('USD');
      expect(product.stock).toBe(25);
      expect(product.createdAt).toEqual(new Date('2023-01-01T00:00:00Z'));
      expect(product.updatedAt).toBeUndefined();
    });

    it('should create a product with updatedAt when provided', () => {
      const propsWithUpdatedAt = {
        ...mockProductProps,
        updatedAt: new Date('2023-01-02T00:00:00Z'),
      };

      const product = Product.create(propsWithUpdatedAt);
      expect(product.updatedAt).toEqual(new Date('2023-01-02T00:00:00Z'));
    });
  });

  describe('isInStock', () => {
    it('should return true when stock is greater than 0', () => {
      const product = Product.create({ ...mockProductProps, stock: 10 });
      expect(product.isInStock()).toBe(true);
    });

    it('should return false when stock is 0', () => {
      const product = Product.create({ ...mockProductProps, stock: 0 });
      expect(product.isInStock()).toBe(false);
    });

    it('should return false when stock is negative', () => {
      const product = Product.create({ ...mockProductProps, stock: -1 });
      expect(product.isInStock()).toBe(false);
    });
  });

  describe('applyDiscount', () => {
    const product = Product.create({ ...mockProductProps, priceCents: 10000 });

    it('should apply 50% discount correctly', () => {
      expect(product.applyDiscount(50)).toBe(5000);
    });

    it('should apply 25% discount correctly', () => {
      expect(product.applyDiscount(25)).toBe(7500);
    });

    it('should return original price with 0% discount', () => {
      expect(product.applyDiscount(0)).toBe(10000);
    });

    it('should return 0 with 100% discount', () => {
      expect(product.applyDiscount(100)).toBe(0);
    });

    it('should round to nearest cent', () => {
      const productWith3333Cents = Product.create({ ...mockProductProps, priceCents: 3333 });
      expect(productWith3333Cents.applyDiscount(33.33)).toBe(2222);
    });
  });

  describe('toPlainObject', () => {
    it('should return all properties as plain object', () => {
      const product = Product.create(mockProductProps);
      const plainObject = product.toPlainObject();

      expect(plainObject).toEqual(mockProductProps);
      expect(plainObject).not.toBe(mockProductProps);
    });
  });
});
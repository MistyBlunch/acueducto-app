import { PalindromeDiscountCalculator } from '../infrastructure/discount/palindrome-discount-calculator';
import { PalindromeDetector } from '../core/interfaces/palindrome-detector.interface';
import { DiscountContext } from '../core/interfaces/discount-calculator.interface';
import { Product, ProductProps } from '../core/entities/product.entity';

describe('PalindromeDiscountCalculator', () => {
  let calculator: PalindromeDiscountCalculator;
  let mockPalindromeDetector: jest.Mocked<PalindromeDetector>;

  const createMockProduct = (priceCents: number): Product => {
    const props: ProductProps = {
      id: 'test-id-1',
      title: 'Test Product',
      brand: 'TestBrand',
      description: 'Test description',
      priceCents,
      currency: 'USD',
      stock: 25,
      createdAt: new Date('2023-01-01'),
    };
    return Product.create(props);
  };

  beforeEach(() => {
    mockPalindromeDetector = {
      isPalindrome: jest.fn(),
      normalizeText: jest.fn(),
    };

    calculator = new PalindromeDiscountCalculator(mockPalindromeDetector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('calculateDiscount', () => {
    const testProduct = createMockProduct(10000); // $100.00

    it('should return 50% discount when query is palindrome', () => {
      const context: DiscountContext = { query: 'ana' };
      mockPalindromeDetector.isPalindrome.mockReturnValue(true);

      const discount = calculator.calculateDiscount(testProduct, context);

      expect(discount).toBe(5000); // 50% of 10000 cents
      expect(mockPalindromeDetector.isPalindrome).toHaveBeenCalledWith('ana');
    });

    it('should return 0 discount when query is not palindrome', () => {
      const context: DiscountContext = { query: 'nike' };
      mockPalindromeDetector.isPalindrome.mockReturnValue(false);

      const discount = calculator.calculateDiscount(testProduct, context);

      expect(discount).toBe(0);
      expect(mockPalindromeDetector.isPalindrome).toHaveBeenCalledWith('nike');
    });

    it('should return 0 discount when query is undefined', () => {
      const context: DiscountContext = { query: undefined };

      const discount = calculator.calculateDiscount(testProduct, context);

      expect(discount).toBe(0);
      expect(mockPalindromeDetector.isPalindrome).not.toHaveBeenCalled();
    });

    it('should return 0 discount when query is null', () => {
      const context: DiscountContext = { query: null as any };

      const discount = calculator.calculateDiscount(testProduct, context);

      expect(discount).toBe(0);
      expect(mockPalindromeDetector.isPalindrome).not.toHaveBeenCalled();
    });

    it('should return 0 discount when query is empty string', () => {
      const context: DiscountContext = { query: '' };

      const discount = calculator.calculateDiscount(testProduct, context);

      expect(discount).toBe(0);
      expect(mockPalindromeDetector.isPalindrome).not.toHaveBeenCalled();
    });

    it('should calculate correct discount for different product prices', () => {
      const expensiveProduct = createMockProduct(25000); // $250.00
      const context: DiscountContext = { query: 'oso' };
      mockPalindromeDetector.isPalindrome.mockReturnValue(true);

      const discount = calculator.calculateDiscount(expensiveProduct, context);

      expect(discount).toBe(12500); // 50% of 25000 cents
    });

    it('should handle edge case with 1 cent product', () => {
      const cheapProduct = createMockProduct(1);
      const context: DiscountContext = { query: 'aa' };
      mockPalindromeDetector.isPalindrome.mockReturnValue(true);

      const discount = calculator.calculateDiscount(cheapProduct, context);

      expect(discount).toBe(0.5); // 50% of 1 cent = 0.5 cents
    });
  });

  describe('canApply', () => {
    it('should return true when query is palindrome', () => {
      const context: DiscountContext = { query: 'ana' };
      mockPalindromeDetector.isPalindrome.mockReturnValue(true);

      const canApply = calculator.canApply(context);

      expect(canApply).toBe(true);
      expect(mockPalindromeDetector.isPalindrome).toHaveBeenCalledWith('ana');
    });

    it('should return false when query is not palindrome', () => {
      const context: DiscountContext = { query: 'nike' };
      mockPalindromeDetector.isPalindrome.mockReturnValue(false);

      const canApply = calculator.canApply(context);

      expect(canApply).toBe(false);
      expect(mockPalindromeDetector.isPalindrome).toHaveBeenCalledWith('nike');
    });

    it('should return false when query is undefined', () => {
      const context: DiscountContext = { query: undefined };

      const canApply = calculator.canApply(context);

      expect(canApply).toBe(false);
      expect(mockPalindromeDetector.isPalindrome).not.toHaveBeenCalled();
    });

    it('should return false when query is null', () => {
      const context: DiscountContext = { query: null as any };

      const canApply = calculator.canApply(context);

      expect(canApply).toBe(false);
      expect(mockPalindromeDetector.isPalindrome).not.toHaveBeenCalled();
    });

    it('should return false when query is empty string', () => {
      const context: DiscountContext = { query: '' };

      const canApply = calculator.canApply(context);

      expect(canApply).toBe(false);
      expect(mockPalindromeDetector.isPalindrome).not.toHaveBeenCalled();
    });

    it('should handle whitespace-only queries', () => {
      const context: DiscountContext = { query: '   ' };
      mockPalindromeDetector.isPalindrome.mockReturnValue(false);

      const canApply = calculator.canApply(context);

      expect(canApply).toBe(false);
      expect(mockPalindromeDetector.isPalindrome).toHaveBeenCalledWith('   ');
    });

    it('should handle complex palindromes', () => {
      const context: DiscountContext = { query: 'A man, a plan, a canal: Panama!' };
      mockPalindromeDetector.isPalindrome.mockReturnValue(true);

      const canApply = calculator.canApply(context);

      expect(canApply).toBe(true);
      expect(mockPalindromeDetector.isPalindrome).toHaveBeenCalledWith('A man, a plan, a canal: Panama!');
    });

    it('should handle Unicode palindromes', () => {
      const context: DiscountContext = { query: 'ábbá' };
      mockPalindromeDetector.isPalindrome.mockReturnValue(true);

      const canApply = calculator.canApply(context);

      expect(canApply).toBe(true);
      expect(mockPalindromeDetector.isPalindrome).toHaveBeenCalledWith('ábbá');
    });
  });

  describe('integration behavior', () => {
    it('should apply discount only when canApply returns true', () => {
      const testProduct = createMockProduct(10000);
      
      // Test palindrome case
      const palindromeContext: DiscountContext = { query: 'oso' };
      mockPalindromeDetector.isPalindrome.mockReturnValue(true);
      
      expect(calculator.canApply(palindromeContext)).toBe(true);
      expect(calculator.calculateDiscount(testProduct, palindromeContext)).toBe(5000);

      // Reset mock for next test
      jest.clearAllMocks();

      // Test non-palindrome case
      const nonPalindromeContext: DiscountContext = { query: 'test' };
      mockPalindromeDetector.isPalindrome.mockReturnValue(false);
      
      expect(calculator.canApply(nonPalindromeContext)).toBe(false);
      expect(calculator.calculateDiscount(testProduct, nonPalindromeContext)).toBe(0);
    });
  });
});
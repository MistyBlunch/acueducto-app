import { describe, it, expect } from 'vitest';
import { isPalindrome, formatPrice, debounce } from '../utils';

describe('isPalindrome', () => {
  it('should return true for simple palindromes', () => {
    expect(isPalindrome('aba')).toBe(true);
    expect(isPalindrome('ana')).toBe(true);
    expect(isPalindrome('oso')).toBe(true);
    expect(isPalindrome('radar')).toBe(true);
  });

  it('should return false for non-palindromes', () => {
    expect(isPalindrome('hello')).toBe(false);
    expect(isPalindrome('world')).toBe(false);
    expect(isPalindrome('producto')).toBe(false);
    expect(isPalindrome('tienda')).toBe(false);
  });

  it('should handle case insensitive palindromes', () => {
    expect(isPalindrome('Aba')).toBe(true);
    expect(isPalindrome('ANA')).toBe(true);
    expect(isPalindrome('RaDaR')).toBe(true);
  });

  it('should handle palindromes with spaces and punctuation', () => {
    expect(isPalindrome('A man a plan a canal Panama')).toBe(true);
    expect(isPalindrome('race a car')).toBe(false);
    expect(isPalindrome('Was it a car or a cat I saw?')).toBe(true);
  });

  it('should handle empty string and single characters', () => {
    expect(isPalindrome('')).toBe(true);
    expect(isPalindrome('a')).toBe(true);
    expect(isPalindrome('A')).toBe(true);
  });

  it('should handle numbers and special characters', () => {
    expect(isPalindrome('12321')).toBe(true);
    expect(isPalindrome('12345')).toBe(false);
    expect(isPalindrome('!@#@!')).toBe(true);
  });

  it('should handle Unicode characters', () => {
    expect(isPalindrome('aña')).toBe(true);
    expect(isPalindrome('café')).toBe(false);
  });
});

describe('formatPrice', () => {
  it('should format all currencies as USD', () => {
    expect(formatPrice(1000, 'EUR')).toBe('$10.00');
    expect(formatPrice(2550, 'EUR')).toBe('$25.50');
    expect(formatPrice(99, 'EUR')).toBe('$0.99');
  });

  it('should format USD prices correctly', () => {
    expect(formatPrice(1000, 'USD')).toBe('$10.00');
    expect(formatPrice(2550, 'USD')).toBe('$25.50');
  });

  it('should handle zero and large amounts', () => {
    expect(formatPrice(0, 'USD')).toBe('$0.00');
    expect(formatPrice(1000000, 'USD')).toBe('$10,000.00');
  });

  it('should handle unknown currencies by defaulting to USD', () => {
    expect(formatPrice(1000, 'XYZ')).toBe('$10.00');
  });
});

describe('debounce', () => {
  it('should debounce function calls', async () => {
    let callCount = 0;
    let lastValue = '';

    const debouncedFn = debounce((value: string) => {
      callCount++;
      lastValue = value;
    }, 100);

    // Call function multiple times quickly
    debouncedFn('first');
    debouncedFn('second');
    debouncedFn('third');

    // Should not have been called yet
    expect(callCount).toBe(0);

    // Wait for debounce delay
    await new Promise(resolve => setTimeout(resolve, 150));

    // Should have been called only once with the last value
    expect(callCount).toBe(1);
    expect(lastValue).toBe('third');
  });

  it('should handle multiple debounce cycles', async () => {
    let callCount = 0;

    const debouncedFn = debounce(() => {
      callCount++;
    }, 50);

    debouncedFn();
    await new Promise(resolve => setTimeout(resolve, 70));
    expect(callCount).toBe(1);

    debouncedFn();
    await new Promise(resolve => setTimeout(resolve, 70));
    expect(callCount).toBe(2);
  });
});

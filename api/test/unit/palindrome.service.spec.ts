import { PalindromeService } from '../../src/core/services/palindrome.service';

describe('PalindromeService', () => {
  describe('isPalindrome', () => {
    it('should return true for simple Spanish palindromes', () => {
      expect(PalindromeService.isPalindrome('ana')).toBe(true);
      expect(PalindromeService.isPalindrome('reconocer')).toBe(true);
      expect(PalindromeService.isPalindrome('oso')).toBe(true);
    });

    it('should return true for symmetric strings', () => {
      expect(PalindromeService.isPalindrome('abba')).toBe(true);
      expect(PalindromeService.isPalindrome('aa')).toBe(true);
    });

    it('should return true for numeric palindromes', () => {
      expect(PalindromeService.isPalindrome('12321')).toBe(true);
    });

    it('should return false for non-palindromes', () => {
      expect(PalindromeService.isPalindrome('acueducto')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(PalindromeService.isPalindrome('')).toBe(false);
    });

    it('should return false for single character strings', () => {
      expect(PalindromeService.isPalindrome('a')).toBe(false);
    });

    it('should handle case insensitivity', () => {
      expect(PalindromeService.isPalindrome('Ana')).toBe(true);
      expect(PalindromeService.isPalindrome('RECONOCER')).toBe(true);
      expect(PalindromeService.isPalindrome('AbBa')).toBe(true);
    });

    it('should ignore spaces and punctuation', () => {
      expect(PalindromeService.isPalindrome('a man a plan a canal panama')).toBe(true);
      expect(PalindromeService.isPalindrome('Madam, I\'m Adam')).toBe(true);
      expect(PalindromeService.isPalindrome('Was it a car or a cat I saw?')).toBe(true);
    });

    it('should handle Unicode normalization and remove diacritics', () => {
      expect(PalindromeService.isPalindrome('áná')).toBe(true);
      expect(PalindromeService.isPalindrome('reconocér')).toBe(true);
      expect(PalindromeService.isPalindrome('ósö')).toBe(true);
    });

    it('should handle mixed alphanumeric palindromes', () => {
      expect(PalindromeService.isPalindrome('a1b2b1a')).toBe(true);
      expect(PalindromeService.isPalindrome('1a2a1')).toBe(true);
    });

    it('should return false for mixed alphanumeric non-palindromes', () => {
      expect(PalindromeService.isPalindrome('a1b2c1a')).toBe(false);
      expect(PalindromeService.isPalindrome('hello123')).toBe(false);
    });

    it('should handle whitespace-only strings as non-palindromes', () => {
      expect(PalindromeService.isPalindrome('   ')).toBe(false);
      expect(PalindromeService.isPalindrome('\t\n')).toBe(false);
    });

    it('should handle complex Unicode characters', () => {
      expect(PalindromeService.isPalindrome('café éfac')).toBe(true);
      expect(PalindromeService.isPalindrome('niño oñin')).toBe(true);
    });

    it('should return false for strings that become single char after normalization', () => {
      expect(PalindromeService.isPalindrome('!@#$%^&*()a')).toBe(false);
      expect(PalindromeService.isPalindrome('.,;:"\'1')).toBe(false);
    });
  });
});
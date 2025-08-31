import { SearchQuery } from '../../src/core/value-objects/search-query.vo';

describe('SearchQuery', () => {
  describe('create', () => {
    it('should trim input string', () => {
      const query = SearchQuery.create('  nike  ');
      expect(query.getValue()).toBe('nike');
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty string', () => {
      const query = SearchQuery.create('');
      expect(query.isEmpty()).toBe(true);
    });

    it('should return false for non-empty string', () => {
      const query = SearchQuery.create('nike');
      expect(query.isEmpty()).toBe(false);
    });
  });

  describe('hasMinimumLength', () => {
    it('should return false for strings shorter than 4 characters', () => {
      const query = SearchQuery.create('abc');
      expect(query.hasMinimumLength()).toBe(false);
    });

    it('should return true for strings with 4 or more characters', () => {
      const query = SearchQuery.create('nike');
      expect(query.hasMinimumLength()).toBe(true);
    });
  });

  describe('isPalindrome', () => {
    it('should delegate to PalindromeService and return true for palindromes', () => {
      const query = SearchQuery.create('ana');
      expect(query.isPalindrome()).toBe(true);
    });

    it('should delegate to PalindromeService and return false for non-palindromes', () => {
      const query = SearchQuery.create('acueducto');
      expect(query.isPalindrome()).toBe(false);
    });

    it('should handle empty query', () => {
      const query = SearchQuery.create('');
      expect(query.isPalindrome()).toBe(false);
    });

    it('should handle single character', () => {
      const query = SearchQuery.create('a');
      expect(query.isPalindrome()).toBe(false);
    });
  });

  describe('getExactMatchPattern', () => {
    it('should return lowercase version', () => {
      const query = SearchQuery.create('Nike Air Max');
      expect(query.getExactMatchPattern()).toBe('nike air max');
    });
  });

  describe('getILikePattern', () => {
    it('should wrap query with wildcards', () => {
      const query = SearchQuery.create('nike');
      expect(query.getILikePattern()).toBe('%nike%');
    });
  });
});
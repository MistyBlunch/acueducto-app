import { SearchQuery } from '../core/value-objects/search-query.vo';

describe('SearchQuery', () => {
  describe('create', () => {
    it('should create a search query and trim whitespace', () => {
      const query = SearchQuery.create('  nike  ');
      expect(query.getValue()).toBe('nike');
    });

    it('should create a search query with empty string', () => {
      const query = SearchQuery.create('');
      expect(query.getValue()).toBe('');
    });

    it('should create a search query with normal string', () => {
      const query = SearchQuery.create('adidas');
      expect(query.getValue()).toBe('adidas');
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty string', () => {
      const query = SearchQuery.create('');
      expect(query.isEmpty()).toBe(true);
    });

    it('should return true for whitespace-only string after trim', () => {
      const query = SearchQuery.create('   ');
      expect(query.isEmpty()).toBe(true);
    });

    it('should return false for non-empty string', () => {
      const query = SearchQuery.create('nike');
      expect(query.isEmpty()).toBe(false);
    });
  });

  describe('hasMinimumLength', () => {
    it('should return false for strings shorter than 4 characters', () => {
      expect(SearchQuery.create('abc').hasMinimumLength()).toBe(false);
      expect(SearchQuery.create('ab').hasMinimumLength()).toBe(false);
      expect(SearchQuery.create('a').hasMinimumLength()).toBe(false);
      expect(SearchQuery.create('').hasMinimumLength()).toBe(false);
    });

    it('should return true for strings with 4 or more characters', () => {
      expect(SearchQuery.create('nike').hasMinimumLength()).toBe(true);
      expect(SearchQuery.create('adidas').hasMinimumLength()).toBe(true);
      expect(SearchQuery.create('very long query').hasMinimumLength()).toBe(true);
    });
  });

  describe('getLength', () => {
    it('should return correct length of the query', () => {
      expect(SearchQuery.create('nike').getLength()).toBe(4);
      expect(SearchQuery.create('adidas').getLength()).toBe(6);
      expect(SearchQuery.create('').getLength()).toBe(0);
      expect(SearchQuery.create('a').getLength()).toBe(1);
    });
  });

  describe('toString', () => {
    it('should return the query value as string', () => {
      const query = SearchQuery.create('nike');
      expect(query.toString()).toBe('nike');
    });

    it('should return empty string for empty query', () => {
      const query = SearchQuery.create('');
      expect(query.toString()).toBe('');
    });
  });

  describe('getExactMatchPattern', () => {
    it('should return lowercase version of query', () => {
      expect(SearchQuery.create('Nike Air Max').getExactMatchPattern()).toBe('nike air max');
      expect(SearchQuery.create('ADIDAS').getExactMatchPattern()).toBe('adidas');
      expect(SearchQuery.create('MiXeD CaSe').getExactMatchPattern()).toBe('mixed case');
    });

    it('should handle empty query', () => {
      expect(SearchQuery.create('').getExactMatchPattern()).toBe('');
    });
  });

  describe('getILikePattern', () => {
    it('should wrap query with wildcards', () => {
      expect(SearchQuery.create('nike').getILikePattern()).toBe('%nike%');
      expect(SearchQuery.create('adidas').getILikePattern()).toBe('%adidas%');
      expect(SearchQuery.create('air max').getILikePattern()).toBe('%air max%');
    });

    it('should handle empty query', () => {
      expect(SearchQuery.create('').getILikePattern()).toBe('%%');
    });
  });

  describe('getValue', () => {
    it('should return the internal value', () => {
      const query = SearchQuery.create('test query');
      expect(query.getValue()).toBe('test query');
    });

    it('should return trimmed value', () => {
      const query = SearchQuery.create('  trimmed  ');
      expect(query.getValue()).toBe('trimmed');
    });
  });
});
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

  describe('getLength', () => {
    it('should return the length of the query', () => {
      const query = SearchQuery.create('nike');
      expect(query.getLength()).toBe(4);
    });

    it('should return 0 for empty query', () => {
      const query = SearchQuery.create('');
      expect(query.getLength()).toBe(0);
    });
  });

  describe('toString', () => {
    it('should return the query value', () => {
      const query = SearchQuery.create('nike');
      expect(query.toString()).toBe('nike');
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
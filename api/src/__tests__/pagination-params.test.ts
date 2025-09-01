import { normalizePagination, PaginationParams } from '../core/value-objects/pagination-params.vo';

describe('PaginationParams', () => {
  describe('normalizePagination', () => {
    describe('page parameter', () => {
      it('should return page 1 when no params provided', () => {
        const result = normalizePagination();
        expect(result.page).toBe(1);
      });

      it('should return page 1 when page is undefined', () => {
        const result = normalizePagination({ page: undefined });
        expect(result.page).toBe(1);
      });

      it('should return valid page number when provided', () => {
        const result = normalizePagination({ page: 5 });
        expect(result.page).toBe(5);
      });

      it('should return page 1 when page is 0 or negative', () => {
        expect(normalizePagination({ page: 0 }).page).toBe(1);
        expect(normalizePagination({ page: -1 }).page).toBe(1);
        expect(normalizePagination({ page: -10 }).page).toBe(1);
      });

      it('should floor decimal page numbers', () => {
        const result = normalizePagination({ page: 3.7 });
        expect(result.page).toBe(3);
      });

      it('should handle string page numbers', () => {
        const result = normalizePagination({ page: '5' as any });
        expect(result.page).toBe(5);
      });

      it('should return page 1 for invalid string page numbers', () => {
        const result = normalizePagination({ page: 'invalid' as any });
        expect(result.page).toBe(1);
      });

      it('should handle large page numbers', () => {
        const result = normalizePagination({ page: 999999 });
        expect(result.page).toBe(999999);
      });
    });

    describe('pageSize parameter', () => {
      it('should return pageSize 12 when no params provided', () => {
        const result = normalizePagination();
        expect(result.pageSize).toBe(12);
      });

      it('should return pageSize 12 when pageSize is undefined', () => {
        const result = normalizePagination({ pageSize: undefined });
        expect(result.pageSize).toBe(12);
      });

      it('should return valid pageSize when provided', () => {
        const result = normalizePagination({ pageSize: 20 });
        expect(result.pageSize).toBe(20);
      });

      it('should return pageSize 1 when pageSize is 0 or negative', () => {
        expect(normalizePagination({ pageSize: 0 }).pageSize).toBe(1);
        expect(normalizePagination({ pageSize: -5 }).pageSize).toBe(1);
      });

      it('should cap pageSize at 100', () => {
        expect(normalizePagination({ pageSize: 150 }).pageSize).toBe(100);
        expect(normalizePagination({ pageSize: 100 }).pageSize).toBe(100);
      });

      it('should floor decimal pageSize numbers', () => {
        const result = normalizePagination({ pageSize: 15.7 });
        expect(result.pageSize).toBe(15);
      });

      it('should handle string pageSize numbers', () => {
        const result = normalizePagination({ pageSize: '25' as any });
        expect(result.pageSize).toBe(25);
      });

      it('should return pageSize 1 for invalid string pageSize numbers', () => {
        const result = normalizePagination({ pageSize: 'invalid' as any });
        expect(result.pageSize).toBe(1);
      });
    });

    describe('combined parameters', () => {
      it('should normalize both page and pageSize together', () => {
        const result = normalizePagination({ page: 3, pageSize: 25 });
        expect(result.page).toBe(3);
        expect(result.pageSize).toBe(25);
      });

      it('should handle empty object', () => {
        const result = normalizePagination({});
        expect(result.page).toBe(1);
        expect(result.pageSize).toBe(12);
      });

      it('should normalize invalid values for both parameters', () => {
        const result = normalizePagination({ page: -1, pageSize: 200 });
        expect(result.page).toBe(1);
        expect(result.pageSize).toBe(100);
      });

      it('should handle zero values for both parameters', () => {
        const result = normalizePagination({ page: 0, pageSize: 0 });
        expect(result.page).toBe(1);
        expect(result.pageSize).toBe(1);
      });

      it('should return correct interface', () => {
        const result = normalizePagination({ page: 2, pageSize: 15 });
        
        expect(typeof result.page).toBe('number');
        expect(typeof result.pageSize).toBe('number');
        expect(Object.keys(result)).toEqual(['page', 'pageSize']);
      });
    });
  });
});
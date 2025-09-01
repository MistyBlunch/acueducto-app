import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@/test/utils';
import { useProductSearch } from '../use-product-search';
import * as apiModule from '@/lib/api';

// Mock the API client
vi.mock('@/lib/api', () => ({
  apiClient: {
    searchProducts: vi.fn(),
  },
}));

// Mock utils
vi.mock('@/lib/utils', () => ({
  isPalindrome: (str: string) => {
    const normalized = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    return normalized === normalized.split('').reverse().join('');
  },
  debounce: <F extends (...args: unknown[]) => void>(fn: F, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>; // evita NodeJS.Timeout vs number
    return (...args: Parameters<F>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  },
  formatPrice: (cents: number, currency: string) =>
    `${currency} ${(cents / 100).toFixed(2)}`,
}));

const mockApiResponse = {
  items: [
    {
      id: '1',
      title: 'Test Product',
      brand: 'Test Brand',
      description: 'Test description',
      priceCents: 1000,
      currency: 'EUR',
      stock: 10,
      createdAt: '2024-01-01T00:00:00Z',
    },
  ],
  pagination: {
    page: 1,
    pageSize: 12,
    total: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  meta: {
    query: 'test',
    isPalindrome: false,
    executedAt: '2024-01-01T00:00:00Z',
    executionTimeMs: 50,
  },
};

describe('useProductSearch', () => {
  const mockSearchProducts = vi.mocked(apiModule.apiClient.searchProducts);

  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchProducts.mockResolvedValue(mockApiResponse);
  });

  it('should initialize with provided query', () => {
    const { result } = renderHook(() => useProductSearch('test query'));

    expect(result.current.query).toBe('test query');
    expect(result.current.debouncedQuery).toBe('test query');
  });

  it('should detect palindromes correctly', () => {
    const { result } = renderHook(() => useProductSearch('oso'));

    expect(result.current.isPalindromeQuery).toBe(true);
  });

  it('should not detect non-palindromes as palindromes', () => {
    const { result } = renderHook(() => useProductSearch('raqueta'));

    expect(result.current.isPalindromeQuery).toBe(false);
  });

  it('should not consider short strings as palindromes even if they are', () => {
    const { result } = renderHook(() => useProductSearch('aa'));

    expect(result.current.isPalindromeQuery).toBe(false);
  });

  it('should update query and trigger search', async () => {
    const { result } = renderHook(() => useProductSearch());

    // Update query
    await act(async () => {
      result.current.updateQuery('test');
    });

    await waitFor(() => {
      expect(result.current.query).toBe('test');
    });

    // Should eventually trigger search (after debounce)
    await waitFor(() => {
      expect(result.current.debouncedQuery).toBe('test');
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockSearchProducts).toHaveBeenCalledWith({
      query: 'test',
      page: 1,
      pageSize: 12,
    });
  });

  it('should handle pagination', async () => {
    const { result } = renderHook(() => useProductSearch('test'));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Change page
    await act(async () => {
      result.current.setPage(2);
    });

    await waitFor(() => {
      expect(result.current.page).toBe(2);
    });

    await waitFor(() => {
      expect(mockSearchProducts).toHaveBeenCalledWith({
        query: 'test',
        page: 2,
        pageSize: 12,
      });
    });
  });

  it('should reset page when query changes', async () => {
    const { result } = renderHook(() => useProductSearch('test'));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Change page
    await act(async () => {
      result.current.setPage(2);
    });
    await waitFor(() => {
      expect(result.current.page).toBe(2);
    });

    // Update query - should reset page
    await act(async () => {
      result.current.updateQuery('new query');
    });

    await waitFor(() => {
      expect(result.current.page).toBe(1);
    });
  });

  it('should handle empty results', async () => {
    const emptyResponse = {
      ...mockApiResponse,
      items: [],
      pagination: { ...mockApiResponse.pagination, total: 0 },
    };
    mockSearchProducts.mockResolvedValueOnce(emptyResponse);

    const { result } = renderHook(() => useProductSearch('test'));

    await waitFor(() => {
      expect(result.current.isEmpty).toBe(true);
    });

    expect(result.current.state).toBe('empty');
    expect(result.current.data?.items).toHaveLength(0);
  });

  it('should provide search metadata', async () => {
    const { result } = renderHook(() => useProductSearch('test'));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.searchMetadata).toEqual({
      total: 1,
      executionTimeMs: 50,
      isPalindrome: false,
      executedAt: '2024-01-01T00:00:00Z',
    });
  });

  it('should handle pagination helpers correctly', async () => {
    const multiPageResponse = {
      ...mockApiResponse,
      pagination: {
        ...mockApiResponse.pagination,
        total: 25,
        totalPages: 3,
        hasNextPage: true,
        hasPreviousPage: false,
      },
    };
    mockSearchProducts.mockResolvedValueOnce(multiPageResponse);

    const { result } = renderHook(() => useProductSearch('test'));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.hasPreviousPage).toBe(false);
  });

  it('should not search for empty queries', async () => {
    const { result } = renderHook(() => useProductSearch(''));

    // Should be in idle state
    expect(result.current.state).toBe('idle');
    expect(result.current.isIdle).toBe(true);

    // Wait a bit to ensure no async search is triggered
    await new Promise(resolve => setTimeout(resolve, 100));

    // Should not call API for empty query
    expect(mockSearchProducts).not.toHaveBeenCalled();
  });

  it('should support custom page size', async () => {
    const { result } = renderHook(() => useProductSearch('test', 20));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockSearchProducts).toHaveBeenCalledWith({
      query: 'test',
      page: 1,
      pageSize: 20,
    });
  });
});

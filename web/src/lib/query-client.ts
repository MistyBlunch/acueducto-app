import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && 'statusCode' in error) {
          const statusCode = (error as any).statusCode
          if (statusCode >= 400 && statusCode < 500) {
            return false
          }
        }
        return failureCount < 3
      },
      refetchOnWindowFocus: false,
    },
  },
})

// Query keys factory
export const queryKeys = {
  all: ['products'] as const,
  search: (params: { query?: string; page?: number; pageSize?: number }) => 
    [...queryKeys.all, 'search', params] as const,
}
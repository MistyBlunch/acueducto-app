'use client'

import { useQuery } from '@tanstack/react-query'
import { useState, useEffect, useMemo } from 'react'
import { apiClient } from '@/lib/api'
import { queryKeys } from '@/lib/query-client'
import { ProductsResponseSchema, type ProductsResponse } from '@/types/api'
import { isPalindrome, debounce } from '@/lib/utils'

export type SearchState = 'idle' | 'loading' | 'success' | 'error' | 'empty'

export interface UseProductSearchResult {
  // Data
  data?: ProductsResponse
  
  // States
  state: SearchState
  isIdle: boolean
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  isEmpty: boolean
  
  // Query info
  query: string
  debouncedQuery: string
  isPalindromeQuery: boolean
  
  // Error handling
  error: Error | null
  retry: () => void
  
  // Pagination
  page: number
  setPage: (page: number) => void
  hasNextPage: boolean
  hasPreviousPage: boolean
  
  // Search metadata
  searchMetadata?: {
    total: number
    executionTimeMs: number
    isPalindrome: boolean
    executedAt: string
  }
}

export function useProductSearch(
  initialQuery: string = '',
  pageSize: number = 12
): UseProductSearchResult {
  const [query, setQuery] = useState(initialQuery)
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery)
  const [page, setPage] = useState(1)

  // Debounce search query
  const debouncedSetQuery = useMemo(
    () => debounce((newQuery: string) => {
      setDebouncedQuery(newQuery)
      setPage(1) // Reset page when query changes
    }, 300),
    []
  )

  useEffect(() => {
    setQuery(initialQuery)
    debouncedSetQuery(initialQuery)
  }, [initialQuery, debouncedSetQuery])

  // Update query and trigger debounced search
  const updateQuery = (newQuery: string) => {
    setQuery(newQuery)
    debouncedSetQuery(newQuery)
  }

  // Check if query is palindrome
  const isPalindromeQuery = useMemo(
    () => isPalindrome(debouncedQuery.trim()) && debouncedQuery.trim().length >= 3,
    [debouncedQuery]
  )

  // Determine if search should be enabled - always search, even with empty query to show all products
  const shouldSearch = true

  // React Query
  const queryResult = useQuery({
    queryKey: queryKeys.search({ 
      query: debouncedQuery, 
      page, 
      pageSize 
    }),
    queryFn: async () => {
      console.log(`🔍 Searching products with query: "${debouncedQuery}", page: ${page}, pageSize: ${pageSize}`)
      
      try {
        const response = await apiClient.searchProducts({
          query: debouncedQuery,
          page,
          pageSize,
        })
        
        console.log(`✅ Search successful. Found ${response.items?.length || 0} items`)
        
        // Validate response with Zod
        const validatedResponse = ProductsResponseSchema.parse(response)
        return validatedResponse
      } catch (error) {
        console.error('❌ Search failed:', error)
        throw error
      }
    },
    enabled: shouldSearch,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx)
      if (error && 'statusCode' in error) {
        const statusCode = (error as any).statusCode
        if (statusCode >= 400 && statusCode < 500) {
          console.log(`🚫 Not retrying client error: ${statusCode}`)
          return false
        }
      }
      console.log(`🔄 Retrying search (attempt ${failureCount + 1}/3)`)
      return failureCount < 3
    },
  })

  // Determine current state
  const state: SearchState = useMemo(() => {
    if (queryResult.isLoading) return 'loading'
    if (queryResult.isError) return 'error'
    if (queryResult.data && queryResult.data.items.length === 0) return 'empty'
    if (queryResult.data && queryResult.data.items.length > 0) return 'success'
    return 'loading'
  }, [queryResult.isLoading, queryResult.isError, queryResult.data])

  // Search metadata
  const searchMetadata = useMemo(() => {
    if (!queryResult.data?.meta) return undefined
    
    return {
      total: queryResult.data.pagination.total,
      executionTimeMs: queryResult.data.meta.executionTimeMs,
      isPalindrome: queryResult.data.meta.isPalindrome,
      executedAt: queryResult.data.meta.executedAt,
    }
  }, [queryResult.data])

  // Pagination helpers
  const hasNextPage = queryResult.data?.pagination.hasNextPage ?? false
  const hasPreviousPage = queryResult.data?.pagination.hasPreviousPage ?? false

  // Return comprehensive result object
  return {
    // Data
    data: queryResult.data,
    
    // States
    state,
    isIdle: state === 'idle',
    isLoading: state === 'loading',
    isSuccess: state === 'success',
    isError: state === 'error',
    isEmpty: state === 'empty',
    
    // Query info
    query,
    debouncedQuery,
    isPalindromeQuery,
    
    // Error handling
    error: queryResult.error,
    retry: queryResult.refetch,
    
    // Pagination
    page,
    setPage,
    hasNextPage,
    hasPreviousPage,
    
    // Search metadata
    searchMetadata,
    
    // Internal query management (for external use)
    updateQuery,
  } as UseProductSearchResult & { updateQuery: (query: string) => void }
}
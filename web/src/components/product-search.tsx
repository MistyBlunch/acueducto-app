'use client';

import { useEffect } from 'react';
import { useProductSearch } from '@/hooks/use-product-search';
import { SearchBar } from '@/components/search-bar';
import { IdleState } from '@/components/search-states/idle-state';
import { LoadingState } from '@/components/search-states/loading-state';
import { ErrorState } from '@/components/search-states/error-state';
import { EmptyState } from '@/components/search-states/empty-state';
import { SuccessState } from '@/components/search-states/success-state';

interface ProductSearchProps {
  initialQuery?: string;
  pageSize?: number;
}

export function ProductSearch({
  initialQuery = '',
  pageSize = 12,
}: ProductSearchProps) {
  const search = useProductSearch(initialQuery, pageSize);

  useEffect(() => {
    const handleSearchSuggestion = (event: CustomEvent<string>) => {
      search.updateQuery(event.detail);
    };

    window.addEventListener(
      'search-suggestion',
      handleSearchSuggestion as EventListener,
    );
    return () => {
      window.removeEventListener(
        'search-suggestion',
        handleSearchSuggestion as EventListener,
      );
    };
  }, [search]);

  const handleSearch = (query: string) => {
    search.updateQuery(query);
  };

  const renderSearchState = () => {
    switch (search.state) {
      case 'idle':
        return (
          <IdleState
            isPalindromeQuery={search.isPalindromeQuery}
            query={search.debouncedQuery}
          />
        );

      case 'loading':
        return (
          <LoadingState
            query={search.debouncedQuery}
            isPalindromeQuery={search.isPalindromeQuery}
          />
        );

      case 'error':
        return (
          <ErrorState
            error={search.error!}
            query={search.debouncedQuery}
            onRetry={search.retry}
          />
        );

      case 'empty':
        return <EmptyState query={search.debouncedQuery} />;

      case 'success':
        return (
          <SuccessState
            data={search.data!}
            query={search.debouncedQuery}
            page={search.page}
            onPageChange={search.setPage}
            hasNextPage={search.hasNextPage}
            hasPreviousPage={search.hasPreviousPage}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="sticky top-4 z-10">
        <SearchBar
          onSearch={handleSearch}
          isLoading={search.isLoading}
          placeholder="Buscar productos..."
        />
      </div>

      <div className="min-h-[400px]">
        {search.debouncedQuery.trim() === '' && search.allProductsData ? (
          <SuccessState
            data={search.allProductsData}
            query=""
            page={search.page}
            onPageChange={search.setPage}
            hasNextPage={search.hasNextPage}
            hasPreviousPage={search.hasPreviousPage}
          />
        ) : (
          renderSearchState()
        )}
      </div>
    </div>
  );
}

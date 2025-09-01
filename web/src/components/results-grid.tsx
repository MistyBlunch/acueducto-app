import { ProductCard } from '@/components/product-card';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { Product, type ProductsResponse } from '@/types/api';

interface ResultsGridProps {
  data?: ProductsResponse;
  isLoading: boolean;
  error?: Error | null;
  query?: string;
}

export function ResultsGrid({
  data,
  isLoading,
  error,
  query,
}: ResultsGridProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorState error={error} query={query} />;
  }

  if (!data || data.items.length === 0) {
    return <EmptyState query={query} />;
  }

  return (
    <div className="space-y-6">
      {/* Search metadata */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-muted-foreground">
        <div className="flex flex-wrap items-center gap-4">
          <span>
            {data.pagination.total} resultado
            {data.pagination.total !== 1 ? 's' : ''} encontrado
            {data.pagination.total !== 1 ? 's' : ''}
          </span>
          {data.meta.query && <span>para "{data.meta.query}"</span>}
        </div>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.items.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination info */}
      {data.pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground">
          <span>
            Página {data.pagination.page} de {data.pagination.totalPages}
          </span>
        </div>
      )}
    </div>
  );
}

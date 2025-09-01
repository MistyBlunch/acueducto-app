import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  TrendingUp,
  CheckCircle,
} from 'lucide-react';
import { type ProductsResponse } from '@/types/api';

interface SuccessStateProps {
  data: ProductsResponse;
  query: string;
  page: number;
  onPageChange: (page: number) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function SuccessState({
  data,
  query,
  page,
  onPageChange,
  hasNextPage,
  hasPreviousPage,
}: SuccessStateProps) {
  const { items, pagination, meta } = data;

  return (
    <div className="space-y-6">
      <Card className="bg-success/5 border-success/20">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="font-semibold">
                  {pagination.total} resultado
                  {pagination.total !== 1 ? 's' : ''} encontrado
                  {pagination.total !== 1 ? 's' : ''}
                </span>
              </div>

              {query && (
                <Badge variant="outline" className="text-xs">
                  "{query}"
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {pagination.totalPages > 1 && (
                <span>
                  Página {pagination.page} de {pagination.totalPages}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {meta.isPalindrome && (
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-primary" />
              <div>
                <h3 className="font-semibold text-primary">
                  ¡Descuento palíndromo activo!
                </h3>
                <p className="text-sm text-muted-foreground">
                  Todos los productos mostrados tienen un 50% de descuento
                  aplicado automáticamente porque buscaste "{query}" (un
                  palíndromo).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((product, index) => (
          <div
            key={product.id}
            className="animate-in fade-in-50 duration-500"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Mostrando {(pagination.page - 1) * pagination.pageSize + 1}-
                {Math.min(
                  pagination.page * pagination.pageSize,
                  pagination.total,
                )}{' '}
                de {pagination.total} productos
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(page - 1)}
                  disabled={!hasPreviousPage}
                  className="gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(pagination.totalPages, 5) },
                    (_, i) => {
                      let pageNum: number;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={pageNum === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => onPageChange(pageNum)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    },
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(page + 1)}
                  disabled={!hasNextPage}
                  className="gap-1"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

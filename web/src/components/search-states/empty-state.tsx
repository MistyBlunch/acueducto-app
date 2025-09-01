import { Card, CardContent } from '@/components/ui/card';
import { Search, TrendingUp } from 'lucide-react';
import { isPalindrome } from '@/lib/utils';

interface EmptyStateProps {
  query: string;
}

export function EmptyState({ query }: EmptyStateProps) {
  const isQueryPalindrome = isPalindrome(query.trim());

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6 relative">
        <Search className="w-10 h-10 text-muted-foreground" />
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-warning rounded-full flex items-center justify-center">
          <span className="text-xs">0</span>
        </div>
      </div>

      <h3 className="text-2xl font-semibold mb-2">No encontramos productos</h3>

      <p className="text-muted-foreground max-w-md mb-4">
        No hay productos que coincidan con tu búsqueda.
      </p>

      {isQueryPalindrome && (
        <Card className="bg-gradient-to-r from-secondary/10 to-primary/10 border-primary/30 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                ¡Palíndromo detectado!
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Aunque no encontramos productos para "{query}", cualquier producto
              que encuentres con búsquedas palíndromas tendrá 50% de descuento
              automático.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

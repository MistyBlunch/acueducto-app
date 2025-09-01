import { Search } from 'lucide-react';

interface EmptyStateProps {
  query?: string;
}

export function EmptyState({ query }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <Search className="w-8 h-8 text-muted-foreground" />
      </div>

      {query ? (
        <>
          <h3 className="text-xl font-semibold mb-2">
            No se encontraron productos
          </h3>
          <p className="text-muted-foreground max-w-md mb-4">
            No encontramos productos que coincidan con tu búsqueda "{query}".
          </p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>💡 Prueba con:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Términos más generales</li>
              <li>Verificar la ortografía</li>
              <li>
                Palabras palíndromas para obtener descuentos (ej: "ana", "oso",
                "radar")
              </li>
            </ul>
          </div>
        </>
      ) : (
        <>
          <h3 className="text-xl font-semibold mb-2">
            Busca productos de tenis
          </h3>
          <p className="text-muted-foreground max-w-md">
            Usa la barra de búsqueda para encontrar productos en nuestra tienda.
          </p>
          <div className="mt-4 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
            <p className="text-sm text-primary font-medium">
              🎯 ¡Tip especial! Busca palabras palíndromas (como "ana", "oso",
              "radar") para obtener un 50% de descuento automático.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

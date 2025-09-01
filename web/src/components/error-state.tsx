import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ApiException } from '@/types/api';

interface ErrorStateProps {
  error: Error;
  query?: string;
  onRetry?: () => void;
}

export function ErrorState({ error, query, onRetry }: ErrorStateProps) {
  const getErrorMessage = () => {
    if (error instanceof ApiException) {
      switch (error.statusCode) {
        case 400:
          return 'Los parámetros de búsqueda no son válidos.';
        case 404:
          return 'El servicio de búsqueda no está disponible.';
        case 500:
          return 'Error interno del servidor. Por favor, intenta más tarde.';
        default:
          return error.message || 'Error desconocido del servidor.';
      }
    }

    if (error.message.includes('fetch')) {
      return 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
    }

    return error.message || 'Ocurrió un error inesperado.';
  };

  const getErrorTitle = () => {
    if (error instanceof ApiException && error.statusCode >= 500) {
      return 'Error del servidor';
    }

    if (error.message.includes('fetch')) {
      return 'Error de conexión';
    }

    return 'Error en la búsqueda';
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>

      <h3 className="text-xl font-semibold mb-2 text-destructive">
        {getErrorTitle()}
      </h3>

      <p className="text-muted-foreground max-w-md mb-4">{getErrorMessage()}</p>

      {query && (
        <p className="text-sm text-muted-foreground mb-4">
          Error al buscar: "{query}"
        </p>
      )}

      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Intentar nuevamente
        </Button>
      )}

      {error instanceof ApiException && error.requestId && (
        <p className="text-xs text-muted-foreground mt-4">
          ID de error: {error.requestId}
        </p>
      )}
    </div>
  );
}

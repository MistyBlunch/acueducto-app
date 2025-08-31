import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react'
import { ApiException } from '@/types/api'

interface ErrorStateProps {
  error: Error
  query?: string
  onRetry: () => void
  isRetrying?: boolean
}

export function ErrorState({ error, query, onRetry, isRetrying }: ErrorStateProps) {
  const getErrorInfo = () => {
    if (error instanceof ApiException) {
      switch (error.statusCode) {
        case 0:
          return {
            icon: WifiOff,
            title: 'Error de conexión',
            message: error.error || 'No se pudo conectar con la API. Verifica que esté ejecutándose en http://localhost:3001',
            color: 'text-destructive',
            bgColor: 'bg-destructive/10',
            canRetry: true
          }
        case 400:
          return {
            icon: AlertCircle,
            title: 'Consulta inválida',
            message: 'Los parámetros de búsqueda no son válidos. Intenta con términos diferentes.',
            color: 'text-warning',
            bgColor: 'bg-warning/10',
            canRetry: false
          }
        case 404:
          return {
            icon: WifiOff,
            title: 'Servicio no encontrado',
            message: error.error || 'El servicio de búsqueda no está disponible. Verifica que la API esté ejecutándose.',
            color: 'text-destructive',
            bgColor: 'bg-destructive/10',
            canRetry: true
          }
        case 429:
          return {
            icon: AlertCircle,
            title: 'Demasiadas búsquedas',
            message: 'Has realizado muchas búsquedas. Espera un momento antes de intentar de nuevo.',
            color: 'text-warning',
            bgColor: 'bg-warning/10',
            canRetry: true
          }
        case 500:
          return {
            icon: AlertCircle,
            title: 'Error del servidor',
            message: error.error || 'Error interno del servidor. Verifica que la API esté funcionando correctamente.',
            color: 'text-destructive',
            bgColor: 'bg-destructive/10',
            canRetry: true
          }
        case 502:
        case 503:
        case 504:
          return {
            icon: WifiOff,
            title: 'Servidor no disponible',
            message: error.error || 'El servidor no está disponible. Intenta nuevamente en unos momentos.',
            color: 'text-destructive',
            bgColor: 'bg-destructive/10',
            canRetry: true
          }
        default:
          return {
            icon: AlertCircle,
            title: 'Error desconocido',
            message: error.error || error.message || 'Ha ocurrido un error inesperado.',
            color: 'text-destructive',
            bgColor: 'bg-destructive/10',
            canRetry: true
          }
      }
    }
    
    if (error.message.includes('fetch')) {
      return {
        icon: WifiOff,
        title: 'Error de conexión',
        message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
        color: 'text-destructive',
        bgColor: 'bg-destructive/10',
        canRetry: true
      }
    }
    
    return {
      icon: AlertCircle,
      title: 'Error inesperado',
      message: error.message || 'Ha ocurrido un error inesperado. Intenta de nuevo.',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      canRetry: true
    }
  }

  const errorInfo = getErrorInfo()
  const Icon = errorInfo.icon

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className={`w-20 h-20 ${errorInfo.bgColor} rounded-full flex items-center justify-center mb-6`}>
        <Icon className={`w-10 h-10 ${errorInfo.color}`} />
      </div>
      
      <h3 className={`text-2xl font-semibold mb-2 ${errorInfo.color}`}>
        {errorInfo.title}
      </h3>
      
      <p className="text-muted-foreground max-w-md mb-4">
        {errorInfo.message}
      </p>
      
      {query && (
        <Card className="bg-muted/50 border-dashed mb-6">
          <CardContent className="p-3">
            <p className="text-sm text-muted-foreground">
              Error al buscar: <span className="font-medium text-foreground">"{query}"</span>
            </p>
          </CardContent>
        </Card>
      )}
      
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        {errorInfo.canRetry && (
          <Button 
            onClick={onRetry} 
            disabled={isRetrying}
            variant="outline" 
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'Intentando...' : 'Intentar nuevamente'}
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          onClick={() => window.location.reload()}
          className="gap-2"
        >
          <Wifi className="w-4 h-4" />
          Recargar página
        </Button>
      </div>
      
      {error instanceof ApiException && error.requestId && (
        <Card className="mt-6 bg-muted/30">
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">
              ID de error: <span className="font-mono">{error.requestId}</span>
            </p>
          </CardContent>
        </Card>
      )}

      {/* Status indicator */}
      <div className="mt-6 flex items-center gap-2">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
          <span className="text-xs text-muted-foreground">Desconectado</span>
        </div>
        <Badge variant="outline" className="text-xs">
          Error {error instanceof ApiException ? error.statusCode : 'NETWORK'}
        </Badge>
      </div>
    </div>
  )
}
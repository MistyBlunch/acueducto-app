import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Lightbulb, TrendingUp, Filter } from 'lucide-react'
import { isPalindrome } from '@/lib/utils'

interface EmptyStateProps {
  query: string
  searchMetadata?: {
    total: number
    executionTimeMs: number
    isPalindrome: boolean
    executedAt: string
  }
  onClearSearch?: () => void
}

export function EmptyState({ query, searchMetadata, onClearSearch }: EmptyStateProps) {
  const isQueryPalindrome = isPalindrome(query.trim())
  
  // Generate search suggestions based on the query
  const getSuggestions = () => {
    const queryWords = query.toLowerCase().trim().split(' ')
    const suggestions = []
    
    // Product-related suggestions
    if (queryWords.some(word => ['producto', 'item'].includes(word))) {
      suggestions.push('productos populares', 'productos nuevos', 'productos destacados')
    } else if (queryWords.some(word => ['accesorios', 'equipos'].includes(word))) {
      suggestions.push('accesorios deportivos', 'equipos premium', 'accesorios populares')
    } else if (queryWords.some(word => ['ropa', 'camiseta', 'shorts'].includes(word))) {
      suggestions.push('ropa casual', 'ropa deportiva', 'vestimenta')
    } else {
      // Default suggestions
      suggestions.push('productos populares', 'ofertas especiales', 'nuevos productos', 'categorías')
    }
    
    return suggestions.slice(0, 3)
  }

  const suggestions = getSuggestions()
  
  // Palindrome suggestions for discounts
  const palindromeSuggestions = ['ana', 'oso', 'radar', 'level', 'civic', 'noon']

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6 relative">
        <Search className="w-10 h-10 text-muted-foreground" />
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-warning rounded-full flex items-center justify-center">
          <span className="text-xs">0</span>
        </div>
      </div>
      
      <h3 className="text-2xl font-semibold mb-2">
        No encontramos productos
      </h3>
      
      <p className="text-muted-foreground max-w-md mb-4">
        No hay productos que coincidan con tu búsqueda.
      </p>

      <Card className="bg-muted/50 border-dashed mb-6 max-w-lg">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Buscaste:</span>
          </div>
          <Badge variant="outline" className="text-sm">
            "{query}"
          </Badge>
          {searchMetadata && (
            <div className="mt-2 text-xs text-muted-foreground">
              Búsqueda completada en {searchMetadata.executionTimeMs}ms
              {searchMetadata.isPalindrome && (
                <span className="text-primary font-medium"> • Palíndromo detectado</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Palindrome suggestion if current query is palindrome */}
      {isQueryPalindrome && (
        <Card className="bg-gradient-to-r from-secondary/10 to-primary/10 border-primary/30 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">¡Palíndromo detectado!</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Aunque no encontramos productos para "{query}", cualquier producto que encuentres
              con búsquedas palíndromas tendrá 50% de descuento automático.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Search suggestions */}
      <Card className="bg-background border-dashed max-w-2xl mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-warning" />
            <h4 className="font-semibold">Sugerencias de búsqueda:</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div>
              <h5 className="text-sm font-medium mb-2 text-primary">Términos relacionados:</h5>
              <div className="flex flex-wrap gap-1">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => window.dispatchEvent(new CustomEvent('search-suggestion', { detail: suggestion }))}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <h5 className="text-sm font-medium mb-2 text-primary">Palíndromos (50% descuento):</h5>
              <div className="flex flex-wrap gap-1">
                {palindromeSuggestions.map((palindrome, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-primary hover:bg-primary/10"
                    onClick={() => window.dispatchEvent(new CustomEvent('search-suggestion', { detail: palindrome }))}
                  >
                    🎯 {palindrome}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-dashed">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Filter className="w-3 h-3" />
              <span>Prueba con términos más generales o verifica la ortografía</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex gap-3">
        {onClearSearch && (
          <Button variant="outline" onClick={onClearSearch}>
            <Search className="w-4 h-4 mr-2" />
            Nueva búsqueda
          </Button>
        )}
        
        <Button 
          variant="ghost"
          onClick={() => window.dispatchEvent(new CustomEvent('search-suggestion', { detail: 'raquetas' }))}
        >
          Ver todas las raquetas
        </Button>
      </div>

      {/* Status indicator */}
      <div className="mt-8 flex items-center gap-2">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-success rounded-full" />
          <span className="text-xs text-muted-foreground">Conectado</span>
        </div>
        <Badge variant="outline" className="text-xs">
          0 resultados
        </Badge>
      </div>
    </div>
  )
}
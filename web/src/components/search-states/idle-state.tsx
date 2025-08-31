import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Sparkles } from 'lucide-react'

interface IdleStateProps {
  isPalindromeQuery?: boolean
  query?: string
}

export function IdleState({ isPalindromeQuery, query }: IdleStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-6">
        <Search className="w-10 h-10 text-primary" />
      </div>
      
      <h3 className="text-2xl font-semibold mb-4">
        🛒 Busca productos
      </h3>
      
      <p className="text-muted-foreground max-w-md mb-6">
        Escribe el nombre de un producto para comenzar tu búsqueda.
        Encuentra los mejores productos en nuestra tienda.
      </p>

      {/* Palindrome hint */}
      {isPalindromeQuery && query && (
        <Card className="bg-gradient-to-r from-secondary/10 to-primary/10 border-primary/30 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <div>
                <Badge variant="palindrome" className="mb-2">
                  ¡Palíndromo detectado!
                </Badge>
                <p className="text-sm text-primary font-medium">
                  "{query}" es un palíndromo. ¡Obtendrás 50% de descuento automático!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="bg-muted/50 border-dashed max-w-lg">
        <CardContent className="p-6">
          <h4 className="font-semibold mb-3" style={{ color: '#1a4ce0' }}>💡 Tips de búsqueda:</h4>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#1a4ce0' }} />
              Usa términos específicos para encontrar productos
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#4a90e2' }} />
              Prueba palabras palíndromas para descuentos: "ana", "oso", "radar"
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              Busca por marca, categoría o material
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
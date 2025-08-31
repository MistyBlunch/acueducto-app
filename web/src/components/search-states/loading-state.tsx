import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'

interface LoadingStateProps {
  query?: string
  isPalindromeQuery?: boolean
}

export function LoadingState({ query, isPalindromeQuery }: LoadingStateProps) {
  return (
    <div className="space-y-6">
      {/* Search status */}
      <div className="flex items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Buscando productos...</span>
        {query && <span className="text-primary font-medium">"{query}"</span>}
      </div>

      {/* Palindrome notification */}
      {isPalindromeQuery && (
        <div className="flex justify-center">
          <Badge variant="palindrome" className="animate-pulse">
            🎯 Aplicando descuento palíndromo del 50%
          </Badge>
        </div>
      )}

      {/* Loading skeleton grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }, (_, i) => (
          <Card key={i} className="h-full">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-12" />
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-2 mb-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
              </div>
              
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="text-right space-y-1">
                  <Skeleton className="h-3 w-8" />
                  <Skeleton className="h-4 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Loading progress indicator */}
      <div className="flex justify-center">
        <div className="flex items-center gap-1">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-primary rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
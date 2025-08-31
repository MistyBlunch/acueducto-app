'use client'

import { useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, X } from 'lucide-react'
import { isPalindrome, debounce } from '@/lib/utils'

interface SearchBarProps {
  onSearch: (query: string) => void
  isLoading?: boolean
  placeholder?: string
}

export function SearchBar({ onSearch, isLoading, placeholder = "Buscar productos..." }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [showPalindromeHint, setShowPalindromeHint] = useState(false)

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      onSearch(searchQuery)
    }, 300),
    [onSearch]
  )

  const handleInputChange = (value: string) => {
    setQuery(value)
    
    // Show palindrome hint if the query is a palindrome and has at least 3 characters
    const isQueryPalindrome = isPalindrome(value) && value.trim().length >= 3
    setShowPalindromeHint(isQueryPalindrome)
    
    debouncedSearch(value)
  }

  const handleClear = () => {
    setQuery('')
    setShowPalindromeHint(false)
    onSearch('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            className="pl-10 pr-20 h-12 text-base"
            disabled={isLoading}
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute right-2 top-1/2 h-8 w-8 p-0 -translate-y-1/2 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
      
      {showPalindromeHint && (
        <div className="mt-2 flex justify-center">
          <Badge variant="palindrome" className="animate-pulse">
            🎯 ¡Palíndromo detectado! 50% de descuento aplicado
          </Badge>
        </div>
      )}
    </div>
  )
}
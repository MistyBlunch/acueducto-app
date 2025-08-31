'use client'

import { ProductSearch } from '@/components/product-search'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-end">
            <h1 className="text-2xl font-bold" style={{ color: '#1a4ce0' }}>
              acueductoShop
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Busca acá todos los productos de nuestra tienda
          </h2>
          
          {/* Palindrome Message */}
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-full px-6 py-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium text-purple-800">
              💡 Busca palabras palíndromas y obtén 50% de descuento
            </span>
            <div className="px-2 py-1 bg-purple-200 text-purple-800 text-xs font-bold rounded-full">
              50% OFF
            </div>
          </div>
        </div>
        
        <ProductSearch pageSize={12} />
      </main>
    </div>
  )
}
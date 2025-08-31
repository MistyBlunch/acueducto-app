import { Product } from '../entities/product.entity'

export interface CreateProductData {
  title: string
  brand: string
  description: string
  priceCents: number
  currency: string
  stock: number
}

export interface UpdateProductData {
  title?: string
  brand?: string
  description?: string
  priceCents?: number
  currency?: string
  stock?: number
}

export interface ProductWriter {
  create(data: CreateProductData): Promise<Product>
  update(id: string, data: UpdateProductData): Promise<Product>
  delete(id: string): Promise<void>
}

export const PRODUCT_WRITER = Symbol('ProductWriter')
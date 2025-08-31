import { Product } from '../entities/product.entity'

export interface DiscountContext {
  query?: string
  isPalindrome?: boolean
  userId?: string
  productCategory?: string
}

export interface DiscountCalculator {
  calculateDiscount(product: Product, context: DiscountContext): number
  canApply(context: DiscountContext): boolean
}

export interface DiscountCalculatorFactory {
  getCalculators(context: DiscountContext): DiscountCalculator[]
}

export const DISCOUNT_CALCULATOR_FACTORY = Symbol('DiscountCalculatorFactory')
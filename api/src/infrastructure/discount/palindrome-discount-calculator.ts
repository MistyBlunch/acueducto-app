import { Injectable, Inject } from '@nestjs/common'
import { DiscountCalculator, DiscountContext } from '../../core/interfaces/discount-calculator.interface'
import { PalindromeDetector, PALINDROME_DETECTOR } from '../../core/interfaces/palindrome-detector.interface'
import { Product } from '../../core/entities/product.entity'

@Injectable()
export class PalindromeDiscountCalculator implements DiscountCalculator {
  private readonly PALINDROME_DISCOUNT_PERCENTAGE = 0.5 // 50%

  constructor(
    @Inject(PALINDROME_DETECTOR)
    private readonly palindromeDetector: PalindromeDetector
  ) {}

  calculateDiscount(product: Product, context: DiscountContext): number {
    if (!this.canApply(context)) {
      return 0
    }

    return product.priceCents * this.PALINDROME_DISCOUNT_PERCENTAGE
  }

  canApply(context: DiscountContext): boolean {
    if (!context.query) {
      return false
    }

    return this.palindromeDetector.isPalindrome(context.query)
  }
}
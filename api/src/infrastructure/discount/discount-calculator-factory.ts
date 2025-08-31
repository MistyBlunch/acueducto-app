import { Injectable } from '@nestjs/common'
import { DiscountCalculator, DiscountCalculatorFactory, DiscountContext } from '../../core/interfaces/discount-calculator.interface'
import { PalindromeDiscountCalculator } from './palindrome-discount-calculator'

@Injectable()
export class DiscountCalculatorFactoryImpl implements DiscountCalculatorFactory {
  constructor(
    private readonly palindromeDiscountCalculator: PalindromeDiscountCalculator
  ) {}

  getCalculators(context: DiscountContext): DiscountCalculator[] {
    const calculators: DiscountCalculator[] = []

    // Add palindrome discount calculator if applicable
    if (this.palindromeDiscountCalculator.canApply(context)) {
      calculators.push(this.palindromeDiscountCalculator)
    }

    // Future discount calculators can be added here
    // e.g., seasonal discounts, user-level discounts, category discounts, etc.

    return calculators
  }
}
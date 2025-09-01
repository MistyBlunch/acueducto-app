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

    if (this.palindromeDiscountCalculator.canApply(context)) {
      calculators.push(this.palindromeDiscountCalculator)
    }

    return calculators
  }
}
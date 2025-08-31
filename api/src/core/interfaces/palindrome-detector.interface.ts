export interface PalindromeDetector {
  isPalindrome(text: string): boolean
  normalizeText(text: string): string
}

export const PALINDROME_DETECTOR = Symbol('PalindromeDetector')
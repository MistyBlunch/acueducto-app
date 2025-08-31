/**
 * Pure domain service for palindrome detection
 * Implements strict normalization rules for Unicode text
 */
export class PalindromeService {
  /**
   * Checks if a string is a palindrome using strict normalization rules
   * @param input - The string to check
   * @returns true if the normalized string is a palindrome, false otherwise
   */
  static isPalindrome(input: string): boolean {
    const normalized = this.normalize(input);
    
    // Consider strings with length < 2 as non-palindromes
    if (normalized.length < 2) {
      return false;
    }

    return normalized === normalized.split('').reverse().join('');
  }

  /**
   * Normalizes a string for palindrome comparison
   * 1. Unicode normalization (NFD) to decompose characters
   * 2. Remove diacritics (accent marks)
   * 3. Remove non-alphanumeric characters
   * 4. Convert to lowercase
   * @param input - The string to normalize
   * @returns The normalized string
   */
  private static normalize(input: string): string {
    return input
      .normalize('NFD') // Decompose Unicode characters
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9]/gi, '') // Remove non-alphanumeric
      .toLowerCase(); // Convert to lowercase
  }
}
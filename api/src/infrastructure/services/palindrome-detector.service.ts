import { Injectable } from '@nestjs/common';
import { PalindromeDetector } from '../../core/interfaces/palindrome-detector.interface';

@Injectable()
export class PalindromeDetectorService implements PalindromeDetector {
  isPalindrome(text: string): boolean {
    const normalized = this.normalizeText(text);

    // Require minimum 2 characters after normalization
    if (normalized.length < 2) {
      return false;
    }

    return normalized === normalized.split('').reverse().join('');
  }

  normalizeText(text: string): string {
    return text
      .normalize('NFD') // Decompose Unicode characters
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .toLowerCase()
      .replace(/[^a-z0-9]/g, ''); // Keep only alphanumeric characters
  }
}

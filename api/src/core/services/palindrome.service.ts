export class PalindromeService {
  static isPalindrome(input: string): boolean {
    const normalized = this.normalize(input);
    
    if (normalized.length < 2) {
      return false;
    }

    return normalized === normalized.split('').reverse().join('');
  }

  private static normalize(input: string): string {
    return input
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/gi, '')
      .toLowerCase();
  }
}
export class SearchMetadata {
  constructor(
    public readonly query: string | undefined,
    public readonly isPalindrome: boolean,
    public readonly executionTimeMs: number,
    public readonly executedAt: Date = new Date()
  ) {}

  toPlainObject() {
    return {
      query: this.query,
      isPalindrome: this.isPalindrome,
      executionTimeMs: this.executionTimeMs,
      executedAt: this.executedAt.toISOString(),
    }
  }
}
export class SearchQuery {
  private constructor(private readonly value: string) {}

  public static create(query: string): SearchQuery {
    const trimmedQuery = query.trim();
    return new SearchQuery(trimmedQuery);
  }

  public getValue(): string {
    return this.value;
  }

  public isEmpty(): boolean {
    return this.value === '';
  }

  public hasMinimumLength(): boolean {
    return this.value.length >= 4;
  }

  public getExactMatchPattern(): string {
    return this.value.toLowerCase();
  }

  public getILikePattern(): string {
    return `%${this.value}%`;
  }

  public getLength(): number {
    return this.value.length;
  }

  public toString(): string {
    return this.value;
  }
}
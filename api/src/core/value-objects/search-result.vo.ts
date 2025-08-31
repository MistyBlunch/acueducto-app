import { Product } from '../entities/product.entity'

export class SearchResult {
  constructor(
    public readonly data: Product[],
    public readonly total: number,
    public readonly page: number,
    public readonly pageSize: number
  ) {}

  get totalPages(): number {
    return Math.ceil(this.total / this.pageSize)
  }

  get hasNextPage(): boolean {
    return this.page < this.totalPages
  }

  get hasPreviousPage(): boolean {
    return this.page > 1
  }

  get isEmpty(): boolean {
    return this.data.length === 0
  }
}
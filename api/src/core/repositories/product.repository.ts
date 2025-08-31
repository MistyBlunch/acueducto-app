import { Product } from '../entities/product.entity';

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SearchFilters {
  query?: string;
}

export abstract class ProductRepository {
  abstract findById(id: string): Promise<Product | null>;
  abstract findByExactTitle(title: string): Promise<Product | null>;
  abstract searchProducts(
    filters: SearchFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Product>>;
  abstract create(product: Product): Promise<Product>;
  abstract update(id: string, product: Partial<Product>): Promise<Product>;
  abstract delete(id: string): Promise<void>;
}
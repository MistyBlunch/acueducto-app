export class ProductResponseDto {
  id: string;
  title: string;
  brand: string;
  description: string;
  priceCents: number;
  finalPriceCents?: number;
  currency: string;
  stock: number;
  createdAt: string;
  palindromeDiscountApplied?: boolean;
}
export class PaginatedProductResponseDto {
  data: ProductResponseDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class ProductView {
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

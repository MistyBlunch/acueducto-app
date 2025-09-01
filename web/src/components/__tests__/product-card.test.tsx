import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import { ProductCard } from '../product-card';
import { type Product } from '@/types/api';

const mockProduct: Product = {
  id: '1',
  title: 'Producto Premium Pro',
  brand: 'Premium Brand',
  description: 'Producto profesional de alta calidad.',
  priceCents: 25000,
  currency: 'USD',
  stock: 10,
  createdAt: '2024-01-01T00:00:00Z',
};

const mockProductWithDiscount: Product = {
  ...mockProduct,
  finalPriceCents: 12500,
  palindromeDiscountApplied: true,
};

const mockProductOutOfStock: Product = {
  ...mockProduct,
  stock: 0,
};

const mockProductLowStock: Product = {
  ...mockProduct,
  stock: 3,
};

describe('ProductCard', () => {
  it('should render product information correctly', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Producto Premium Pro')).toBeInTheDocument();
    expect(screen.getByText('Premium Brand')).toBeInTheDocument();
    expect(
      screen.getByText(/producto profesional de alta calidad/i),
    ).toBeInTheDocument();
    expect(screen.getByText('$250.00')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('should render product with discount correctly', () => {
    render(<ProductCard product={mockProductWithDiscount} />);

    // Should show both original and final price
    expect(screen.getByText('$250.00')).toBeInTheDocument();
    expect(screen.getByText('$125.00')).toBeInTheDocument();

    // Should show palindrome discount badge
    expect(screen.getByText('-50% Palíndromo')).toBeInTheDocument();

    // Should show discount message
    expect(
      screen.getByText(/50% de descuento palíndromo aplicado/i),
    ).toBeInTheDocument();
  });

  it('should render out of stock product correctly', () => {
    render(<ProductCard product={mockProductOutOfStock} />);

    expect(screen.getByText('Sin stock')).toBeInTheDocument();
    expect(screen.queryByText('Stock')).not.toBeInTheDocument();
  });

  it('should render low stock warning', () => {
    render(<ProductCard product={mockProductLowStock} />);

    expect(screen.getByText('Últimas unidades')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should not show low stock warning for normal stock', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.queryByText('Últimas unidades')).not.toBeInTheDocument();
    expect(screen.queryByText('Sin stock')).not.toBeInTheDocument();
  });

  it('should handle different currencies', () => {
    const productUSD: Product = {
      ...mockProduct,
      currency: 'USD',
    };

    render(<ProductCard product={productUSD} />);

    expect(screen.getByText('$250.00')).toBeInTheDocument();
  });

  it('should render proper price structure without discount', () => {
    render(<ProductCard product={mockProduct} />);

    const priceElement = screen.getByText('$250.00');
    expect(priceElement).toHaveClass('text-primary');
    expect(priceElement).toHaveClass('font-bold');

    // Should not have strikethrough
    expect(screen.queryByText('$250.00')).not.toHaveClass('line-through');
  });

  it('should render proper price structure with discount', () => {
    render(<ProductCard product={mockProductWithDiscount} />);

    // Original price should be struck through
    const originalPrice = screen.getByText('$250.00');
    expect(originalPrice).toHaveClass('line-through');
    expect(originalPrice).toHaveClass('text-muted-foreground');

    // Final price should be highlighted
    const finalPrice = screen.getByText('$125.00');
    expect(finalPrice).toHaveClass('text-discount');
    expect(finalPrice).toHaveClass('font-bold');
  });

  it('should handle edge case with zero price', () => {
    const freeProduct: Product = {
      ...mockProduct,
      priceCents: 0,
    };

    render(<ProductCard product={freeProduct} />);

    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });

  it('should handle very large prices', () => {
    const expensiveProduct: Product = {
      ...mockProduct,
      priceCents: 999999,
    };

    render(<ProductCard product={expensiveProduct} />);

    expect(screen.getByText('$9,999.99')).toBeInTheDocument();
  });

  it('should show discount message only when palindrome discount is applied', () => {
    const productWithRegularDiscount: Product = {
      ...mockProduct,
      finalPriceCents: 20000,
      palindromeDiscountApplied: false,
    };

    render(<ProductCard product={productWithRegularDiscount} />);

    // Should show discount prices but not palindrome message
    expect(screen.getByText('$250.00')).toBeInTheDocument();
    expect(screen.getByText('$200.00')).toBeInTheDocument();
    expect(
      screen.queryByText(/50% de descuento palíndromo aplicado/i),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('-50% Palíndromo')).not.toBeInTheDocument();
  });

  it('should handle long product titles and descriptions gracefully', () => {
    const longProduct: Product = {
      ...mockProduct,
      title:
        'This is a very long product title that should be truncated properly to avoid layout issues',
      description:
        'This is an extremely long product description that should be truncated with ellipsis to maintain a clean card layout and prevent the card from becoming too tall or breaking the grid system.',
    };

    render(<ProductCard product={longProduct} />);

    expect(
      screen.getByText(/this is a very long product title/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/this is an extremely long product description/i),
    ).toBeInTheDocument();
  });
});

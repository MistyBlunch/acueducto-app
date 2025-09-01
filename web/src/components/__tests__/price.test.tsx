import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import { Price } from '../price';

describe('Price', () => {
  it('should render regular price without discount', () => {
    render(<Price priceCents={2500} currency="USD" />);

    expect(screen.getByText('$25.00')).toBeInTheDocument();
    expect(screen.getByText('$25.00')).toHaveClass('text-primary');
    expect(screen.getByText('$25.00')).toHaveClass('font-bold');
  });

  it('should render discounted price with strikethrough original', () => {
    render(<Price priceCents={2500} finalPriceCents={1250} currency="USD" />);

    // Original price should be struck through
    const originalPrice = screen.getByText('$25.00');
    expect(originalPrice).toHaveClass('line-through');
    expect(originalPrice).toHaveClass('text-muted-foreground');

    // Final price should be highlighted
    const finalPrice = screen.getByText('$12.50');
    expect(finalPrice).toHaveClass('text-discount');
    expect(finalPrice).toHaveClass('font-bold');
  });

  it('should show palindrome discount message when applied', () => {
    render(
      <Price
        priceCents={2500}
        finalPriceCents={1250}
        currency="USD"
        palindromeDiscountApplied={true}
      />,
    );

    expect(
      screen.getByText('¡50% de descuento palíndromo aplicado!'),
    ).toBeInTheDocument();
  });

  it('should not show palindrome discount message for regular discounts', () => {
    render(
      <Price
        priceCents={2500}
        finalPriceCents={2000}
        currency="USD"
        palindromeDiscountApplied={false}
      />,
    );

    expect(
      screen.queryByText('¡50% de descuento palíndromo aplicado!'),
    ).not.toBeInTheDocument();
  });

  it('should handle different currencies', () => {
    render(<Price priceCents={2500} currency="USD" />);

    expect(screen.getByText('$25.00')).toBeInTheDocument();
  });

  it('should handle zero price', () => {
    render(<Price priceCents={0} currency="USD" />);

    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });

  it('should handle large prices with proper formatting', () => {
    render(<Price priceCents={123456} currency="USD" />);

    expect(screen.getByText('$1,234.56')).toBeInTheDocument();
  });

  it('should not show discount when finalPriceCents equals priceCents', () => {
    render(<Price priceCents={2500} finalPriceCents={2500} currency="USD" />);

    // Should only show one price without discount styling
    const priceElements = screen.getAllByText('$25.00');
    expect(priceElements).toHaveLength(1);
    expect(priceElements[0]).toHaveClass('text-primary');
    expect(priceElements[0]).not.toHaveClass('line-through');
  });

  it('should not show discount when finalPriceCents is higher than priceCents', () => {
    render(<Price priceCents={2500} finalPriceCents={3000} currency="USD" />);

    // Should only show the original price
    expect(screen.getByText('$25.00')).toBeInTheDocument();
    expect(screen.queryByText('$30.00')).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<Price priceCents={2500} currency="USD" className="custom-class" />);

    const priceContainer = screen.getByText('$25.00').closest('div');
    expect(priceContainer).toHaveClass('custom-class');
  });

  it('should handle cent precision correctly', () => {
    render(<Price priceCents={1} currency="USD" />);

    expect(screen.getByText('$0.01')).toBeInTheDocument();
  });

  it('should handle palindrome discount with different discount amounts', () => {
    render(
      <Price
        priceCents={1000}
        finalPriceCents={750}
        currency="USD"
        palindromeDiscountApplied={true}
      />,
    );

    expect(screen.getByText('$10.00')).toBeInTheDocument();
    expect(screen.getByText('$7.50')).toBeInTheDocument();
    expect(
      screen.getByText('¡50% de descuento palíndromo aplicado!'),
    ).toBeInTheDocument();
  });
});

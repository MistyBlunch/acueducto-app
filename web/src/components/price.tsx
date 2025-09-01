import { formatPrice } from '@/lib/utils';

interface PriceProps {
  priceCents: number;
  finalPriceCents?: number;
  currency: string;
  palindromeDiscountApplied?: boolean;
  className?: string;
}

export function Price({
  priceCents,
  finalPriceCents,
  currency,
  palindromeDiscountApplied,
  className,
}: PriceProps) {
  const hasDiscount = finalPriceCents && finalPriceCents < priceCents;

  if (!hasDiscount) {
    return (
      <div className={className}>
        <span className="text-2xl font-bold text-primary">
          {formatPrice(priceCents, currency)}
        </span>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <span className="text-lg text-muted-foreground line-through">
          {formatPrice(priceCents, currency)}
        </span>
        <span className="text-2xl font-bold text-discount">
          {formatPrice(finalPriceCents, currency)}
        </span>
      </div>
      {palindromeDiscountApplied && (
        <div className="text-xs text-success font-medium mt-1">
          ¡50% de descuento palíndromo aplicado!
        </div>
      )}
    </div>
  );
}

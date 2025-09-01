import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Price } from '@/components/price';
import { type Product } from '@/types/api';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const {
    title,
    brand,
    description,
    priceCents,
    finalPriceCents,
    currency,
    stock,
    palindromeDiscountApplied,
  } = product;

  return (
    <Card className="h-full transition-all hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
          {palindromeDiscountApplied && (
            <Badge variant="palindrome" className="shrink-0">
              -50% Palíndromo
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-primary">{brand}</span>
          {stock === 0 && (
            <Badge variant="destructive" className="text-xs">
              Sin stock
            </Badge>
          )}
          {stock > 0 && stock <= 5 && (
            <Badge variant="warning" className="text-xs m">
              <span className="mt-0 mb-[-.3rem]">Últimas unidades</span>
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {description}
        </p>

        <div className="flex justify-between items-end">
          <Price
            priceCents={priceCents}
            finalPriceCents={finalPriceCents ?? 0}
            currency={currency}
            palindromeDiscountApplied={palindromeDiscountApplied ?? false}
          />

          {stock > 0 && (
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Stock</div>
              <div className="text-sm font-medium">{stock}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface PricedVariant {
  price?: number;
}

export interface PricedProduct {
  price: number;
  variants?: PricedVariant[] | null;
}

/**
 * Price to display: the lowest priced variant when variants are priced,
 * otherwise the product price (a variant price of 0 means "not priced yet").
 */
export function effectivePrice(product: PricedProduct): number {
  const prices = (product.variants ?? [])
    .map((v) => v.price)
    .filter((p): p is number => typeof p === "number" && p > 0);
  return prices.length > 0 ? Math.min(...prices) : product.price;
}

import type { productT } from "@/features/products/types";
import type { warrantyT } from "@/features/warranty/types";

export type ProductWithWarranty = productT & {
  warranty?: warrantyT;
};

export function getMostUrgentProduct(
  products: ProductWithWarranty[]
): ProductWithWarranty | undefined {
  return [...products].sort((a, b) => {
    const dateA = new Date(a.warranty?.expiryDate ?? 0).getTime();
    const dateB = new Date(b.warranty?.expiryDate ?? 0).getTime();
    return dateA - dateB;
  })[0];
}
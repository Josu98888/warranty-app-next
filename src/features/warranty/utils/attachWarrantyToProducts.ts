import type { productT } from '@/features/products/types'
import type { warrantyT } from '@/features/warranty/types'

export type ProductRow = productT & { warranty?: warrantyT }

export function attachWarrantyToProducts(
  products: productT[],
  warranties: warrantyT[]
): ProductRow[] {
  const warrantyById = new Map(warranties.map((warranty) => [warranty.id, warranty]))

  return products.map((product) => ({
    ...product,
    warranty: product.id ? warrantyById.get(product.id) : undefined,
  }))
}
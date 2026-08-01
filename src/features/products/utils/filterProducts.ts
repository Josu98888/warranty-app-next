import type { productT } from '../types'

export function filterProducts(
  products: productT[],
  searchQuery: string,
  categoryFilter: string
): productT[] {
  let result = products

  if (searchQuery.trim()) {
    const query = searchQuery.trim().toLowerCase()
    result = result.filter((product) => product.name.toLowerCase().includes(query))
  }

  if (categoryFilter) {
    result = result.filter((product) => product.category === categoryFilter)
  }

  return result
}
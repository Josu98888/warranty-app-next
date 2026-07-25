import { useState, useMemo } from 'react'
import { differenceInDays, parseISO } from 'date-fns'
import { useProductStore } from '../store'
import { useWarrantyStore } from '@/features/warranty/store'
import type { productT } from '../types'
import type { warrantyT } from '@/features/warranty/types'

const WARRANTY_GROUP = {
  EXPIRED: 0,
  EXPIRING_SOON: 1,
  VALID: 2,
} as const

const EXPIRING_SOON_DAYS = 30 as const

const SORT_ORDER = {
  BEFORE: -1,
  EQUAL: 0,
  AFTER: 1,
} as const

export type ProductRow = productT & { warranty?: warrantyT }

export function useProductFilters() {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  const products = useProductStore((storeState) => storeState.products)
  const warranties = useWarrantyStore((storeState) => storeState.warranties)

  const filteredProductsWithWarranty = useMemo(() => {
    let matchingProducts = products

    if (searchQuery.trim()) {
      const searchQueryLowercased = searchQuery.trim().toLowerCase()
      matchingProducts = matchingProducts.filter(
        (product) => product.name.toLowerCase().includes(searchQueryLowercased)
      )
    }

    if (categoryFilter) {
      matchingProducts = matchingProducts.filter(
        (product) => product.category === categoryFilter
      )
    }

    const productRowsWithWarranty: ProductRow[] = matchingProducts.map((product) => ({
      ...product,
      warranty: warranties.find((warranty) => warranty.id === product.id),
    }))

    return productRowsWithWarranty.sort((firstProduct, secondProduct) => {
      const firstExpiryDate = firstProduct.warranty?.expiryDate
      const secondExpiryDate = secondProduct.warranty?.expiryDate

      const firstRemainingDays = firstExpiryDate
        ? differenceInDays(parseISO(firstExpiryDate), new Date())
        : Infinity
      const secondRemainingDays = secondExpiryDate
        ? differenceInDays(parseISO(secondExpiryDate), new Date())
        : Infinity

      const firstGroup = firstRemainingDays <= 0
        ? WARRANTY_GROUP.EXPIRED
        : firstRemainingDays <= EXPIRING_SOON_DAYS
          ? WARRANTY_GROUP.EXPIRING_SOON
          : WARRANTY_GROUP.VALID
      const secondGroup = secondRemainingDays <= 0
        ? WARRANTY_GROUP.EXPIRED
        : secondRemainingDays <= EXPIRING_SOON_DAYS
          ? WARRANTY_GROUP.EXPIRING_SOON
          : WARRANTY_GROUP.VALID

      if (firstGroup !== secondGroup) return firstGroup - secondGroup

      if (firstExpiryDate && secondExpiryDate) return firstExpiryDate.localeCompare(secondExpiryDate)
      if (firstExpiryDate) return SORT_ORDER.BEFORE
      if (secondExpiryDate) return SORT_ORDER.AFTER
      return SORT_ORDER.EQUAL
    })
  }, [products, warranties, searchQuery, categoryFilter])

  const resetFilters = () => {
    setSearchQuery('')
    setCategoryFilter('')
  }

  const activeFilterCount = (searchQuery ? 1 : 0) + (categoryFilter ? 1 : 0)

  return {
    filteredProductsWithWarranty,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    resetFilters,
    totalProductCount: products.length,
    filteredProductCount: filteredProductsWithWarranty.length,
    activeFilterCount,
  }
}
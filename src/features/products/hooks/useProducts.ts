"use client";
import { useState, useMemo } from 'react'
import { useProductStore } from '../store'
import { useWarrantyStore } from '@/features/warranty/store/store'
import { filterProducts } from '../utils/filterProducts'
import { attachWarrantyToProducts } from '@/features/warranty/utils/attachWarrantyToProducts'
import { sortByWarrantyUrgency } from '@/features/warranty/utils/sortByWarrantyUrgency'

export function useProductFilters(initialSearchQuery: string = '') {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [categoryFilter, setCategoryFilter] = useState('')

  const products = useProductStore((storeState) => storeState.products)
  const warranties = useWarrantyStore((storeState) => storeState.warranties)

  const filteredProductsWithWarranty = useMemo(() => {
    const matchingProducts = filterProducts(products, searchQuery, categoryFilter)
    const productRows = attachWarrantyToProducts(matchingProducts, warranties)
    return [...productRows].sort(sortByWarrantyUrgency)
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
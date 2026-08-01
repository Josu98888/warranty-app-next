// src/app/products/ProductsPage.tsx
"use client";
import { useProductFilters } from "@/features/products/hooks/useProducts";
import ProductFilters from "@/features/products/components/ProductFilters";
import ProductDataActions from "@/features/products/components/ProductDataActions";
import ProductsTable from "@/features/products/components/ProductsTable";
import { seedTestData, clearAllData } from "@/features/products/utils/seedData";
import { useProductStore } from "@/features/products/store";

export default function ProductsPage() {
  const totalProducts = useProductStore((storeState) => storeState.products.length);

  const {
    filteredProductsWithWarranty,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    resetFilters,
    totalProductCount,
    filteredProductCount,
    activeFilterCount,
  } = useProductFilters();

  return (
    <main className="px-4 sm:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-6">
        Todos tus productos
      </h2>

      <ProductFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        onReset={resetFilters}
        totalProductCount={totalProductCount}
        filteredProductCount={filteredProductCount}
        activeFilterCount={activeFilterCount}
      />

      <ProductDataActions
        hasProducts={totalProducts > 0}
        onClear={clearAllData}
        onLoadSampleData={seedTestData}
      />

      <ProductsTable
        productsWithWarranty={filteredProductsWithWarranty}
        totalProductCount={totalProductCount}
      />
    </main>
  );
}
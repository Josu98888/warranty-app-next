"use client";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useProductFilters } from "@/features/products/hooks/useProducts";
import ProductFilters from "@/features/products/components/ProductFilters";
import ProductDataActions from "@/features/products/components/ProductDataActions";
import ProductsTable from "@/features/products/components/ProductsTable";
import { seedTestData, clearAllData } from "@/features/products/utils/seedData";
import SummaryCards from "@/features/home/SummaryCards";

export default function HomeView() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const initialSearchQuery = searchParams.get("q") ?? "";

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
  } = useProductFilters(initialSearchQuery);

  useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  const hasProducts = totalProductCount > 0;

  return (
    <main className="px-4 sm:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
      <SummaryCards />

      <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-6">
        Garantías para tus productos
      </h2>

      <ProductFilters
        state={{ searchQuery, categoryFilter }}
        actions={{
          onSearchChange: setSearchQuery,
          onCategoryChange: setCategoryFilter,
          onReset: resetFilters,
        }}
        stats={{ totalProductCount, filteredProductCount, activeFilterCount }}
      />

      <ProductDataActions
        hasProducts={hasProducts}
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

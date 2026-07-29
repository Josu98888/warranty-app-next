"use client";
import type { Metadata } from "next";
import HomeView from "@/features/home/HomeView";
import { useProductStore } from "@/features/products/store";
import { useProductFilters } from "@/features/products/hooks/useProducts";
import  SummaryCards  from "@/features/home/SummaryCards";
import ProductFilters from "@/features/products/components/ProductFilters";
import {seedTestData} from "@/features/products/utils/seedData";
import { clearAllData } from "@/features/products/utils/seedData";
import ProductsTable from "@/features/products/components/ProductsTable";
export default function HomePage() {
    const totalProducts = useProductStore((storeState) => storeState.products.length)

    const {
        filteredProductsWithWarranty,
        searchQuery, setSearchQuery,
        categoryFilter, setCategoryFilter,
        resetFilters,
        totalProductCount,
        filteredProductCount,
        activeFilterCount,
    } = useProductFilters()

    return (
        <main className="px-4 sm:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
            <SummaryCards />

            <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-6">Garantías para tus productos</h2>

            <ProductFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                categoryFilter={categoryFilter}
                onCategoryChange={setCategoryFilter}
                onReset={resetFilters}
                onClearAllData={totalProducts === 0 ? seedTestData : clearAllData}
                hasProducts={totalProducts > 0}
                totalProductCount={totalProductCount}
                filteredProductCount={filteredProductCount}
                activeFilterCount={activeFilterCount}
            />

            <ProductsTable
                productsWithWarranty={filteredProductsWithWarranty}
                totalProductCount={totalProductCount}
            />

        </main>
    )
}

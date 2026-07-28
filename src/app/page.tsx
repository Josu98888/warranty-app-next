"use client";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useProductFilters } from "@/features/products/hooks/useProducts";
import ProductFilters from "@/features/products/components/ProductFilters"
import ProductsTable from "@/features/products/components/ProductsTable";
import { seedTestData, clearAllData } from "@/features/products/utils/seedData"
import { useProductStore } from "@/features/products/store";
import SummaryCards from "@/features/home/SummaryCards";

export default function HomePage () {
    return (
        <Suspense>
            <HomeContent />
        </Suspense>
    )
}

function HomeContent () {

    const searchParams = useSearchParams()
    const initialSearchQuery = searchParams.get("q") ?? ""

    const totalProducts = useProductStore((storeState) => storeState.products.length)

    const {
        filteredProductsWithWarranty,
        searchQuery, setSearchQuery,
        categoryFilter, setCategoryFilter,
        resetFilters,
        totalProductCount,
        filteredProductCount,
        activeFilterCount,
    } = useProductFilters(initialSearchQuery)

    useEffect(() => {
        setSearchQuery(initialSearchQuery)
    }, [initialSearchQuery])

    return(
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
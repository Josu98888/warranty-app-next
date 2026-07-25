import { Search, FilterX } from "lucide-react";
import { CATEGORIES } from "@/features/products/categories";

interface ProductFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  onReset: () => void;
  onClearAllData: () => void;
  hasProducts: boolean;
  totalProductCount: number;
  filteredProductCount: number;
  activeFilterCount: number;
}

export default function ProductFilters({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  onReset,
  onClearAllData,
  hasProducts,
  totalProductCount,
  filteredProductCount,
  activeFilterCount,
}: ProductFiltersProps) {
  return (
    <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              aria-label="Buscar por nombre"
              value={searchQuery}
              onChange={(inputEvent) => onSearchChange(inputEvent.target.value)}
              className="
              w-full
              rounded-xl
              border
              border-slate-300
              bg-white
              pl-10
              pr-4
              py-2.5
              text-sm
              focus:border-blue-500
              focus:outline-none
              focus:ring-2
              focus:ring-blue-200 "
            />
          </div>
          <select
            value={categoryFilter}
            aria-label="Filtrar por categoría"
            onChange={(inputEvent) => onCategoryChange(inputEvent.target.value)}
            className="
            rounded-xl
            border
            border-slate-300
            bg-white
            px-4
            py-2.5
            text-sm
            focus:border-blue-500
            focus:outline-none
            focus:ring-2
            focus:ring-blue-200
            w-full
            sm:w-auto
            "
          >
            <option value="">Todas las categorías</option>
            {CATEGORIES.map((singleCategory) => (
              <option key={singleCategory.value} value={singleCategory.value}>
                {singleCategory.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm font-medium text-slate-500">
              Mostrando {filteredProductCount} de {totalProductCount} productos
            </span>

            <button
              onClick={onClearAllData}
              className={`
              flex
              w-fit
              items-center
              gap-2
              rounded-xl
              border
              px-3
              sm:px-4
              py-2
              text-xs
              sm:text-sm
              font-medium
              transition
              ${
                hasProducts
                  ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                  : "border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100"
              }
              `}
            >
              {hasProducts ? "Limpiar" : "Cargar datos"}
            </button>
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={onReset}
              className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-3
              sm:px-4
              py-2
              text-xs
              sm:text-sm
              font-medium
              text-red-600
              transition
              hover:bg-red-100
              w-full
              sm:w-fit
              justify-center
              sm:justify-start
              "
            >
              <FilterX className="w-4 h-4" />
              <span className="hidden sm:inline">Limpiar filtros</span>
              <span className="sm:hidden">Limpiar</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

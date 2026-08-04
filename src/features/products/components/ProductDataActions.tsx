interface ProductDataActionsProps {
  hasProducts: boolean;
  onClear: () => void;
  onLoadSampleData: () => void;
}

export default function ProductDataActions({
  hasProducts,
  onClear,
  onLoadSampleData,
}: ProductDataActionsProps) {
  return hasProducts ? (
    <button
      onClick={onClear}
      aria-label="Clear all product data"
      className="flex w-fit items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-red-600 transition hover:bg-red-100"
    >
      Limpiar
    </button>
  ) : (
    <button
      onClick={onLoadSampleData}
      aria-label="Load sample product data"
      className="flex w-fit items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-blue-600 transition hover:bg-blue-100"
    >
      Cargar datos
    </button>
  );
}

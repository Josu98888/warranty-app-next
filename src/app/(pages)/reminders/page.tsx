"use client";

import { useProductFilters } from "@/features/products/hooks/useProducts";
import { getWarrantyStatus } from "@/features/warranty/utils/warrantyStatus";

export default function RemindersPage() {
  const { filteredProductsWithWarranty } = useProductFilters();

  const upcoming = filteredProductsWithWarranty.filter((p) => {
    const status = getWarrantyStatus(p.warranty?.expiryDate);
    return status?.variant === "expiring-soon" || status?.variant === "expired";
  });

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-2">Recordatorios</h1>
      <p className="text-slate-500 text-sm mb-6">
        Garantías próximas a vencer o ya vencidas
      </p>

      {upcoming.length === 0 && (
        <p className="text-slate-400">
          No hay garantías próximas a vencer. ¡Todo en orden!
        </p>
      )}

      <ul className="flex flex-col gap-3">
        {upcoming.map((p) => {
          const status = getWarrantyStatus(p.warranty?.expiryDate);

          return (
            <li
              key={p.id}
              className={`border rounded-lg p-4 ${status?.className}`}
            >
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm">{status?.label}</p>

              {p.receipt && (
                <img
                  src={p.receipt}
                  alt="Comprobante"
                  className="mt-2 h-20 rounded border"
                />
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

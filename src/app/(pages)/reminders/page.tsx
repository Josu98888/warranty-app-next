"use client";

import { useProductFilters } from "@/features/products/hooks/useProducts";
import { getWarrantyStatus } from "@/features/warranty/utils/warrantyStatus";

export default function RemindersPage() {
  const { filteredProductsWithWarranty } = useProductFilters();

  const upcoming = filteredProductsWithWarranty.filter((p) => {
    const status = getWarrantyStatus(p.warranty?.expiryDate);

    return (
      status?.variant === "expiring-soon" ||
      status?.variant === "expired"
    );
  });

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-2">Recordatorios</h1>

      <p className="text-slate-500 text-sm mb-6">
        Garantías próximas a vencer o ya vencidas
      </p>

      {/* Configuración de recordatorios */}
      <div className="border rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-4">
          Configuración de recordatorios
        </h2>

        <label className="block mb-2">
          Correo de notificación
        </label>

        <input
          type="email"
          placeholder="daina@gmail.com"
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <div className="flex flex-col gap-2">
          <label>
            <input type="checkbox" className="mr-2" />
            Enviar 30 días antes
          </label>

          <label>
            <input type="checkbox" className="mr-2" />
            Enviar 7 días antes
          </label>

          <label>
            <input type="checkbox" className="mr-2" />
            Enviar 1 día antes
          </label>

          <label>
            <input type="checkbox" className="mr-2" />
            Enviar cuando venza
          </label>
        </div>

        <button className="mt-4 px-4 py-2 rounded bg-blue-600 text-white">
          Guardar
        </button>
      </div>

      {upcoming.length === 0 && (
        <p className="text-slate-400">
          No hay garantías próximas a vencer. ¡Todo en orden!
        </p>
      )}

      <ul className="flex flex-col gap-3">
        {upcoming.map((p) => {
          const status = getWarrantyStatus(
            p.warranty?.expiryDate
          );

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
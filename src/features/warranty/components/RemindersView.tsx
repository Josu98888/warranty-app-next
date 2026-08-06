// src/features/warranty/RemindersView.tsx
"use client";

import { useReminderSettings } from "@/features/warranty/hooks/useReminderSettings";
import { useProductFilters } from "@/features/products/hooks/useProducts";
import { getWarrantyStatus } from "@/features/warranty/utils/warrantyStatus";
import { useReminderStore } from "@/features/warranty/store/reminderStore";
import toast from "react-hot-toast";

export default function RemindersView() {
  const { filteredProductsWithWarranty } = useProductFilters();

  const { settings, updateSettings } = useReminderStore();

  const {
    email,
    setEmail,
    send30DaysBefore,
    setSend30DaysBefore,
    send7DaysBefore,
    setSend7DaysBefore,
    send1DayBefore,
    setSend1DayBefore,
    sendOnExpiry,
    setSendOnExpiry,
    saveSettings,
  } = useReminderSettings(settings);

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

      {/* Reminder settings */}
      <div className="border rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-4">Configuración de recordatorios</h2>

        <label className="block mb-2">Correo de notificación</label>

        <input
          type="email"
          placeholder="correo@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <div className="flex flex-col gap-2">
          <label>
            <input
              type="checkbox"
              className="mr-2"
              checked={send30DaysBefore}
              onChange={(e) => setSend30DaysBefore(e.target.checked)}
            />
            Enviar 30 días antes
          </label>

          <label>
            <input
              type="checkbox"
              className="mr-2"
              checked={send7DaysBefore}
              onChange={(e) => setSend7DaysBefore(e.target.checked)}
            />
            Enviar 7 días antes
          </label>

          <label>
            <input
              type="checkbox"
              className="mr-2"
              checked={send1DayBefore}
              onChange={(e) => setSend1DayBefore(e.target.checked)}
            />
            Enviar 1 día antes
          </label>

          <label>
            <input
              type="checkbox"
              className="mr-2"
              checked={sendOnExpiry}
              onChange={(e) => setSendOnExpiry(e.target.checked)}
            />
            Enviar cuando venza
          </label>
        </div>
        <button
          className="mt-4 px-4 py-2 rounded bg-blue-600 text-white cursor-pointer hover:bg-blue-700 transition-all"
          onClick={async () => {
            try {
              await saveSettings();

              updateSettings({
                email,
                send30DaysBefore,
                send7DaysBefore,
                send1DayBefore,
                sendOnExpiry,
              });

              toast.success("Configuracion de recordatorios guardada");
            } catch (error) {
              console.error(error);
              toast.error("No se pudo guardar la configuracion");
            }
          }}
        >
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

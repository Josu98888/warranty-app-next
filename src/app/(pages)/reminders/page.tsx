"use client";

import { useProductFilters } from "@/features/products/hooks/useProducts";
import { getWarrantyStatus } from "@/features/warranty/utils/warrantyStatus";
import { useReminderStore } from "@/features/warranty/reminderStore";
import { useWarrantyStore } from "@/features/warranty/store";
import { checkReminders } from "@/features/warranty/utils/checkReminders";
import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { supabase } from "@/lib/supabase";

export default function RemindersPage() {
  const { filteredProductsWithWarranty } = useProductFilters();

  const { settings, updateSettings } = useReminderStore();
  const { warranties } = useWarrantyStore();

  const [email, setEmail] = useState(settings.email);

  const [send30DaysBefore, setSend30DaysBefore] =
    useState(settings.send30DaysBefore);

  const [send7DaysBefore, setSend7DaysBefore] =
    useState(settings.send7DaysBefore);

  const [send1DayBefore, setSend1DayBefore] =
    useState(settings.send1DayBefore);

  const [sendOnExpiry, setSendOnExpiry] =
    useState(settings.sendOnExpiry);

  useEffect(() => {
    async function loadSettings() {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("id", 1)
        .single();

      if (error || !data) return;

      setEmail(data.email);
      setSend30DaysBefore(data.send_30_days_before);
      setSend7DaysBefore(data.send_7_days_before);
      setSend1DayBefore(data.send_1_day_before);
      setSendOnExpiry(data.send_on_expiry);
    }

    loadSettings();
  }, []);

  const reminders = checkReminders(
    warranties,
    settings,
  );

  console.log(reminders);
  const sendEmail = async () => {
    try {
      const result = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          to_email: email,
          product_name: "Producto de prueba",
          expiry_date: "01/09/2026",
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
      );

      console.log("Correo enviado:", result);
    } catch (error: unknown) {
      console.error(error);
    }
  };
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
              onChange={(e) =>
                setSend30DaysBefore(e.target.checked)
              }
            />
            Enviar 30 días antes
          </label>

          <label>
            <input
              type="checkbox"
              className="mr-2"
              checked={send7DaysBefore}
              onChange={(e) =>
                setSend7DaysBefore(e.target.checked)
              }
            />
            Enviar 7 días antes
          </label>

          <label>
            <input
              type="checkbox"
              className="mr-2"
              checked={send1DayBefore}
              onChange={(e) =>
                setSend1DayBefore(e.target.checked)
              }
            />
            Enviar 1 día antes
          </label>

          <label>
            <input
              type="checkbox"
              className="mr-2"
              checked={sendOnExpiry}
              onChange={(e) =>
                setSendOnExpiry(e.target.checked)
              }
            />
            Enviar cuando venza
          </label>
        </div>
        <button
          onClick={async () => {
            const { error } = await supabase
              .from("settings")
              .update({
                email,
                send_30_days_before: send30DaysBefore,
                send_7_days_before: send7DaysBefore,
                send_1_day_before: send1DayBefore,
                send_on_expiry: sendOnExpiry,
              })
              .eq("id", 1);

            if (error) {
              console.error(error);
              return;
            }

            updateSettings({
              email,
              send30DaysBefore,
              send7DaysBefore,
              send1DayBefore,
              sendOnExpiry,
            });

            await sendEmail();

            console.log("Configuración guardada");
          }}
          className="mt-4 px-4 py-2 rounded bg-blue-600 text-white cursor-pointer hover:bg-blue-700 transition-all"
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
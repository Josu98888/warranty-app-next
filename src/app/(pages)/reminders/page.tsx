import type { Metadata } from "next";
import RemindersView from "@/features/warranty/RemindersView";

export const metadata: Metadata = {
  title: "Recordatorios de garantías | Warranty Manager",
  description:
    "Mirá qué garantías están por vencer pronto o ya vencieron, con el comprobante de compra a mano, para gestionar reclamos a tiempo desde un único listado.",
  openGraph: {
    title: "Recordatorios de garantías | Warranty Manager",
    description:
      "Mirá qué garantías están por vencer pronto o ya vencieron, con el comprobante de compra a mano, para gestionar reclamos a tiempo desde un único listado.",
    type: "website",
    locale: "es_AR",
    siteName: "Warranty Manager",
  },
};

export default function Page() {
  return <RemindersView />;
}

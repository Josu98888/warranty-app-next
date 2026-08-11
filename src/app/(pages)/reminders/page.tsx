import type { Metadata } from "next";
import RemindersView from "@/features/warranty/components/RemindersView";

export const metadata: Metadata = {
  title: "Recordatorios | Garantías de productos",
  description: "Configure y revise los recordatorios para sus garantías de productos.",
  openGraph: {
    title: "Recordatorios | Garantías de productos",
    description: "Configure y revise los recordatorios para sus garantías de productos.",
    type: "website",
    locale: "es_AR",
    siteName: "Warranty Manager",
  },
};

export default function RemindersPage() {
  return <RemindersView />;
}
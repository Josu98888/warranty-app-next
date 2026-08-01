import type { Metadata } from "next";
import RemindersView from "@/features/warranty/components/RemindersView";

export const metadata: Metadata = {
  title: "Recordatorios | Garantías de productos",
  description: "Configure y revise los recordatorios para sus garantías de productos.",
};

export default function RemindersPage() {
  return <RemindersView />;
}
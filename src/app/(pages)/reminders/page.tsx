import type { Metadata } from "next";
import RemindersView from "@/features/warranty/components/RemindersView";

export const metadata: Metadata = {
  title: "Reminders | Product Warranties",
  description: "Configure and check reminders for your product warranties.",
};

export default function RemindersPage() {
  return <RemindersView />;
}
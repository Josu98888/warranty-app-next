import type { Metadata } from "next";
import EditWarrantyView from "@/features/warranty/components/EditWarrantyView";

export const metadata: Metadata = {
  title: "Editar Garantía | Garantías de productos",
  description: "Edita la información de la garantía del producto.",
}

export default function EditWarrantyPage() {
  return <EditWarrantyView />;
}

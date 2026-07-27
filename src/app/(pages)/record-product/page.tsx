import type { Metadata } from "next";
import { ProductForm } from "@/features/products/components/ProductForm";

export const metadata: Metadata = {
  title: "Agregar producto | Warranty Manager",
  description:
    "Registrá un producto nuevo con fecha de compra, categoría, precio, duración de garantía y comprobante para hacer seguimiento automático del vencimiento.",
  openGraph: {
    title: "Agregar producto | Warranty Manager",
    description:
      "Registrá un producto nuevo con fecha de compra, categoría, precio, duración de garantía y comprobante para hacer seguimiento automático del vencimiento.",
    type: "website",
  },
};

export default function RecordProductPage() {
    return (
        <main>
            <ProductForm />
        </main>
    );
}

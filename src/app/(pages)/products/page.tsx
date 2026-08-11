import type { Metadata } from "next";
import ProductsView from "@/features/products/components/ProductsView";

export const metadata: Metadata = {
  title: "Productos | Garantías de productos",
  description: "Administra y revisa tus productos y sus garantías.",
  openGraph: {
    title: "Productos | Garantías de productos",
    description: "Administra y revisa tus productos y sus garantías.",
    type: "website",
    locale: "es_AR",
    siteName: "Warranty Manager",
  },
}

export default function ProductsPage() {
  return <ProductsView />;
}
import { Package, ShieldCheck, TriangleAlert, ShieldX } from "lucide-react";

import { useProductStore } from "@/features/products/store";

import SummaryCard from "./SummaryCard";

export default function SummaryCards() {
  const products = useProductStore((state) => state.products);

  const total = products.length;

  // Por ahora son datos temporales.
  // Más adelante los conectaremos con warranty.

  const active = Math.max(total - 2, 0);
  const expiring = total > 1 ? 1 : 0;
  const expired = total > 2 ? 1 : 0;

  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-8">
      <SummaryCard
        title="Productos"
        value={total}
        icon={Package}
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
      />

      <SummaryCard
        title="Garantías vigentes"
        value={active}
        icon={ShieldCheck}
        iconBg="bg-green-100"
        iconColor="text-green-600"
      />

      <SummaryCard
        title="Por vencer"
        value={expiring}
        icon={TriangleAlert}
        iconBg="bg-amber-100"
        iconColor="text-amber-600"
      />

      <SummaryCard
        title="Vencidas"
        value={expired}
        icon={ShieldX}
        iconBg="bg-red-100"
        iconColor="text-red-600"
      />
    </section>
  );
}

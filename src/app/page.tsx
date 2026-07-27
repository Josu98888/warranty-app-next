import type { Metadata } from "next";
import HomeView from "@/features/home/HomeView";

export const metadata: Metadata = {
  title: "Panel de garantías | Warranty Manager",
  description:
    "Consultá el estado de tus productos registrados: filtrá por nombre o categoría y mirá qué garantías siguen vigentes, están por vencer o ya vencieron.",
  openGraph: {
    title: "Panel de garantías | Warranty Manager",
    description:
      "Consultá el estado de tus productos registrados: filtrá por nombre o categoría y mirá qué garantías siguen vigentes, están por vencer o ya vencieron.",
    type: "website",
  },
};

export default function Page() {
  return <HomeView />;
}

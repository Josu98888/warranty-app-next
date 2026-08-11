import type { Metadata } from "next";
import HomeView from "@/features/home/HomeView";

export const metadata: Metadata = {
    title: "Inicio | Garantías de tus productos",
    description: "Gestioná y consultá las garantías de tus productos desde un solo lugar.",
    openGraph: {
        title: "Inicio | Garantías de tus productos",
        description: "Gestioná y consultá las garantías de tus productos desde un solo lugar.",
        type: "website",
        locale: "es_AR",
        siteName: "Warranty Manager",
    },
};

export default function HomePage() {
    return <HomeView />;
}
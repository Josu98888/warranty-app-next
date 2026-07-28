import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Sidebar from "@/shared/components/layouts/Sidebar";
import Topbar from "@/shared/components/layouts/Topbar";

export const metadata: Metadata = {
  title: "Warranty App",
  description: "Registro de garantías de tus productos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <Toaster position="top-right" />
        <main className="min-h-screen bg-[#F6F8FC]">
          <div className="flex flex-col lg:flex-row">
            <Sidebar />
            <section className="flex-1 flex flex-col w-full pt-16 lg:pt-0">
              <Topbar />
              <div className="p-4 sm:p-6 lg:p-10">{children}</div>
            </section>
          </div>
        </main>
      </body>
    </html>
  );
}

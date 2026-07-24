import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}

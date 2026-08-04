"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Bell, Plus, Search, UserCircle } from "lucide-react";
import Link from "next/link";

import { ROUTES } from "@/shared/utils/route";

export default function Topbar() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchSubmit = (event: FormEvent) => {
    event.preventDefault();

    const trimmedTerm = searchTerm.trim();

    router.push(
      trimmedTerm
        ? `${ROUTES.HOME}?q=${encodeURIComponent(trimmedTerm)}`
        : ROUTES.HOME,
    );
  };

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 sm:py-0 sm:h-24 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
      {/* Lado izquierdo */}
      <div className="min-w-0">
        <h1 className="text-xl sm:text-3xl font-bold text-slate-900">
          Mis Garantías
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Estado general de tus productos
        </p>
      </div>

      {/* Lado derecho */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        {/* Buscador - oculto en móvil */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden sm:block relative"
        >
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-48 rounded-lg border border-slate-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </form>

        {/* Notificaciones */}
        <button
          className="rounded-lg border border-slate-300 p-2 hover:bg-slate-100 transition"
          aria-label="Notificaciones"
        >
          <Bell size={18} className="sm:w-5 sm:h-5" />
        </button>

        {/* Agregar producto */}
        <Link
          href={ROUTES.RECORD_PRODUCT}
          className="flex items-center gap-1 sm:gap-2 rounded-lg bg-blue-600 px-2 sm:px-4 py-2 text-white hover:bg-blue-700 transition text-xs sm:text-sm whitespace-nowrap"
        >
          <Plus size={16} className="sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Agregar producto</span>
          <span className="sm:hidden">Agregar</span>
        </Link>

        {/* Usuario */}
        <button
          className="rounded-full hover:bg-slate-100 transition p-1"
          aria-label="Usuario"
        >
          <UserCircle size={28} className="sm:w-9 sm:h-9" />
        </button>
      </div>
    </header>
  );
}

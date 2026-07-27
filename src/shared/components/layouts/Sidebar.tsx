"use client";
import { useState } from "react";
import {
  House,
  Package,
  PlusCircle,
  Bell,
  Settings,
  ShieldCheck,
  UserCircle,
  Menu,
  X,
} from "lucide-react";

import SidebarItem from "./SidebarItem";

import { ROUTES } from "@/shared/utils/route";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Botón hamburguesa - visible solo en móvil */}
      <button
        onClick={toggleMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition"
        aria-label="Abrir: menú"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay - visible solo cuando el menú está abierto en móvil */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeMenu}
        />
      )}

      {/* Sidebar - desktop siempre visible, móvil como drawer */}
      <aside
        className={`fixed lg:relative lg:flex w-72 bg-[#0E2F66] text-white flex-col justify-between z-40 transition-all duration-300 h-screen lg:h-auto
                    ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
      >
        <div>
          <div className="px-6 py-8 border-b border-blue-800">
            <div className="flex items-center gap-3">
              <ShieldCheck size={34} />

              <div>
                <p className="font-bold text-lg">Warranty</p>

                <p className="text-sm text-slate-300">Tracker</p>
              </div>
            </div>
          </div>

          <nav className="flex flex-col gap-2 p-4">
            <SidebarItem
              to={ROUTES.HOME}
              icon={House}
              label="Dashboard"
              onClick={closeMenu}
            />

            <SidebarItem
              to={ROUTES.HOME}
              icon={Package}
              label="Productos"
              onClick={closeMenu}
            />

            <SidebarItem
              to={ROUTES.RECORD_PRODUCT}
              icon={PlusCircle}
              label="Agregar producto"
              onClick={closeMenu}
            />

            <SidebarItem
              to={ROUTES.REMINDERS}
              icon={Bell}
              label="Recordatorios"
              onClick={closeMenu}
            />

            <button
              onClick={closeMenu}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-200 hover:bg-blue-800 transition-colors"
            >
              <Settings size={20} />
              Configuración
            </button>
          </nav>
        </div>

        <div className="border-t border-blue-800 p-6">
          <div className="flex items-center gap-3">
            <UserCircle size={40} />

            <div>
              <p className="font-semibold">Usuario</p>

              <span className="text-sm text-slate-300">Warranty Manager</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

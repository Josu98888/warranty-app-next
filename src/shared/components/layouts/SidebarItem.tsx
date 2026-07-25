"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}

export default function SidebarItem({
  to,
  icon: Icon,
  label,
  onClick,
}: SidebarItemProps) {
  const pathname = usePathname();

  const isActive = pathname === to;

  return (
    <Link
      href={to}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
        isActive ? "bg-blue-500 text-white" : "text-slate-200 hover:bg-blue-800"
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );
}

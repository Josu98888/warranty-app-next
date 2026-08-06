import type { categoriesClssificationT } from "./types";

import {
  Smartphone,
  Zap,
  Wrench,
  Package,
  Shirt,
  Car,
  Settings,
  BookOpen,
} from "lucide-react";

export const CATEGORIES: categoriesClssificationT[] = [
  {
    value: "Electronic",
    label: "Electrónica",
    icon: Smartphone,
  },
  {
    value: "Appliance",
    label: "Electrodoméstico",
    icon: Zap,
  },
  {
    value: "Tools",
    label: "Herramientas",
    icon: Wrench,
  },
  {
    value: "Clothing",
    label: "Ropa",
    icon: Shirt,
  },
  {
    value: "Vehicle",
    label: "Vehículos",
    icon: Car,
  },
  {
    value: "Spare-part",
    label: "Piezas y Respuestos",
    icon: Settings,
  },
  {
    value: "Book",
    label: "Librerías",
    icon: BookOpen,
  },
  {
    value: "Other",
    label: "Otro",
    icon: Package,
  },
];

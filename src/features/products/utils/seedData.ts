import type { productT } from "../types"
import { useProductStore } from "../store"
import { useWarrantyStore } from "@/features/warranty/store";

const seedProducts: productT[] = [
  { name: "iPhone 15",            category: "Electronic",   price: 1200, importance: "High",   purchaseDate: "2024-01-15", durationMonths: 12 },
  { name: "Lavadora Samsung",     category: "Appliance",    price: 800,  importance: "Medium", purchaseDate: "2025-03-01", durationMonths: 6  },
  { name: "Cafetera Nespresso",   category: "Appliance",    price: 200,  importance: "Low",    purchaseDate: "2025-07-01", durationMonths: 8  },
  { name: "Filtro de Aceite",     category: "Spare-part",   price: 30,   importance: "Low",    purchaseDate: "2026-03-01", durationMonths: 4  },
  { name: "Zapatillas Nike",      category: "Clothing",     price: 150,  importance: "Medium", purchaseDate: "2026-02-15", durationMonths: 5  },
  { name: "Taladro Bosch",        category: "Tools",        price: 250,  importance: "Medium", purchaseDate: "2025-12-01", durationMonths: 7  },
  { name: "MacBook Pro",          category: "Electronic",   price: 2500, importance: "High",   purchaseDate: "2024-06-15", durationMonths: 36 },
  { name: "Abrigo Invierno",      category: "Clothing",     price: 90,   importance: "Low",    purchaseDate: "2026-01-01", durationMonths: 12 },
  { name: "Auriculares Sony",     category: "Electronic",   price: 350,  importance: "Medium", purchaseDate: "2026-05-01", durationMonths: 6  },
  { name: "Manual TypeScript",    category: "Book",         price: 45,   importance: "Low",    purchaseDate: "2026-06-20", durationMonths: 3  },
  { name: "Silla Ergonómica",     category: "Other",        price: 600,  importance: "Medium", purchaseDate: "2026-04-01", durationMonths: 8  },
  { name: "Juego Llaves Allen",   category: "Tools",        price: 25,   importance: "Low",    purchaseDate: "2025-08-15", durationMonths: 6  },
]

export function seedTestData() {
  const { products, addProduct } = useProductStore.getState()
  const { evaluateWarranty } = useWarrantyStore.getState()

  if (products.length > 0) return

  seedProducts.forEach((productSeed) => {
    const newProduct = { ...productSeed, id: crypto.randomUUID() }
    addProduct(newProduct)
    evaluateWarranty(newProduct)
  })
}

export function clearAllData() {
  useProductStore.setState({ products: [] })
  useWarrantyStore.setState({ warranties: [] })
}
"use client";
import { useProductStore } from "../store";

export function ProductList() {
  const products = useProductStore((s) => s.products);

  if (products.length === 0) {
    return (
      <p className="text-gray-500 text-sm mt-4">
        No hay productos cargados todavía.
      </p>
    );
  }

  return (
    <ul className="mt-4 flex flex-col gap-3">
      {products.map((product) => (
        <li key={product.id} className="border rounded-lg p-4">
          <p className="font-medium">{product.name}</p>
          <p className="text-sm text-gray-500">
            {product.category} · {product.purchaseDate} ·{" "}
            {product.durationMonths} meses
          </p>
        </li>
      ))}
    </ul>
  );
}

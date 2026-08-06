// src/features/warranty/EditWarrantyView.tsx
"use client";

import { useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

import { productRepository } from "@/features/products/repositories/productRepository";
import { useProductStore } from "@/features/products/store";
import { useWarrantyStore } from "@/features/warranty/store/store";
import type { productT } from "@/features/products/types";
import { ROUTES } from "@/shared/utils/route";

export default function EditWarrantyView() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const products = useProductStore((state) => state.products);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const updateWarranty = useWarrantyStore((state) => state.updateWarranty);

  const product = products.find((p) => p.id === Number(id));

  const [purchaseDate, setPurchaseDate] = useState(product?.purchaseDate ?? "");
  const [durationMonths, setDurationMonths] = useState(
    product?.durationMonths ?? 12,
  );
  const [importance, setImportance] = useState<productT["importance"]>(
    product?.importance ?? "Medium",
  );

  if (!product) {
    return (
      <main className="max-w-xl mx-auto">
        <p className="text-slate-500 mb-4">
          No se encontró el producto que querés editar.
        </p>
        <Link href={ROUTES.HOME} className="text-blue-600 underline">
          Volver al inicio
        </Link>
      </main>
    );
  }
const handleSubmit = async (event: FormEvent) => {
  event.preventDefault();

  const updatedFields: Partial<productT> = {
    purchaseDate,
    durationMonths: Number(durationMonths),
    importance,
  };

  try {
    await productRepository.update(product.id!, updatedFields);

    updateProduct(product.id!, updatedFields);
    updateWarranty({ ...product, ...updatedFields });

    toast.success("Garantía actualizada correctamente");
    router.push(ROUTES.HOME);
  } catch (error) {
    console.error(error);
    toast.error("No se pudo actualizar la garantía");
  }
};
  return (
    <main className="max-w-xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-6">
        Editar garantía de &ldquo;{product.name}&rdquo;
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm"
      >
        <div>
          <label htmlFor="purchaseDate" className="text-sm font-medium">
            Fecha de compra
          </label>
          <input
            id="purchaseDate"
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="durationMonths" className="text-sm font-medium">
            Duración (meses)
          </label>
          <input
            id="durationMonths"
            type="number"
            min={1}
            value={durationMonths}
            onChange={(e) => setDurationMonths(Number(e.target.value))}
            className="mt-1 w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="importance" className="text-sm font-medium">
            Importancia
          </label>
          <select
            id="importance"
            value={importance}
            onChange={(e) =>
              setImportance(e.target.value as productT["importance"])
            }
            className="mt-1 w-full border rounded px-3 py-2 text-sm"
          >
            <option value="Low">Baja</option>
            <option value="Medium">Media</option>
            <option value="High">Alta</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white rounded px-4 py-2 text-sm hover:bg-blue-700"
          >
            Guardar cambios
          </button>

          <Link
            href={ROUTES.HOME}
            className="rounded px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </main>
  );
}
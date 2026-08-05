"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import type { ProductRow } from "@/features/warranty/utils/attachWarrantyToProducts";
import { CATEGORIES } from "../categories";
import { getWarrantyStatus } from "@/features/warranty/utils/warrantyStatus";
import { ROUTES } from "@/shared/utils/route";
import { useProductStore } from "@/features/products/store";
import { useWarrantyStore } from "@/features/warranty/store/store";
import { productRepository } from "@/features/products/repositories/productRepository";

interface ProductsTableProps {
  productsWithWarranty: ProductRow[];
  totalProductCount: number;
}

export default function ProductsTable({
  productsWithWarranty,
  totalProductCount,
}: ProductsTableProps) {
  const PRODUCTS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const deleteProduct = useProductStore((state) => state.deleteProduct);
  const removeWarranty = useWarrantyStore((state) => state.removeWarranty);

  const handleDelete = async (

    id: string | undefined,

    name: string,

  ) => {
    if (!id) return;

    const confirmed = window.confirm(
      `¿Seguro que querés eliminar "${name}"? Esta acción no se puede deshacer.`,
    );

    if (!confirmed) return;

    try {
await productRepository.delete(id);
      deleteProduct(id);
      removeWarranty(id);

      toast.success("Producto eliminado", {
        duration: 3000,
      });
    } catch (error) {
      console.error("ERROR:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Error al eliminar el producto"
      );
    }
  };

  const totalPages = Math.max(
    1,
    Math.ceil(productsWithWarranty.length / PRODUCTS_PER_PAGE),
  );

  const [prevTotalPages, setPrevTotalPages] = useState(totalPages);
  if (totalPages !== prevTotalPages) {
    setPrevTotalPages(totalPages);
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;

  const visibleProducts = useMemo(() => {
    return productsWithWarranty.slice(
      startIndex,
      startIndex + PRODUCTS_PER_PAGE,
    );
  }, [productsWithWarranty, startIndex]);

  const getCategoryLabel = (categoryValue: string): string => {
    const foundCategory = CATEGORIES.find(
      (category) => category.value === categoryValue,
    );
    return foundCategory?.label ?? categoryValue;
  };

  const getRowClasses = (expiryDate?: string) => {
    const status = getWarrantyStatus(expiryDate);

    switch (status?.variant) {
      case "valid":
        return "bg-green-50/70";
      case "expiring-soon":
        return "bg-amber-50/70";
      case "expired":
        return "bg-red-50/70";
      default:
        return "";
    }
  };

  const getStatusBadge = (expiryDate?: string) => {
    const status = getWarrantyStatus(expiryDate);

    if (!status) return null;

    const statusLabel = {
      expired: {
        text: "Vencido",
        className: "bg-red-100 text-red-700 border border-red-200",
      },
      "expiring-soon": {
        text: "Próximo a vencer",
        className: "bg-amber-100 text-amber-700 border border-amber-200",
      },
      valid: {
        text: "Vigente",
        className: "bg-green-100 text-green-700 border border-green-200",
      },
    };

    const config = statusLabel[status.variant];

    return (
      <span
        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${config.className}`}
      >
        {config.text}
      </span>
    );
  };

  const getExpiryDateInfo = (expiryDate?: string) => {
    const status = getWarrantyStatus(expiryDate);

    if (!status) return null;

    const daysText = status.days === 1 ? "día" : "días";
    const messageByVariant = {
      expired: {
        text: `Vencida hace ${status.days} ${daysText}`,
        className: "text-red-600",
      },
      "expiring-soon": {
        text: `En ${status.days} ${daysText}`,
        className: "text-amber-600",
      },
      valid: {
        text: `En ${status.days} ${daysText}`,
        className: "text-green-600",
      },
    };

    const config = messageByVariant[status.variant];

    return (
      <div className={`text-xs font-medium ${config.className}`}>
        {config.text}
      </div>
    );
  };

  return (
    <section className="mb-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-2 border-b border-slate-200 px-4 py-3 sm:px-6 sm:py-4">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-slate-800">
            Productos registrados
          </h2>

          <p className="text-xs sm:text-sm text-slate-500">
            Listado de todas las garantías
          </p>
        </div>
      </div>
      <table className="w-full text-xs sm:text-sm">
        <caption className="sr-only">Listado de productos con garantía</caption>

        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-600 uppercase text-xs tracking-wide">
            <th className="px-2 sm:px-4 py-2 sm:py-4 font-semibold">
              Producto
            </th>
            <th className="hidden md:table-cell px-2 sm:px-4 py-2 sm:py-4 font-semibold">
              Categoría
            </th>
            <th className="hidden lg:table-cell px-2 sm:px-4 py-2 sm:py-4 font-semibold">
              Precio
            </th>

            <th className="hidden sm:table-cell px-2 sm:px-4 py-2 sm:py-4 font-semibold">
              Compra
            </th>
            <th className="px-2 sm:px-4 py-2 sm:py-4 font-semibold">
              Vencimiento
            </th>
            <th className="px-2 sm:px-4 py-2 sm:py-4 font-semibold">Estado</th>
            <th className="hidden xl:table-cell px-2 sm:px-4 py-2 sm:py-4 font-semibold">
              Plazo
            </th>
            <th className="px-2 sm:px-4 py-2 sm:py-4 font-semibold">
              Comprobante
            </th>
            <th className="px-2 sm:px-4 py-2 sm:py-4 font-semibold">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {visibleProducts.map((productRow) => {
            const rowClasses = getRowClasses(productRow.warranty?.expiryDate);

            return (
              <tr
                key={productRow.id}
                className={`border-b border-slate-100 transition-colors hover:bg-slate-50 ${rowClasses}`}
              >
                <td className="px-2 sm:px-4 py-2 sm:py-4 font-medium text-slate-900 max-w-xs truncate">
                  {productRow.name}
                </td>
                <td className="hidden md:table-cell px-2 sm:px-4 py-2 sm:py-4">
                  {getCategoryLabel(productRow.category)}
                </td>
                <td className="hidden lg:table-cell px-2 sm:px-4 py-2 sm:py-4">
                  ${productRow.price}
                </td>

                <td className="hidden sm:table-cell px-2 sm:px-4 py-2 sm:py-4 text-xs">
                  {productRow.purchaseDate}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-4">
                  <div className="text-xs sm:text-sm">
                    {productRow.warranty?.expiryDate
                      ? new Date(
                        productRow.warranty.expiryDate,
                      ).toLocaleDateString()
                      : "—"}
                  </div>
                  {productRow.warranty?.expiryDate && (
                    <div className="mt-1">
                      {getExpiryDateInfo(productRow.warranty.expiryDate)}
                    </div>
                  )}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-4">
                  {getStatusBadge(productRow.warranty?.expiryDate)}
                </td>
                <td className="hidden xl:table-cell px-2 sm:px-4 py-2 sm:py-4 text-xs">
                  {productRow.warranty?.warrantyTerm ?? "—"}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-4">
                  {productRow.receipt ? (
                    <a
                      href={productRow.receipt}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={productRow.receipt}
                        alt={`Comprobante de ${productRow.name}`}
                        className="h-10 w-10 object-cover rounded border cursor-pointer hover:opacity-80"
                      />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400">
                      Sin comprobante
                    </span>
                  )}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`${ROUTES.EDIT_WARRANTY}/${productRow.id}`}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 whitespace-nowrap"
                    >
                      Editar
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(productRow.id, productRow.name)
                      }
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 whitespace-nowrap"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {productsWithWarranty.length > PRODUCTS_PER_PAGE && (
        <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-slate-600">
            Mostrando {productsWithWarranty.length === 0 ? 0 : startIndex + 1}-
            {Math.min(
              startIndex + PRODUCTS_PER_PAGE,
              productsWithWarranty.length,
            )}{" "}
            de {productsWithWarranty.length} productos
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Atrás
            </button>

            <span className="text-sm text-slate-600">
              Página {currentPage} de {totalPages}
            </span>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={currentPage === totalPages}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {productsWithWarranty.length === 0 && (
        <p className="py-8 text-center text-slate-400">
          {totalProductCount === 0
            ? "No hay productos registrados."
            : "No se encontraron productos con los filtros actuales."}
        </p>
      )}
    </section>
  );
}
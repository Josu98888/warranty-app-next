"use client";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type productFormDataT } from "../schema";
import { useProductStore } from "../store";
import { productRepository } from "../repositories/productRepository";
import { useWarrantyStore } from "@/features/warranty/store/store";
import toast from "react-hot-toast";
import Image from "next/image";
import { uploadReceipt } from "@/lib/uploadReceipt";
import { CATEGORIES } from "../categories";
import { mapProduct } from "../utils/mapProduct";
export function ProductForm() {
  const {
  register,
  handleSubmit,
  control,
  setValue,
  reset,
  formState: { errors },
} = useForm<productFormDataT>({
  resolver: zodResolver(productSchema),
});
 const selectedCategory = useWatch({
  control,
  name: "category",
});

const receiptUrl = useWatch({
  control,
  name: "receipt",
});
  const setProducts = useProductStore(
    (state) => state.setProducts
  );
  const evaluateWarranty = useWarrantyStore(
    (state) => state.evaluateWarranty
  );

  const onSubmit = async (data: productFormDataT) => {
    try {
      await productRepository.create(data);

      const products =
        await productRepository.getAll();

      const mappedProducts = products.map(mapProduct);

      setProducts(mappedProducts);

      mappedProducts.forEach((product) => {
        evaluateWarranty(product);
      });

      reset();

      toast.success(
        "Producto agregado correctamente",
        {
          duration: 3000,
        }
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Error al guardar producto"
      );
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 p-4 border rounded-lg"
    >
      <div>
        <label htmlFor="name" className="text-sm font-medium">
          Producto
        </label>
        <input
          id="name"
          {...register("name")}
          className="mt-1 w-full border rounded px-3 py-2 text-sm"
          placeholder="Smart TV Samsung"
        />
        {errors.name && (
          <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="text-sm font-medium">
          Categoría
        </label>

        <article className="grid grid-cols-4 gap-2">
          {CATEGORIES.map((category) => (
            <label
              key={category.value}
              className={`flex flex-col items-center gap-1 p-2 border rounded cursor-pointer text-xs font-semibold
                                ${selectedCategory === category.value ? "border-blue-600 bg-blue-300" : "border-slate-600"}`}
            >
              <input
                type="radio"
                value={category.value}
                {...register("category")}
                className="hidden"
              />

              <category.icon size={20} />

              {category.label}
            </label>
          ))}
        </article>

        {errors.category && (
          <p className="text-red-600 text-xs mt-1">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="price" className="text-sm font-medium">
          Precio
        </label>
        <input
          id="price"
          type="number"
          {...register("price", { valueAsNumber: true })}
          className="mt-1 w-full border rounded px-3 py-2 text-sm"
          placeholder="1200"
        />
        {errors.price && (
          <p className="text-red-600 text-xs mt-1">{errors.price.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="purchaseDate" className="text-sm font-medium">
          Fecha de compra
        </label>
        <input
          id="purchaseDate"
          type="date"
          {...register("purchaseDate")}
          className="mt-1 w-full border rounded px-3 py-2 text-sm"
        />
        {errors.purchaseDate && (
          <p className="text-red-600 text-xs mt-1">
            {errors.purchaseDate.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="durationMonths" className="text-sm font-medium">
          Duración (meses)
        </label>
        <input
          id="durationMonths"
          type="number"
          {...register("durationMonths", { valueAsNumber: true })}
          className="mt-1 w-full border rounded px-3 py-2 text-sm"
          placeholder="24"
        />
        {errors.durationMonths && (
          <p className="text-red-600 text-xs mt-1">
            {errors.durationMonths.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="importance" className="text-sm font-medium">
          Importancia
        </label>
        <select
          id="importance"
          {...register("importance")}
          className="mt-1 w-full border rounded px-3 py-2 text-sm"
        >
          <option value="">Elegir importancia...</option>
          <option value="Low">Baja</option>
          <option value="Medium">Media</option>
          <option value="High">Alta</option>
        </select>
        {errors.importance && (
          <p className="text-red-600 text-xs mt-1">
            {errors.importance.message}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="receipt" className="text-sm font-medium">
          Comprobante de compra
        </label>
        <input
          id="receipt"
          type="file"
          accept="image/*,application/pdf"
          onChange={async (e) => {
            const file = e.target.files?.[0];

            if (!file) return;

            try {
              const publicUrl = await uploadReceipt(file);

              setValue("receipt", publicUrl);
              toast.success("Comprobante subido");
            } catch (error) {
              console.error(error);

              toast.error("Error al subir comprobante");
            }
          }}
          className="mt-1 w-full border rounded px-3 py-2 text-sm"
        />
        {receiptUrl && (
  <Image
    src={receiptUrl}
    alt="Vista previa del comprobante"
    width={64}
    height={64}
    className="mt-2 h-16 w-16 rounded border"
    
          />
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white rounded px-4 py-2 text-sm hover:bg-blue-700"
      >
        Agregar producto
      </button>
    </form>
  );

}


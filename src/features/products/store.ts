"use client";

import { create } from "zustand";
import type { productT } from "@/features/products/types";

type productStoreT = {
  products: productT[];

  setProducts: (products: productT[]) => void;

  addProduct: (product: productT) => void;

  updateProduct: (
    id: string,
    data: Partial<productT>
  ) => void;

  deleteProduct: (id: string) => void;
};

export const useProductStore = create<productStoreT>((set) => ({
  products: [],

  setProducts: (products) =>
    set({ products }),

  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product],
    })),

  updateProduct: (id, data) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.id === id
          ? { ...product, ...data }
          : product
      ),
    })),

  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter(
        (product) => product.id !== id
      ),
    })),
}));
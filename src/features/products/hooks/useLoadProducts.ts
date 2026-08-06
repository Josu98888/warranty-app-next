import { useEffect } from "react";
import { useProductStore } from "../store";
import { useWarrantyStore } from "@/features/warranty/store/store";
import { productRepository } from "../repositories/productRepository";
import { mapProduct } from "../utils/mapProduct";

export function useLoadProducts() {
  const setProducts = useProductStore(
    (state) => state.setProducts
  );

  const evaluateWarranty = useWarrantyStore(
    (state) => state.evaluateWarranty
  );

  useEffect(() => {
    async function loadProducts() {
      try {
        const products =
          await productRepository.getAll();

        const mappedProducts =
          products.map(mapProduct);

        setProducts(mappedProducts);

        mappedProducts.forEach((product) => {
          evaluateWarranty(product);
        });
      } catch (error) {
        console.error(error);
      }
    }

    loadProducts();
  }, [setProducts, evaluateWarranty]);
};
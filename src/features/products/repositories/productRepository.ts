import { supabase } from "@/lib/supabase";
import type { productT } from "../types";

export const productRepository = {
    async getAll() {
        const { data, error } = await supabase
            .from("products")
            .select("*");

        if (error) throw error;

        return data;
    },

    async create(product: Omit<productT, "id">) {
        const payload = {
            name: product.name,
            price: product.price,
            importance: product.importance,
            category: product.category,
            purchase_date: product.purchaseDate,
            duration_months: product.durationMonths,
            receipt: product.receipt ?? null,
        };
        const { data, error } = await supabase
            .from("products")
            .insert(payload)
            .select()
            .single();

        if (error) {
            console.error("ERROR SUPABASE:", error);
            throw error;
        }

        return data;
    },

    async update(id: number, product: Partial<productT>) {


  const { data, error } = await supabase
    .from("products")
    .update({
      name: product.name,
      price: product.price,
      importance: product.importance,
      category: product.category,
      purchase_date: product.purchaseDate,
      duration_months: product.durationMonths,
      receipt: product.receipt,
    })
    .eq("id", id)
    .select();

  if (error) throw error;

  return data;
},

    async delete(id: number) {
        const { data, error } = await supabase
            .from("products")
            .delete()
            .eq("id", id)
            .select();

        if (error) throw error;

        return data;
    },
};
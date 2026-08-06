import type { productT } from "../types";

type SupabaseProduct = {
  id: number;
  name: string;
  price: string | number;
  importance: productT["importance"];
  category: string;
  purchase_date: string;
  duration_months: number;
  receipt: string | null;
};

export const mapProduct = (product: SupabaseProduct): productT => ({
  id: product.id,
  name: product.name,
  price: product.price,
  importance: product.importance,
  category: product.category,
  purchaseDate: product.purchase_date,
  durationMonths: product.duration_months,
  receipt: product.receipt ?? undefined,
});
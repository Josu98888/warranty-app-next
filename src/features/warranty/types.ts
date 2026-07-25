import type { productT } from "@/features/products/types";

export type warrantyTermT = "short" | "medium" | "long";

export const warrantyTermReturn: Record<warrantyTermT, string> = {
  short: "Corto",

  medium: "Medio",

  long: "Largo",
} as const;

export type warrantyTermLabelT =
  (typeof warrantyTermReturn)[keyof typeof warrantyTermReturn];

export type warrantiesInStateT = {
  warranties: warrantyT[];
};

export type temporalThresholdsT = Record<
  productT["importance"],
  {
    short: number;
    long: number;
  }
>;

export type warrantyT = {
  id: string;

  warrantyTerm: warrantyTermT | warrantyTermLabelT;

  expiryDate: string;

  remainingMonths: number;
};

// Re-exportamos para que el store no dependa de products/types directamente
export type { productT };

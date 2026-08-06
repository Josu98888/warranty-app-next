"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { addMonths, differenceInMonths, parseISO } from "date-fns";

import type {
  temporalThresholdsT,
  warrantiesInStateT,
  warrantyT,
} from "../types";
import type { productT } from "../types";
import { ComputeWarrantyTerm } from "../utils/computeWarrantyTerm";

const THRESHOLDS: temporalThresholdsT = {
  High: { short: 9, long: 24 },

  Medium: { short: 6, long: 18 },

  Low: { short: 3, long: 12 },
};

// Store

type warrantyStoreT = {
  warranties: warrantyT[];

  evaluateWarranty: (product: productT) => void;

  updateWarranty: (product: productT) => void;

  removeWarranty: (id: number) => void;
};

export const useWarrantyStore = create<warrantyStoreT>()(
  persist(
    (set) => {
      return {
        warranties: [],

        evaluateWarranty: (product) => {
          const id = product.id!;

          const expiry = addMonths(
            parseISO(product.purchaseDate),
            product.durationMonths,
          );

          set((state): warrantiesInStateT => {
            return {
              warranties: [
                ...state.warranties.filter((warranty) => warranty.id !== id),
                {
                  id: id,
                  warrantyTerm: ComputeWarrantyTerm(product, THRESHOLDS),
                  expiryDate: expiry.toISOString(),
                  remainingMonths: differenceInMonths(expiry, new Date()),
                },
              ],
            };
          });
        },
        updateWarranty: (product) => {
          const id = product.id; //product.id! ;

          const expiry = addMonths(
            parseISO(product.purchaseDate),
            product.durationMonths,
          );

          set((state): warrantiesInStateT => {
            return {
              warranties: state.warranties.map((warranty): warrantyT => {
                if (warranty.id === id) {
                  return {
                    id,
                    warrantyTerm: ComputeWarrantyTerm(product, THRESHOLDS),
                    expiryDate: expiry.toISOString(),
                    remainingMonths: differenceInMonths(expiry, new Date()),
                  };
                } else {
                  return warranty;
                }
              }),
            };
          });
        },
        removeWarranty: (id) => {
          set((state): warrantiesInStateT => {
            return {
              warranties: state.warranties.filter(
                (warranty) => warranty.id !== id,
              ),
            };
          });
        },
      };
    },
    { name: "warranty-storage" },
  ),
);


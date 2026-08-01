"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { reminderSettingsT } from "./types";

type reminderStoreT = {
  settings: reminderSettingsT;

  updateSettings: (
    settings: reminderSettingsT,
  ) => void;
};

export const useReminderStore =
  create<reminderStoreT>()(
    persist(
      (set) => ({
        settings: {
          email: "",

          send30DaysBefore: true,

          send7DaysBefore: true,

          send1DayBefore: true,

          sendOnExpiry: true,
        },

        updateSettings: (settings) =>
          set({ settings }),
      }),
      {
        name: "reminder-settings",
      },
    ),
  );
import { differenceInCalendarDays } from "date-fns";
import type {
  reminderSettingsT,
  warrantyT,
} from "../types";

export type reminderTypeT =
  | "30-days"
  | "7-days"
  | "1-day"
  | "expired";

export type reminderResultT = {
  warranty: warrantyT;
  type: reminderTypeT;
};

export function checkReminders(
  warranties: warrantyT[],
  settings: reminderSettingsT,
): reminderResultT[] {
  const reminders: reminderResultT[] = [];

  warranties.forEach((warranty) => {
    const daysRemaining =
      differenceInCalendarDays(
        new Date(warranty.expiryDate),
        new Date(),
      );

    if (
      settings.send30DaysBefore &&
      daysRemaining === 30
    ) {
      reminders.push({
        warranty,
        type: "30-days",
      });
    }

    if (
      settings.send7DaysBefore &&
      daysRemaining === 7
    ) {
      reminders.push({
        warranty,
        type: "7-days",
      });
    }

    if (
      settings.send1DayBefore &&
      daysRemaining === 1
    ) {
      reminders.push({
        warranty,
        type: "1-day",
      });
    }

    if (
      settings.sendOnExpiry &&
      daysRemaining <= 0
    ) {
      reminders.push({
        warranty,
        type: "expired",
      });
    }
  });

  return reminders;
}
import { differenceInDays, parseISO } from "date-fns";
import type { warrantyT } from "@/features/warranty/types";

const WARRANTY_GROUP = {
  EXPIRED: 0,
  EXPIRING_SOON: 1,
  VALID: 2,
} as const;

const EXPIRING_SOON_DAYS = 30 as const;

function getRemainingDays(expiryDate?: string): number {
  return expiryDate
    ? differenceInDays(parseISO(expiryDate), new Date())
    : Infinity;
}

function getWarrantyGroup(remainingDays: number): number {
  if (remainingDays <= 0) return WARRANTY_GROUP.EXPIRED;
  if (remainingDays <= EXPIRING_SOON_DAYS) return WARRANTY_GROUP.EXPIRING_SOON;
  return WARRANTY_GROUP.VALID;
}

export function sortByWarrantyUrgency<T extends { warranty?: warrantyT }>(
  firstItem: T,
  secondItem: T,
): number {
  const firstExpiryDate = firstItem.warranty?.expiryDate;
  const secondExpiryDate = secondItem.warranty?.expiryDate;

  const firstGroup = getWarrantyGroup(getRemainingDays(firstExpiryDate));
  const secondGroup = getWarrantyGroup(getRemainingDays(secondExpiryDate));

  if (firstGroup !== secondGroup) return firstGroup - secondGroup;
  if (firstExpiryDate && secondExpiryDate)
    return firstExpiryDate.localeCompare(secondExpiryDate);
  if (firstExpiryDate) return -1;
  if (secondExpiryDate) return 1;
  return 0;
}

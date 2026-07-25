import { differenceInCalendarDays, parseISO, startOfDay } from 'date-fns'

export function getWarrantyStatus(expiryDate) {
  if (!expiryDate) {
    return null
  }

  const today = startOfDay(new Date())
  const expiry = startOfDay(parseISO(expiryDate))
  const daysRemaining = differenceInCalendarDays(expiry, today)

  if (daysRemaining < 0) {
    return {
      variant: 'expired',
      days: Math.abs(daysRemaining),
      label: `Vencida hace ${Math.abs(daysRemaining)} día${Math.abs(daysRemaining) === 1 ? '' : 's'}`,
      className: 'border-red-200 bg-red-50 text-red-700',
    }
  }

  if (daysRemaining <= 30) {
    return {
      variant: 'expiring-soon',
      days: daysRemaining,
      label: `En ${daysRemaining} día${daysRemaining === 1 ? '' : 's'}`,
      className: 'border-orange-200 bg-orange-50 text-orange-700',
    }
  }

  return {
    variant: 'valid',
    days: daysRemaining,
    label: `En ${daysRemaining} días`,
    className: 'border-green-200 bg-green-50 text-green-700',
  }
}
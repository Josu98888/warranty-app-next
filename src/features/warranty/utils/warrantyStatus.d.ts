export type WarrantyStatusVariant = 'expired' | 'expiring-soon' | 'valid'

export interface WarrantyStatusResult {
  variant: WarrantyStatusVariant
  days: number
  label: string
  className: string
}

export function getWarrantyStatus(expiryDate: string | undefined): WarrantyStatusResult | null
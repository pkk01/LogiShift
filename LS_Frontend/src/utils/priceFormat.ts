/**
 * Utility functions for price formatting and display
 */

/**
 * Format price with INR symbol
 */
export const formatPrice = (price: number | null | undefined): string => {
  if (price === null || price === undefined) {
    return '₹0.00'
  }
  return `₹${price.toFixed(2)}`
}

/**
 * Format weight with kg
 */
export const formatWeight = (weight: number | null | undefined): string => {
  if (weight === null || weight === undefined) {
    return '0 kg'
  }
  return `${weight} kg`
}

/**
 * Format distance with km
 */
export const formatDistance = (distance: number | null | undefined): string => {
  if (distance === null || distance === undefined) {
    return '0 km'
  }
  return `${distance.toFixed(2)} km`
}

/**
 * Package type options with surcharges
 */
export const PACKAGE_TYPES = [
  { value: 'Small', label: 'Small', surcharge: 0 },
  { value: 'Medium', label: 'Medium (+₹20)', surcharge: 20 },
  { value: 'Large', label: 'Large (+₹50)', surcharge: 50 },
  { value: 'Fragile', label: 'Fragile (+₹70)', surcharge: 70 },
  { value: 'Electronics', label: 'Electronics (+₹100)', surcharge: 100 },
]

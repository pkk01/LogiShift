/**
 * Industry-standard phone number utility with country code
 */

export const COUNTRY_CODES = [
  { code: '+1', country: 'USA/Canada' },
  { code: '+44', country: 'UK' },
  { code: '+91', country: 'India' },
  { code: '+86', country: 'China' },
  { code: '+81', country: 'Japan' },
  { code: '+33', country: 'France' },
  { code: '+49', country: 'Germany' },
  { code: '+39', country: 'Italy' },
  { code: '+34', country: 'Spain' },
  { code: '+61', country: 'Australia' },
  { code: '+55', country: 'Brazil' },
  { code: '+27', country: 'South Africa' },
  { code: '+65', country: 'Singapore' },
  { code: '+60', country: 'Malaysia' },
  { code: '+62', country: 'Indonesia' },
]

/**
 * Format 10-digit phone number without country code
 * Allows only numeric input, max 10 digits
 */
export const format10DigitPhone = (value: string): string => {
  const cleaned = value.replace(/\D/g, '')
  return cleaned.slice(0, 10)
}

/**
 * Validate 10-digit phone number
 */
export const isValid10DigitPhone = (value: string): boolean => {
  const cleaned = value.replace(/\D/g, '')
  return cleaned.length === 10
}

/**
 * Combine country code with phone number
 */
export const combinePhoneWithCountryCode = (countryCode: string, phone: string): string => {
  const cleanedPhone = phone.replace(/\D/g, '')
  return `${countryCode}${cleanedPhone}`
}


// Example unit test for a utility function

import { describe, it, expect } from '@jest/globals'

// Mock utility function to demonstrate unit testing
function formatCurrency(amount: number, currency = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(amount)
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('should format currency in BRL by default', () => {
      expect(formatCurrency(1000)).toBe('R$ 1.000,00')
    })

    it('should format currency in specified currency', () => {
      expect(formatCurrency(1000, 'USD')).toContain('1.000')
    })

    it('should handle zero values', () => {
      expect(formatCurrency(0)).toBe('R$ 0,00')
    })

    it('should handle negative values', () => {
      expect(formatCurrency(-100)).toBe('-R$ 100,00')
    })
  })

  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      expect(validateEmail('user@example.com')).toBe(true)
      expect(validateEmail('test.email+tag@domain.co.uk')).toBe(true)
    })

    it('should reject invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('user@')).toBe(false)
      expect(validateEmail('@domain.com')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })
})
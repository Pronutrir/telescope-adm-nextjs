// Example unit test for a utility function

import { describe, it, expect } from '@jest/globals'
import { formatCurrency } from '../../src/lib/utils'

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('should format currency in BRL by default', () => {
      const result = formatCurrency(1000)
      expect(result).toContain('R$')
      expect(result).toContain('1.000,00')
    })

    it('should handle zero values', () => {
      const result = formatCurrency(0)
      expect(result).toContain('R$')
      expect(result).toContain('0,00')
    })

    it('should handle negative values', () => {
      const result = formatCurrency(-100)
      expect(result).toContain('R$')
      expect(result).toContain('100,00')
      expect(result).toContain('-')
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
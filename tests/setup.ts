// Setup global para testes
import '@testing-library/jest-dom'
import React from 'react'

// Mock do next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return React.createElement('img', props)
  },
}))

// Mock do next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}))

// Suppress console warnings in tests (opcional)
global.console = {
  ...console,
  // warn: jest.fn(), // Descomente para silenciar warnings
  // error: jest.fn(), // Descomente para silenciar errors
}

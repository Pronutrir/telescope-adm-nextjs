import '@testing-library/jest-dom'

// Mock fetch for API testing
global.fetch = jest.fn()

// Mock Next.js modules for integration tests
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/test',
  useSearchParams: () => new URLSearchParams(),
  notFound: jest.fn(),
  redirect: jest.fn(),
}))

// Mock Next.js headers
jest.mock('next/headers', () => ({
  cookies: () => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  }),
  headers: () => ({
    get: jest.fn(),
  }),
}))

// Setup test environment
beforeEach(() => {
  // Reset all mocks before each test
  jest.clearAllMocks()
  
  // Reset fetch mock
  ;(fetch as jest.Mock).mockClear()
})

// Global test utilities
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock environment variables for integration tests
Object.defineProperty(process.env, 'NODE_ENV', {
  value: 'test',
  writable: true,
})

Object.defineProperty(process.env, 'NEXT_PUBLIC_API_URL', {
  value: 'http://localhost:3000/api',
  writable: true,
})
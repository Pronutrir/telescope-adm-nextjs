// Unit Tests - Testam componentes isolados sem dependências externas

export default {
    displayName: 'Unit Tests',
    testMatch: ['<rootDir>/tests/unit/**/*.test.(ts|tsx|js|jsx)'],
    collectCoverageFrom: [
        'src/components/**/*.{ts,tsx}',
        'src/hooks/**/*.{ts,tsx}',
        'src/utils/**/*.{ts,tsx}',
        'src/lib/**/*.{ts,tsx}',
        '!src/lib/redis-setup.ts', // Exclude infrastructure
        '!src/tests/redis-validator.ts', // Exclude infrastructure
    ],
    setupFilesAfterEnv: ['<rootDir>/tests/unit/setup.ts'],
    testEnvironment: 'jsdom',
}
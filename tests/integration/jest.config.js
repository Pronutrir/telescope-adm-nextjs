// Integration Tests - Testam interações entre componentes sem dependências externas

export default {
    displayName: 'Integration Tests',
    testMatch: ['<rootDir>/tests/integration/**/*.test.(ts|tsx|js|jsx)'],
    collectCoverageFrom: [
        'src/services/**/*.{ts,tsx}',
        'src/contexts/**/*.{ts,tsx}',
        'src/app/**/*.{ts,tsx}',
        '!src/app/**/loading.tsx',
        '!src/app/**/error.tsx',
        '!src/app/**/not-found.tsx',
        '!src/app/**/layout.tsx',
    ],
    setupFilesAfterEnv: ['<rootDir>/tests/integration/setup.ts'],
    testEnvironment: 'jsdom',
}
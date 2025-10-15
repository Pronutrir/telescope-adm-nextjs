// Infrastructure Tests - Testam Redis e serviços externos

export default {
    displayName: 'Infrastructure Tests',
    testMatch: ['<rootDir>/tests/infrastructure/**/*.test.(ts|tsx|js|jsx)'],
    collectCoverageFrom: [
        'src/tests/**/*.{ts,tsx}',
        'src/config/redis-environments.{ts,tsx}',
        'src/lib/redis-setup.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/index.ts'
    ],
    setupFilesAfterEnv: ['<rootDir>/tests/infrastructure/setup.ts'],
    testTimeout: 60000, // 60 segundos para testes de infraestrutura
}
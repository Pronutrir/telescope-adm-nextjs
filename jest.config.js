module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom', // Mudado de 'node' para 'jsdom' para testes React
    roots: ['<rootDir>/src', '<rootDir>/tests'],
    testMatch: [
        '**/__tests__/**/*.ts?(x)', // Adicionado suporte para .tsx
        '**/?(*.)+(spec|test).ts?(x)' // Adicionado suporte para .tsx
    ],
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: {
                jsx: 'react', // Suporte para JSX
            }
        }],
    },
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}', // Incluir arquivos .tsx
        '!src/**/*.d.ts',
        '!src/**/index.ts'
    ],
    testTimeout: 30000,
    setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'], // Arquivo de setup global
    moduleNameMapper: {
        // Mock para assets estáticos (deve vir antes do alias @/)
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/tests/__mocks__/fileMock.js',
        '^@/(.*)$': '<rootDir>/src/$1'
    }
}
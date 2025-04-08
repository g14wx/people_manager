import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    clearMocks: true,
    coverageProvider: 'v8',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    setupFilesAfterEnv: ['./tests/setup.ts'],
    testMatch: [
        "**/tests/**/*.test.[jt]s?(x)",
    ],
    resetMocks: true,
    restoreMocks: true,
    testTimeout: 10000,
    forceExit: true,
    detectOpenHandles: true,
};

export default config;
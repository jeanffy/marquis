// https://jestjs.io/fr/docs/configuration
const config = {
  extensionsToTreatAsEsm: ['.ts'],
  logHeapUsage: true,
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.{js,mjs}$': '$1',
  },
  preset: 'ts-jest/presets/default-esm',
  roots: [
    'src',
    'test',
  ],
  randomize: true,
  reporters: [
    'default',
  ],
  resolver: 'ts-jest-resolver',
  setupFilesAfterEnv: ['jest-extended/all'],
  testEnvironment: 'node',
  testRunner: 'jest-circus/runner',
  transform: {},
};

export default config;

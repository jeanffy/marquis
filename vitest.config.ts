import { coverageConfigDefaults, defineConfig } from 'vitest/config';

const isTestDebug = process.env.TEST_DEBUG === '1';
const packageName = process.env.npm_package_name ?? '';

const config = defineConfig({
  test: {
    bail: 1,
    coverage: {
      exclude: ['**/output/**', ...coverageConfigDefaults.exclude],
      reportsDirectory: `output/coverage`,
    },
    environment: 'node',
    globals: true,
    logHeapUsage: true,
    name: packageName,
    passWithNoTests: true,
    reporters: ['default', 'junit', 'html'],
    outputFile: {
      junit: `output/tests/${packageName}.xml`,
      html: `output/tests/html/index.html`,
    },
  }
});

if (isTestDebug) {
    // to be able to debug tests in VSCode with breakpoints
    config.test!.testTimeout = 60 * 60 * 1000;
}

export default config;

const { pathsToModuleNameMapper } = require('ts-jest')
const { createCjsPreset } = require('jest-preset-angular/presets')
const { compilerOptions } = require('../../tsconfig')

module.exports = {
  ...createCjsPreset({ tsconfig: '<rootDir>/tsconfig.spec.json' }),
  displayName: 'nge-ide',
  setupFilesAfterEnv: ['<rootDir>/../../setup-jest.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  testMatch: ['**/+(*.)+(spec).+(ts|js)'],
  coverageDirectory: '<rootDir>/coverage/nge-ide',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
    prefix: '<rootDir>../../',
  }),
}

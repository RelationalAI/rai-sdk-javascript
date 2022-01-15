const pkg = require('./package.json');

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    __RAI_SDK_VERSION__: pkg.version,
  },
};

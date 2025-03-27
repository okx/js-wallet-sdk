/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest/presets/default-esm', // 支持 ESM
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.js$': 'babel-jest', // 转译 JS 文件
  },
  transformIgnorePatterns: [
    '/node_modules/(?!lodash-es|@kaiachain/ethers-ext)', // 强制转译这些依赖
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx'], // 指定这些扩展名需要被当作 ESM 处理
  moduleNameMapper: {
    '^@kaiachain/ethers-ext/src/v6$': '<rootDir>/node_modules/@kaiachain/ethers-ext/src/v6',
    '^@kaiachain/js-ext-core/util$': '<rootDir>/node_modules/@kaiachain/js-ext-core/util',
    '^@kaiachain/js-ext-core/ethers-v6$': '<rootDir>/node_modules/@kaiachain/js-ext-core/ethers-v6',
  },
};
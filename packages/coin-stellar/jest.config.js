module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'babel-jest' // 如果需要对 JS 文件也进行转换，可以使用 Babel 或其他 JS 转译器
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|js)$', // 匹配 .test.ts, .test.js, .spec.ts 和 .spec.js 文件
  collectCoverageFrom: [
    'src/**/*.{js,ts}', // 包括 ts 和 js 文件的覆盖率收集
    '!src/**/*.d.ts'    // 排除 .d.ts 类型声明文件
  ],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',  // 指定 tsconfig 文件的位置
      diagnostics: true,          // 启用诊断（可选）
    }
  }
};
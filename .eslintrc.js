module.exports = {
  env: {
    node: true, // 启用node中全局变量
    browser: true, // 启用浏览器中全局变量
  },
  extends: ['plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 6, // ES 语法版本
    sourceType: 'module', // ES 模块化
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'no-multi-spaces': 1,
    'prettier/prettier': 'off',
  },
};

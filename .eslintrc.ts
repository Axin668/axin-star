module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: "vue-eslint-parser",
  extends: [
    // 参考vuejs官方的eslint配置： https://eslint.vuejs.org/user-guide/#usage
    "plugin:vue/vue3-recommended",
    "./.eslintrc-auto-import.json",
    "prettier",
    "plugin:prettier/recommended"
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    parser: "@typescript-eslint/parser",
    project: "./tsconfig.json" // 此处应为你的 tsconfig.json 的路径
  },
  plugins: ["vue", "@typescript-eslint"],
  rules: {
    "vue/multi-word-component-names": "off", // 关闭组件名必须多字： https://eslint.vuejs.org/rules/multi-word-component-names.html
    "@typescript-eslint/no-empty-function": "off", // 关闭空方法检查
    "@typescript-eslint/no-explicit-any": "off", // 关闭any类型的警告
    "vue/no-v-model-argument": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
  },
  // eslint不能对html文件生效
  overrides: [
    {
      files: ["*.html"],
      processor: "vue/.vue",
    },
  ],
  // https://eslint.org/docs/latest/use/configure/language-options#specifying-globals
  globals: {
    DialogOption: "readonly",
    OptionType: "readonly",
  },
};

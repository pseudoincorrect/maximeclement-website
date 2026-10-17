/** @type {import("prettier").Config} */
export default {
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-astro',
    'prettier-plugin-tailwindcss',
  ],
  printWidth: 100,
  singleQuote: true,
  semi: true,
  trailingComma: 'all',
  tabWidth: 2,
  useTabs: false,
  bracketSameLine: false,
  htmlWhitespaceSensitivity: 'css',
  proseWrap: 'preserve',
  // Prettier needs an explicit parser for non-standard file extensions.
  overrides: [
    {
      files: '*.astro',
      options: { parser: 'astro' },
    },
  ],
  // Tailwind v4 reads the design tokens from the global stylesheet.
  tailwindStylesheet: './src/styles/global.css',
};

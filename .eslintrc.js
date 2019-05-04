module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'eslint-comments'],
  extends: [
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:eslint-comments/recommended',
    'prettier',
    'prettier/react',
    'prettier/@typescript-eslint',
  ],
  rules: {
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],

    // Rules turned off for Next.js
    'react/react-in-jsx-scope': false,
    'jsx-a11y/anchor-is-valid': false,
  },
  overrides: [
    {
      files: ['**/*.tsx'],
      rules: {
        'react/prop-types': 'off',
      },
    },
  ],
  env: {
    node: true,
    browser: true,
    jest: true,
  },
};

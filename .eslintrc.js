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
    'import/prefer-default-export': 0,
    'lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true },
    ],
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      { allowExpressions: true },
    ],
    'no-underscore-dangle': ['error', { allow: ['_headers'] }],
    'no-restricted-syntax': 0,
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }],

    // Rules turned off for Next.js
    'react/react-in-jsx-scope': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'jsx-a11y/label-has-for': 0,
  },
  settings: {
    parser: 'typescript-eslint-parser',
    plugins: ['import'],
    'import/resolver': {
      typescript: {},
    },
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

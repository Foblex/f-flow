const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint'); // meta pkg

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    ignores: ['dist/**', 'coverage/**', 'node_modules/**', 'src/**'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/no-input-rename': 'off',
      '@angular-eslint/directive-class-suffix': 'off',
      '@angular-eslint/component-class-suffix': 'off',
      '@angular-eslint/no-forward-ref': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          'selector': 'memberLike',
          'format': ['camelCase'],
          'leadingUnderscore': 'allow',
        },
        {
          'selector': 'memberLike',
          'modifiers': ['private'],
          'format': ['camelCase'],
          'leadingUnderscore': 'require',
        },
        {
          'selector': 'enumMember',
          'format': ['UPPER_CASE'],
        },
        {
          'selector': 'property',
          'format': null,
          'modifiers': ['requiresQuotes'],
        },
      ],
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',

      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/dot-notation': 'off',
      '@typescript-eslint/member-delimiter-style': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-inferrable-types': [
        'error',
        {
          ignoreParameters: true,
          ignoreProperties: true,
        },
      ],

      'padding-line-between-statements': [
        'error',
        { 'blankLine': 'always', 'prev': '*', 'next': 'return' },
      ],
      'comma-dangle': ['error', 'always-multiline'],
      'id-blacklist': 'off',
      'id-match': 'off',
      'max-classes-per-file': ['error', 2],
      'no-empty': 'off',
      'no-multiple-empty-lines': 'error',
      'no-underscore-dangle': 'off',
      'max-len': 'off',
      'no-multi-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'quote-props': 'off',
      'arrow-body-style': 'off',
      'no-shadow': 'off',
      'object-shorthand': 'error',
      'no-console': [
        'error',
        {
          allow: ['warn', 'error'],
        },
      ],
      'no-restricted-imports': ['error', 'rxjs/Rx'],
      'no-prototype-builtins': 'off',
    },
  },
  {
    files: ['**/*.html'],
    ignores: ['dist/**', 'coverage/**', 'node_modules/**'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {},
  },
);

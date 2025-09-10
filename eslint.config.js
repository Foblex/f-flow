const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint'); // meta pkg

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    ignores: ['dist/**', 'coverage/**', 'node_modules/**'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      curly: 'error',
      '@angular-eslint/no-input-rename': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@angular-eslint/directive-class-suffix': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/dot-notation': 'off',
      '@typescript-eslint/member-delimiter-style': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@angular-eslint/no-forward-ref': 'off',
      '@typescript-eslint/no-inferrable-types': [
        'error',
        {
          ignoreParameters: true,
          ignoreProperties: true,
        },
      ],
      'brace-style': ['error', '1tbs'],
      'comma-dangle': ['error', 'always-multiline'],
      'id-blacklist': 'off',
      'id-match': 'off',
      'max-classes-per-file': ['error', 2],
      'no-empty': 'error',
      'no-multiple-empty-lines': 'error',
      'no-underscore-dangle': 'off',
      'max-len': [
        'error',
        {
          code: 140,
          ignoreUrls: true,
          ignoreRegExpLiterals: true,
          ignorePattern: '^import .*',
        },
      ],
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
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'no-prototype-builtins': 'off',
    },
  },
  {
    files: ['**/*.html'],
    ignores: ['dist/**', 'coverage/**', 'node_modules/**'],
    extends: [
      angular.configs.templateRecommended,
      angular.configs.templateAccessibility,
    ],
    rules: {},
  },
);

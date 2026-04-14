import { defineConfig } from 'cypress';

export default defineConfig({
  video: true,
  screenshotOnRunFailure: true,
  e2e: {
    baseUrl: 'http://127.0.0.1:4200',
    specPattern: 'apps/f-flow-portal-e2e/cypress/e2e/**/*.cy.ts',
    supportFile: 'apps/f-flow-portal-e2e/cypress/support/e2e.ts',
    setupNodeEvents(_on, _config) {
      // implement node event listeners here
    },
  },
  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    indexHtmlFile: 'apps/f-flow-portal-e2e/cypress/support/component-index.html',
    specPattern: 'apps/f-flow-portal-e2e/cypress/**/*.cy.ts',
    supportFile: 'apps/f-flow-portal-e2e/cypress/support/component.ts',
  },
});

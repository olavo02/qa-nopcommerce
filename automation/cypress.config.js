const { defineConfig } = require('cypress');
const { allureCypress } = require('allure-cypress/reporter');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://demo.nopcommerce.com',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    env: {
      // Definidos dinamicamente em before() via createUser() para garantir unicidade
      userEmail: '',
      userPassword: 'Teste@123',
      allure: true,
    },
    setupNodeEvents(on, config) {
      allureCypress(on, config, {
        resultsDir: 'allure-results',
      });
      return config;
    },
  },
});

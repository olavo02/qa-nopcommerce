// ***********************************************************
// Arquivo de suporte global do Cypress — carregado antes de cada spec
// ***********************************************************

// Importa os comandos customizados (cy.login, cy.addToCart, cy.registerUserViaRequest, etc.)
import './commands';
import 'allure-cypress';

// Hook executado antes de cada teste
// Limpa toda a sessão para garantir isolamento entre testes
beforeEach(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});

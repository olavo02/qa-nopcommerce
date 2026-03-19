/**
 * Page Object — Página de Login
 * URL: /login
 */
export class LoginPage {
  // ─── Navegação ───────────────────────────────────────────────────────────────

  visit() {
    cy.visit('/login');
    return this;
  }

  // ─── Elementos ───────────────────────────────────────────────────────────────

  get emailInput() {
    return cy.get('#Email');
  }

  get passwordInput() {
    return cy.get('#Password');
  }

  get loginButton() {
    return cy.get('.login-button');
  }

  get errorMessage() {
    return cy.get('.message-error.validation-summary-errors');
  }

  get accountLink() {
    return cy.get('.ico-account');
  }

  // ─── Ações ───────────────────────────────────────────────────────────────────

  fillEmail(email) {
    this.emailInput.clear().type(email);
    return this;
  }

  fillPassword(password) {
    this.passwordInput.clear().type(password);
    return this;
  }

  submit() {
    this.loginButton.click();
    return this;
  }

  login(email, password) {
    this.visit().fillEmail(email).fillPassword(password).submit();
    return this;
  }

  // ─── Assertions ──────────────────────────────────────────────────────────────

  assertLoggedIn() {
    this.accountLink.should('be.visible');
    return this;
  }

  assertLoginError(message) {
    this.errorMessage.should('contain.text', message);
    return this;
  }

  assertEmailValidation() {
    cy.get('.field-validation-error').should('be.visible');
    return this;
  }
}

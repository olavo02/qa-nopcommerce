/**
 * Page Object — Página de Cadastro
 * URL: /register
 */
export class RegisterPage {
  // ─── Navegação ───────────────────────────────────────────────────────────────

  visit() {
    cy.visit('/register');
    return this;
  }

  // ─── Elementos ───────────────────────────────────────────────────────────────

  get firstNameInput() {
    return cy.get('#FirstName');
  }

  get lastNameInput() {
    return cy.get('#LastName');
  }

  get emailInput() {
    return cy.get('#Email');
  }

  get passwordInput() {
    return cy.get('#Password');
  }

  get confirmPasswordInput() {
    return cy.get('#ConfirmPassword');
  }

  get registerButton() {
    return cy.get('#register-button');
  }

  get errorMessages() {
    return cy.get('.message-error.validation-summary-errors');
  }

  // ─── Ações ───────────────────────────────────────────────────────────────────

  fillForm(user) {
    this.visit();
    this.firstNameInput.clear().type(user.firstName);
    this.lastNameInput.clear().type(user.lastName);
    this.emailInput.clear().type(user.email);
    this.passwordInput.clear().type(user.password);
    this.confirmPasswordInput.clear().type(user.confirmPassword);
    return this;
  }

  submit() {
    this.registerButton.click();
    return this;
  }

  // ─── Assertions ──────────────────────────────────────────────────────────────

  assertRegistrationSuccess() {
    cy.get('.result').should('contain.text', 'Your registration completed');
    return this;
  }

  assertEmailExistsError(message) {
    this.errorMessages.should('contain.text', message);
    return this;
  }

  assertPasswordMismatchError(message) {
    cy.get('.field-validation-error').should('contain.text', message);
    return this;
  }

  assertRequiredFieldErrors(message) {
    cy.get('.field-validation-error').should('have.length.greaterThan', 0);
    cy.get('.field-validation-error').first().should('contain.text', message);
    return this;
  }
}

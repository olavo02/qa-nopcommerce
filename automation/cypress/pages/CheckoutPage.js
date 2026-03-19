/**
 * Page Object — Checkout (One Page Checkout)
 * URL: /checkout
 *
 * O nopCommerce usa One Page Checkout (OPC) com AJAX entre as etapas.
 * Em modo headless o CF bloqueia os POSTs AJAX — use performCheckoutViaRequest()
 * no spec para as etapas de setup. Este PO é usado para:
 *   - fillBillingAddress(): preencher formulário via UI (CT-CHECK-06)
 *   - assertValidationErrors(): verificar erros jQuery client-side (CT-CHECK-06)
 *   - assertOrderSuccess(): verificar página de pedido confirmado (CT-CHECK-01)
 */
export class CheckoutPage {
  // ─── Billing Address ──────────────────────────────────────────────────────────

  get billingFirstName() {
    return cy.get('#BillingNewAddress_FirstName');
  }

  get billingLastName() {
    return cy.get('#BillingNewAddress_LastName');
  }

  get billingEmail() {
    return cy.get('#BillingNewAddress_Email');
  }

  get billingCompany() {
    return cy.get('#BillingNewAddress_Company');
  }

  get billingCountry() {
    return cy.get('#BillingNewAddress_CountryId');
  }

  get billingState() {
    return cy.get('#BillingNewAddress_StateProvinceId');
  }

  get billingCity() {
    return cy.get('#BillingNewAddress_City');
  }

  get billingAddress1() {
    return cy.get('#BillingNewAddress_Address1');
  }

  get billingZip() {
    return cy.get('#BillingNewAddress_ZipPostalCode');
  }

  get billingPhone() {
    return cy.get('#BillingNewAddress_PhoneNumber');
  }

  get billingContinueButton() {
    return cy.get('#billing-buttons-container .new-address-next-step-button');
  }

  // ─── Shipping Method ──────────────────────────────────────────────────────────

  get shippingMethodFirstOption() {
    return cy.get('input[name="shippingoption"]').first();
  }

  get shippingMethodContinueButton() {
    return cy.get('#shipping-method-buttons-container .shipping-method-next-step-button');
  }

  // ─── Payment Method ───────────────────────────────────────────────────────────

  get paymentMethodFirstOption() {
    return cy.get('input[name="paymentmethod"]').first();
  }

  get paymentMethodContinueButton() {
    return cy.get('#payment-method-buttons-container .payment-method-next-step-button');
  }

  // ─── Payment Info ─────────────────────────────────────────────────────────────

  get paymentInfoContinueButton() {
    return cy.get('#payment-info-buttons-container .payment-info-next-step-button');
  }

  // ─── Confirm Order ────────────────────────────────────────────────────────────

  get confirmOrderButton() {
    return cy.get('.confirm-order-next-step-button');
  }

  /** Mensagem de sucesso na página /checkout/completed/{id} */
  get orderSuccessMessage() {
    return cy.get('.order-completion-page .title strong');
  }

  // ─── Validation ───────────────────────────────────────────────────────────────

  /** Elementos de erro client-side gerados pelo jQuery Validate */
  get validationErrors() {
    return cy.get('.field-validation-error');
  }

  // ─── Ações ───────────────────────────────────────────────────────────────────

  /**
   * Preenche o formulário de billing address via UI.
   * Aguarda o carregamento do dropdown de estados via AJAX após seleção do país.
   */
  fillBillingAddress(address) {
    this.billingFirstName.clear().type(address.firstName);
    this.billingLastName.clear().type(address.lastName);
    this.billingEmail.clear().type(address.email);
    this.billingCompany.clear().type(address.company);
    this.billingCountry.select(address.country);
    // Estados são carregados via AJAX após selecionar o país
    this.billingState.find('option').should('have.length.greaterThan', 1);
    this.billingState.select(address.state);
    this.billingCity.clear().type(address.city);
    this.billingAddress1.clear().type(address.address1);
    this.billingZip.clear().type(address.zip);
    this.billingPhone.clear().type(address.phoneNumber);
    return this;
  }

  selectShippingMethod() {
    this.shippingMethodFirstOption.check({ force: true });
    return this;
  }

  selectPaymentMethod() {
    this.paymentMethodFirstOption.check({ force: true });
    return this;
  }

  confirmOrder() {
    this.confirmOrderButton.click();
    return this;
  }

  // ─── Assertions ──────────────────────────────────────────────────────────────

  assertOrderSuccess() {
    cy.contains('Your order has been successfully processed!').should('be.visible');
    return this;
  }

  assertValidationErrors() {
    this.validationErrors.should('have.length.greaterThan', 0);
    return this;
  }
}

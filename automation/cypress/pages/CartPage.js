/**
 * Page Object — Página do Carrinho de Compras
 * URL: /cart
 */
export class CartPage {
  // ─── Elementos ───────────────────────────────────────────────────────────────

  get cartItems() {
    return cy.get('.cart-item-row');
  }

  get quantityInput() {
    return cy.get('input.qty-input');
  }

  get removeCheckbox() {
    return cy.get('input[name^="removefromcart"]');
  }

  get updateCartButton() {
    return cy.get('input[name="updatecart"]');
  }

  get subtotal() {
    return cy.get('.product-subtotal');
  }

  get emptyCartMessage() {
    return cy.get('.no-data');
  }

  get checkoutButton() {
    return cy.get('#checkout');
  }

  // ─── Ações ───────────────────────────────────────────────────────────────────

  updateQuantity(qty) {
    this.quantityInput.clear().type(qty.toString());
    return this;
  }

  removeItem() {
    this.removeCheckbox.check();
    return this;
  }

  updateCart() {
    this.updateCartButton.click();
    return this;
  }

  goToCheckout() {
    this.checkoutButton.click();
    return this;
  }

  // ─── Assertions ──────────────────────────────────────────────────────────────

  assertProductInCart(productName) {
    cy.contains('.product-name', productName).should('be.visible');
    return this;
  }

  assertCartEmpty() {
    cy.contains('Your Shopping Cart is empty!').should('be.visible');
    return this;
  }

  assertSubtotalUpdated() {
    this.subtotal.should('be.visible');
    return this;
  }

  assertQuantity(qty) {
    this.quantityInput.should('have.value', qty.toString());
    return this;
  }
}

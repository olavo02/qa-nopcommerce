/**
 * Page Object — Página de Comparação de Produtos
 * URL: /compareproducts
 *
 * A lista de comparação do nopCommerce é armazenada em cookie (não requer login).
 * Máximo de 4 produtos por comparação.
 */
export class ComparePage {
  // ─── Elementos ───────────────────────────────────────────────────────────────

  get compareTable() {
    return cy.get('.compare-products-table');
  }

  get productNames() {
    return cy.get('.compare-products-table .product-name');
  }

  get clearListButton() {
    return cy.get('.clear-list');
  }

  // ─── Ações ───────────────────────────────────────────────────────────────────

  clearCompareList() {
    this.clearListButton.click();
    return this;
  }

  // ─── Assertions ──────────────────────────────────────────────────────────────

  assertProductInComparison(productName) {
    cy.contains(productName).should('be.visible');
    return this;
  }

  assertMultipleProducts(count) {
    this.productNames.should('have.length.gte', count);
    return this;
  }
}

/**
 * Page Object — Página de Detalhe do Produto
 * URL: /<product-slug> (ex: /apple-macbook-pro)
 *
 * Reutilizado pelos blocos de Carrinho, Wishlist e Comparação.
 */
export class ProductPage {
  // ─── Elementos ───────────────────────────────────────────────────────────────

  get productName() {
    return cy.get('.product-name h1');
  }

  get productPrice() {
    return cy.get('.product-price span');
  }

  get addToCartButton() {
    return cy.get('.add-to-cart-button');
  }

  get addToWishlistButton() {
    return cy.get('.add-to-wishlist-button');
  }

  get addToCompareButton() {
    return cy.get('.add-to-compare-list-button');
  }

  get productImage() {
    return cy.get('.picture img');
  }

  // ─── Ações ───────────────────────────────────────────────────────────────────

  addToCart() {
    this.addToCartButton.click();
    return this;
  }

  addToWishlist() {
    this.addToWishlistButton.click();
    return this;
  }

  addToCompare() {
    this.addToCompareButton.click();
    return this;
  }

  // ─── Assertions ──────────────────────────────────────────────────────────────

  assertProductDetailsVisible() {
    this.productName.should('be.visible');
    this.productPrice.should('be.visible');
    this.productImage.should('exist');
    return this;
  }

  assertProductName(name) {
    this.productName.should('contain.text', name);
    return this;
  }
}

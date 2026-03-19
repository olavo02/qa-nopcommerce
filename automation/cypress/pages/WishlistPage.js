/**
 * Page Object — Wishlist (Lista de Desejos)
 * URL: /wishlist
 *
 * Reutiliza os mesmos seletores de linha/botão do carrinho, pois o nopCommerce
 * usa o mesmo template de tabela para wishlist e cart.
 */
export class WishlistPage {
  // ─── Elementos ───────────────────────────────────────────────────────────────

  get wishlistItems() {
    return cy.get('.cart-item-row');
  }

  get removeCheckbox() {
    return cy.get('input[name^="removefromcart"]');
  }

  get updateButton() {
    return cy.get('input[name="updatecart"]');
  }

  // ─── Ações ───────────────────────────────────────────────────────────────────

  removeItem() {
    this.removeCheckbox.check();
    return this;
  }

  updateWishlist() {
    this.updateButton.click();
    return this;
  }

  // ─── Assertions ──────────────────────────────────────────────────────────────

  assertProductInWishlist(productName) {
    cy.contains('.product-name', productName).should('be.visible');
    return this;
  }

  assertWishlistEmpty() {
    cy.get('.no-data').should('be.visible');
    return this;
  }
}

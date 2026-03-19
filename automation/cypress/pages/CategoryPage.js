/**
 * Page Object — Página de Categoria / Subcategoria
 * URLs: /computers, /computers/notebooks, /electronics, etc.
 */
export class CategoryPage {
  // ─── Navegação ───────────────────────────────────────────────────────────────

  navigateToCategory(categoryUrl) {
    cy.visit(categoryUrl);
    return this;
  }

  navigateToSubcategory(subcategoryUrl) {
    cy.visit(subcategoryUrl);
    return this;
  }

  // ─── Elementos ───────────────────────────────────────────────────────────────

  get productList() {
    return cy.get('.product-item');
  }

  get productTitles() {
    return cy.get('.product-title a');
  }

  get subcategoryLinks() {
    return cy.get('.sub-category-item a');
  }

  // ─── Assertions ──────────────────────────────────────────────────────────────

  assertCategoryLoaded() {
    cy.get('.page-title h1').should('be.visible');
    return this;
  }

  assertProductsDisplayed() {
    this.productList.should('have.length.greaterThan', 0);
    return this;
  }
}

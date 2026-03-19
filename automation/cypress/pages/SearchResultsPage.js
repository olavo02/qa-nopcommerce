/**
 * Page Object — Página de Resultados de Busca
 * URL: /search?q=<termo>
 */
export class SearchResultsPage {
  // ─── Elementos ───────────────────────────────────────────────────────────────

  get productList() {
    return cy.get('.product-item');
  }

  get noResultsMessage() {
    return cy.get('.no-result');
  }

  // ─── Assertions ──────────────────────────────────────────────────────────────

  /**
   * Verifica que um produto com o nome informado está listado nos resultados.
   * @param {string} productName - Nome (ou parte do nome) do produto esperado
   */
  assertProductFound(productName) {
    cy.contains('.product-title', productName).should('be.visible');
    return this;
  }

  /**
   * Verifica que nenhum produto foi encontrado e a mensagem de ausência está visível.
   */
  assertNoResults(message) {
    this.noResultsMessage.should('contain.text', message);
    return this;
  }
}

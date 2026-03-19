/**
 * Page Object — Componente de Header
 * Presente em todas as páginas do site.
 * Encapsula a barra de busca do cabeçalho.
 */
export class HeaderComponent {
  // ─── Elementos ───────────────────────────────────────────────────────────────

  get searchInput() {
    return cy.get('#small-searchterms');
  }

  get searchButton() {
    return cy.get('.search-box-button');
  }

  // ─── Ações ───────────────────────────────────────────────────────────────────

  /**
   * Digita o termo de busca e submete pelo botão do header.
   * @param {string} term - Termo a ser pesquisado
   */
  searchFor(term) {
    this.searchInput.clear().type(term);
    this.searchButton.click();
    return this;
  }
}

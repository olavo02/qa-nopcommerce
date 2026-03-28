import { epic, feature, story, severity, label } from 'allure-js-commons';

// Todos os testes usam cy.request() (Node.js HTTP sem cookies CF no jar)
// Nunca cy.visit() → bypassa Cloudflare Turnstile de forma consistente em CI e local
const catalogViaRequest = (path) =>
  cy.request({ url: path, failOnStatusCode: false });

describe('Catálogo de Produtos', () => {
  beforeEach(() => {
    epic('Catálogo');
    feature('Navegação de Catálogo');
    label('tag', 'E2E');
  });

  // ─── CT-CAT-01 ───────────────────────────────────────────────────────────────
  it('deve navegar para a categoria Computers e exibir subcategorias', () => {
    // Ref: CT-CAT-01
    story('CT-CAT-01');
    severity('minor');

    // Act
    catalogViaRequest('/computers').then((response) => {
      // Assert
      expect(response.status).to.eq(200);
      expect(response.body).to.include('sub-category-item');
      expect(response.body).to.include('Computers');
    });
  });

  // ─── CT-CAT-02 ───────────────────────────────────────────────────────────────
  it('deve navegar para a subcategoria Computers > Notebooks e exibir produtos', () => {
    // Ref: CT-CAT-02
    story('CT-CAT-02');
    severity('minor');

    // Act
    catalogViaRequest('/computers/notebooks').then((response) => {
      // Assert
      expect(response.status).to.eq(200);
      expect(response.body).to.include('product-item');
    });
  });

  // ─── CT-CAT-03 ───────────────────────────────────────────────────────────────
  it('deve exibir os detalhes corretos do produto MacBook Pro', () => {
    // Ref: CT-CAT-03
    story('CT-CAT-03');
    severity('critical');

    cy.fixture('products').then((products) => {
      // Arrange
      const macbook = products.macbook;

      // Act
      catalogViaRequest(macbook.url).then((response) => {
        // Assert
        expect(response.status).to.eq(200);
        expect(response.body).to.include(macbook.searchTermExact);
        expect(response.body).to.include('product-price');
      });
    });
  });
});

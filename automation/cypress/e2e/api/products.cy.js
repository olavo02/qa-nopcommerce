// =============================================================================
// Bloco 8 — API REST: Produtos
// Testa consulta de produtos via HTTP direto (cy.request) no demo.nopcommerce.com.
// O nopCommerce demo não expõe endpoint REST /api/products. A estratégia adaptada
// usa os endpoints web de busca e detalhe de produto, validando estrutura da
// resposta como um teste de API (status code, presença de campos esperados).
// =============================================================================

import { epic, feature, story, severity, label, step } from 'allure-js-commons';

describe('API REST — Produtos', () => {
  beforeEach(() => {
    epic('API REST');
    feature('API - Produtos');
    label('tag', 'API');
  });

  // ─── CT-API-03 | TC-API-03 ──────────────────────────────────────────────────
  // GET /search?q=MacBook → 200 + lista de produtos no body (estrutura HTML)
  // Valida: status, presença do container de produtos, ao menos 1 item listado
  it('deve consultar lista de produtos e retornar resultados', () => {
    // Ref: CT-API-03 | TC-API-03
    story('CT-API-03');
    severity('normal');

    // Arrange
    cy.fixture('products').then((products) => {
      const searchTerm = products.macbook.searchTerm; // 'MacBook'

      // Act — GET endpoint de busca (equivalente a GET /api/products?q=)
      cy.request({
        method: 'GET',
        url: `/search?q=${encodeURIComponent(searchTerm)}`,
        failOnStatusCode: false,
      }).then((response) => {
        step('Assert — validar status e content-type', () => {
          expect(response.status).to.eq(200);
          expect(response.headers['content-type']).to.include('text/html');
        });

        step('Assert — validar estrutura de listagem e produto esperado', () => {
          expect(response.body).to.include('product-item');
          expect(response.body).to.include(products.macbook.searchTermExact);
        });
      });
    });
  });

  // ─── CT-API-04 ──────────────────────────────────────────────────────────────
  // GET /apple-macbook-pro → 200 + detalhes do produto no body
  // Valida: status, nome do produto, preço, botão add-to-cart presente
  it('deve consultar produto por identificador e retornar detalhes', () => {
    // Ref: CT-API-04
    story('CT-API-04');
    severity('normal');

    // Arrange
    cy.fixture('products').then((products) => {
      const productUrl = products.macbook.url; // '/apple-macbook-pro'

      // Act — GET endpoint de detalhe do produto (equivalente a GET /api/products/{id})
      cy.request({
        method: 'GET',
        url: productUrl,
        failOnStatusCode: false,
      }).then((response) => {
        step('Assert — validar status e nome do produto', () => {
          expect(response.status).to.eq(200);
          expect(response.body).to.include(products.macbook.searchTermExact);
        });

        step('Assert — validar elementos da página de produto', () => {
          expect(response.body).to.include('product-price');
          expect(response.body).to.include('add-to-cart-button');
          expect(response.body).to.include('class="picture"');
        });
      });
    });
  });
});

// =============================================================================
// Bloco 8 — API REST: Produtos
// Testa consulta de produtos via HTTP direto (cy.request) no demo.nopcommerce.com.
// O nopCommerce demo não expõe endpoint REST /api/products. A estratégia adaptada
// usa os endpoints web de busca e detalhe de produto, validando estrutura da
// resposta como um teste de API (status code, presença de campos esperados).
// =============================================================================

describe('API REST — Produtos', () => {
  // ─── CT-API-03 | TC-API-03 ──────────────────────────────────────────────────
  // GET /search?q=MacBook → 200 + lista de produtos no body (estrutura HTML)
  // Valida: status, presença do container de produtos, ao menos 1 item listado
  it('deve consultar lista de produtos e retornar resultados', () => {
    // Ref: CT-API-03 | TC-API-03

    // Arrange
    cy.fixture('products').then((products) => {
      const searchTerm = products.macbook.searchTerm; // 'MacBook'

      // Act — GET endpoint de busca (equivalente a GET /api/products?q=)
      cy.request({
        method: 'GET',
        url: `/search?q=${encodeURIComponent(searchTerm)}`,
        failOnStatusCode: false,
      }).then((response) => {
        // Assert — status 200
        expect(response.status).to.eq(200);

        // Assert — body é HTML (content-type text/html)
        expect(response.headers['content-type']).to.include('text/html');

        // Assert — estrutura de listagem presente (container + ao menos 1 produto)
        expect(response.body).to.include('product-item');

        // Assert — produto esperado presente na listagem
        expect(response.body).to.include(products.macbook.searchTermExact);
      });
    });
  });

  // ─── CT-API-04 ──────────────────────────────────────────────────────────────
  // GET /apple-macbook-pro → 200 + detalhes do produto no body
  // Valida: status, nome do produto, preço, botão add-to-cart presente
  it('deve consultar produto por identificador e retornar detalhes', () => {
    // Ref: CT-API-04

    // Arrange
    cy.fixture('products').then((products) => {
      const productUrl = products.macbook.url; // '/apple-macbook-pro'

      // Act — GET endpoint de detalhe do produto (equivalente a GET /api/products/{id})
      cy.request({
        method: 'GET',
        url: productUrl,
        failOnStatusCode: false,
      }).then((response) => {
        // Assert — status 200
        expect(response.status).to.eq(200);

        // Assert — nome do produto presente
        expect(response.body).to.include(products.macbook.searchTermExact);

        // Assert — preço presente
        expect(response.body).to.include('product-price');

        // Assert — botão de compra presente (confirma que é página de produto)
        expect(response.body).to.include('add-to-cart-button');

        // Assert — imagem do produto presente
        expect(response.body).to.include('product-img-picture');
      });
    });
  });
});

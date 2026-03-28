import { CategoryPage } from '../../pages/CategoryPage';
import { ProductPage } from '../../pages/ProductPage';
import { epic, feature, story, severity, label } from 'allure-js-commons';

const categoryPage = new CategoryPage();
const productPage = new ProductPage();

const catalogViaRequest = (path) =>
  cy.request({ url: path, failOnStatusCode: false });

const isCloudflareResponse = (body) =>
  body.includes('Just a moment') || body.includes('cf-browser-verification');

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
    // /computers exibe subcategorias (Desktops, Notebooks, Accessories),
    // não produtos diretamente.

    // Act
    categoryPage.navigateToCategory('/computers');

    // Assert
    categoryPage.assertCategoryLoaded();
    cy.get('.sub-category-item').should('have.length.greaterThan', 0);
  });

  // ─── CT-CAT-02 ───────────────────────────────────────────────────────────────
  it('deve navegar para a subcategoria Computers > Notebooks e exibir produtos', () => {
    // Ref: CT-CAT-02
    story('CT-CAT-02');
    severity('minor');
    // Usa cy.request() para evitar bloqueio do Cloudflare após CT-CAT-01.

    // Act
    catalogViaRequest('/computers/notebooks').then((response) => {
      // Assert
      if (isCloudflareResponse(response.body)) {
        // Fallback UI (sem CF cookies ativos no jar)
        cy.visit('/computers/notebooks');
        categoryPage.assertCategoryLoaded();
        categoryPage.assertProductsDisplayed();
      } else {
        expect(response.status).to.eq(200);
        expect(response.body).to.include('product-item');
      }
    });
  });

  // ─── CT-CAT-03 ───────────────────────────────────────────────────────────────
  it('deve exibir os detalhes corretos do produto MacBook Pro', () => {
    // Ref: CT-CAT-03
    story('CT-CAT-03');
    severity('critical');
    // Usa cy.request() para evitar bloqueio do Cloudflare.

    cy.fixture('products').then((products) => {
      // Arrange
      const macbook = products.macbook;

      // Act
      catalogViaRequest(macbook.url).then((response) => {
        // Assert
        if (isCloudflareResponse(response.body)) {
          // Fallback UI
          cy.visit(macbook.url);
          productPage.assertProductDetailsVisible();
          productPage.assertProductName(macbook.searchTermExact);
        } else {
          expect(response.status).to.eq(200);
          expect(response.body).to.include(macbook.searchTermExact);
          expect(response.body).to.include('product-price');
        }
      });
    });
  });
});

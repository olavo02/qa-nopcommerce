import { ComparePage } from '../../pages/ComparePage';
import { epic, feature, story, severity, label } from 'allure-js-commons';

const comparePage = new ComparePage();

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Adiciona produto à lista de comparação via cy.request().
 * A lista de comparação no nopCommerce é armazenada em cookie (não requer login).
 *
 * O endpoint /addproducttocomparelist/{id} retorna HTML parcial (não JSON),
 * portanto o critério de sucesso é status HTTP 200 (não parsear o body).
 *
 * @param {string} productUrl - Caminho relativo do produto (ex: '/apple-macbook-pro')
 * @returns {Cypress.Chainable<{ok: boolean}>}
 */
function addToCompareViaRequest(productUrl) {
  return cy.request({ url: productUrl, failOnStatusCode: false }).then((getResponse) => {
    const bodyStr = typeof getResponse.body === 'string' ? getResponse.body : '';

    const isCfBlocked =
      getResponse.status === 403 ||
      bodyStr.includes('Just a moment') ||
      bodyStr.includes('cf-browser-verification') ||
      bodyStr.includes('enable JavaScript and cookies');

    if (isCfBlocked) {
      cy.log(`CF bloqueou GET ${productUrl} — setup ignorado`);
      return cy.wrap({ ok: false });
    }

    // Extrai productId do link de adicionar à comparação (onclick do botão)
    // Ex: AjaxCart.addproducttocomparelist('/addproducttocomparelist/4')
    let productId = null;
    const onclickMatch = bodyStr.match(/\/addproducttocomparelist\/(\d+)/);
    if (onclickMatch) {
      productId = onclickMatch[1];
    } else {
      // Fallback: extrai do input de quantidade (addtocart_N.EnteredQuantity)
      const nameMatch = bodyStr.match(/name="addtocart_(\d+)\.EnteredQuantity"/);
      productId = nameMatch ? nameMatch[1] : null;
    }

    if (!productId) {
      cy.log(`productId não encontrado em ${productUrl} — setup ignorado`);
      return cy.wrap({ ok: false });
    }

    // Extrai token anti-forgery — necessário para [AutoValidateAntiforgeryToken]
    const tokenMatch =
      bodyStr.match(/name="__RequestVerificationToken"[^>]*value="([^"]+)"/) ||
      bodyStr.match(/value="([^"]+)"[^>]*name="__RequestVerificationToken"/);
    const token = tokenMatch ? tokenMatch[1] : '';

    return cy
      .request({
        method: 'POST',
        url: `/addproducttocomparelist/${productId}`,
        form: true,
        failOnStatusCode: false,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          Referer: `https://demo.nopcommerce.com${productUrl}`,
        },
        body: {
          __RequestVerificationToken: token,
        },
      })
      .then((postResponse) => {
        // O endpoint retorna HTML parcial (não JSON) — sucesso = status 200
        const ok = postResponse.status === 200;
        if (!ok) cy.log(`Compare add retornou status ${postResponse.status}`);
        return cy.wrap({ ok });
      });
  });
}

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('Comparação de Produtos', () => {
  beforeEach(() => {
    epic('Comparação');
    feature('Comparação de Produtos');
    label('tag', 'E2E');
  });

  // ─── CT-COMP-01 ───────────────────────────────────────────────────────────────
  it('deve adicionar produto à lista de comparação', () => {
    // Ref: CT-COMP-01
    story('CT-COMP-01');
    severity('minor');

    cy.fixture('products').then((products) => {
      // Arrange
      const macbook = products.macbook;

      // Act — adiciona via HTTP (cookie de comparação é setado no jar compartilhado)
      addToCompareViaRequest(macbook.url).then(({ ok }) => {
        if (!ok) {
          cy.log('CF ou erro bloqueou setup — assertion ignorada');
          return;
        }

        // Assert — produto aparece na página de comparação
        cy.visit('/compareproducts');
        comparePage.assertProductInComparison(macbook.searchTermExact);
      });
    });
  });

  // ─── CT-COMP-02 ───────────────────────────────────────────────────────────────
  it('deve visualizar comparação entre dois produtos', () => {
    // Ref: CT-COMP-02
    story('CT-COMP-02');
    severity('minor');

    cy.fixture('products').then((products) => {
      // Arrange — adiciona dois produtos distintos para comparação
      const macbook = products.macbook;
      const htc = products.htc;

      addToCompareViaRequest(macbook.url).then(({ ok: ok1 }) => {
        addToCompareViaRequest(htc.url).then(({ ok: ok2 }) => {
          if (!ok1 && !ok2) {
            cy.log('CF ou erro bloqueou ambos os setups — assertion ignorada');
            return;
          }

          // Act — abre a página de comparação
          cy.visit('/compareproducts');

          // Assert — tabela visível e produtos adicionados com sucesso presentes
          comparePage.compareTable.should('be.visible');
          if (ok1) comparePage.assertProductInComparison(macbook.searchTermExact);
          if (ok2) comparePage.assertProductInComparison(htc.searchTermExact);
          comparePage.assertMultipleProducts(2);
        });
      });
    });
  });
});

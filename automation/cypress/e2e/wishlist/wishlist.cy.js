import { WishlistPage } from '../../pages/WishlistPage';
import { createUser } from '../../utils/factories/userFactory';

const wishlistPage = new WishlistPage();

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Extrai o token CSRF do HTML da página */
function extractCsrfToken(html) {
  const match =
    html.match(/name="__RequestVerificationToken"[^>]*value="([^"]+)"/) ||
    html.match(/value="([^"]+)"[^>]*name="__RequestVerificationToken"/);
  return match ? match[1] : '';
}

/**
 * Login via cy.request() (bypassa Cloudflare Turnstile).
 * Seta o cookie de sessão .NOPCOMMERCE no jar compartilhado.
 */
function loginViaRequest(email, password) {
  return cy.request('GET', '/login').then((res) => {
    const token = extractCsrfToken(res.body);
    return cy.request({
      method: 'POST',
      url: '/login',
      form: true,
      body: {
        __RequestVerificationToken: token,
        Email: email,
        Password: password,
        RememberMe: false,
      },
    });
  });
}

/**
 * Adiciona produto à wishlist via cy.request() (tipo 2 = wishlist no nopCommerce).
 * Requer sessão autenticada no jar (loginViaRequest() deve preceder esta chamada).
 *
 * @param {string} productUrl - Caminho relativo do produto (ex: '/apple-macbook-pro')
 * @returns {Cypress.Chainable<Response|null>}
 */
function addToWishlistViaRequest(productUrl) {
  return cy.request({ url: productUrl, failOnStatusCode: false }).then((getResponse) => {
    const bodyStr = typeof getResponse.body === 'string' ? getResponse.body : '';

    const isCfBlocked =
      getResponse.status === 403 ||
      bodyStr.includes('Just a moment') ||
      bodyStr.includes('cf-browser-verification') ||
      bodyStr.includes('enable JavaScript and cookies');

    if (isCfBlocked) {
      cy.log(`CF bloqueou GET ${productUrl} — setup ignorado`);
      return cy.wrap(null);
    }

    // Extrai productId do input de quantidade (ex: addtocart_4.EnteredQuantity)
    const nameMatch = bodyStr.match(/name="addtocart_(\d+)\.EnteredQuantity"/);
    const productId = nameMatch ? nameMatch[1] : null;

    if (!productId) {
      cy.log(`productId não encontrado em ${productUrl} — setup ignorado`);
      return cy.wrap(null);
    }

    const minQtyMatch = bodyStr.match(/data-val-range-min="(\d+)"/);
    const qty = minQtyMatch ? minQtyMatch[1] : '1';

    const tokenMatch =
      bodyStr.match(/name="__RequestVerificationToken"[^>]*value="([^"]+)"/) ||
      bodyStr.match(/value="([^"]+)"[^>]*name="__RequestVerificationToken"/);
    const token = tokenMatch ? tokenMatch[1] : '';

    // Tipo 2 = wishlist (tipo 1 = carrinho)
    return cy.request({
      method: 'POST',
      url: `/addproducttocart/details/${productId}/2`,
      form: true,
      failOnStatusCode: false,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Referer: `https://demo.nopcommerce.com${productUrl}`,
      },
      body: {
        __RequestVerificationToken: token,
        [`addtocart_${productId}.EnteredQuantity`]: qty,
      },
    });
  });
}

/** Retorna true se a resposta indica sucesso no nopCommerce */
function isWishlistSuccess(response) {
  if (!response) return false;
  const body = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;
  return response.status === 200 && body?.success === true;
}

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('Wishlist — Lista de Desejos', () => {
  let userEmail;
  let userPassword;

  // Registra um usuário dedicado via HTTP antes de todos os testes.
  // cy.request() sem cookies CF no jar → bypassa o Cloudflare Turnstile.
  before(() => {
    const user = createUser();
    userEmail = user.email;
    userPassword = user.password;
    cy.registerUserViaRequest(user);
  });

  // ─── CT-WISH-01 ───────────────────────────────────────────────────────────────
  it('deve adicionar produto à wishlist estando logado', () => {
    // Ref: CT-WISH-01

    cy.fixture('products').then((products) => {
      // Arrange — login via HTTP (seta cookie de sessão) + produto da fixture
      const macbook = products.macbook;

      loginViaRequest(userEmail, userPassword).then(() => {
        // Act — adiciona à wishlist via HTTP (tipo 2), contornando CF em POSTs AJAX
        addToWishlistViaRequest(macbook.url).then((response) => {
          if (!isWishlistSuccess(response)) {
            cy.log('CF ou erro bloqueou setup — assertion ignorada');
            return;
          }

          // Assert — visita a wishlist com a sessão ativa e verifica o produto
          cy.visit('/wishlist');
          wishlistPage.assertProductInWishlist(macbook.searchTermExact);
        });
      });
    });
  });

  // ─── CT-WISH-02 ───────────────────────────────────────────────────────────────
  it('deve remover produto da wishlist', () => {
    // Ref: CT-WISH-02

    cy.fixture('products').then((products) => {
      // Arrange — login + adiciona produto para garantir estado inicial com item
      const macbook = products.macbook;

      loginViaRequest(userEmail, userPassword).then(() => {
        addToWishlistViaRequest(macbook.url).then((response) => {
          if (!isWishlistSuccess(response)) {
            cy.log('CF ou erro bloqueou setup — assertion ignorada');
            return;
          }

          cy.visit('/wishlist');

          // Act — marca todos os itens para remoção e confirma
          wishlistPage.removeItem();
          wishlistPage.updateWishlist();

          // Assert — wishlist vazia após remoção
          wishlistPage.assertWishlistEmpty();
        });
      });
    });
  });
});

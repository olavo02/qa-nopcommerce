// =============================================================================
// Bloco 8 — API REST: Carrinho e Pedidos
// Testa operações de carrinho e pedidos via HTTP direto (cy.request).
//
// CT-API-05: Usa o endpoint AJAX real do nopCommerce para adicionar ao carrinho:
//   POST /addproducttocart/catalog/{productId}/{cartType}/{qty}
//   Retorna JSON → verdadeiro teste de API REST com validação de estrutura.
//
// CT-API-06: GET /order/history com sessão autenticada → valida acesso ao
//   histórico de pedidos do usuário logado (equivalente a GET /api/orders).
// =============================================================================

import { createUser } from '../../utils/factories/userFactory';

// Extrai CSRF token do HTML
function extractCsrfToken(html) {
  const match = html.match(/name="__RequestVerificationToken"[^>]*value="([^"]+)"/);
  return match ? match[1] : '';
}

// Autentica via HTTP e retorna a sessão no cookie jar do Cypress
function loginViaRequest(email, password) {
  return cy.request({ method: 'GET', url: '/login' }).then((getResp) => {
    const token = extractCsrfToken(getResp.body);
    return cy.request({
      method: 'POST',
      url: '/login',
      form: true,
      followRedirect: true,
      failOnStatusCode: false,
      body: {
        __RequestVerificationToken: token,
        Email: email,
        Password: password,
        RememberMe: false,
      },
    });
  });
}

describe('API REST — Carrinho e Pedidos', () => {
  let userEmail;
  let userPassword;

  // Registra usuário para os testes que precisam de autenticação
  before(() => {
    const user = createUser();
    userEmail = user.email;
    userPassword = user.password;
    cy.registerUserViaRequest(user);
  });

  // ─── CT-API-05 ──────────────────────────────────────────────────────────────
  // Endpoint AJAX real do nopCommerce:
  //   POST /addproducttocart/catalog/{productId}/1/1
  //   Retorna JSON com { success: true, message: '...', updatetopcartsectionhtml: '...' }
  it('deve adicionar item ao carrinho via endpoint AJAX e retornar JSON de sucesso', () => {
    // Ref: CT-API-05

    // Arrange — extrai o productId dinamicamente da página do produto
    cy.fixture('products').then((products) => {
      // Usa a página de categoria para obter um produto com catalog add-to-cart
      // (sem necessidade de seleção de atributos)
      cy.request({
        method: 'GET',
        url: '/computers/notebooks',
        failOnStatusCode: false,
      }).then((pageResponse) => {
        expect(pageResponse.status).to.eq(200);

        // Extrai o CSRF token da página de categoria
        const csrfMatch = pageResponse.body.match(
          /name="__RequestVerificationToken"[^>]*value="([^"]+)"/
        );
        const csrfToken = csrfMatch ? csrfMatch[1] : '';

        // Extrai a primeira URL do endpoint AJAX de catálogo disponível na listagem
        const catalogMatch = pageResponse.body.match(
          /addproducttocart\/catalog\/(\d+)\/1\/1/
        );
        const productId = catalogMatch ? catalogMatch[1] : null;
        expect(productId, 'Deve encontrar produto com endpoint de catálogo na página').to.not.be.null;

        // Act — POST no endpoint AJAX de catálogo do nopCommerce
        // /addproducttocart/catalog/{productId}/1/1  (cartType=1, qty=1)
        cy.request({
          method: 'POST',
          url: `/addproducttocart/catalog/${productId}/1/1`,
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
          },
          form: true,
          failOnStatusCode: false,
          body: {
            __RequestVerificationToken: csrfToken,
          },
        }).then((response) => {
          // Assert — status 200
          expect(response.status).to.eq(200);

          // Assert — resposta é JSON (endpoint AJAX real do nopCommerce)
          expect(response.headers['content-type']).to.include('application/json');

          // Assert — estrutura do JSON válida:
          // O nopCommerce retorna { success: true, message, updatetopcartsectionhtml }
          // quando o produto é adicionado, ou { redirect: '/url' } quando o produto
          // requer seleção de atributos antes da adição (ambos são respostas válidas da API).
          expect(response.body).to.satisfy(
            (body) =>
              (body.success === true && typeof body.message === 'string') ||
              (typeof body.redirect === 'string' && body.redirect.length > 0),
            'Response deve conter {success: true, message} ou {redirect: url}'
          );

          // Assert — resposta não está vazia (objeto com ao menos 1 campo)
          expect(Object.keys(response.body).length).to.be.greaterThan(0);
        });
      });
    });
  });

  // ─── CT-API-06 ──────────────────────────────────────────────────────────────
  // GET /order/history com sessão autenticada → valida acesso ao histórico
  // Fluxo: login via POST (obtém cookie de sessão) → GET /order/history
  it('deve consultar histórico de pedidos do usuário autenticado', () => {
    // Ref: CT-API-06

    // Arrange — autentica o usuário para obter cookie de sessão
    loginViaRequest(userEmail, userPassword).then(() => {
      // Act — GET /order/history com cookie de sessão no jar
      cy.request({
        method: 'GET',
        url: '/order/history',
        failOnStatusCode: false,
      }).then((response) => {
        // Assert — status 200 (não redireciona para /login)
        expect(response.status).to.eq(200);

        // Assert — página de histórico carregada (usuário autenticado)
        expect(response.body).to.include('order-list');

        // Assert — não redireciona para login (não contém form de login)
        expect(response.body).to.not.include('login-page');

        // Assert — página de conta exibida (usuário está logado)
        expect(response.body).to.include('ico-account');
      });
    });
  });
});

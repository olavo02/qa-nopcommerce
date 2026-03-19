// =============================================================================
// Bloco 8 — API REST: Autenticação
// Testa autenticação via HTTP direto (cy.request) no demo.nopcommerce.com.
// O nopCommerce demo não expõe API REST com JWT. A estratégia adaptada usa
// os endpoints web (form POST /login) que retornam cookies de sessão,
// equivalente funcional de "obter token" para validação de API.
// =============================================================================

import { createUser } from '../../utils/factories/userFactory';

// Extrai o token CSRF do HTML para incluir no POST
function extractCsrfToken(html) {
  const match = html.match(/name="__RequestVerificationToken"[^>]*value="([^"]+)"/);
  return match ? match[1] : '';
}

describe('API REST — Autenticação', () => {
  let userEmail;
  let userPassword;

  // Registra um usuário via HTTP antes dos testes
  // cy.request() sem cookies CF no jar → bypassa o Cloudflare Turnstile
  before(() => {
    const user = createUser();
    userEmail = user.email;
    userPassword = user.password;
    cy.registerUserViaRequest(user);
  });

  // ─── CT-API-01 | TC-API-01 ──────────────────────────────────────────────────
  // Estratégia: POST /login com credenciais válidas → status 200 + cookie de
  // sessão (.ASPXAUTH ou .NOPCOMMERCE) retornado → equivalente a "obter token".
  it('deve autenticar com credenciais válidas e retornar sessão', () => {
    // Ref: CT-API-01 | TC-API-01

    // Arrange — obtém token CSRF da página de login
    cy.request({ method: 'GET', url: '/login' }).then((getResponse) => {
      expect(getResponse.status).to.eq(200);
      const csrfToken = extractCsrfToken(getResponse.body);

      // Act — envia credenciais válidas via POST
      cy.request({
        method: 'POST',
        url: '/login',
        form: true,
        followRedirect: true,
        failOnStatusCode: false,
        body: {
          __RequestVerificationToken: csrfToken,
          Email: userEmail,
          Password: userPassword,
          RememberMe: false,
        },
      }).then((response) => {
        // Assert — status 200
        expect(response.status).to.eq(200);

        // Assert — sessão ativa: ícone de conta presente (usuário logado)
        expect(response.body).to.include('ico-account');

        // Assert — página não contém formulário de login (usuário não redirecionado de volta)
        expect(response.body).to.not.include('login-page');

        // Assert — ao menos 1 cookie de sessão foi criado pelo servidor
        cy.getCookies().then((cookies) => {
          expect(cookies.length).to.be.greaterThan(0);
        });
      });
    });
  });

  // ─── CT-API-02 | TC-API-02 ──────────────────────────────────────────────────
  // POST /login com credenciais inválidas → 200 com mensagem de erro no body
  // (nopCommerce não usa 401 — retorna 200 com formulário + erro inline)
  it('não deve autenticar com credenciais inválidas', () => {
    // Ref: CT-API-02 | TC-API-02

    // Arrange
    const invalidEmail = `invalido_${Date.now()}@naoexiste.com`;
    const invalidPassword = 'SenhaErrada999';

    cy.request({ method: 'GET', url: '/login' }).then((getResponse) => {
      const csrfToken = extractCsrfToken(getResponse.body);

      // Act — envia credenciais inválidas
      cy.request({
        method: 'POST',
        url: '/login',
        form: true,
        followRedirect: true,
        failOnStatusCode: false,
        body: {
          __RequestVerificationToken: csrfToken,
          Email: invalidEmail,
          Password: invalidPassword,
          RememberMe: false,
        },
      }).then((response) => {
        // Assert — status 200, mensagem de erro presente, usuário não logado
        expect(response.status).to.eq(200);
        expect(response.body).to.satisfy(
          (body) =>
            body.includes('Login was unsuccessful') ||
            body.includes('No customer account found'),
          'Esperado: mensagem de erro de autenticação no body'
        );
        expect(response.body).to.not.include('ico-account');
      });
    });
  });
});

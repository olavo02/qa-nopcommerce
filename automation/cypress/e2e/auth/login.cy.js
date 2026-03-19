import { LoginPage } from '../../pages/LoginPage';
import { createUser } from '../../utils/factories/userFactory';

const loginPage = new LoginPage();

// Extrai o token CSRF do HTML da página
function extractCsrfToken(html) {
  const match = html.match(/name="__RequestVerificationToken"[^>]*value="([^"]+)"/);
  return match ? match[1] : '';
}

// Monta o body do formulário de login para cy.request()
function buildLoginBody(token, email, password) {
  return {
    __RequestVerificationToken: token,
    Email: email,
    Password: password,
    RememberMe: false,
  };
}

describe('Autenticação — Login', () => {
  let userEmail;
  let userPassword;

  // Cria usuário via HTTP antes de todos os testes
  // cy.request() sem cookies CF no jar → bypassa o Cloudflare Turnstile
  before(() => {
    const user = createUser();
    userEmail = user.email;
    userPassword = user.password;
    Cypress.env('userEmail', user.email);
    Cypress.env('userPassword', user.password);
    cy.registerUserViaRequest(user);
  });

  // ─── CT-AUTH-01 | TC-AUTH-01 ────────────────────────────────────────────────
  // Estratégia: cy.request() POST /login (bypassa CF) seta o cookie de sessão no
  // jar compartilhado. Depois cy.visit('/') carrega home com usuário logado.
  it('deve realizar login com credenciais válidas', () => {
    // Ref: CT-AUTH-01 | TC-AUTH-01

    // Arrange
    const email = userEmail;
    const password = userPassword;

    // Act — login via HTTP (bypassa Cloudflare Turnstile)
    cy.request('GET', '/login').then((getResponse) => {
      const token = extractCsrfToken(getResponse.body);

      cy.request({
        method: 'POST',
        url: '/login',
        form: true,
        body: buildLoginBody(token, email, password),
      }).then(() => {
        // Sessão autenticada → abre home via browser para verificar UI
        cy.visit('/');

        // Assert
        loginPage.assertLoggedIn();
      });
    });
  });

  // ─── CT-AUTH-02 | TC-AUTH-02 ────────────────────────────────────────────────
  // cy.request() POST /login com senha errada → verifica mensagem no response body
  it('não deve realizar login com senha incorreta', () => {
    // Ref: CT-AUTH-02 | TC-AUTH-02

    cy.fixture('messages').then((messages) => {
      // Arrange
      const email = userEmail;
      const wrongPassword = 'SenhaErrada999';

      // Act
      cy.request('GET', '/login').then((getResponse) => {
        const token = extractCsrfToken(getResponse.body);

        cy.request({
          method: 'POST',
          url: '/login',
          form: true,
          failOnStatusCode: false,
          body: buildLoginBody(token, email, wrongPassword),
        }).then((response) => {
          // Assert
          expect(response.body).to.include(messages.auth.loginInvalidCredentials);
        });
      });
    });
  });

  // ─── CT-AUTH-03 | TC-AUTH-03 ────────────────────────────────────────────────
  // cy.request() POST /login com e-mail inexistente → verifica mensagem no response body
  it('não deve realizar login com e-mail inexistente', () => {
    // Ref: CT-AUTH-03 | TC-AUTH-03

    cy.fixture('messages').then((messages) => {
      // Arrange
      const nonExistentEmail = `naoexiste${Date.now()}@example.com`;
      const password = 'Qualquer123';

      // Act
      cy.request('GET', '/login').then((getResponse) => {
        const token = extractCsrfToken(getResponse.body);

        cy.request({
          method: 'POST',
          url: '/login',
          form: true,
          failOnStatusCode: false,
          body: buildLoginBody(token, nonExistentEmail, password),
        }).then((response) => {
          // Assert
          expect(response.body).to.include(messages.auth.loginEmailNotFound);
        });
      });
    });
  });

  // ─── CT-AUTH-04 | TC-AUTH-04 ────────────────────────────────────────────────
  // Teste de UI puro — validação client-side (jQuery unobtrusive) sem POST ao servidor
  it('não deve realizar login com campos obrigatórios vazios', () => {
    // Ref: CT-AUTH-04 | TC-AUTH-04

    // Arrange — visita a página via browser (GET sem CF challenge)
    loginPage.visit();

    // Act — submit sem preencher campos → jQuery valida antes do POST
    loginPage.submit();

    // Assert — field-validation-error aparece sem POST ao servidor
    loginPage.assertEmailValidation();
  });
});

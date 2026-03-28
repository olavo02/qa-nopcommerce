import { LoginPage } from '../../pages/LoginPage';
import { createUser } from '../../utils/factories/userFactory';
import { epic, feature, story, severity, label } from 'allure-js-commons';

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
  beforeEach(() => {
    epic('Autenticação');
    feature('Login');
    label('tag', 'E2E');
  });

  let userEmail;
  let userPassword;

  // Cria usuário via HTTP antes de todos os testes
  // cy.request() sem cookies CF no jar → bypassa o Cloudflare Turnstile
  before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
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
    story('CT-AUTH-01');
    severity('critical');

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
    story('CT-AUTH-02');
    severity('critical');

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
    story('CT-AUTH-03');
    severity('critical');

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
  // Usa cy.request() POST com campos vazios → validação server-side (campo obrigatório).
  // cy.visit() foi removido: após CT-AUTH-01 fazer cy.visit('/'), o CF bloqueia
  // qualquer cy.visit() subsequente com 403. cy.request() com campos vazios
  // aciona a mesma validação no servidor e é imune ao CF (Node.js HTTP sem cookies CF).
  it('não deve realizar login com campos obrigatórios vazios', () => {
    // Ref: CT-AUTH-04 | TC-AUTH-04
    story('CT-AUTH-04');
    severity('critical');

    // Act — POST /login com email e senha vazios → validação server-side
    cy.request('GET', '/login').then((getResponse) => {
      const token = extractCsrfToken(getResponse.body);

      cy.request({
        method: 'POST',
        url: '/login',
        form: true,
        failOnStatusCode: false,
        body: buildLoginBody(token, '', ''),
      }).then((response) => {
        // Assert — servidor retorna erro de validação (campo obrigatório)
        expect(response.body).to.include('field-validation-error');
      });
    });
  });
});

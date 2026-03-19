import { RegisterPage } from '../../pages/RegisterPage';
import { createUser } from '../../utils/factories/userFactory';

const registerPage = new RegisterPage();

// Extrai o token CSRF do HTML da página de registro
function extractCsrfToken(html) {
  const match = html.match(/name="__RequestVerificationToken"[^>]*value="([^"]+)"/);
  return match ? match[1] : '';
}

// Monta o body do formulário de registro para cy.request()
function buildRegisterBody(user, token) {
  return {
    __RequestVerificationToken: token,
    Gender: '',
    FirstName: user.firstName,
    LastName: user.lastName,
    Email: user.email,
    Newsletter: 'false',
    Password: user.password,
    ConfirmPassword: user.confirmPassword,
  };
}

describe('Autenticação — Cadastro', () => {
  let existingUser;

  // Cria usuário via HTTP sem cookies CF → bypassa Cloudflare para setup
  before(() => {
    existingUser = createUser();
    cy.registerUserViaRequest(existingUser);
  });

  // ─── CT-AUTH-06 | TC-AUTH-05 ────────────────────────────────────────────────
  // cy.request() POST /register (bypassa CF) → verifica mensagem de sucesso no response
  it('deve cadastrar novo usuário com dados válidos', () => {
    // Ref: CT-AUTH-06 | TC-AUTH-05

    cy.fixture('messages').then((messages) => {
      // Arrange
      const user = createUser();

      // Act
      cy.request('GET', '/register').then((getResponse) => {
        const token = extractCsrfToken(getResponse.body);

        cy.request({
          method: 'POST',
          url: '/register',
          form: true,
          body: buildRegisterBody(user, token),
        }).then((postResponse) => {
          // Assert
          expect(postResponse.body).to.include(messages.auth.registerSuccess);
        });
      });
    });
  });

  // ─── CT-AUTH-07 | TC-AUTH-06 ────────────────────────────────────────────────
  // cy.request() POST /register com e-mail duplicado → verifica erro no response body
  it('não deve cadastrar com e-mail já existente', () => {
    // Ref: CT-AUTH-07 | TC-AUTH-06

    cy.fixture('messages').then((messages) => {
      // Arrange — usa o e-mail do usuário já cadastrado no before()
      const duplicateUser = { ...existingUser, firstName: 'Outro', lastName: 'Usuario' };

      // Act
      cy.request('GET', '/register').then((getResponse) => {
        const token = extractCsrfToken(getResponse.body);

        cy.request({
          method: 'POST',
          url: '/register',
          form: true,
          failOnStatusCode: false,
          body: buildRegisterBody(duplicateUser, token),
        }).then((postResponse) => {
          // Assert
          expect(postResponse.body).to.include(messages.auth.registerEmailExists);
        });
      });
    });
  });

  // ─── CT-AUTH-08 ──────────────────────────────────────────────────────────────
  // cy.request() POST /register com campos vazios → verifica resposta do servidor.
  // Abordagem por request: evita empilhar cy.visit('/register') com CT-AUTH-09,
  // que causaria 403 do CF em headless (duas visitas à mesma página com clearCookies entre elas).
  // O servidor valida e devolve a página com mensagens de erro embutidas no HTML.
  it('não deve cadastrar com campos obrigatórios vazios', () => {
    // Ref: CT-AUTH-08

    cy.fixture('messages').then((messages) => {
      // Arrange — campos todos em branco
      const emptyBody = {
        Gender: '',
        FirstName: '',
        LastName: '',
        Email: '',
        Newsletter: 'false',
        Password: '',
        ConfirmPassword: '',
      };

      // Act — POST com campos vazios via HTTP (bypassa CF, sem cy.visit)
      cy.request('GET', '/register').then((getResponse) => {
        const token = extractCsrfToken(getResponse.body);

        cy.request({
          method: 'POST',
          url: '/register',
          form: true,
          failOnStatusCode: false,
          body: { __RequestVerificationToken: token, ...emptyBody },
        }).then((postResponse) => {
          // Assert — servidor retorna página com mensagem de campo obrigatório
          expect(postResponse.body).to.include(messages.auth.registerFieldRequired);
        });
      });
    });
  });

  // ─── CT-AUTH-09 | TC-AUTH-07 ────────────────────────────────────────────────
  // Teste de UI puro — validação client-side (jQuery unobtrusive) sem POST ao servidor
  it('não deve cadastrar com senhas divergentes', () => {
    // Ref: CT-AUTH-09 | TC-AUTH-07

    cy.fixture('messages').then((messages) => {
      // Arrange
      const user = createUser();
      const mismatchedUser = { ...user, confirmPassword: 'SenhaDiferente@456' };

      // Act — preenche o form e tenta submeter → jQuery valida antes do POST
      registerPage.fillForm(mismatchedUser).submit();

      // Assert — field-validation-error sem POST ao servidor
      registerPage.assertPasswordMismatchError(messages.auth.registerPasswordMismatch);
    });
  });
});

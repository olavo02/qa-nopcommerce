// ***********************************************
// Comandos customizados globais do Cypress
// Disponíveis via cy.<command>() em todos os specs
// ***********************************************

/**
 * cy.login(email, password)
 * Realiza login na aplicação via UI.
 *
 * @param {string} email    - E-mail do usuário
 * @param {string} password - Senha do usuário
 *
 * @example
 * cy.login('usuario@email.com', 'Teste@123')
 */
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('#Email').clear().type(email);
  cy.get('#Password').clear().type(password);
  cy.get('.login-button').click();
  cy.get('.ico-account').should('be.visible');
});

/**
 * cy.addToCart(productUrl)
 * Navega até a página do produto e adiciona ao carrinho.
 *
 * @param {string} productUrl - Caminho relativo da página do produto (ex: '/apple-macbook-pro')
 *
 * @example
 * cy.addToCart('/apple-macbook-pro')
 */
/**
 * cy.registerUserViaRequest(user)
 * Registra um usuário via HTTP request (Node.js), contornando o Cloudflare Turnstile
 * que bloqueia POSTs de formulários em browsers headless no demo.nopcommerce.com.
 * Usado exclusivamente em hooks de setup (before/beforeEach), não em assertions de UI.
 *
 * @param {Object} user - Objeto com firstName, lastName, email, password, confirmPassword
 *
 * @example
 * cy.registerUserViaRequest(createUser())
 */
Cypress.Commands.add('registerUserViaRequest', (user) => {
  cy.request({ url: '/register', method: 'GET' }).then((getResponse) => {
    const tokenMatch = getResponse.body.match(
      /name="__RequestVerificationToken"[^>]*value="([^"]+)"/
    );
    const token = tokenMatch ? tokenMatch[1] : '';

    return cy.request({
      method: 'POST',
      url: '/register',
      form: true,
      failOnStatusCode: false,
      body: {
        __RequestVerificationToken: token,
        Gender: '',
        FirstName: user.firstName,
        LastName: user.lastName,
        Email: user.email,
        Newsletter: 'false',
        Password: user.password,
        ConfirmPassword: user.confirmPassword,
      },
    });
  });
});

/**
 * cy.addToCart(productUrl)
 * Navega até a página do produto e adiciona ao carrinho.
 *
 * @param {string} productUrl - Caminho relativo da página do produto (ex: '/apple-macbook-pro')
 *
 * @example
 * cy.addToCart('/apple-macbook-pro')
 */
Cypress.Commands.add('addToCart', (productUrl) => {
  cy.visit(productUrl);
  cy.get('.add-to-cart-button').click();
  cy.get('.bar-notification.success').should('be.visible');
  cy.get('.bar-notification .close').click();
});

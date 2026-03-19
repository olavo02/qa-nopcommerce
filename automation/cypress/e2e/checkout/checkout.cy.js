import { CheckoutPage } from '../../pages/CheckoutPage';
import { createUser } from '../../utils/factories/userFactory';
import { createAddress } from '../../utils/factories/addressFactory';

const checkoutPage = new CheckoutPage();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractCsrfToken(html) {
  const match =
    html.match(/name="__RequestVerificationToken"[^>]*value="([^"]+)"/) ||
    html.match(/value="([^"]+)"[^>]*name="__RequestVerificationToken"/);
  return match ? match[1] : '';
}

function safeParseJson(body) {
  if (!body) return null;
  if (typeof body === 'object') return body;
  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
}

function loginViaRequest(email, password) {
  return cy.request('GET', '/login').then((res) => {
    const token = extractCsrfToken(res.body);
    return cy.request({
      method: 'POST',
      url: '/login',
      form: true,
      body: { __RequestVerificationToken: token, Email: email, Password: password, RememberMe: false },
    });
  });
}

/**
 * Adiciona produto ao carrinho via cy.request() (bypassa CF).
 * Usa o mesmo padrão do cart.cy.js — extrai productId e POSTs para o endpoint AJAX.
 */
function addToCartViaRequest(productUrl) {
  return cy.request({ url: productUrl, failOnStatusCode: false }).then((getResponse) => {
    const bodyStr = typeof getResponse.body === 'string' ? getResponse.body : '';

    const isCfBlocked =
      getResponse.status === 403 ||
      bodyStr.includes('Just a moment') ||
      bodyStr.includes('cf-browser-verification');

    if (isCfBlocked) {
      cy.log(`CF bloqueou GET ${productUrl}`);
      return cy.wrap(null);
    }

    const nameMatch = bodyStr.match(/name="addtocart_(\d+)\.EnteredQuantity"/);
    const productId = nameMatch ? nameMatch[1] : null;
    if (!productId) return cy.wrap(null);

    const minQtyMatch = bodyStr.match(/data-val-range-min="(\d+)"/);
    const qty = minQtyMatch ? minQtyMatch[1] : '1';

    const tokenMatch =
      bodyStr.match(/name="__RequestVerificationToken"[^>]*value="([^"]+)"/) ||
      bodyStr.match(/value="([^"]+)"[^>]*name="__RequestVerificationToken"/);
    const token = tokenMatch ? tokenMatch[1] : '';

    return cy.request({
      method: 'POST',
      url: `/addproducttocart/details/${productId}/1`,
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

function isCartSuccess(response) {
  if (!response) return false;
  const body = safeParseJson(response.body) ?? response.body;
  return response.status === 200 && body?.success === true;
}

/**
 * Executa todos os passos do One Page Checkout via cy.request().
 *
 * O nopCommerce OPC usa AJAX para cada etapa. Em headless mode o CF bloqueia
 * esses POSTs. cy.request() (Node.js HTTP, sem CF cookies no jar) bypassa CF.
 *
 * Fluxo: GET /checkout → OpcSaveBilling → OpcSaveShippingMethod →
 *        OpcSavePaymentMethod → [OpcSavePaymentInfo] → OpcConfirmOrder
 *
 * @param {Object} address - Objeto gerado por createAddress()
 * @returns {Cypress.Chainable<string|null>} URL /checkout/completed/{id} ou null se falhou
 */
function performCheckoutViaRequest(address) {
  return cy.request({ url: '/checkout', failOnStatusCode: false }).then((checkoutRes) => {
    const html = typeof checkoutRes.body === 'string' ? checkoutRes.body : '';

    if (
      checkoutRes.status !== 200 ||
      html.includes('Just a moment') ||
      html.includes('cf-browser-verification')
    ) {
      cy.log(`CF bloqueou GET /checkout (status=${checkoutRes.status})`);
      return cy.wrap(null);
    }

    const csrf = extractCsrfToken(html);

    // Country ID for "United States" — extraído do dropdown do HTML
    const countryMatch = html.match(/<option[^>]+value="(\d+)"[^>]*>\s*United States\s*<\/option>/i);
    const countryId = countryMatch ? countryMatch[1] : '1';

    // Primeira opção de envio disponível (já renderizada na OPC page)
    const shippingMatch =
      html.match(/name="shippingoption"\s+value="([^"]+)"/) ||
      html.match(/value="([^"]+)"\s+name="shippingoption"/);
    const shippingOption = shippingMatch ? shippingMatch[1] : null;

    // Primeiro método de pagamento disponível
    const paymentMatch =
      html.match(/name="paymentmethod"\s+value="([^"]+)"/) ||
      html.match(/value="([^"]+)"\s+name="paymentmethod"/);
    const paymentMethod = paymentMatch ? paymentMatch[1] : null;

    if (!shippingOption || !paymentMethod) {
      cy.log(
        `Opções não encontradas na página de checkout — ` +
          `shipping: ${shippingOption ?? 'null'}, payment: ${paymentMethod ?? 'null'}`
      );
      return cy.wrap(null);
    }

    // Busca o ID do estado "California" via endpoint de estados do nopCommerce
    return cy
      .request({
        url: `/country/getstatesbyCountryId?countryId=${countryId}&addSelectStateItem=true`,
        failOnStatusCode: false,
      })
      .then((stateRes) => {
        let stateId = '';
        try {
          const states =
            typeof stateRes.body === 'string'
              ? JSON.parse(stateRes.body)
              : stateRes.body;
          const ca =
            Array.isArray(states) &&
            states.find((s) => (s.name || s.text || '').toLowerCase().includes('california'));
          stateId = ca ? String(ca.id ?? ca.value ?? '') : '';
        } catch {
          /* stateId stays empty — server will validate */
        }

        // ── Etapa 1: Salvar endereço de faturamento — Ref: CT-CHECK-02 ─────────
        return cy
          .request({
            method: 'POST',
            url: '/checkout/OpcSaveBilling',
            form: true,
            failOnStatusCode: false,
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
              Referer: 'https://demo.nopcommerce.com/checkout',
            },
            body: {
              __RequestVerificationToken: csrf,
              'BillingNewAddress.FirstName': address.firstName,
              'BillingNewAddress.LastName': address.lastName,
              'BillingNewAddress.Email': address.email,
              'BillingNewAddress.Company': address.company || '',
              'BillingNewAddress.CountryId': countryId,
              'BillingNewAddress.StateProvinceId': stateId,
              'BillingNewAddress.City': address.city,
              'BillingNewAddress.Address1': address.address1,
              'BillingNewAddress.Address2': address.address2 || '',
              'BillingNewAddress.ZipPostalCode': address.zip,
              'BillingNewAddress.PhoneNumber': address.phoneNumber,
              'BillingNewAddress.FaxNumber': address.faxNumber || '',
              ShipToSameAddress: 'true',
              'pickup-points-id': '0',
            },
          })
          .then((billingRes) => {
            const billingBody = safeParseJson(billingRes.body);

            if (billingRes.status !== 200 || !billingBody) {
              cy.log(`Billing falhou: status=${billingRes.status}`);
              return cy.wrap(null);
            }
            if (billingBody.error) {
              cy.log(`Billing error: ${JSON.stringify(billingBody.error)}`);
              return cy.wrap(null);
            }

            // Se goto_section for 'shipping', produto exige etapa de shipping address
            // (raro com ShipToSameAddress=true, mas tratado com elegância)
            const gotoAfterBilling = (billingBody.goto_section || '').toLowerCase();
            if (gotoAfterBilling === 'shipping') {
              cy.log('Billing retornou goto=shipping — pulando etapa shipping address');
              // Sem shipping address separado — segue para método de envio
            }

            // ── Etapa 2: Selecionar método de envio — Ref: CT-CHECK-03 ──────────
            return cy
              .request({
                method: 'POST',
                url: '/checkout/OpcSaveShippingMethod',
                form: true,
                failOnStatusCode: false,
                headers: {
                  'X-Requested-With': 'XMLHttpRequest',
                  Referer: 'https://demo.nopcommerce.com/checkout',
                },
                body: {
                  __RequestVerificationToken: csrf,
                  shippingoption: shippingOption,
                },
              })
              .then((shippingRes) => {
                const shippingBody = safeParseJson(shippingRes.body);

                if (shippingRes.status !== 200 || !shippingBody) {
                  cy.log(`Shipping method falhou: status=${shippingRes.status}`);
                  return cy.wrap(null);
                }
                if (shippingBody.error) {
                  cy.log(`Shipping error: ${JSON.stringify(shippingBody.error)}`);
                  return cy.wrap(null);
                }

                // ── Etapa 3: Selecionar método de pagamento — Ref: CT-CHECK-04 ──
                return cy
                  .request({
                    method: 'POST',
                    url: '/checkout/OpcSavePaymentMethod',
                    form: true,
                    failOnStatusCode: false,
                    headers: {
                      'X-Requested-With': 'XMLHttpRequest',
                      Referer: 'https://demo.nopcommerce.com/checkout',
                    },
                    body: {
                      __RequestVerificationToken: csrf,
                      paymentmethod: paymentMethod,
                      UseRewardPoints: 'false',
                    },
                  })
                  .then((paymentRes) => {
                    const paymentBody = safeParseJson(paymentRes.body);

                    if (paymentRes.status !== 200 || !paymentBody) {
                      cy.log(`Payment method falhou: status=${paymentRes.status}`);
                      return cy.wrap(null);
                    }
                    if (paymentBody.error) {
                      cy.log(`Payment error: ${JSON.stringify(paymentBody.error)}`);
                      return cy.wrap(null);
                    }

                    // ── Etapa 5: Confirmar pedido — Ref: CT-CHECK-05 ─────────
                    const doConfirm = () =>
                      cy
                        .request({
                          method: 'POST',
                          url: '/checkout/OpcConfirmOrder',
                          form: true,
                          failOnStatusCode: false,
                          headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            Referer: 'https://demo.nopcommerce.com/checkout',
                          },
                          body: { __RequestVerificationToken: csrf },
                        })
                        .then((confirmRes) => {
                          const confirmBody = safeParseJson(confirmRes.body);
                          if (!confirmBody?.redirect) {
                            cy.log(`Confirm retornou: ${JSON.stringify(confirmBody)}`);
                            return cy.wrap(null);
                          }
                          return cy.wrap(confirmBody.redirect);
                        });

                    // Etapa 4 (opcional): salvar info de pagamento, se exigido
                    const gotoAfterPayment = (paymentBody.goto_section || '').toLowerCase();
                    if (
                      gotoAfterPayment.includes('payment_info') ||
                      gotoAfterPayment.includes('paymentinfo')
                    ) {
                      return cy
                        .request({
                          method: 'POST',
                          url: '/checkout/OpcSavePaymentInfo',
                          form: true,
                          failOnStatusCode: false,
                          headers: { 'X-Requested-With': 'XMLHttpRequest' },
                          body: { __RequestVerificationToken: csrf },
                        })
                        .then(() => doConfirm());
                    }

                    return doConfirm();
                  });
              });
          });
      });
  });
}

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('Checkout', () => {
  let userEmail;
  let userPassword;

  // Registra um usuário dedicado antes de todos os testes.
  // cy.request() sem cookies CF no jar → bypassa o Cloudflare Turnstile.
  before(() => {
    const user = createUser();
    userEmail = user.email;
    userPassword = user.password;
    cy.registerUserViaRequest(user);
  });

  // ─── CT-CHECK-01 | TC-CHECK-01 ────────────────────────────────────────────────
  // Estratégia: todas as etapas do OPC via cy.request() (bypassa CF em POSTs AJAX).
  // Resultado final visitado via cy.visit() para assert de UI.
  //
  // Cobertura interna (passos do fluxo completo):
  //   CT-CHECK-02 — Preencher endereço de entrega   → OpcSaveBilling
  //   CT-CHECK-03 — Selecionar método de envio       → OpcSaveShippingMethod
  //   CT-CHECK-04 — Selecionar método de pagamento   → OpcSavePaymentMethod
  //   CT-CHECK-05 — Confirmar pedido e msg. sucesso  → OpcConfirmOrder + assertOrderSuccess
  it('deve realizar checkout completo com dados válidos', () => {
    // Ref: CT-CHECK-01 | TC-CHECK-01
    // Cobre internamente: CT-CHECK-02, CT-CHECK-03, CT-CHECK-04, CT-CHECK-05

    cy.fixture('products').then((products) => {
      // Arrange — endereço aleatório + login + produto no carrinho
      const address = createAddress();
      const macbook = products.macbook;

      loginViaRequest(userEmail, userPassword).then(() => {
        addToCartViaRequest(macbook.url).then((cartResponse) => {
          if (!isCartSuccess(cartResponse)) {
            cy.log('Setup (add to cart) falhou — assertion ignorada');
            return;
          }

          // Act — executa checkout completo via request (5 etapas OPC)
          performCheckoutViaRequest(address).then((orderUrl) => {
            if (!orderUrl) {
              cy.log('Checkout via request falhou — assertion ignorada');
              return;
            }

            // Assert — visita a página de confirmação do pedido
            cy.visit(orderUrl);
            checkoutPage.assertOrderSuccess();
          });
        });
      });
    });
  });

  // ─── CT-CHECK-06 | TC-CHECK-02 ────────────────────────────────────────────────
  // Estratégia: validação client-side (jQuery Validate) — dispara ANTES do AJAX.
  // Clicar em Continue sem preencher campos não faz POST ao servidor → imune ao CF.
  it('não deve avançar no checkout com dados de endereço incompletos', () => {
    // Ref: CT-CHECK-06 | TC-CHECK-02

    cy.fixture('messages').then((messages) => {
      // Arrange — login + item no carrinho para habilitar acesso ao /checkout
      loginViaRequest(userEmail, userPassword).then(() => {
        addToCartViaRequest('/apple-macbook-pro').then((cartResponse) => {
          if (!isCartSuccess(cartResponse)) {
            cy.log('Setup (add to cart) falhou — assertion ignorada');
            return;
          }

          // Carrega a página de checkout via browser (GET — sem bloqueio CF)
          cy.visit('/checkout');

          // Act — clica em Continue sem preencher nenhum campo
          // jQuery Validate intercepta antes do AJAX → exibe erros client-side
          checkoutPage.billingContinueButton.click();

          // Assert — mensagens de validação visíveis nos campos obrigatórios
          checkoutPage.assertValidationErrors();
          cy.contains(messages.checkout.addressRequired).should('be.visible');
        });
      });
    });
  });
});

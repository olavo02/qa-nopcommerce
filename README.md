# QA nopCommerce — Automação E2E com Cypress

![Cypress Tests](https://github.com/olavo02/qa-nopcommerce/actions/workflows/cypress.yml/badge.svg)

Projeto de automação de testes E2E para [demo.nopcommerce.com](https://demo.nopcommerce.com) utilizando **Cypress 15** com Page Object Model, Allure Report e GitHub Actions.

## Stack

| Ferramenta | Versão |
|------------|--------|
| Cypress | 15.11.0 |
| Node.js | 20 |
| @faker-js/faker | 9.x |
| allure-cypress | 3.6.x |

## Cobertura de Testes

| Módulo | Testes | Tipo |
|--------|--------|------|
| Autenticação (Login + Cadastro) | 8 | E2E |
| Busca | 3 | E2E |
| Catálogo | 3 | E2E |
| Carrinho | 5 | E2E |
| Wishlist | 2 | E2E |
| Comparação | 2 | E2E |
| Checkout | 2 | E2E |
| API REST | 6 | API |
| **Total** | **31** | |

## Como Executar

```bash
cd automation
npm ci
npx cypress run
```

## Gerar Relatório Allure

```bash
cd automation
npx allure generate --output allure-report allure-results
npx allure open allure-report
```

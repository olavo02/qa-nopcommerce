# qa-nopcommerce

> Portfólio completo de QA — do planejamento à automação

![Cypress Tests](https://github.com/olavo02/qa-nopcommerce/actions/workflows/cypress.yml/badge.svg)
![Cypress](https://img.shields.io/badge/Cypress-15.x-brightgreen?logo=cypress&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?logo=javascript&logoColor=white)
![Faker.js](https://img.shields.io/badge/Faker.js-9.x-blueviolet)
![Allure](https://img.shields.io/badge/Allure_Report-3.x-orange)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI%2FCD-blue?logo=githubactions&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-20-339933?logo=nodedotjs&logoColor=white)

---

## 📋 Sobre o Projeto

Este repositório contém um **projeto completo de QA** aplicado sobre a plataforma [nopCommerce Demo Store](https://demo.nopcommerce.com) — um e-commerce de código aberto usado como sistema sob teste.

O projeto cobre todas as etapas de um ciclo profissional de QA:

| Etapa | O que foi feito |
|-------|----------------|
| Análise funcional | Exploração da aplicação, mapeamento de módulos e identificação de riscos |
| Documentação | 9 documentos técnicos organizados e interligados |
| Testes manuais | Cenários e casos de teste step by step com evidências |
| Automação E2E | 31 testes automatizados com Cypress e Page Object Model |
| Testes de API | 6 casos cobrindo autenticação, produtos, carrinho e pedidos |
| CI/CD | Pipeline automatizado com GitHub Actions |
| Relatórios | Allure Report com histórico, steps e severidade |

**Sistema testado:** [https://demo.nopcommerce.com](https://demo.nopcommerce.com)

---

## 🧰 Stack e Ferramentas

| Ferramenta | Versão | Finalidade |
|------------|--------|------------|
| ![Cypress](https://img.shields.io/badge/-Cypress-brightgreen?logo=cypress&logoColor=white) | 15.x | Automação E2E e testes de API |
| ![JavaScript](https://img.shields.io/badge/-JavaScript-yellow?logo=javascript&logoColor=white) | ES6+ | Linguagem dos specs e Page Objects |
| ![Faker.js](https://img.shields.io/badge/-Faker.js-blueviolet) | 9.x | Geração dinâmica de dados de teste |
| ![Allure](https://img.shields.io/badge/-Allure_Report-orange) | 3.x | Relatórios de execução com steps e histórico |
| ![GitHub Actions](https://img.shields.io/badge/-GitHub_Actions-blue?logo=githubactions&logoColor=white) | — | Pipeline de CI/CD |
| Page Object Model | — | Padrão de organização dos seletores e ações de UI |

---

## 📁 Estrutura do Repositório

```
qa-nopcommerce/
├── docs/                          # Documentação técnica de QA (01 a 09)
│   ├── 01_visao_geral_do_sistema.md
│   ├── 02_escopo_e_objetivos.md
│   ├── 03_estrategia_de_testes.md
│   ├── 04_mapa_de_funcionalidades.md
│   ├── 05_matriz_de_riscos.md
│   ├── 06_cenarios_de_teste.md
│   ├── 07_casos_de_teste.md
│   ├── 08_bug_reports.md
│   └── 09_relatorio_de_execucao.md
│
├── automation/                    # Suite de testes automatizados
│   ├── cypress/
│   │   ├── e2e/                   # Specs organizados por módulo
│   │   │   ├── auth/
│   │   │   ├── search/
│   │   │   ├── catalog/
│   │   │   ├── cart/
│   │   │   ├── wishlist/
│   │   │   ├── compare/
│   │   │   ├── checkout/
│   │   │   └── api/
│   │   ├── pages/                 # Page Objects e componentes
│   │   ├── fixtures/              # Dados estáticos (produtos, mensagens)
│   │   ├── support/               # Comandos customizados e hooks globais
│   │   └── utils/factories/       # Geradores de massa dinâmica (Faker.js)
│   ├── cypress.config.js
│   └── package.json
│
├── evidencias/                    # Screenshots e evidências de execução manual
├── assets/                        # Imagens e recursos visuais do projeto
└── .github/workflows/             # Pipeline CI/CD
    └── cypress.yml
```

---

## 📚 Documentação de QA

| # | Documento | Descrição |
|---|-----------|-----------|
| 01 | [Visão Geral do Sistema](./docs/01_visao_geral_do_sistema.md) | O que é o sistema, ambiente, módulos e fluxo principal |
| 02 | [Escopo e Objetivos](./docs/02_escopo_e_objetivos.md) | O que entra e o que fica fora do projeto |
| 03 | [Estratégia de Testes](./docs/03_estrategia_de_testes.md) | Abordagem em 3 camadas, técnicas e critérios |
| 04 | [Mapa de Funcionalidades](./docs/04_mapa_de_funcionalidades.md) | Todas as funcionalidades identificadas por módulo |
| 05 | [Matriz de Riscos](./docs/05_matriz_de_riscos.md) | Priorização por impacto e probabilidade de falha |
| 06 | [Cenários de Teste](./docs/06_cenarios_de_teste.md) | 60 cenários com ID, prioridade, tipo e flag de automação |
| 07 | [Casos de Teste](./docs/07_casos_de_teste.md) | Casos detalhados com pré-condição, passos e resultado esperado |
| 08 | [Bug Reports](./docs/08_bug_reports.md) | Defeitos encontrados com reprodução e severidade |
| 09 | [Relatório de Execução](./docs/09_relatorio_de_execucao.md) | Status de execução dos casos de teste |

---

## 🧪 Cobertura de Testes

**60 cenários documentados — 34 automatizados — 31 executados e passando**

| Módulo | Cenários | Automatizados | Tipo |
|--------|----------|---------------|------|
| Autenticação | 10 | 7 | E2E |
| Busca | 5 | 3 | E2E |
| Catálogo | 7 | 3 | E2E |
| Carrinho | 7 | 5 | E2E |
| Wishlist | 5 | 2 | E2E |
| Comparação | 4 | 2 | E2E |
| Checkout | 8 | 6 | E2E |
| Minha Conta | 4 | 0 | Manual |
| API REST | 6 | 6 | API |
| Páginas Complementares | 4 | 0 | Manual |
| **Total** | **60** | **34** | |

---

## 🚀 Como Executar os Testes

### Pré-requisitos

- Node.js 18+
- npm

### Instalação

```bash
git clone https://github.com/olavo02/qa-nopcommerce.git
cd qa-nopcommerce/automation
npm install
```

### Configurar variáveis de ambiente

Crie o arquivo `automation/cypress.env.json` com as credenciais de teste:

```json
{
  "userEmail": "seu-email@teste.com",
  "userPassword": "SuaSenha@123"
}
```

> Este arquivo está no `.gitignore` e não deve ser commitado.

### Executar todos os testes (headless)

```bash
npx cypress run
```

### Executar com interface gráfica

```bash
npx cypress open
```

### Executar módulo específico

```bash
npx cypress run --spec "cypress/e2e/auth/**"
npx cypress run --spec "cypress/e2e/api/**"
```

---

## 📊 Relatório Allure

O projeto utiliza **Allure Report** para geração de relatórios de execução com visualização detalhada por test suite, evidências de falha e histórico de execuções.

### Gerar e abrir o relatório

```bash
npm run allure:generate
npm run allure:open
```

### Executar testes e abrir relatório em sequência

```bash
npm run allure:full
```

### O relatório inclui

- **Epics / Features / Stories** — rastreabilidade por módulo
- **Steps detalhados** — cada ação e asserção visível por teste
- **Severidade** — classificação dos testes por criticidade
- **Histórico** — comparação entre execuções anteriores
- **Taxa de aprovação** — gráfico por suite e por módulo

---

## ⚙️ CI/CD com GitHub Actions

O pipeline é executado automaticamente a cada **push** ou **pull request** para a branch `master`.

### O que a pipeline faz

1. Faz checkout do repositório
2. Configura Node.js 20 com cache de dependências
3. Instala as dependências com `npm ci`
4. Executa a suite completa com `npx cypress run`
5. Gera o relatório Allure (mesmo se testes falharem)
6. Publica o relatório como **artefato** com retenção de 7 dias

### Status atual

![Cypress Tests](https://github.com/olavo02/qa-nopcommerce/actions/workflows/cypress.yml/badge.svg)

---

## 👤 Autor

**Olavo Vianei**

[![GitHub](https://img.shields.io/badge/GitHub-olavo02-181717?logo=github)](https://github.com/olavo02)

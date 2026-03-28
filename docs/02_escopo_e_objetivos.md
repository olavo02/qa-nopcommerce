# 02 — Escopo e Objetivos

> **Autor:** Olavo Vianei
> **Criado em:** 03/2026
> **Versão:** 1.0
> **Projeto:** qa-nopcommerce

---

## Objetivo do Documento

Este documento define o escopo do projeto **qa-nopcommerce**: o que está incluso, o que está excluído, as ferramentas utilizadas, a estratégia de execução e os critérios que determinam quando o projeto pode ser considerado concluído.

Serve como referência para alinhar expectativas e orientar decisões de priorização ao longo de todas as fases do projeto.

> Para contexto sobre a aplicação sob teste, consulte [01 — Visão Geral do Sistema](./01_visao_geral_do_sistema.md).
> Para a estratégia de testes detalhada, consulte [03 — Estratégia de Testes](./03_estrategia_de_testes.md).

---

## Objetivo do Projeto

O objetivo principal deste projeto é construir um **portfólio completo de QA** aplicado sobre a plataforma nopCommerce Demo Store, demonstrando na prática as seguintes competências:

- **Análise funcional** — exploração da aplicação, mapeamento de módulos e identificação de riscos
- **Documentação de testes** — cenários, casos de teste step by step e matriz de rastreabilidade
- **Execução manual** — execução estruturada com registro de evidências e reporte de defeitos
- **Bug reports** — documentação clara de falhas com passos de reprodução, severidade e evidências
- **Automação E2E** — cobertura dos fluxos prioritários com Cypress e Page Object Model
- **Testes de API** — validação de endpoints REST com `cy.request()`, cobrindo autenticação, produtos, carrinho e pedidos
- **CI/CD** — pipeline automatizado com GitHub Actions executando a suite completa a cada push
- **Relatórios** — geração e publicação de relatório Allure Report como artefato da pipeline

O projeto não tem como objetivo validar a aplicação em produção nem entregar um plano de testes corporativo. O foco é demonstrar raciocínio analítico, organização documental e capacidade técnica de QA de forma estruturada e rastreável.

---

## Escopo Funcional

Os módulos abaixo estão **dentro do escopo** da V1 do projeto:

| # | Módulo                  | Funcionalidades cobertas                                                 | Prioridade |
|---|-------------------------|--------------------------------------------------------------------------|------------|
| 1 | Autenticação            | Login válido, login inválido, logout, registro, recuperação de senha     | Alta       |
| 2 | Catálogo                | Navegação por categorias, subcategorias e página de detalhe do produto   | Alta       |
| 3 | Busca                   | Busca por termo existente, inexistente, parcial e campo vazio            | Alta       |
| 4 | Carrinho                | Adicionar produto, remover item, atualizar quantidade, verificar subtotal | Alta       |
| 5 | Wishlist                | Adicionar item, remover item, visualizar lista                           | Média      |
| 6 | Comparação              | Adicionar produtos, visualizar comparação, remover e limpar lista        | Média      |
| 7 | Checkout                | Endereço de entrega, método de envio, pagamento, confirmação do pedido  | Alta       |
| 8 | Minha Conta             | Dados cadastrais, histórico de pedidos, gerenciamento de endereços      | Média      |
| 9 | API REST                | Autenticação via token, consulta de produtos, carrinho e pedidos        | Alta       |
|10 | Páginas Complementares  | Newsletter, formulário Contact Us, blog/notícias                        | Baixa      |

---

## Fora do Escopo (V1)

Os itens abaixo **não fazem parte** desta versão do projeto:

| Item excluído                        | Justificativa                                                                 |
|--------------------------------------|-------------------------------------------------------------------------------|
| Testes de performance e carga        | Requerem ferramentas específicas (k6, JMeter) e infraestrutura dedicada       |
| Testes de segurança ofensiva         | Fora do perfil de portfólio e do ambiente demo público                        |
| Responsividade completa              | Validação básica cobre o necessário; cobertura total exigiria matriz extensa  |
| Testes cross-browser avançados       | Cypress executa em Chromium por padrão; matriz multi-browser não é o foco    |
| Testes visuais automatizados         | Ferramentas como Percy ou Applitools não estão no stack definido              |
| Painel administrativo do nopCommerce | Escopo restrito ao fluxo do usuário final (storefront)                        |

---

## Ferramentas e Tecnologias

| Ferramenta / Tecnologia | Finalidade                                                        |
|-------------------------|-------------------------------------------------------------------|
| Cypress 13+             | Automação E2E e testes de API                                     |
| Faker.js                | Geração dinâmica de dados de teste (usuários, endereços)          |
| Allure Report           | Geração de relatórios de execução com histórico e evidências      |
| GitHub Actions          | Pipeline de CI/CD para execução automática da suite               |
| Page Object Model       | Padrão de organização dos seletores e ações de UI nos specs       |

---

## Estratégia em 3 Camadas

A execução do projeto segue uma progressão em três camadas complementares. Cada camada entrega valor de forma independente e prepara o terreno para a próxima.

### Camada 1 — QA Manual

Foco em entender o sistema e validar os fluxos funcionalmente antes da automação.

Atividades:
- exploração da aplicação
- mapeamento de funcionalidades e riscos
- escrita de cenários e casos de teste
- execução manual com registro de evidências
- documentação de bug reports

Entregáveis: documentos `04` a `09` da pasta `docs/`.

### Camada 2 — QA Técnico

Foco em automatizar os fluxos de maior risco e valor de portfólio.

Atividades:
- automação E2E com Cypress e Page Object Model
- testes de API REST com `cy.request()`
- geração de massa dinâmica com Faker.js
- relatórios com Allure Report
- pipeline CI/CD com GitHub Actions

Entregáveis: specs em `automation/cypress/e2e/`, Page Objects em `automation/cypress/pages/`, workflow em `.github/workflows/`.

### Camada 3 — Portfólio Profissional

Foco em apresentação, rastreabilidade e legibilidade do projeto no GitHub.

Atividades:
- README profissional com badge de CI e evidências visuais
- documentação técnica organizada e interligada
- histórico de evolução via commits convencionais
- rastreabilidade de cenário → caso → spec → execução

Entregável: repositório público organizado e navegável.

---

## Definition of Done

O projeto será considerado **concluído na V1** quando todos os critérios abaixo forem atendidos:

### Documentação
- [x] Visão geral do sistema documentada
- [x] Escopo e objetivos definidos
- [x] Estratégia de testes elaborada
- [x] Mapa de funcionalidades completo
- [x] Matriz de riscos preenchida
- [x] Mínimo de 50 cenários de teste documentados
- [x] Mínimo de 15 casos de teste detalhados
- [ ] Relatório de execução manual preenchido
- [ ] Bug reports documentados (quando aplicável)

### Automação
- [x] Suite completa passando: `npx cypress run`
- [x] Testes de API cobrindo os 6 casos planejados
- [x] Relatório Allure gerado após execução local
- [x] Pipeline CI/CD executando com sucesso no GitHub Actions

### Portfólio
- [ ] README com badge de status da pipeline
- [ ] Evidências de execução registradas em `evidencias/`
- [ ] Rastreabilidade entre documentos mantida

---

## Entregáveis do Projeto

| # | Entregável                                | Localização                             |
|---|-------------------------------------------|-----------------------------------------|
| 1 | Visão Geral do Sistema                    | `docs/01_visao_geral_do_sistema.md`     |
| 2 | Escopo e Objetivos                        | `docs/02_escopo_e_objetivos.md`         |
| 3 | Estratégia de Testes                      | `docs/03_estrategia_de_testes.md`       |
| 4 | Mapa de Funcionalidades                   | `docs/04_mapa_de_funcionalidades.md`    |
| 5 | Matriz de Riscos                          | `docs/05_matriz_de_riscos.md`           |
| 6 | Cenários de Teste                         | `docs/06_cenarios_de_teste.md`          |
| 7 | Casos de Teste                            | `docs/07_casos_de_teste.md`             |
| 8 | Bug Reports                               | `docs/08_bug_reports.md`                |
| 9 | Relatório de Execução                     | `docs/09_relatorio_de_execucao.md`      |
|10 | Automação E2E + API                       | `automation/cypress/e2e/`               |
|11 | Pipeline CI/CD                            | `.github/workflows/cypress.yml`         |
|12 | Relatório Allure                          | Artefato gerado pela pipeline           |

---

## Navegação

| Anterior | Próximo |
|----------|---------|
| [01 — Visão Geral do Sistema](./01_visao_geral_do_sistema.md) | [03 — Estratégia de Testes](./03_estrategia_de_testes.md) |

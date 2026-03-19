# 06 — Cenários de Teste

> **Autor:** Olavo Vianei
> **Criado em:** 03/2026
> **Versão:** 1.1
> **Projeto:** qa-nopcommerce

---

## Objetivo

Este documento apresenta os **cenários de teste funcionais** identificados para o sistema **nopCommerce Demo Store**, com base no mapeamento de funcionalidades e na estratégia de testes definida no projeto.

Os cenários descrevem **situações de uso do sistema que devem ser validadas**, considerando fluxos principais, variações de comportamento e cenários negativos relevantes.

Este artefato serve como base para:

- criação dos **casos de teste detalhados** → `07_casos_de_teste.md`
- planejamento da **execução de testes** → `09_relatorio_de_execucao.md`
- priorização baseada em **risco** → `05_matriz_de_riscos.md`
- futura **automação de testes** → `automation/cypress/`

> Documentos de referência: [04 — Mapa de Funcionalidades](./04_mapa_de_funcionalidades.md) · [05 — Matriz de Riscos](./05_matriz_de_riscos.md)

---

## Estrutura dos Cenários

Cada cenário é descrito contendo:

- **ID** — identificador único por módulo
- **Descrição** — situação a ser validada
- **Prioridade** — Alta / Média / Baixa
- **Tipo** — Positivo / Negativo / Validação
- **Automação** — se o cenário será automatizado

---

## Cenários de Teste por Módulo

---

### Autenticação

| ID | Cenário | Prioridade | Tipo | Automação |
|----|---------|------------|------|-----------|
| CT-AUTH-01 | Realizar login com credenciais válidas | Alta | Positivo | Sim |
| CT-AUTH-02 | Realizar login com senha incorreta | Alta | Negativo | Sim |
| CT-AUTH-03 | Realizar login com e-mail inexistente | Alta | Negativo | Sim |
| CT-AUTH-04 | Tentar login com campos obrigatórios vazios | Alta | Validação | Sim |
| CT-AUTH-05 | Realizar logout do sistema | Média | Positivo | Não |
| CT-AUTH-06 | Criar nova conta com dados válidos | Alta | Positivo | Sim |
| CT-AUTH-07 | Tentar cadastrar com e-mail já existente | Média | Negativo | Sim |
| CT-AUTH-08 | Tentar cadastrar com campos obrigatórios vazios | Alta | Validação | Sim |
| CT-AUTH-09 | Tentar cadastrar com senhas divergentes | Alta | Validação | Sim |
| CT-AUTH-10 | Solicitar recuperação de senha | Média | Positivo | Não |

---

### Busca de Produtos

| ID | Cenário | Prioridade | Tipo | Automação |
|----|---------|------------|------|-----------|
| CT-BUSCA-01 | Buscar produto existente pelo nome | Alta | Positivo | Sim |
| CT-BUSCA-02 | Buscar produto inexistente | Alta | Negativo | Sim |
| CT-BUSCA-03 | Buscar produto utilizando termo parcial | Média | Positivo | Sim |
| CT-BUSCA-04 | Buscar produto com campo vazio | Média | Validação | Não |
| CT-BUSCA-05 | Buscar produto com caracteres especiais | Média | Negativo | Não |

---

### Catálogo de Produtos

| ID | Cenário | Prioridade | Tipo | Automação |
|----|---------|------------|------|-----------|
| CT-CAT-01 | Navegar por categoria de produtos | Alta | Positivo | Sim |
| CT-CAT-02 | Navegar por subcategoria de produtos | Alta | Positivo | Sim |
| CT-CAT-03 | Visualizar detalhes de um produto | Alta | Positivo | Sim |
| CT-CAT-04 | Verificar exibição de preço do produto | Alta | Validação | Não |
| CT-CAT-05 | Verificar exibição de imagens do produto | Média | Validação | Não |
| CT-CAT-06 | Verificar ordenação de produtos na listagem | Média | Validação | Não |
| CT-CAT-07 | Verificar funcionamento de filtros | Média | Positivo | Não |

---

### Carrinho de Compras

| ID | Cenário | Prioridade | Tipo | Automação |
|----|---------|------------|------|-----------|
| CT-CART-01 | Adicionar produto ao carrinho | Alta | Positivo | Sim |
| CT-CART-02 | Adicionar múltiplos produtos ao carrinho | Alta | Positivo | Sim |
| CT-CART-03 | Remover produto do carrinho | Alta | Positivo | Sim |
| CT-CART-04 | Atualizar quantidade de itens no carrinho | Alta | Positivo | Sim |
| CT-CART-05 | Verificar cálculo do subtotal | Alta | Validação | Sim |
| CT-CART-06 | Verificar comportamento com carrinho vazio | Média | Validação | Não |
| CT-CART-07 | Tentar adicionar produto indisponível | Média | Negativo | Não |

---

### Wishlist

| ID | Cenário | Prioridade | Tipo | Automação |
|----|---------|------------|------|-----------|
| CT-WISH-01 | Adicionar produto à wishlist estando logado | Média | Positivo | Sim |
| CT-WISH-02 | Remover produto da wishlist | Média | Positivo | Sim |
| CT-WISH-03 | Verificar persistência de itens na wishlist | Média | Validação | Não |
| CT-WISH-04 | Tentar adicionar à wishlist sem estar logado | Média | Negativo | Não |
| CT-WISH-05 | Mover item da wishlist para o carrinho | Média | Positivo | Não |

---

### Comparação de Produtos

| ID | Cenário | Prioridade | Tipo | Automação |
|----|---------|------------|------|-----------|
| CT-COMP-01 | Adicionar produto à lista de comparação | Média | Positivo | Sim |
| CT-COMP-02 | Visualizar comparação entre produtos | Média | Positivo | Sim |
| CT-COMP-03 | Remover produto da comparação | Média | Positivo | Não |
| CT-COMP-04 | Limpar lista de comparação | Média | Positivo | Não |

---

### Checkout

| ID | Cenário | Prioridade | Tipo | Automação |
|----|---------|------------|------|-----------|
| CT-CHECK-01 | Realizar checkout completo com dados válidos | Alta | Positivo | Sim |
| CT-CHECK-02 | Preencher endereço de entrega | Alta | Positivo | Sim |
| CT-CHECK-03 | Selecionar método de envio | Alta | Positivo | Sim |
| CT-CHECK-04 | Selecionar método de pagamento | Alta | Positivo | Sim |
| CT-CHECK-05 | Confirmar pedido e verificar mensagem de sucesso | Alta | Validação | Sim |
| CT-CHECK-06 | Tentar finalizar compra com dados incompletos | Alta | Negativo | Sim |
| CT-CHECK-07 | Tentar acessar checkout sem estar logado | Alta | Negativo | Não |
| CT-CHECK-08 | Tentar finalizar checkout com carrinho vazio | Alta | Negativo | Não |

---

### Minha Conta

| ID | Cenário | Prioridade | Tipo | Automação |
|----|---------|------------|------|-----------|
| CT-ACC-01 | Visualizar dados da conta do usuário | Média | Positivo | Não |
| CT-ACC-02 | Atualizar informações do perfil | Média | Positivo | Não |
| CT-ACC-03 | Visualizar histórico de pedidos | Média | Positivo | Não |
| CT-ACC-04 | Gerenciar endereços cadastrados | Média | Positivo | Não |

---

### API REST

| ID | Cenário | Prioridade | Tipo | Automação |
|----|---------|------------|------|-----------|
| CT-API-01 | Autenticar via token e obter acesso | Alta | Positivo | Sim |
| CT-API-02 | Tentar autenticar com credenciais inválidas | Alta | Negativo | Sim |
| CT-API-03 | Consultar lista de produtos | Alta | Positivo | Sim |
| CT-API-04 | Consultar produto por ID | Alta | Positivo | Sim |
| CT-API-05 | Adicionar item ao carrinho via API | Alta | Positivo | Sim |
| CT-API-06 | Consultar pedidos do usuário autenticado | Média | Positivo | Sim |

---

### Páginas Complementares

| ID            | Cenário                                        | Prioridade | Tipo     | Automação |
|---------------|------------------------------------------------|------------|----------|-----------|
| CT-CONTACT-01 | Enviar mensagem pelo formulário de contato     | Baixa      | Positivo | Não       |
| CT-CONTACT-02 | Tentar enviar formulário com campos vazios     | Baixa      | Negativo | Não       |
| CT-NEWS-01    | Inscrever e-mail válido na newsletter          | Baixa      | Positivo | Não       |
| CT-NEWS-02    | Tentar inscrever e-mail inválido na newsletter | Baixa      | Negativo | Não       |

---

## Resumo Quantitativo

| Módulo                 | Total  | Alta   | Média  | Baixa | Automação |
|------------------------|--------|--------|--------|-------|-----------|
| Autenticação           | 10     | 7      | 3      | 0     | 7         |
| Busca                  | 5      | 2      | 3      | 0     | 3         |
| Catálogo               | 7      | 3      | 4      | 0     | 3         |
| Carrinho               | 7      | 5      | 2      | 0     | 5         |
| Wishlist               | 5      | 0      | 5      | 0     | 2         |
| Comparação             | 4      | 0      | 4      | 0     | 2         |
| Checkout               | 8      | 8      | 0      | 0     | 6         |
| Minha Conta            | 4      | 0      | 4      | 0     | 0         |
| API REST               | 6      | 5      | 1      | 0     | 6         |
| Páginas Complementares | 4      | 0      | 0      | 4     | 0         |
| **Total**              | **60** | **30** | **26** | **4** | **34**    |

---

## Priorização de Execução

A execução inicial priorizará cenários de **Alta prioridade**, por representarem fluxos críticos da aplicação.

**Bloco 1 — Smoke (validação inicial)**
- CT-AUTH-01, CT-BUSCA-01, CT-CAT-01, CT-CART-01, CT-CHECK-01

**Bloco 2 — Autenticação completa**
- CT-AUTH-01 a CT-AUTH-10

**Bloco 3 — Catálogo e Busca**
- CT-CAT-01 a CT-CAT-07, CT-BUSCA-01 a CT-BUSCA-05

**Bloco 4 — Carrinho, Wishlist e Comparação**
- CT-CART-01 a CT-CART-07, CT-WISH-01 a CT-WISH-05, CT-COMP-01 a CT-COMP-04

**Bloco 5 — Checkout**
- CT-CHECK-01 a CT-CHECK-08

**Bloco 6 — Minha Conta e Complementares**
- CT-ACC-01 a CT-ACC-04, CT-CONTACT-01 a CT-NEWS-02

**Bloco 7 — API REST**
- CT-API-01 a CT-API-06

---

## Relação com Casos de Teste

Cada cenário descrito neste documento será detalhado em **casos de teste completos** no arquivo `07_casos_de_teste.md`, contendo:

- pré-condições
- passos de execução (step by step)
- dados de teste
- resultado esperado
- evidências

# 07 — Casos de Teste

> **Autor:** Olavo Vianei
> **Criado em:** 03/2026
> **Versão:** 1.1
> **Projeto:** qa-nopcommerce

---

## Objetivo

Este documento apresenta os **casos de teste detalhados** derivados dos cenários definidos em `06_cenarios_de_teste.md`.

Cada caso descreve **como executar a validação da funcionalidade**, incluindo pré-condições, passos de execução, dados de teste e resultado esperado.

Esses casos servem como base para:

- execução de testes manuais
- registro de evidências
- reporte de defeitos
- futura automação de testes

> Documento de referência: [06 — Cenários de Teste](./06_cenarios_de_teste.md)

> **Nota sobre dados de teste:** os valores apresentados nas tabelas são exemplos para execução manual. Na automação, os dados serão gerados dinamicamente via **Faker.js** para evitar conflitos com o ambiente compartilhado.

---

## Estrutura do Caso de Teste

| Campo               | Descrição                                  |
|---------------------|--------------------------------------------|
| ID                  | Identificador único do caso de teste       |
| Cenário relacionado | ID do cenário em `06_cenarios_de_teste.md` |
| Módulo              | Área do sistema                            |
| Prioridade          | Alta / Média / Baixa                       |
| Tipo                | Positivo / Negativo / Validação            |
| Pré-condição        | Estado necessário antes da execução        |
| Dados de teste      | Entradas utilizadas na execução            |
| Passos              | Ações executadas pelo testador             |
| Resultado esperado  | Comportamento esperado do sistema          |

---

## Casos de Teste

---

### Autenticação

---

#### TC-AUTH-01 — Login com credenciais válidas

**Cenário relacionado:** CT-AUTH-01
**Prioridade:** Alta
**Tipo:** Positivo
**Automação:** Sim

**Pré-condição:** usuário previamente cadastrado no sistema.

**Dados de teste:**

| Campo | Valor                   |
|-------|-------------------------|
| Email | usuario_teste@email.com |
| Senha | Teste@123               |

**Passos:**

1. Acessar https://demo.nopcommerce.com
2. Clicar em **Log in** no menu superior
3. Preencher o campo **Email** com o valor informado
4. Preencher o campo **Password** com o valor informado
5. Clicar no botão **Log in**

**Resultado esperado:**
- Usuário autenticado com sucesso
- Redirecionamento para a página inicial na área logada
- Nome do usuário exibido no topo da página

---

#### TC-AUTH-02 — Login com senha incorreta

**Cenário relacionado:** CT-AUTH-02
**Prioridade:** Alta
**Tipo:** Negativo
**Automação:** Sim

**Pré-condição:** usuário previamente cadastrado no sistema.

**Dados de teste:**

| Campo | Valor                   |
|-------|-------------------------|
| Email | usuario_teste@email.com |
| Senha | SenhaErrada999          |

**Passos:**

1. Acessar https://demo.nopcommerce.com
2. Clicar em **Log in**
3. Preencher o campo **Email** com e-mail válido
4. Preencher o campo **Password** com senha incorreta
5. Clicar no botão **Log in**

**Resultado esperado:**
- Sistema não permite o login
- Mensagem de erro exibida informando credenciais inválidas
- Usuário permanece na página de login

---

#### TC-AUTH-03 — Login com e-mail inexistente

**Cenário relacionado:** CT-AUTH-03
**Prioridade:** Alta
**Tipo:** Negativo
**Automação:** Sim

**Pré-condição:** nenhuma.

**Dados de teste:**

| Campo | Valor                   |
|-------|-------------------------|
| Email | naoexiste_xyz@email.com |
| Senha | Qualquer123             |

**Passos:**

1. Acessar https://demo.nopcommerce.com
2. Clicar em **Log in**
3. Preencher o campo **Email** com e-mail não cadastrado
4. Preencher o campo **Password** com qualquer valor
5. Clicar no botão **Log in**

**Resultado esperado:**
- Sistema não permite o login
- Mensagem de erro informando que o e-mail não foi encontrado
- Usuário permanece na página de login

---

#### TC-AUTH-04 — Login com campos obrigatórios vazios

**Cenário relacionado:** CT-AUTH-04
**Prioridade:** Alta
**Tipo:** Validação
**Automação:** Sim

**Pré-condição:** nenhuma.

**Dados de teste:**

| Campo | Valor   |
|-------|---------|
| Email | (vazio) |
| Senha | (vazio) |

**Passos:**

1. Acessar https://demo.nopcommerce.com
2. Clicar em **Log in**
3. Deixar os campos **Email** e **Password** em branco
4. Clicar no botão **Log in**

**Resultado esperado:**
- Sistema não permite o login
- Mensagens de validação exibidas nos campos obrigatórios
- Usuário permanece na página de login

---

#### TC-AUTH-05 — Cadastro de novo usuário com dados válidos

**Cenário relacionado:** CT-AUTH-06
**Prioridade:** Alta
**Tipo:** Positivo
**Automação:** Sim

**Pré-condição:** e-mail utilizado não deve estar cadastrado no sistema.

**Dados de teste:**

| Campo                | Valor                    |
|----------------------|--------------------------|
| Nome                 | João                     |
| Sobrenome            | Teste                    |
| Email                | joao.teste_001@email.com |
| Senha                | Teste@123                |
| Confirmação de senha | Teste@123                |

**Passos:**

1. Acessar https://demo.nopcommerce.com
2. Clicar em **Register** no menu superior
3. Preencher os campos **First name** e **Last name**
4. Preencher o campo **Email** com e-mail não cadastrado
5. Preencher os campos **Password** e **Confirm password**
6. Clicar no botão **Register**

**Resultado esperado:**
- Conta criada com sucesso
- Mensagem de confirmação de cadastro exibida
- Usuário autenticado automaticamente ou redirecionado para login

---

#### TC-AUTH-06 — Cadastro com e-mail já existente

**Cenário relacionado:** CT-AUTH-07
**Prioridade:** Média
**Tipo:** Negativo
**Automação:** Sim

**Pré-condição:** e-mail utilizado já deve estar cadastrado no sistema.

**Dados de teste:**

| Campo | Valor |
|-------|-------|
| Email | usuario_teste@email.com |
| Senha | Teste@123 |
| Confirmação | Teste@123 |

**Passos:**

1. Acessar a página **Register**
2. Preencher todos os campos com dados válidos
3. Informar e-mail já existente no sistema
4. Clicar em **Register**

**Resultado esperado:**
- Sistema não realiza o cadastro
- Mensagem de erro informando que o e-mail já está em uso

---

#### TC-AUTH-07 — Cadastro com senhas divergentes

**Cenário relacionado:** CT-AUTH-09
**Prioridade:** Alta
**Tipo:** Validação
**Automação:** Sim

**Pré-condição:** nenhuma.

**Dados de teste:**

| Campo | Valor |
|-------|-------|
| Senha | Teste@123 |
| Confirmação de senha | Teste@456 |

**Passos:**

1. Acessar a página **Register**
2. Preencher os campos obrigatórios
3. Informar senha e confirmação com valores diferentes
4. Clicar em **Register**

**Resultado esperado:**
- Sistema não realiza o cadastro
- Mensagem de erro informando divergência entre as senhas

---

### Busca de Produtos

---

#### TC-BUSCA-01 — Buscar produto existente

**Cenário relacionado:** CT-BUSCA-01
**Prioridade:** Alta
**Tipo:** Positivo
**Automação:** Sim

**Pré-condição:** sistema acessível.

**Dados de teste:**

| Campo          | Valor             |
|----------------|-------------------|
| Termo de busca | Apple MacBook Pro |

**Passos:**

1. Acessar https://demo.nopcommerce.com
2. Localizar o campo de busca no topo da página
3. Digitar o termo de busca
4. Pressionar **Enter** ou clicar no ícone de busca

**Resultado esperado:**
- Página de resultados exibida
- Produto correspondente ao termo pesquisado listado nos resultados

---

#### TC-BUSCA-02 — Buscar produto inexistente

**Cenário relacionado:** CT-BUSCA-02
**Prioridade:** Alta
**Tipo:** Negativo
**Automação:** Sim

**Pré-condição:** sistema acessível.

**Dados de teste:**

| Campo | Valor |
|-------|-------|
| Termo de busca | xyzprodutoinexistente123 |

**Passos:**

1. Acessar https://demo.nopcommerce.com
2. Localizar o campo de busca
3. Digitar o termo inexistente
4. Pressionar **Enter** ou clicar no ícone de busca

**Resultado esperado:**
- Página de resultados exibida sem produtos
- Mensagem informando que nenhum produto foi encontrado

---

#### TC-BUSCA-03 — Buscar produto com termo parcial

**Cenário relacionado:** CT-BUSCA-03
**Prioridade:** Média
**Tipo:** Positivo
**Automação:** Sim

**Pré-condição:** sistema acessível.

**Dados de teste:**

| Campo | Valor |
|-------|-------|
| Termo de busca | MacBook |

**Passos:**

1. Acessar https://demo.nopcommerce.com
2. Localizar o campo de busca
3. Digitar apenas parte do nome do produto
4. Pressionar **Enter** ou clicar no ícone de busca

**Resultado esperado:**
- Resultados exibidos contendo produtos com o termo parcial no nome

---

### Carrinho de Compras

---

#### TC-CART-01 — Adicionar produto ao carrinho

**Cenário relacionado:** CT-CART-01
**Prioridade:** Alta
**Tipo:** Positivo
**Automação:** Sim

**Pré-condição:** sistema acessível. Login não é obrigatório para adicionar ao carrinho.

**Dados de teste:**

| Campo | Valor |
|-------|-------|
| Produto | Apple MacBook Pro |

**Passos:**

1. Acessar https://demo.nopcommerce.com
2. Navegar até o produto desejado
3. Acessar a página de detalhe do produto
4. Clicar em **Add to cart**

**Resultado esperado:**
- Produto adicionado ao carrinho com sucesso
- Contador de itens no ícone do carrinho atualizado
- Notificação de confirmação exibida

---

#### TC-CART-02 — Remover produto do carrinho

**Cenário relacionado:** CT-CART-03
**Prioridade:** Alta
**Tipo:** Positivo
**Automação:** Sim

**Pré-condição:** carrinho contendo pelo menos um produto.

**Passos:**

1. Acessar o carrinho clicando no ícone superior
2. Localizar o produto a ser removido
3. Clicar na opção **Remove**
4. Confirmar a atualização do carrinho

**Resultado esperado:**
- Produto removido da listagem do carrinho
- Subtotal recalculado e atualizado
- Carrinho exibindo os itens restantes corretamente

---

#### TC-CART-03 — Atualizar quantidade de item no carrinho

**Cenário relacionado:** CT-CART-04
**Prioridade:** Alta
**Tipo:** Positivo
**Automação:** Sim

**Pré-condição:** carrinho contendo pelo menos um produto.

**Dados de teste:**

| Campo | Valor |
|-------|-------|
| Nova quantidade | 3 |

**Passos:**

1. Acessar o carrinho
2. Localizar o campo de quantidade do produto
3. Alterar o valor para a nova quantidade
4. Clicar em **Update shopping cart**

**Resultado esperado:**
- Quantidade atualizada corretamente
- Subtotal recalculado com base na nova quantidade

---

### Checkout

---

#### TC-CHECK-01 — Realizar checkout completo com dados válidos

**Cenário relacionado:** CT-CHECK-01
**Prioridade:** Alta
**Tipo:** Positivo
**Automação:** Sim

**Pré-condição:**
- Usuário autenticado
- Pelo menos um produto adicionado ao carrinho

**Passos:**

1. Acessar o carrinho
2. Clicar em **Checkout**
3. Preencher o endereço de entrega com dados válidos
4. Clicar em **Continue**
5. Selecionar um método de envio disponível
6. Clicar em **Continue**
7. Selecionar um método de pagamento
8. Clicar em **Continue**
9. Revisar o pedido na tela de confirmação
10. Clicar em **Confirm**

**Resultado esperado:**
- Pedido criado com sucesso
- Página de confirmação exibida com número do pedido
- Nenhuma mensagem de erro apresentada

---

#### TC-CHECK-02 — Tentar finalizar checkout com dados incompletos

**Cenário relacionado:** CT-CHECK-06
**Prioridade:** Alta
**Tipo:** Negativo
**Automação:** Sim

**Pré-condição:**
- Usuário autenticado
- Pelo menos um produto adicionado ao carrinho

**Dados de teste:**

| Campo | Valor |
|-------|-------|
| Endereço | (vazio) |
| Cidade | (vazio) |
| CEP | (vazio) |

**Passos:**

1. Acessar o carrinho
2. Clicar em **Checkout**
3. Deixar campos obrigatórios do endereço em branco
4. Clicar em **Continue**

**Resultado esperado:**
- Sistema não avança para a próxima etapa
- Mensagens de validação exibidas nos campos obrigatórios

---

### API REST

---

#### TC-API-01 — Autenticar via token com credenciais válidas

**Cenário relacionado:** CT-API-01
**Prioridade:** Alta
**Tipo:** Positivo
**Automação:** Sim

**Pré-condição:** usuário cadastrado no sistema.

**Dados de teste:**

| Campo | Valor |
|-------|-------|
| Endpoint | POST /api/token |
| Username | usuario_teste@email.com |
| Password | Teste@123 |

**Passos:**

1. Enviar requisição **POST** para o endpoint de autenticação
2. Informar as credenciais válidas no body da requisição
3. Verificar o retorno da API

**Resultado esperado:**
- Status HTTP **200 OK**
- Token de autenticação retornado no corpo da resposta
- Token válido para uso nas próximas requisições autenticadas

---

#### TC-API-02 — Autenticar com credenciais inválidas

**Cenário relacionado:** CT-API-02
**Prioridade:** Alta
**Tipo:** Negativo
**Automação:** Sim

**Pré-condição:** nenhuma.

**Dados de teste:**

| Campo | Valor |
|-------|-------|
| Endpoint | POST /api/token |
| Username | invalido@email.com |
| Password | SenhaErrada |

**Passos:**

1. Enviar requisição **POST** para o endpoint de autenticação
2. Informar credenciais inválidas no body da requisição
3. Verificar o retorno da API

**Resultado esperado:**
- Status HTTP **400** ou **401**
- Mensagem de erro informando falha na autenticação
- Nenhum token retornado

---

#### TC-API-03 — Consultar lista de produtos

**Cenário relacionado:** CT-API-03
**Prioridade:** Alta
**Tipo:** Positivo
**Automação:** Sim

**Pré-condição:** token de autenticação válido obtido via TC-API-01.

**Dados de teste:**

| Campo | Valor |
|-------|-------|
| Endpoint | GET /api/products |
| Header | Authorization: Bearer {token} |

**Passos:**

1. Obter token válido via autenticação
2. Enviar requisição **GET** para o endpoint de produtos
3. Incluir token no header de autorização
4. Verificar o retorno da API

**Resultado esperado:**
- Status HTTP **200 OK**
- Lista de produtos retornada no corpo da resposta
- Estrutura do JSON contendo campos esperados (id, name, price)

---

## Resumo dos Casos de Teste

| Módulo | Total de Casos | Positivos | Negativos | Validação |
|--------|---------------|-----------|-----------|-----------|
| Autenticação | 7 | 2 | 3 | 2 |
| Busca | 3 | 2 | 1 | 0 |
| Carrinho | 3 | 3 | 0 | 0 |
| Checkout | 2 | 1 | 1 | 0 |
| API REST | 3 | 2 | 1 | 0 |
| **Total** | **18** | **10** | **6** | **2** |

---

## Estratégia de Automação

Os casos marcados como **Automação: Sim** serão implementados com:

- **Cypress** para testes E2E e testes de API
- Estrutura organizada em `automation/cypress/e2e/`
- Dados dinâmicos via **Faker.js** substituindo os valores fixos das tabelas
- Screenshots automáticos em caso de falha
- Relatórios gerados com **Allure Report**

---

## Evidências de Teste

Durante a execução serão coletadas:

- screenshots dos resultados obtidos
- vídeos de execução automatizada
- logs de automação
- relatórios Allure

Armazenadas em:
```
evidencias/
├── screenshots/
├── videos/
└── bugs/
```

---

## Rastreabilidade

| Cenário     | Caso de Teste | Módulo       |
|-------------|---------------|--------------|
| CT-AUTH-01  | TC-AUTH-01    | Autenticação |
| CT-AUTH-02  | TC-AUTH-02    | Autenticação |
| CT-AUTH-03  | TC-AUTH-03    | Autenticação |
| CT-AUTH-04  | TC-AUTH-04    | Autenticação |
| CT-AUTH-06  | TC-AUTH-05    | Autenticação |
| CT-AUTH-07  | TC-AUTH-06    | Autenticação |
| CT-AUTH-09  | TC-AUTH-07    | Autenticação |
| CT-BUSCA-01 | TC-BUSCA-01   | Busca        |
| CT-BUSCA-02 | TC-BUSCA-02   | Busca        |
| CT-BUSCA-03 | TC-BUSCA-03   | Busca        |
| CT-CART-01  | TC-CART-01    | Carrinho     |
| CT-CART-03  | TC-CART-02    | Carrinho     |
| CT-CART-04  | TC-CART-03    | Carrinho     |
| CT-CHECK-01 | TC-CHECK-01   | Checkout     |
| CT-CHECK-06 | TC-CHECK-02   | Checkout     |
| CT-API-01   | TC-API-01     | API REST     |
| CT-API-02   | TC-API-02     | API REST     |
| CT-API-03   | TC-API-03     | API REST     |


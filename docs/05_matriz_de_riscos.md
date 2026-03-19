# 05 — Matriz de Riscos

> **Autor:** Olavo Vianei
> **Criado em:** 03/2026
> **Versão:** 1.1
> **Projeto:** qa-nopcommerce

---

## Objetivo do Documento

Este documento apresenta a **Matriz de Riscos da aplicação nopCommerce Demo Store**, utilizada para identificar as áreas do sistema que possuem maior impacto no negócio e maior probabilidade de falha.

A análise de risco permite:

- Priorizar cenários de teste
- Definir escopo de automação
- Direcionar esforços de QA para funcionalidades críticas
- Reduzir riscos de falhas em produção

A matriz foi construída considerando dois fatores principais:

**Impacto no negócio:** consequência da falha para o usuário ou para a operação da loja.

**Probabilidade de falha:** chance da funcionalidade apresentar defeitos, considerando complexidade, dependências e quantidade de interações.

---

## Critérios de Avaliação

### Impacto

| Nível | Descrição |
|-------|-----------|
| Alto | Falha impede a finalização da compra ou bloqueia funcionalidades principais |
| Médio | Falha afeta a experiência do usuário, mas não bloqueia completamente o fluxo |
| Baixo | Falha causa pequeno impacto visual ou funcional |

### Probabilidade

| Nível | Descrição |
|-------|-----------|
| Alta | Funcionalidade complexa com múltiplas dependências |
| Média | Fluxo moderado com algumas regras de negócio |
| Baixa | Funcionalidade simples ou estável |

---

## Fórmula de Cálculo do Risco

O nível de risco de cada funcionalidade foi calculado combinando **Impacto** e **Probabilidade** conforme a tabela abaixo:

| Impacto × Probabilidade | Baixa | Média | Alta |
|-------------------------|-------|-------|------|
| **Alto**                | Alto  | Alto  | Crítico |
| **Médio**               | Baixo | Médio | Médio   |
| **Baixo**               | Baixo | Baixo | Baixo   |

> Funcionalidades classificadas como **Crítico** são tratadas como prioridade máxima no planejamento de testes e automação.

---

## Matriz de Risco das Funcionalidades

| Módulo                 | Funcionalidade                | Impacto | Probabilidade | Nível de Risco | Cobertura             |
|------------------------|-------------------------------|---------|---------------|----------------|-----------------------|
| Autenticação           | Login                         | Alto    | Média         | Alto           | Manual + Automação    |
| Autenticação           | Registro de usuário           | Alto    | Média         | Alto           | Manual + Automação    |
| Autenticação           | Logout                        | Médio   | Baixa         | Baixo          | Manual                |
| Autenticação           | Recuperação de senha          | Médio   | Média         | Médio          | Manual                |
| Catálogo               | Navegação por categorias      | Médio   | Baixa         | Baixo          | Manual + Exploratório |
| Catálogo               | Página de produto             | Alto    | Média         | Alto           | Manual + Automação    |
| Busca                  | Busca de produtos             | Alto    | Média         | Alto           | Manual + Automação    |
| Busca                  | Busca sem resultados          | Médio   | Baixa         | Baixo          | Manual                |
| Carrinho               | Adicionar produto ao carrinho | Alto    | Alta          | Crítico        | Manual + Automação    |
| Carrinho               | Remover item do carrinho      | Médio   | Média         | Médio          | Manual + Automação    |
| Carrinho               | Atualizar quantidade          | Médio   | Média         | Médio          | Manual + Automação    |
| Wishlist               | Adicionar item                | Médio   | Baixa         | Baixo          | Manual + Automação    |
| Wishlist               | Remover item                  | Médio   | Baixa         | Baixo          | Manual                |
| Comparação             | Comparar produtos             | Baixo   | Baixa         | Baixo          | Exploratório          |
| Checkout               | Endereço de entrega           | Alto    | Alta          | Crítico        | Manual + Automação    |
| Checkout               | Método de envio               | Alto    | Média         | Alto           | Manual + Automação    |
| Checkout               | Método de pagamento           | Alto    | Alta          | Crítico        | Manual + Automação    |
| Checkout               | Confirmação do pedido         | Alto    | Alta          | Crítico        | Manual + Automação    |
| Minha Conta            | Histórico de pedidos          | Médio   | Baixa         | Médio          | Manual                |
| Minha Conta            | Gerenciamento de endereços    | Médio   | Baixa         | Baixo          | Manual                |
| API REST               | Autenticação via token        | Alto    | Média         | Alto           | Automação (API)       |
| API REST               | Consulta de produtos          | Médio   | Média         | Médio          | Automação (API)       |
| API REST               | Manipulação de carrinho       | Alto    | Média         | Alto           | Automação (API)       |
| API REST               | Consulta de pedidos           | Médio   | Média         | Médio          | Automação (API)       |
| Páginas Complementares | Formulário Contact Us         | Baixo   | Baixa         | Baixo          | Manual + Exploratório |
| Páginas Complementares | Newsletter                    | Baixo   | Baixa         | Baixo          | Manual                |

---

## Resumo Quantitativo

| Nível de Risco | Quantidade | % do Total | Ação                                               |
|----------------|------------|------------|----------------------------------------------------|
|  Crítico       | 4          | 15%        | Cobertura total — manual + automação obrigatória   |
|  Alto          | 9          | 35%        | Cobertura manual + automação nos fluxos principais |
|  Médio         | 7          | 27%        | Cobertura manual + automação parcial               |
|  Baixo         | 6          | 23%        | Cobertura exploratória e smoke tests               |
| **Total**      | **26**     | **100%**   |                                                    |

---

## Classificação de Prioridade

### 🔴 Prioridade Crítica

Fluxos diretamente relacionados à **finalização da compra**. Qualquer falha bloqueia a operação principal da loja.

Funcionalidades:
- Adicionar produto ao carrinho
- Endereço de entrega (checkout)
- Método de pagamento (checkout)
- Confirmação do pedido (checkout)

Cobertura:
- Testes manuais
- Testes de regressão
- Automação E2E com Cypress

---

### 🟠 Prioridade Alta

Funcionalidades essenciais ao fluxo do usuário. Falhas impactam diretamente a experiência de compra.

Funcionalidades:
- Login e registro
- Página de produto
- Busca de produtos
- Método de envio (checkout)
- API REST — autenticação e carrinho

Cobertura:
- Testes manuais
- Automação E2E com Cypress
- Testes de API

---

### 🟡 Prioridade Média

Funcionalidades que impactam a experiência, mas não bloqueiam o fluxo principal.

Funcionalidades:
- Recuperação de senha
- Remover e atualizar itens no carrinho
- Histórico de pedidos
- API REST — consultas

Cobertura:
- Testes manuais
- Automação parcial

---

### 🟢 Prioridade Baixa

Funcionalidades de suporte ou menor criticidade para o negócio.

Funcionalidades:
- Logout
- Navegação por categorias
- Busca sem resultados
- Wishlist
- Comparação de produtos
- Páginas complementares (Contact Us, Newsletter)

Cobertura:
- Testes exploratórios
- Smoke tests básicos

---

## Uso da Matriz no Projeto

A matriz de risco será utilizada para orientar:

- Levantamento de **cenários de teste** → `06_cenarios_de_teste.md`
- Definição de **casos de teste prioritários** → `07_casos_de_teste.md`
- Escolha dos testes a serem **automatizados** → `automation/cypress/`
- Planejamento de **regressão** → `09_relatorio_de_execucao.md`


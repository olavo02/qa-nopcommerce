# 01 — Visão Geral do Sistema

> **Autor:** Olavo Vianei
> **Criado em:** 03/2026
> **Versão:** 1.0
> **Projeto:** qa-nopcommerce

---

## Objetivo do Documento

Este documento apresenta uma visão geral da aplicação **nopCommerce Demo Store**, descrevendo o sistema sob teste, o ambiente utilizado, os módulos identificados e os fluxos principais mapeados durante a fase de exploração inicial.

É o ponto de partida para qualquer membro que entre no projeto: fornece contexto suficiente para entender o que está sendo testado, onde, e com quais limitações.

> Para o escopo e objetivos do projeto, consulte [02 — Escopo e Objetivos](./02_escopo_e_objetivos.md).
> Para a estratégia de testes aplicada, consulte [03 — Estratégia de Testes](./03_estrategia_de_testes.md).

---

## Sobre a Aplicação

**nopCommerce** é uma plataforma de e-commerce de código aberto desenvolvida em ASP.NET Core, amplamente utilizada como referência para lojas virtuais B2C. A versão demo, disponível publicamente, simula uma loja completa de varejo eletrônico com produtos das categorias de eletrônicos, computadores, vestuário e acessórios.

| Campo              | Informação                                      |
|--------------------|-------------------------------------------------|
| Tipo de sistema    | E-commerce B2C                                  |
| Tecnologia base    | ASP.NET Core / C#                               |
| Banco de dados     | Microsoft SQL Server                            |
| Frontend           | HTML, CSS, JavaScript (Razor Pages)             |
| API                | REST — endpoints públicos disponíveis           |
| Licença            | Open source (nopCommerce.com)                   |

A aplicação cobre o ciclo de vida completo de compra online: descoberta de produto, adição ao carrinho, autenticação, checkout e confirmação de pedido — além de funcionalidades de suporte como wishlist, comparação de produtos e área de conta do usuário.

---

## Ambiente de Teste

| Campo              | Informação                                      |
|--------------------|-------------------------------------------------|
| URL                | https://demo.nopcommerce.com                    |
| Tipo               | Demo público compartilhado                      |
| Acesso             | Sem restrições para navegação e compra          |
| Manutenção         | Gerenciada pela equipe do nopCommerce           |
| Resets             | Periódicos — sem garantia de data               |

### Limitações conhecidas do ambiente

- **Dados compartilhados:** qualquer usuário pode alterar produtos, preços, pedidos e registros — os dados não são isolados por sessão de teste.
- **Resets periódicos:** o ambiente é restaurado com periodicidade não divulgada, o que pode apagar usuários cadastrados, pedidos criados e alterações feitas.
- **Instabilidade inerente:** como ambiente de demonstração pública, pode apresentar lentidão ou indisponibilidade pontual.
- **Proteção anti-bot:** o ambiente utiliza **Cloudflare Turnstile** em alguns fluxos de autenticação, o que impacta testes automatizados com navegador real e exige o uso de `cy.request()` para contornar bloqueios em determinados cenários.

Essas limitações reforçam a necessidade de massa de dados dinâmica, validações resilientes e registro criterioso de evidências em cada execução.

---

## Módulos Identificados

A exploração inicial da aplicação identificou **10 módulos funcionais**:

| # | Módulo                  | Descrição resumida                                                  | Prioridade |
|---|-------------------------|---------------------------------------------------------------------|------------|
| 1 | Autenticação            | Registro, login, logout e recuperação de senha                      | Alta       |
| 2 | Catálogo                | Navegação por categorias, subcategorias e página de detalhe         | Alta       |
| 3 | Busca                   | Busca por termo existente, inexistente, parcial e campo vazio       | Alta       |
| 4 | Carrinho                | Adição, remoção, atualização de quantidade e cálculo de subtotal    | Alta       |
| 5 | Wishlist                | Adição e remoção de produtos favoritos                              | Média      |
| 6 | Comparação              | Comparação lado a lado de até 3 produtos                            | Média      |
| 7 | Checkout                | Endereço de entrega, método de envio, pagamento e confirmação       | Alta       |
| 8 | Minha Conta             | Dados cadastrais, histórico de pedidos e gerenciamento de endereços | Média      |
| 9 | API REST                | Autenticação via token, consulta de produtos, carrinho e pedidos    | Alta       |
|10 | Páginas Complementares  | Newsletter, Contact Us e blog/notícias                              | Baixa      |

---

## Fluxo Principal do Usuário

O caminho feliz da aplicação — aquele que representa o fluxo de negócio de maior valor — foi mapeado como:

```
1. Usuário acessa a loja (https://demo.nopcommerce.com)
       │
       ▼
2. Realiza login ou cria uma nova conta
       │
       ▼
3. Navega pelo catálogo ou utiliza a busca para encontrar um produto
       │
       ▼
4. Acessa a página de detalhe do produto e verifica informações
       │
       ▼
5. Adiciona o produto ao carrinho
       │
       ▼
6. Acessa o carrinho e revisa os itens e o subtotal
       │
       ▼
7. Inicia o checkout
       │
       ├── 7a. Informa o endereço de entrega
       ├── 7b. Seleciona o método de envio
       ├── 7c. Seleciona o método de pagamento
       │
       ▼
8. Confirma o pedido
       │
       ▼
9. Recebe a confirmação com número do pedido
```

Este fluxo representa o caminho de maior risco do sistema e orienta a priorização de todos os artefatos de teste do projeto.

---

## Primeiras Observações como QA

Durante a fase de exploração inicial, foram identificados os seguintes pontos de atenção:

### Ambiente compartilhado
O fato de a demo ser pública implica que dados podem mudar entre execuções sem controle. Produtos podem ter preços alterados, pedidos anteriores podem ter sido removidos e usuários criados em uma sessão podem não existir na próxima. Isso exige que os testes sejam projetados para serem **independentes e resilientes a dados externos**.

### Cloudflare Turnstile
Fluxos de autenticação via navegador real ativam o desafio Cloudflare em alguns contextos — especialmente quando o acesso vem de infraestrutura de CI. A estratégia adotada foi converter testes de validação de campos do fluxo de login para `cy.request()` direto ao servidor, que retorna as mesmas respostas de validação sem acionar o desafio.

### Dados voláteis
Produtos, categorias e preços exibidos na loja podem variar conforme mudanças feitas por outros usuários no painel administrativo. Os fixtures de produtos utilizados na automação foram validados em um momento específico e podem necessitar de atualização caso o ambiente seja resetado.

### Dependência de sessão
Módulos como Carrinho, Wishlist e Checkout dependem de autenticação prévia. Qualquer instabilidade no fluxo de login impacta indiretamente todos esses módulos — reforçando a classificação de **Autenticação** como módulo de alta prioridade.

### Formulário de contato e newsletter
Foram identificados como módulos de baixo risco e baixa complexidade. Mantidos no escopo para cobertura exploratória, mas sem prioridade de automação na V1 do projeto.

---


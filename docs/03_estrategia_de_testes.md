# 03 — Estratégia de Testes

> **Autor:** Olavo Vianei
> **Criado em:** 03/2026
> **Versão:** 1.1
> **Projeto:** qa-nopcommerce

---

## Objetivo

Este documento define a estratégia de testes do projeto **qa-nopcommerce**, com foco em garantir cobertura funcional, rastreabilidade, priorização por risco e demonstração prática de competências em QA manual e QA técnico.

A estratégia foi elaborada para orientar:

- o planejamento dos testes manuais
- a criação de cenários e casos de teste
- a execução dos fluxos prioritários
- a evolução para automação E2E e testes de API
- a organização das evidências e entregas no GitHub

> Para detalhes sobre a aplicação testada, consulte [01 — Visão Geral do Sistema](./01_visao_geral_do_sistema.md).
> Para o escopo detalhado do projeto, consulte [02 — Escopo e Objetivos](./02_escopo_e_objetivos.md).

---

## Visão Geral da Estratégia

| Aspecto                 | Definição                                              |
|-------------------------|--------------------------------------------------------|
| Sistema sob teste       | nopCommerce Demo Store                                 |
| Tipos de teste          | Funcional, negativo, exploratório, regressão, API, E2E |
| Ferramenta de automação | Cypress                                                |
| Gestão de dados         | Faker.js                                               |
| Relatórios              | Allure Report                                          |
| CI/CD                   | GitHub Actions                                         |
| Abordagem               | Baseada em risco com 3 camadas progressivas            |
| Ambiente                | Demo público compartilhado                             |

---

## Objetivos da Estratégia de Testes

Os principais objetivos desta estratégia são:

- validar os fluxos críticos do sistema
- identificar falhas funcionais antes da automação
- priorizar testes com base em impacto e risco
- garantir documentação clara e reutilizável
- estruturar uma base sólida para automação futura
- demonstrar organização e pensamento analítico de QA em um portfólio profissional

---

## Escopo de Testes

### Em escopo

| Módulo                 | Cobertura prevista                                  | Prioridade |
|------------------------|-----------------------------------------------------|------------|
| Autenticação           | Registro, login, logout, recuperação de senha       | Alta       |
| Catálogo               | Categorias, subcategorias, detalhes do produto      | Alta       |
| Busca                  | Busca existente, inexistente, parcial e campo vazio | Alta       |
| Carrinho               | Adição, remoção, atualização e subtotal             | Alta       |
| Wishlist               | Adição e remoção de itens                           | Média      |
| Comparação             | Adição, visualização, remoção e limpeza             | Média      |
| Checkout               | Endereço, envio, pagamento e confirmação            | Alta       |
| Minha Conta            | Dados cadastrais, pedidos e endereços               | Média      |
| API REST               | Autenticação, produtos, carrinho e pedidos          | Alta       |
| Páginas complementares | Newsletter, contact us, news/blog                   | Baixa      |

### Fora de escopo

Não fazem parte da V1 deste projeto:

- testes de performance e carga
- testes de segurança ofensiva
- testes cross-browser avançados
- testes visuais automatizados
- validação completa de responsividade em múltiplos dispositivos

---

## Abordagem de Testes

A estratégia será executada em **3 camadas complementares e progressivas**:

### Camada 1 — QA Manual

Foco em compreensão do sistema e validação funcional inicial.

Atividades previstas:
- exploração da aplicação
- mapeamento de funcionalidades
- levantamento de cenários
- escrita de casos de teste step by step
- execução manual
- registro de evidências
- reporte de bugs

### Camada 2 — QA Técnico

Foco na transformação dos fluxos mais relevantes em testes automatizados.

Atividades previstas:
- automação E2E com Cypress
- testes de API REST
- uso de massa dinâmica com Faker.js
- estruturação com Page Object Model

### Camada 3 — Portfólio Profissional

Foco em apresentação, rastreabilidade e organização do projeto no GitHub.

Atividades previstas:
- documentação técnica organizada
- README profissional com evidências visuais
- histórico de evolução do projeto via commits
- pipeline de CI/CD configurado e funcional

---

## Tipos de Teste Aplicados

### Testes funcionais
Validação do comportamento esperado das funcionalidades principais do sistema.

Exemplos:
- login com credenciais válidas
- cadastro de novo usuário
- busca de produto existente
- adição de item ao carrinho
- finalização de compra

### Testes negativos
Validação do comportamento do sistema diante de entradas inválidas ou cenários de erro.

Exemplos:
- login com senha incorreta
- busca por produto inexistente
- envio de formulário com campos obrigatórios vazios
- tentativa de checkout sem dados completos

### Testes exploratórios
Execução orientada por análise e observação para descobrir comportamentos não previstos inicialmente.

Aplicação:
- navegação livre em módulos prioritários
- análise de mensagens do sistema
- inconsistências visuais e funcionais
- comportamento entre páginas dependentes

### Testes de regressão
Reexecução dos fluxos principais para verificar se mudanças ou correções impactaram funcionalidades já validadas.

### Testes de API
Validação de endpoints relevantes da aplicação.

Cobertura planejada:
- autenticação via token
- consulta de produtos
- manipulação de carrinho
- consulta de pedidos

### Testes end-to-end automatizados
Automação dos fluxos de maior valor de negócio e maior visibilidade para o portfólio, implementados com Cypress.

---

## Técnicas de Desenho de Testes

Para criação dos cenários e casos, serão utilizadas principalmente:

- **Particionamento de equivalência** — agrupar entradas com comportamento esperado similar
- **Análise de valor limite** — testar nos limites dos intervalos válidos e inválidos
- **Teste baseado em risco** — priorizar conforme impacto e probabilidade de falha
- **Teste de fluxo principal e alternativo** — cobrir o caminho feliz e desvios esperados
- **Transição de estados** — validar comportamento entre estados do sistema quando aplicável
- **Heurísticas exploratórias** — para descoberta de falhas não previstas

Exemplos práticos:
- campo de busca com valor válido, inválido, parcial e vazio
- login com combinação correta e incorreta de credenciais
- carrinho com inclusão, remoção e atualização de quantidade
- checkout com sequência completa e interrupções em etapas críticas

---

## Níveis de Cobertura

### Cobertura mínima esperada
- 100% dos fluxos críticos executados manualmente
- cenários positivos e negativos básicos por módulo de alta prioridade
- evidências de execução registradas para todos os casos executados
- bugs encontrados documentados com reprodução clara

### Cobertura intermediária
- variações relevantes de entrada por funcionalidade
- validação de mensagens de erro e feedback do sistema
- regras de negócio principais cobertas
- regressão dos fluxos críticos após correções

### Cobertura avançada
- 100% dos fluxos críticos e de alta prioridade automatizados
- testes de API cobrindo os endpoints mapeados
- pipeline CI/CD executando com sucesso
- relatório Allure gerado e publicado

---

## Estratégia de Dados de Teste

### Testes manuais
Dados controlados em planilhas e documentação auxiliar, incluindo:
- usuários válidos e inválidos
- produtos existentes e inexistentes
- combinações para busca
- cenários de carrinho e checkout

### Testes automatizados
Massa dinâmica para evitar conflitos com o ambiente compartilhado:
- uso de **Faker.js** para geração de nomes, e-mails e endereços aleatórios
- redução de falhas por reuso de cadastro
- maior independência entre execuções

---

## Ambiente de Testes

| Campo     | Informação                       |
|-----------|----------------------------------|
| Aplicação | nopCommerce Demo Store           |
| URL       | https://demo.nopcommerce.com     |
| Tipo      | Ambiente público de demonstração |
| Acesso    | Sem restrições para navegação    |

**Observações importantes sobre o ambiente compartilhado:**
- dados podem ser alterados por outros usuários a qualquer momento
- cadastros podem conflitar se forem reutilizados
- resultados devem considerar instabilidade típica de ambientes demo

Essa característica reforça a necessidade de massa dinâmica, validações resilientes, boa documentação de pré-condições e registro claro de evidências.

---

## Critérios de Entrada e Saída

### Critérios de entrada
Os testes poderão ser iniciados quando houver:
- entendimento mínimo da funcionalidade a ser testada
- ambiente disponível para navegação
- escopo priorizado e documentado
- cenários definidos
- dados de teste preparados, quando necessário

### Critérios de saída
Uma etapa de testes será considerada concluída quando houver:
- cenários planejados executados
- evidências registradas
- bugs documentados com clareza e reprodução
- atualização do status de execução
- rastreabilidade entre documentação e resultados mantida

---

## Evidências e Rastreabilidade

### Evidências esperadas
- screenshots de execução manual
- vídeos de execução automatizada
- bug reports com passo a passo de reprodução
- planilhas de controle de execução
- relatórios de execução
- relatórios Allure

### Rastreabilidade entre artefatos

```
Funcionalidade mapeada (04_mapa_de_funcionalidades.md)
    └── Cenário de teste (06_cenarios_de_teste.md)
            └── Caso de teste (07_casos_de_teste.md)
                    └── Execução (09_relatorio_de_execucao.md)
                            ├── Evidência (evidencias/)
                            ├── Bug report (08_bug_reports.md)
                            └── Automação correspondente (automation/cypress/)
```

---

## Estratégia de Automação

A automação será incremental, baseada na relevância funcional e no valor de demonstração do portfólio.

### Prioridade 1 — Crítico
- login válido e inválido
- cadastro de novo usuário
- busca de produto existente
- adicionar produto ao carrinho
- testes de API de autenticação e produtos

### Prioridade 2 — Importante
- remover item do carrinho
- atualizar quantidade
- adicionar item à wishlist
- adicionar item à comparação
- testes de API de carrinho e pedidos

### Prioridade 3 — Complementar
- checkout completo
- formulário de contato
- newsletter

### Diretrizes técnicas
- Cypress como framework principal
- organização por módulos em `e2e/`
- Page Object Model para reutilização de seletores
- testes independentes entre si
- dados desacoplados via fixtures e Faker.js
- assertions objetivas e claras
- screenshots automáticos em falhas
- relatórios com Allure Report
- execução automatizada via GitHub Actions

---

## Riscos da Estratégia

| Risco                                        | Impacto | Mitigação                                                  |
|----------------------------------------------|---------|------------------------------------------------------------|
| Ambiente demo instável                       | Alto    | Registrar evidências e repetir execuções quando necessário |
| Dados compartilhados por terceiros           | Alto    | Utilizar massa dinâmica e validar pré-condições            |
| Alterações não controladas no ambiente       | Médio   | Atualizar documentação e adaptar testes afetados           |
| Cobertura excessiva para escopo de portfólio | Médio   | Priorizar fluxos de maior valor e impacto                  |
| Dependência entre testes automatizados       | Médio   | Manter casos independentes e dados isolados                |

---

## Entregáveis Relacionados

Esta estratégia se conecta diretamente com os seguintes artefatos do projeto:

| Documento                                                       | Relação                              |
|-----------------------------------------------------------------|--------------------------------------|
| [01 — Visão Geral do Sistema](./01_visao_geral_do_sistema.md)   | Base de contexto                     |
| [02 — Escopo e Objetivos](./02_escopo_e_objetivos.md)           | Define o que entra e o que fica fora |
| [04 — Mapa de Funcionalidades](./04_mapa_de_funcionalidades.md) | Referência de módulos e fluxos       |
| [05 — Matriz de Riscos](./05_matriz_de_riscos.md)               | Base para priorização                |
| [06 — Cenários de Teste](./06_cenarios_de_teste.md)             | Saída desta estratégia               |
| [07 — Casos de Teste](./07_casos_de_teste.md)                   | Detalhamento dos cenários            |
| [08 — Bug Reports](./08_bug_reports.md)                         | Registro de defeitos encontrados     |
| [09 — Relatório de Execução](./09_relatorio_de_execucao.md)     | Resultado da execução                |

---

## Conclusão

A estratégia de testes deste projeto foi definida para equilibrar:

- cobertura funcional relevante
- organização documental
- priorização baseada em risco
- evolução prática para automação
- apresentação profissional no GitHub

Com essa abordagem, o projeto não apenas valida a aplicação sob a ótica de QA, mas também demonstra competências importantes para o mercado: análise crítica, clareza documental, rastreabilidade, automação e visão de qualidade ponta a ponta.


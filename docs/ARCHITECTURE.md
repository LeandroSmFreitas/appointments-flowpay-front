# Decisoes Tecnicas

Este documento registra as principais decisoes de arquitetura do front-end FlowPay Operations Dashboard.

## Objetivo arquitetural

O projeto e uma SPA operacional. A prioridade e manter telas previsiveis, dados atualizados e componentes visuais simples.

As regras principais sao:

- componentes visuais nao chamam API diretamente
- services concentram HTTP
- hooks concentram estado, efeitos e acoes da feature
- models concentram contratos TypeScript
- context e usado apenas para estado realmente compartilhado
- eventos SSE notificam mudanca, mas nao substituem o endpoint fonte

## Fluxo de dados

### Dashboard

Fonte principal:

```text
GET /api/v1/dashboard/summary
```

O dashboard usa SSE apenas como gatilho de atualizacao.

Fluxo:

1. Dashboard monta.
2. Hook chama `dashboardService.getSummary()`.
3. Context global abre `EventSource`.
4. Backend envia evento operacional.
5. Context registra atividade no feed.
6. Hook do dashboard recebe revisao do evento.
7. Hook chama novamente `dashboardService.getSummary({ force: true })`.

Isso evita que o front tente reconstruir KPIs a partir de payloads parciais de eventos.

### Feed de atividades

O feed usa eventos SSE enquanto a aplicacao esta aberta.

As atividades ficam em `DashboardRealtimeContext`, nao dentro da pagina. Assim, sair do dashboard e voltar nao apaga o feed.

Normalizacao de titulos, descricoes e tipos fica em:

```text
src/utils/activityUtils.ts
```

Esse arquivo centraliza titulo, descricao e tipo de cada evento operacional.

## SSE e polling

O hook:

```text
src/hooks/useDashboardEvents.ts
```

abre conexao com:

```text
/api/v1/dashboard/events
```

Se o SSE falhar, o front entra em polling de 5 segundos.

Esse fallback nao cria dados falsos. Ele apenas dispara novas leituras dos endpoints reais.

## Cache

O cache fica em:

```text
src/services/cacheStore.ts
```

Caracteristicas:

- cache em memoria
- chave por namespace e query params
- TTL padrao de 15 segundos
- mutacoes invalidam caches relacionados
- eventos SSE e polling usam `force: true`

Chaves atuais:

- `dashboard-summary`
- `attendances`
- `agents`

Motivo:

- reduzir chamadas repetidas ao navegar entre abas
- manter dados reais recentes
- evitar mock ou fallback artificial

## Contratos runtime da API

TypeScript valida o codigo em tempo de build, mas nao valida JSON vindo da API.

Por isso os services usam:

```text
src/services/apiContracts.ts
```

Cada resposta importante passa por validação runtime antes de chegar nos hooks.

Se o backend mudar um campo critico, o front mostra erro controlado em vez de quebrar em algum JSX distante.

## Services

Services fazem quatro coisas:

1. chamam a API
2. validam o contrato
3. usam cache em GETs
4. invalidam cache em mutacoes

Exemplo:

```text
attendanceService.createAttendance()
```

invalida:

- `attendances`
- `dashboard-summary`

## Tabelas

O componente:

```text
src/components/Table
```

cuida apenas da interface comum:

- header
- botao de ordenacao
- metadados de pagina
- botoes de pagina
- acessibilidade basica com `aria-sort` e `aria-label`

A regra de ordenacao e paginação fica nos hooks das features.

Isso preserva a regra de negocio perto do dado e evita que a tabela generica conheca o shape de `Agent` ou `Attendance`.

### Paginacao remota

As telas de Atendimentos e Agentes enviam paginacao, filtros e ordenacao para o backend.

Formato dos query params:

```text
page=0
size=8
sort=createdAt,desc
status=WAITING
team=CARTOES
```

O front usa `page` iniciado em `1` na interface, mas converte para `0` ao chamar a API.

Resposta preferida do backend:

```json
{
  "content": [],
  "page": 0,
  "size": 8,
  "totalElements": 0,
  "totalPages": 0,
  "first": true,
  "last": true
}
```

Enquanto o backend ainda devolver array simples, os services adaptam a resposta legada para `PageResponse` usando os dados reais retornados. Isso e uma compatibilidade temporaria, nao mock.

Para remover essa compatibilidade e exigir somente envelope paginado:

```env
VITE_STRICT_PAGINATION=true
```

## Tratamento de erro

Existem dois tipos principais de erro:

### Erros esperados de API

Tratados pelo interceptor Axios e pelos hooks.

Exemplos:

- API offline
- timeout
- 404
- 409
- 5xx
- contrato invalido

Esses erros aparecem em notices dentro da tela.

### Erros inesperados de renderizacao

Tratados por:

```text
src/components/ErrorBoundary
```

O Error Boundary evita tela branca quando um componente quebra durante renderizacao.

## Observabilidade sem Sentry

O projeto possui um logger estruturado simples em:

```text
src/utils/logger.ts
```

Ele registra eventos em formato consistente no console:

- falhas de API
- falhas inesperadas capturadas pelo Error Boundary
- queda de SSE e entrada em polling

Nao ha envio para ferramenta externa. A intencao e centralizar logging para permitir trocar o emissor no futuro sem espalhar `console.*` pelo codigo.

## Testes

Stack:

- Vitest
- Testing Library
- jsdom
- jest-axe

Testes atuais:

- `activityUtils`
- `apiContracts`
- `cacheStore`
- `ErrorBoundary`
- `Table`
- hooks de Atendimentos e Agentes
- modal de criacao de atendimento
- DashboardRealtimeProvider recebendo evento SSE
- acessibilidade automatizada em componentes criticos

Comandos:

```bash
npm run test
npm run test:watch
```

## Acessibilidade

Melhorias aplicadas:

- botoes de acao com `aria-label`
- modal com `role="dialog"` e `aria-modal`
- tabela com `aria-sort`
- paginacao com labels de navegacao
- Error Boundary com `role="alert"`

Ainda nao existe auditoria automatizada com axe.

## Decisoes deixadas fora

### CI

Nao foi implementado por decisao de escopo.

### Redux ou state manager externo

Nao foi adicionado porque o estado compartilhado atual e pequeno e bem delimitado.

### Schema library extra

Nao foi adicionado Zod ou similar. A validacao runtime foi implementada com type guards para nao aumentar dependencia.

## Checklist tecnico local

Antes de entregar:

```bash
npm run lint
npm run test
npm run build
```

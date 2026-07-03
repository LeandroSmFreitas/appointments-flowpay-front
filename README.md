# Appointments FlowPay Operations Dashboard

SPA administrativa para monitorar e gerenciar a distribuicao de atendimentos da FlowPay em tempo real.

O projeto foi construido com React, TypeScript e Vite, seguindo uma arquitetura separada por paginas, hooks, services, models e componentes visuais. A tela principal acompanha KPIs operacionais, capacidade dos times, fila de atendimentos, agentes online e feed de atividades em tempo real via SSE.

## Sumario

- [Stack](#stack)
- [Funcionalidades](#funcionalidades)
- [Requisitos](#requisitos)
- [Como rodar em desenvolvimento](#como-rodar-em-desenvolvimento)
- [Variaveis de ambiente](#variaveis-de-ambiente)
- [Scripts disponiveis](#scripts-disponiveis)
- [Rotas da aplicacao](#rotas-da-aplicacao)
- [Integracao com API](#integracao-com-api)
- [Eventos em tempo real SSE](#eventos-em-tempo-real-sse)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Padroes de arquitetura](#padroes-de-arquitetura)
- [Build de producao](#build-de-producao)
- [Troubleshooting](#troubleshooting)

## Stack

- React 19
- TypeScript com strict mode
- Vite
- React Router DOM
- Styled-components
- React Hook Form
- Yup
- Axios
- Lucide React
- Recharts
- ESLint

## Funcionalidades

### Dashboard

- KPIs de atendimentos em andamento, fila, finalizados no dia e agentes online.
- Cards por time operacional:
  - Cartoes
  - Emprestimos
  - Outros Assuntos
- Indicadores de capacidade por time.
- Grafico de evolucao da fila baseado nas leituras reais do endpoint de resumo.
- Grafico donut de capacidade geral usada e disponivel.
- Feed de atividades recentes vindo do backend ou de eventos SSE.
- Atualizacao automatica via SSE com fallback tecnico para polling quando a conexao de eventos falhar.

### Atendimentos

- Listagem de atendimentos.
- Filtro por status.
- Filtro por time.
- Criacao de atendimento usando `POST /api/v1/attendances`.
- Finalizacao de atendimento em andamento.
- Cancelamento de atendimento aguardando ou em andamento.
- Badges de status.
- Estados de loading, erro e vazio.

### Agentes

- Listagem de agentes.
- Criacao de agente.
- Alteracao de status:
  - ONLINE
  - PAUSED
  - OFFLINE
- Exibicao de carga por agente usando `activeCount`.
- Capacidade maxima fixa por agente: `3`.

## Requisitos

Antes de rodar o projeto, tenha instalado:

- Node.js em versao atual compativel com Vite
- npm
- Backend da FlowPay rodando localmente ou em uma URL acessivel

Para conferir se Node e npm estao disponiveis:

```bash
node -v
npm -v
```

## Como rodar em desenvolvimento

1. Instale as dependencias:

```bash
npm install
```

2. Crie o arquivo de ambiente local a partir do exemplo:

```bash
copy .env.example .env
```

No PowerShell, tambem pode usar:

```powershell
Copy-Item .env.example .env
```

3. Confira a URL da API no arquivo `.env`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

5. Acesse no navegador:

```text
http://127.0.0.1:5173
```

A rota inicial redireciona automaticamente para:

```text
http://127.0.0.1:5173/dashboard
```

## Variaveis de ambiente

O projeto usa variaveis do Vite. Toda variavel usada no front precisa comecar com `VITE_`.

| Variavel | Obrigatoria | Padrao | Descricao |
| --- | --- | --- | --- |
| `VITE_API_BASE_URL` | Sim | `http://localhost:8080` | URL base do backend FlowPay |

Exemplo:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Se o backend estiver em outra porta ou ambiente:

```env
VITE_API_BASE_URL=https://api.suaempresa.com
```

Depois de mudar o `.env`, reinicie o `npm run dev`.

## Scripts disponiveis

### Desenvolvimento

```bash
npm run dev
```

Sobe o servidor Vite com hot reload.

### Build

```bash
npm run build
```

Executa checagem TypeScript e gera os arquivos de producao na pasta `dist/`.

### Lint

```bash
npm run lint
```

Executa ESLint no projeto.

### Preview

```bash
npm run preview
```

Serve localmente o build gerado em `dist/`.

Use depois de rodar:

```bash
npm run build
npm run preview
```

## Rotas da aplicacao

| Rota | Tela | Descricao |
| --- | --- | --- |
| `/` | Redirect | Redireciona para `/dashboard` |
| `/dashboard` | Dashboard | Visao operacional em tempo real |
| `/attendances` | Atendimentos | Gestao da fila e atendimentos |
| `/agents` | Agentes | Gestao de agentes e status |

Nao existe fluxo de login neste momento.

## Integracao com API

Todas as chamadas HTTP ficam centralizadas em `src/services`.

### Base URL

Configurada em:

```text
src/services/api.ts
```

A URL base vem de:

```env
VITE_API_BASE_URL
```

### Endpoints utilizados

#### Dashboard summary

```http
GET /api/v1/dashboard/summary
```

Resposta esperada:

```json
{
  "totalWaiting": 10,
  "totalInProgress": 21,
  "totalFinishedToday": 140,
  "teams": [
    {
      "team": "CARTOES",
      "waiting": 4,
      "inProgress": 9,
      "finishedToday": 70,
      "agentsOnline": 5,
      "totalCapacity": 15,
      "usedCapacity": 9,
      "availableCapacity": 6
    }
  ]
}
```

#### Atividades recentes

```http
GET /api/v1/dashboard/activities
```

Usado para preencher o feed "Atividades recentes" ao entrar no dashboard.

Resposta esperada:

```json
[
  {
    "id": "activity-1",
    "type": "ATTENDANCE_CREATED",
    "title": "Atendimento criado",
    "description": "Atendimento criado e colocado na fila",
    "createdAt": "2026-07-03T16:45:00Z"
  }
]
```

Se `description` nao vier, o front monta uma descricao padrao conforme o tipo do evento.

#### Eventos do dashboard

```http
GET /api/v1/dashboard/events
```

Conexao SSE usando `EventSource`.

#### Listar atendimentos

```http
GET /api/v1/attendances
```

#### Criar atendimento

```http
POST /api/v1/attendances
```

Payload:

```json
{
  "customerName": "Bruno",
  "subject": "Problemas com cartao"
}
```

#### Finalizar atendimento

```http
PATCH /api/v1/attendances/{id}/finish
```

#### Cancelar atendimento

```http
PATCH /api/v1/attendances/{id}/cancel
```

#### Listar agentes

```http
GET /api/v1/agents
```

O front espera que cada agente venha com `activeCount`.

Exemplo:

```json
{
  "id": "agent-1",
  "name": "Ana Souza",
  "email": "ana@flowpay.com",
  "team": "CARTOES",
  "status": "ONLINE",
  "activeCount": 2,
  "createdAt": "2026-07-03T16:45:00Z"
}
```

A capacidade maxima exibida no front e fixa em `3`.

#### Criar agente

```http
POST /api/v1/agents
```

Payload:

```json
{
  "name": "Ana Souza",
  "email": "ana@flowpay.com",
  "team": "CARTOES"
}
```

#### Alterar status do agente

```http
PATCH /api/v1/agents/{id}/status
```

Payload:

```json
{
  "status": "ONLINE"
}
```

## Eventos em tempo real SSE

O dashboard abre uma conexao com:

```http
GET /api/v1/dashboard/events
```

Eventos esperados:

- `ATTENDANCE_CREATED`
- `ATTENDANCE_ASSIGNED`
- `ATTENDANCE_FINISHED`
- `ATTENDANCE_CANCELLED`
- `AGENT_STATUS_CHANGED`
- `CONNECTED`

### Comportamento esperado

1. O dashboard carrega.
2. O front chama `GET /api/v1/dashboard/summary`.
3. O front carrega atividades recentes com `GET /api/v1/dashboard/activities`.
4. O front abre `EventSource` em `/api/v1/dashboard/events`.
5. Quando chega um evento relevante, o evento funciona como notificacao de mudanca.
6. O front chama novamente `GET /api/v1/dashboard/summary`.
7. KPIs, cards, graficos, tabelas e feed sao atualizados.

O evento SSE nao deve ser tratado como fonte principal dos dados agregados. A fonte principal do dashboard continua sendo:

```http
GET /api/v1/dashboard/summary
```

### Evento CONNECTED

O backend pode enviar um evento inicial:

```json
{
  "type": "CONNECTED",
  "createdAt": "2026-07-03T16:45:00Z"
}
```

Esse evento apenas confirma a conexao e nao dispara atualizacao de dashboard.

### Heartbeat

O backend pode enviar heartbeat como comentario SSE.

Exemplo:

```text
: heartbeat
```

Comentarios SSE mantem a conexao viva e nao criam atividade no feed.

### Fallback para polling

Se a conexao SSE falhar, o front mantem polling a cada 5 segundos.

Esse fallback e apenas tecnico para atualizacao. O projeto nao cria dados mockados quando a API falha.

## Estrutura de pastas

```text
src/
  components/
    AgentWorkload/
    CapacityBar/
    EmptyState/
    Header/
    KpiCard/
    LoadingState/
    Sidebar/
    StatusBadge/
    Table/
    TeamCard/

  config/
    theme.ts

  context/
    AppShellContext.tsx
    DashboardRealtimeContext.tsx
    useAppShell.ts
    useDashboardRealtime.ts

  hooks/
    useDashboardEvents.ts

  models/
    enum/
      agentStatus.ts
      attendanceStatus.ts
      teamName.ts
    interface/
      agent/
      attendance/
      dashboard/

  pages/
    Agents/
      components/
      hooks/
      index.tsx
      styles.ts
    Attendances/
      components/
      hooks/
      index.tsx
      styles.ts
    Dashboard/
      components/
      hooks/
      index.tsx
      styles.ts

  routes/
    AppRoutes.tsx

  services/
    api.ts
    agentService.ts
    attendanceService.ts
    dashboardEventService.ts
    dashboardService.ts
    serviceTypes.ts

  utils/
    dateUtils.ts
    numberUtils.ts
    statusUtils.ts

  App.tsx
  App.styles.ts
  index.css
  main.tsx
```

## Padroes de arquitetura

### Pages

As paginas ficam em `src/pages`.

Cada pagina organiza:

- `index.tsx`: JSX declarativo da tela.
- `styles.ts`: styled-components da tela.
- `hooks/`: regras de estado, efeitos e chamadas de API.
- `components/`: componentes especificos da feature.

### Hooks

Hooks centralizam:

- loading
- error
- estado local da feature
- chamadas de service
- efeitos de SSE/polling
- regras de filtro e acoes

Componentes visuais nao chamam API diretamente.

### Services

Services centralizam chamadas HTTP:

- `attendanceService`
- `agentService`
- `dashboardService`
- `dashboardEventService`

### Models

Interfaces e enums ficam centralizados em `src/models`.

Isso evita contratos espalhados pelo JSX.

### Context

Context e usado apenas para estado compartilhado real:

- estado do layout/sidebar
- conexao global de realtime do dashboard

O feed de atividades recentes fica no contexto de realtime para nao ser perdido ao sair e voltar do dashboard.

## Status e enums

### AttendanceStatus

- `WAITING`
- `IN_PROGRESS`
- `FINISHED`
- `CANCELLED`

### AgentStatus

- `ONLINE`
- `PAUSED`
- `OFFLINE`

### TeamName

- `CARTOES`
- `EMPRESTIMOS`
- `OUTROS`

## Build de producao

Gere o build:

```bash
npm run build
```

Os arquivos finais ficam em:

```text
dist/
```

Para testar localmente:

```bash
npm run preview
```

## Checklist antes de abrir PR ou publicar

Rode:

```bash
npm run lint
npm run build
```

Verifique manualmente:

- Dashboard carrega com backend online.
- SSE conecta em `/api/v1/dashboard/events`.
- Feed mostra atividades reais.
- Criacao de atendimento chama `POST /api/v1/attendances`.
- Criacao de agente chama `POST /api/v1/agents`.
- Alteracao de status do agente funciona.
- Finalizar e cancelar atendimento funcionam.
- Layout responde bem em desktop, tablet e mobile.

## Troubleshooting

### A tela mostra erro de API

Confira se o backend esta rodando e se a variavel esta correta:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Depois reinicie:

```bash
npm run dev
```

### SSE nao conecta

Confira:

- endpoint `/api/v1/dashboard/events` existe
- backend responde com `Content-Type: text/event-stream`
- conexao nao esta sendo bloqueada por CORS
- backend envia evento inicial `CONNECTED` ou heartbeat periodico

### CORS

Durante desenvolvimento, o backend precisa permitir a origem do Vite:

```text
http://localhost:5173
http://127.0.0.1:5173
```

### Porta 5173 ocupada

O Vite pode escolher outra porta automaticamente. Observe a URL impressa no terminal apos:

```bash
npm run dev
```

### Build falha por erro de TypeScript

Rode:

```bash
npm run build
```

Leia o arquivo e linha informados pelo TypeScript. O projeto esta em strict mode, entao campos ausentes em contratos de API normalmente aparecem no build.

### Caracteres estranhos no terminal

Se o terminal exibir caracteres quebrados, confira a codificacao do terminal/editor. O projeto deve ser salvo em UTF-8.

## Observacoes importantes

- O front nao possui login neste momento.
- O front nao usa mock de dados.
- Se a API estiver offline, a tela exibe erro amigavel e preserva o layout.
- O SSE funciona como notificacao de mudanca, nao como fonte principal dos dados agregados.
- A fonte principal do dashboard e sempre `GET /api/v1/dashboard/summary`.
- A capacidade maxima por agente e fixa em `3`.

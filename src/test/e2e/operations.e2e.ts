import { expect, type Page, test } from '@playwright/test'

interface TeamSummaryFixture {
  agentsOnline: number
  availableCapacity: number
  finishedToday: number
  inProgress: number
  team: 'CARTOES' | 'EMPRESTIMOS' | 'OUTROS'
  totalCapacity: number
  usedCapacity: number
  waiting: number
}

interface DashboardSummaryFixture {
  teams: TeamSummaryFixture[]
  totalFinishedToday: number
  totalInProgress: number
  totalWaiting: number
}

interface AttendanceFixture {
  createdAt: string
  customerName: string
  id: string
  status: 'WAITING' | 'IN_PROGRESS' | 'FINISHED' | 'CANCELLED'
  subject: string
  team: 'CARTOES' | 'EMPRESTIMOS' | 'OUTROS'
  updatedAt: string
}

interface AgentFixture {
  activeCount: number
  createdAt: string
  email: string
  id: string
  name: string
  status: 'ONLINE' | 'PAUSED' | 'OFFLINE'
  team: 'CARTOES' | 'EMPRESTIMOS' | 'OUTROS'
}

const createdAt = '2026-07-03T20:07:24.957875Z'

const createDashboardSummary = (waiting: number): DashboardSummaryFixture => ({
  totalWaiting: waiting,
  totalInProgress: 21,
  totalFinishedToday: 140,
  teams: [
    {
      team: 'CARTOES',
      waiting,
      inProgress: 9,
      finishedToday: 70,
      agentsOnline: 5,
      totalCapacity: 15,
      usedCapacity: 9,
      availableCapacity: 6,
    },
    {
      team: 'EMPRESTIMOS',
      waiting: 2,
      inProgress: 8,
      finishedToday: 42,
      agentsOnline: 4,
      totalCapacity: 12,
      usedCapacity: 8,
      availableCapacity: 4,
    },
    {
      team: 'OUTROS',
      waiting: 1,
      inProgress: 4,
      finishedToday: 28,
      agentsOnline: 2,
      totalCapacity: 6,
      usedCapacity: 4,
      availableCapacity: 2,
    },
  ],
})

const createPage = <TData>(content: TData[]) => ({
  content,
  first: true,
  last: true,
  number: 0,
  size: 8,
  totalElements: content.length,
  totalPages: content.length > 0 ? 1 : 0,
})

const installEventSourceMock = async (page: Page): Promise<void> => {
  await page.addInitScript({
    content: `
      (() => {
        const sources = [];

        class MockEventSource extends EventTarget {
          constructor(url) {
            super();
            this.url = String(url);
            this.readyState = 0;
            this.onopen = null;
            this.onmessage = null;
            this.onerror = null;
            sources.push(this);

            window.setTimeout(() => {
              this.readyState = 1;
              const openEvent = new Event('open');
              const messageEvent = new MessageEvent('message', {
                data: JSON.stringify({ type: 'CONNECTED', createdAt: new Date().toISOString() }),
              });

              this.onopen?.(openEvent);
              this.dispatchEvent(openEvent);
              this.onmessage?.(messageEvent);
              this.dispatchEvent(messageEvent);
            }, 0);
          }

          close() {
            this.readyState = 2;
          }
        }

        MockEventSource.CONNECTING = 0;
        MockEventSource.OPEN = 1;
        MockEventSource.CLOSED = 2;

        window.EventSource = MockEventSource;
        window.__emitDashboardEvent = (type, payload = {}) => {
          const data = JSON.stringify({ ...payload, type });

          sources.forEach((source) => {
            source.dispatchEvent(new MessageEvent(type, { data }));
          });
        };
      })();
    `,
  })
}

const emitDashboardEvent = async (
  page: Page,
  type:
    | 'ATTENDANCE_CREATED'
    | 'ATTENDANCE_ASSIGNED'
    | 'ATTENDANCE_FINISHED'
    | 'ATTENDANCE_CANCELLED'
    | 'AGENT_STATUS_CHANGED',
): Promise<void> => {
  await page.evaluate((eventType) => {
    const eventWindow = window as typeof window & {
      __emitDashboardEvent?: (
        type: string,
        payload?: Record<string, string>,
      ) => void
    }

    eventWindow.__emitDashboardEvent?.(eventType, {
      id: `event-${eventType}`,
      createdAt: new Date().toISOString(),
    })
  }, type)
}

test.beforeEach(async ({ page }) => {
  await installEventSourceMock(page)
})

test('atualiza KPIs e feed do dashboard quando chega evento SSE', async ({
  page,
}) => {
  let shouldReturnUpdatedSummary = false

  await page.route('**/api/v1/dashboard/summary', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(
        shouldReturnUpdatedSummary
          ? createDashboardSummary(11)
          : createDashboardSummary(10),
      ),
    })
  })

  await page.goto('/dashboard')

  const queueCard = page.locator('article').filter({ hasText: 'Na fila' })

  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  await expect(queueCard.getByText('10')).toBeVisible()

  shouldReturnUpdatedSummary = true
  await emitDashboardEvent(page, 'ATTENDANCE_CREATED')

  await expect(
    page.getByText('Atendimento criado e colocado na fila'),
  ).toBeVisible()
  await expect(queueCard.getByText('11')).toBeVisible()
})

test('cria atendimento e atualiza a tabela com resposta do backend', async ({
  page,
}) => {
  const attendances: AttendanceFixture[] = []
  let createdPayload: { customerName: string; subject: string } | null = null

  await page.route('**/api/v1/attendances**', async (route) => {
    const request = route.request()

    if (request.method() === 'POST') {
      createdPayload = request.postDataJSON() as {
        customerName: string
        subject: string
      }
      const createdAttendance: AttendanceFixture = {
        id: 'attendance-1',
        customerName: createdPayload.customerName,
        subject: createdPayload.subject,
        team: 'OUTROS',
        status: 'WAITING',
        createdAt,
        updatedAt: createdAt,
      }

      attendances.unshift(createdAttendance)

      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify(createdAttendance),
      })

      return
    }

    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(createPage(attendances)),
    })
  })

  await page.goto('/attendances')
  await page
    .locator('header')
    .getByRole('button', { name: 'Criar atendimento' })
    .click()
  await page.getByLabel('Cliente').fill('Bruno')
  await page.getByLabel('Assunto').fill('Problemas com cartão')
  await page
    .getByRole('dialog', { name: 'Criar atendimento' })
    .getByRole('button', { name: 'Criar atendimento' })
    .click()

  await expect(
    page.getByRole('cell', { exact: true, name: 'Bruno' }),
  ).toBeVisible()
  expect(createdPayload).toEqual({
    customerName: 'Bruno',
    subject: 'Problemas com cartão',
  })
})

test('exibe carga do agente e altera status pela API', async ({ page }) => {
  const agents: AgentFixture[] = [
    {
      id: 'agent-1',
      name: 'Ana Silva',
      email: 'ana@flowpay.com',
      team: 'CARTOES',
      status: 'ONLINE',
      activeCount: 2,
      createdAt,
    },
  ]

  await page.route('**/api/v1/agents**', async (route) => {
    const request = route.request()

    if (request.method() === 'PATCH') {
      const payload = request.postDataJSON() as { status: AgentFixture['status'] }
      agents[0] = { ...agents[0], status: payload.status }

      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify(agents[0]),
      })

      return
    }

    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(createPage(agents)),
    })
  })

  await page.goto('/agents')

  const agentRow = page.getByRole('row').filter({ hasText: 'Ana Silva' })

  await expect(agentRow).toBeVisible()
  await expect(agentRow.getByText('2/3')).toBeVisible()

  await agentRow
    .getByRole('button', { name: 'Alterar Ana Silva para Pausado' })
    .click()

  await expect(page.getByLabel('Status: Pausado')).toBeVisible()
})

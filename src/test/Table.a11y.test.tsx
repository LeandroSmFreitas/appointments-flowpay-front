import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import type { ReactElement } from 'react'
import { ThemeProvider } from 'styled-components'
import { describe, expect, it } from 'vitest'
import { Table, type TableColumn } from '../components/Table'
import { theme } from '../config/theme'

expect.extend(toHaveNoViolations)

const columns: TableColumn[] = [
  { key: 'name', label: 'Agente', sortable: true },
  { key: 'status', label: 'Status' },
]

const renderWithTheme = (element: ReactElement) =>
  render(<ThemeProvider theme={theme}>{element}</ThemeProvider>)

describe('Table accessibility', () => {
  it('has no automated accessibility violations in the base table state', async () => {
    const { container } = renderWithTheme(
      <Table
        columns={columns}
        pagination={{
          page: 1,
          pageSize: 8,
          totalItems: 1,
          onPageChange: () => undefined,
        }}
        sort={{ key: 'name', direction: 'asc' }}
        onSort={() => undefined}
      >
        <tr>
          <td>Ana</td>
          <td>ONLINE</td>
        </tr>
      </Table>,
    )

    await expect(axe(container)).resolves.toHaveNoViolations()
  })
})

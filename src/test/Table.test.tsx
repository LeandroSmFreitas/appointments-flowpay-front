import { fireEvent, render, screen } from '@testing-library/react'
import type { ReactElement } from 'react'
import { ThemeProvider } from 'styled-components'
import { describe, expect, it, vi } from 'vitest'
import { Table, type TableColumn } from '../components/Table'
import { theme } from '../config/theme'

const columns: TableColumn[] = [
  { key: 'name', label: 'Agente', sortable: true },
  { key: 'status', label: 'Status' },
]

const renderWithTheme = (element: ReactElement) =>
  render(<ThemeProvider theme={theme}>{element}</ThemeProvider>)

describe('Table', () => {
  it('notifies sortable column changes', () => {
    const onSort = vi.fn()

    renderWithTheme(
      <Table
        columns={columns}
        onSort={onSort}
        sort={{ key: 'name', direction: 'asc' }}
      >
        <tr>
          <td>Ana</td>
          <td>ONLINE</td>
        </tr>
      </Table>,
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Ordenar Agente em ordem decrescente',
      }),
    )

    expect(onSort).toHaveBeenCalledWith('name')
  })

  it('renders pagination metadata and actions', () => {
    const onPageChange = vi.fn()

    renderWithTheme(
      <Table
        columns={columns}
        pagination={{
          page: 1,
          pageSize: 8,
          totalItems: 10,
          onPageChange,
        }}
      >
        <tr>
          <td>Ana</td>
          <td>ONLINE</td>
        </tr>
      </Table>,
    )

    expect(screen.getByText('Mostrando 1-8 de 10')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Próxima página' }))

    expect(onPageChange).toHaveBeenCalledWith(2)
  })
})

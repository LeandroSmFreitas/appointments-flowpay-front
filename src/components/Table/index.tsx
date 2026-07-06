import { ArrowDownUp, ChevronLeft, ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import type { SortState } from '../../utils/tableUtils'
import { getPageCount } from '../../utils/tableUtils'
import * as S from './styles'

export interface TableColumn {
  key: string
  label: string
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
}

interface TablePagination {
  page: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
}

interface TableProps {
  caption?: string
  columns: TableColumn[]
  children: ReactNode
  onSort?: (key: string) => void
  pagination?: TablePagination
  sort?: SortState
}

const getAriaSort = (
  column: TableColumn,
  sort?: SortState,
): 'ascending' | 'descending' | 'none' => {
  if (!column.sortable || sort?.key !== column.key) {
    return 'none'
  }

  return sort.direction === 'asc' ? 'ascending' : 'descending'
}

const getSortButtonLabel = (column: TableColumn, sort?: SortState): string => {
  if (sort?.key !== column.key) {
    return `Ordenar por ${column.label}`
  }

  return sort.direction === 'asc'
    ? `Ordenar ${column.label} em ordem decrescente`
    : `Ordenar ${column.label} em ordem crescente`
}

export function Table({
  caption,
  columns,
  children,
  onSort,
  pagination,
  sort,
}: TableProps) {
  const pageCount = pagination
    ? getPageCount(pagination.totalItems, pagination.pageSize)
    : 1
  const startItem = pagination
    ? (pagination.page - 1) * pagination.pageSize + 1
    : 0
  const endItem = pagination
    ? Math.min(pagination.page * pagination.pageSize, pagination.totalItems)
    : 0

  return (
    <S.TableShell>
      <S.TableScroll>
        <S.Table>
          {caption && <S.Caption>{caption}</S.Caption>}
          <thead>
            <tr>
              {columns.map((column) => (
                <S.Th
                  key={column.key}
                  $align={column.align ?? 'left'}
                  aria-sort={getAriaSort(column, sort)}
                  scope="col"
                >
                  {column.sortable && onSort ? (
                    <S.SortButton
                      type="button"
                      onClick={() => onSort(column.key)}
                      $align={column.align ?? 'left'}
                      aria-label={getSortButtonLabel(column, sort)}
                    >
                      {column.label}
                      <ArrowDownUp size={13} />
                    </S.SortButton>
                  ) : (
                    column.label
                  )}
                </S.Th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </S.Table>
      </S.TableScroll>

      {pagination && pagination.totalItems > 0 && (
        <S.Pagination aria-label="Paginação da tabela">
          <span aria-live="polite">
            Mostrando {startItem}-{endItem} de {pagination.totalItems}
          </span>
          <S.PaginationActions>
            <S.PageButton
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              aria-label="Página anterior"
            >
              <ChevronLeft size={16} />
            </S.PageButton>
            <strong aria-label={`Página ${pagination.page} de ${pageCount}`}>
              {pagination.page}/{pageCount}
            </strong>
            <S.PageButton
              type="button"
              disabled={pagination.page >= pageCount}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              aria-label="Próxima página"
            >
              <ChevronRight size={16} />
            </S.PageButton>
          </S.PaginationActions>
        </S.Pagination>
      )}
    </S.TableShell>
  )
}

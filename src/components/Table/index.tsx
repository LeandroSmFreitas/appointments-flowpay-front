import type { ReactNode } from 'react'
import * as S from './styles'

export interface TableColumn {
  key: string
  label: string
  align?: 'left' | 'center' | 'right'
}

interface TableProps {
  columns: TableColumn[]
  children: ReactNode
}

export function Table({ columns, children }: TableProps) {
  return (
    <S.TableScroll>
      <S.Table>
        <thead>
          <tr>
            {columns.map((column) => (
              <S.Th key={column.key} $align={column.align ?? 'left'}>
                {column.label}
              </S.Th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </S.Table>
    </S.TableScroll>
  )
}

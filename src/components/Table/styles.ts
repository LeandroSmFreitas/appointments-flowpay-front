import styled from 'styled-components'

export const TableShell = styled.div`
  display: grid;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  background: ${({ theme }) => theme.colors.cardLight};
  box-shadow: ${({ theme }) => theme.shadows.card};
`

export const TableScroll = styled.div`
  width: 100%;
  overflow-x: auto;
`

export const Table = styled.table`
  width: 100%;
  min-width: 860px;
  border-collapse: collapse;

  tbody tr {
    transition: background 160ms ease;
  }

  tbody tr:hover {
    background: #fafbff;
  }

  td {
    padding: 16px;
    border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
    color: #3f4757;
    font-size: 0.88rem;
    vertical-align: middle;
  }
`

export const Caption = styled.caption`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
`

export const Th = styled.th<{ $align: 'left' | 'center' | 'right' }>`
  padding: 14px 16px;
  color: #a1abc0;
  font-size: 0.72rem;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  letter-spacing: 0;
  text-align: ${({ $align }) => $align};
  text-transform: uppercase;
  background: ${({ theme }) => theme.colors.cardLight};
`

export const SortButton = styled.button<{
  $align: 'left' | 'center' | 'right'
}>`
  display: inline-flex;
  width: 100%;
  align-items: center;
  justify-content: ${({ $align }) =>
    $align === 'right'
      ? 'flex-end'
      : $align === 'center'
        ? 'center'
        : 'flex-start'};
  gap: 6px;
  color: inherit;
  background: transparent;
  border: 0;
  font: inherit;
  text-align: inherit;
  text-transform: inherit;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`

export const Pagination = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};

  span {
    color: ${({ theme }) => theme.colors.textSubtle};
    font-size: 0.78rem;
    font-weight: 700;
  }

  @media (max-width: 560px) {
    align-items: flex-start;
    flex-direction: column;
  }
`

export const PaginationActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  strong {
    min-width: 44px;
    color: ${({ theme }) => theme.colors.textDark};
    font-size: 0.82rem;
    text-align: center;
  }
`

export const PageButton = styled.button`
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 10px;
  color: ${({ theme }) => theme.colors.textSubtle};
  background: #f8faff;
  border: 1px solid #e8edf6;

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors.primary};
    border-color: #d9ceff;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
`

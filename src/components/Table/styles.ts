import styled from 'styled-components'

export const TableScroll = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #edf1f7;
  background: #ffffff;
  box-shadow: 0 18px 40px rgba(86, 101, 126, 0.08);
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
    border-top: 1px solid #edf1f7;
    color: #3f4757;
    font-size: 0.88rem;
    vertical-align: middle;
  }
`

export const Th = styled.th<{ $align: 'left' | 'center' | 'right' }>`
  padding: 14px 16px;
  color: #a1abc0;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0;
  text-align: ${({ $align }) => $align};
  text-transform: uppercase;
  background: #ffffff;
`

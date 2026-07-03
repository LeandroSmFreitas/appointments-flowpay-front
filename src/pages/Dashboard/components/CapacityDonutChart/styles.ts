import styled from 'styled-components'

export const ChartCard = styled.section`
  display: grid;
  min-height: 360px;
  gap: 16px;
  padding: 20px;
  border-radius: 18px;
  border: 1px solid #edf1f7;
  background: #ffffff;
  box-shadow: 0 18px 40px rgba(86, 101, 126, 0.08);
`

export const ChartHeader = styled.header`
  display: grid;
  gap: 4px;

  span {
    color: #96a0b5;
    font-size: 0.78rem;
    font-weight: 800;
  }

  strong {
    color: #111827;
    font-size: 1.08rem;
  }
`

export const DonutArea = styled.div`
  position: relative;
  height: 212px;
`

export const CenterLabel = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  gap: 2px;
  text-align: center;
  pointer-events: none;

  strong {
    color: #111827;
    font-size: 2.25rem;
    line-height: 1;
  }

  span {
    color: #8490a8;
    font-size: 0.82rem;
    font-weight: 700;
  }
`

export const Legend = styled.div`
  display: grid;
  gap: 10px;
`

export const LegendItem = styled.div<{ $color: string }>`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 10px;
  color: #3f4757;
  font-size: 0.86rem;

  span {
    width: 9px;
    height: 9px;
    border-radius: 999px;
    background: ${({ $color }) => $color};
    box-shadow: 0 0 14px ${({ $color }) => $color};
  }

  strong {
    color: #111827;
  }
`

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

export const ChartBody = styled.div`
  height: 280px;
  min-width: 0;
`

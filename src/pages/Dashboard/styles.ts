import styled from 'styled-components'

export const PageStack = styled.div`
  display: grid;
  gap: 22px;
`

export const KpiGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 1180px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

export const TeamGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
  }
`

export const AnalyticsGrid = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(280px, 0.75fr) minmax(300px, 0.85fr);
  gap: 18px;
  align-items: stretch;

  @media (max-width: 1280px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    aside {
      grid-column: 1 / -1;
    }
  }

  @media (max-width: 860px) {
    grid-template-columns: 1fr;

    aside {
      grid-column: auto;
    }
  }
`

export const Notice = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
  padding: 12px 14px;
  border-radius: 14px;
  color: #92400e;
  background: #fff8e8;
  border: 1px solid #fde4ad;

  span {
    color: #92400e;
    font-size: 0.86rem;
    font-weight: 700;
  }

  strong {
    color: #b45309;
    font-size: 0.78rem;
  }
`

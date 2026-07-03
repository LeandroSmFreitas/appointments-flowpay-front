import styled from 'styled-components'

export const Shell = styled.div`
  min-height: 100vh;
  background:
    radial-gradient(circle at 78% 4%, rgba(99, 102, 241, 0.08), transparent 28%),
    linear-gradient(180deg, #f9fbff 0%, #f4f7fd 100%);
  color: #111827;
`

export const Main = styled.main`
  min-height: 100vh;
  padding-left: 244px;

  @media (max-width: 1024px) {
    padding-left: 0;
  }
`

export const Content = styled.div`
  width: min(1440px, 100%);
  margin: 0 auto;
  padding: 28px 40px 44px;

  @media (max-width: 720px) {
    padding: 18px 16px 28px;
  }
`

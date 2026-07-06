import styled from 'styled-components'

export const SkipLink = styled.a`
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 100;
  transform: translateY(-140%);
  border-radius: 8px;
  padding: 10px 14px;
  color: #ffffff;
  background: #111827;
  font-size: 0.86rem;
  font-weight: 800;
  box-shadow: 0 12px 32px rgba(17, 24, 39, 0.22);
  transition: transform 160ms ease;

  &:focus-visible {
    transform: translateY(0);
  }
`

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

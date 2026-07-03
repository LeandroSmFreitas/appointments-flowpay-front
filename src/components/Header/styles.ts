import styled from 'styled-components'

export const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;

  @media (max-width: 760px) {
    display: grid;
    grid-template-columns: auto 1fr;
  }
`

export const MobileMenuButton = styled.button`
  display: none;
  width: 42px;
  height: 42px;
  place-items: center;
  border: 1px solid #edf1f7;
  border-radius: 12px;
  color: #111827;
  background: #ffffff;

  @media (max-width: 1024px) {
    display: grid;
  }
`

export const TitleGroup = styled.div`
  display: grid;
  gap: 8px;

  h1 {
    max-width: 780px;
    margin: 0;
    color: #111827;
    font-size: clamp(1.28rem, 3vw, 1.65rem);
    line-height: 1.12;
    letter-spacing: 0;
  }

  p {
    margin: 0;
    color: #8490a8;
    font-size: 0.9rem;
  }
`

export const LiveBadge = styled.span`
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: 7px;
  padding: 6px 9px;
  border-radius: 999px;
  color: #16a673;
  background: #eafff5;
  border: 1px solid #c9f5df;
  font-size: 0.76rem;
  font-weight: 800;
`

export const RightSide = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 760px) {
    grid-column: 1 / -1;
    justify-content: space-between;
  }
`

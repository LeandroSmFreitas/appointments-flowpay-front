import styled from 'styled-components'

export const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 10px;
  padding: 44px 24px;
  border-radius: ${({ theme }) => theme.radii.xl};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  background: ${({ theme }) => theme.colors.cardLight};
  text-align: center;

  strong {
    color: ${({ theme }) => theme.colors.textDark};
    font-size: 1rem;
  }

  p {
    max-width: 420px;
    margin: 0;
    color: ${({ theme }) => theme.colors.textSubtle};
    font-size: 0.88rem;
    line-height: 1.5;
  }
`

export const IconBox = styled.div`
  display: grid;
  width: 46px;
  height: 46px;
  place-items: center;
  border-radius: ${({ theme }) => theme.radii.pill};
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primarySoft};
  border: 1px solid #e5ddff;
`

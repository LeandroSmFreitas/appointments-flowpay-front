import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

export const Wrapper = styled.div`
  display: flex;
  min-height: 220px;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-radius: ${({ theme }) => theme.radii.xl};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  background: ${({ theme }) => theme.colors.cardLight};
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 0.9rem;
`

export const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border-radius: ${({ theme }) => theme.radii.pill};
  border: 2px solid #e6ebf4;
  border-top-color: ${({ theme }) => theme.colors.primary};
  animation: ${spin} 800ms linear infinite;
`

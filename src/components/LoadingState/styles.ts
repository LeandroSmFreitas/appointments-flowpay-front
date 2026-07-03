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
  border-radius: 18px;
  border: 1px solid #edf1f7;
  background: #ffffff;
  color: #8490a8;
  font-size: 0.9rem;
`

export const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 999px;
  border: 2px solid #e6ebf4;
  border-top-color: #5b2eea;
  animation: ${spin} 800ms linear infinite;
`

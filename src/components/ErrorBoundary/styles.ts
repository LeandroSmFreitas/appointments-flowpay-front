import styled from 'styled-components'

export const Wrapper = styled.section`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px;
  border-radius: 8px;
  color: #7f1d1d;
  background: #fef2f2;
  border: 1px solid #fecaca;

  h2 {
    margin: 0 0 6px;
    color: #7f1d1d;
    font-size: 1rem;
  }

  p {
    max-width: 620px;
    margin: 0 0 14px;
    color: #991b1b;
    font-size: 0.88rem;
    line-height: 1.6;
  }
`

export const Icon = styled.span`
  display: grid;
  flex: 0 0 auto;
  width: 40px;
  height: 40px;
  place-items: center;
  border-radius: 10px;
  color: #dc2626;
  background: #fee2e2;
`

export const RetryButton = styled.button`
  min-height: 38px;
  padding: 0 14px;
  border-radius: 10px;
  color: #ffffff;
  background: #dc2626;
  border: 1px solid #dc2626;
  font-weight: 800;
`

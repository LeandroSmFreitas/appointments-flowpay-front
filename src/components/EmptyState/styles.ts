import styled from 'styled-components'

export const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 10px;
  padding: 44px 24px;
  border-radius: 18px;
  border: 1px solid #edf1f7;
  background: #ffffff;
  text-align: center;

  strong {
    color: #111827;
    font-size: 1rem;
  }

  p {
    max-width: 420px;
    margin: 0;
    color: #8490a8;
    font-size: 0.88rem;
    line-height: 1.5;
  }
`

export const IconBox = styled.div`
  display: grid;
  width: 46px;
  height: 46px;
  place-items: center;
  border-radius: 999px;
  color: #5b2eea;
  background: #f2efff;
  border: 1px solid #e5ddff;
`

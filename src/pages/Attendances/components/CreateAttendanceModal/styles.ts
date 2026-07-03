import styled from 'styled-components'

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(17, 24, 39, 0.28);
  backdrop-filter: blur(8px);
`

export const Modal = styled.div`
  width: min(520px, 100%);
  border-radius: 20px;
  border: 1px solid #edf1f7;
  background: #ffffff;
  box-shadow: 0 24px 80px rgba(86, 101, 126, 0.18);
`

export const ModalHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 20px;
  border-bottom: 1px solid #edf1f7;

  span {
    color: #5b2eea;
    font-size: 0.78rem;
    font-weight: 800;
  }

  h2 {
    margin: 4px 0 0;
    color: #111827;
    font-size: 1.25rem;
    letter-spacing: 0;
  }
`

export const IconButton = styled.button`
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 10px;
  color: #8490a8;
  background: #f8faff;
  border: 1px solid #e8edf6;
`

export const Form = styled.form`
  display: grid;
  gap: 16px;
  padding: 20px;
`

export const Field = styled.div`
  display: grid;
  gap: 8px;

  label {
    color: #8490a8;
    font-size: 0.76rem;
    font-weight: 800;
  }

  input,
  textarea {
    width: 100%;
    min-height: 42px;
    padding: 0 12px;
    border-radius: 12px;
    color: #111827;
    background: #f8faff;
    border: 1px solid #e8edf6;
    outline: none;
    font: inherit;
    resize: vertical;
  }

  textarea {
    min-height: 104px;
    padding: 12px;
    line-height: 1.5;
  }

  span {
    color: #dc2626;
    font-size: 0.74rem;
    font-weight: 700;
  }
`

export const Footer = styled.footer`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 8px;
`

export const SecondaryButton = styled.button`
  min-height: 40px;
  padding: 0 14px;
  border-radius: 12px;
  color: #8490a8;
  background: #f8faff;
  border: 1px solid #e8edf6;
  font-weight: 800;
`

export const PrimaryButton = styled.button`
  min-height: 40px;
  padding: 0 14px;
  border-radius: 12px;
  color: #ffffff;
  background: #5b2eea;
  border: 1px solid #5b2eea;
  font-weight: 800;

  &:disabled {
    opacity: 0.56;
  }
`

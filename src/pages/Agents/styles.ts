import styled from 'styled-components'

export const PageStack = styled.div`
  display: grid;
  gap: 18px;
`

export const Notice = styled.div`
  padding: 12px 14px;
  border-radius: 14px;
  color: #92400e;
  background: #fff8e8;
  border: 1px solid #fde4ad;
  font-size: 0.86rem;
  font-weight: 700;
`

export const HeaderActions = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 560px) {
    width: 100%;
  }
`

export const PrimaryAction = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 42px;
  padding: 0 14px;
  border: 1px solid #5b2eea;
  border-radius: 12px;
  color: #ffffff;
  background: #5b2eea;
  font-size: 0.86rem;
  font-weight: 800;

  @media (max-width: 560px) {
    flex: 1;
    justify-content: center;
  }
`

export const Filters = styled.section`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: end;
  padding: 16px;
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid #edf1f7;
  box-shadow: 0 18px 40px rgba(86, 101, 126, 0.08);
`

export const FilterGroup = styled.div`
  display: grid;
  min-width: 220px;
  gap: 8px;

  label {
    color: #8490a8;
    font-size: 0.76rem;
    font-weight: 800;
  }

  select {
    min-height: 42px;
    padding: 0 12px;
    border-radius: 12px;
    color: #111827;
    background: #f8faff;
    border: 1px solid #e8edf6;
    outline: none;
  }
`

export const AgentIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  div {
    display: grid;
    gap: 4px;
  }

  strong {
    color: #111827;
    font-size: 0.9rem;
  }

  span {
    color: #8490a8;
    font-size: 0.76rem;
  }
`

export const Avatar = styled.span`
  display: grid;
  flex: 0 0 auto;
  width: 36px;
  height: 36px;
  place-items: center;
  border-radius: 999px;
  color: #ffffff;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  font-weight: 900;
`

export const StatusActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`

export const StatusButton = styled.button<{ $active: boolean }>`
  min-height: 32px;
  padding: 0 10px;
  border-radius: 10px;
  color: ${({ $active }) => ($active ? '#FFFFFF' : '#8490A8')};
  background: ${({ $active }) =>
    $active ? '#5B2EEA' : '#F8FAFF'};
  border: 1px solid
    ${({ $active }) =>
      $active ? '#5B2EEA' : '#E8EDF6'};
  font-size: 0.76rem;
  font-weight: 800;

  &:disabled {
    opacity: 0.55;
  }
`

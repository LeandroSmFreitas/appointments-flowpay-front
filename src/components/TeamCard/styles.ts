import styled from 'styled-components'
import type { StatusTone } from '../../utils/statusUtils'

const toneColor: Record<StatusTone, string> = {
  green: '#10B981',
  yellow: '#F59E0B',
  red: '#EF4444',
  neutral: '#64748B',
  blue: '#3B82F6',
}

export const Card = styled.article<{ $tone: StatusTone }>`
  display: grid;
  gap: 22px;
  padding: 22px;
  border-radius: 18px;
  border: 1px solid #edf1f7;
  background:
    linear-gradient(155deg, ${({ $tone }) => toneColor[$tone]}12, transparent 48%),
    #ffffff;
  box-shadow: 0 18px 40px rgba(86, 101, 126, 0.08);
  transition:
    transform 180ms ease,
    border-color 180ms ease;

  &:hover {
    transform: translateY(-2px);
    border-color: ${({ $tone }) => toneColor[$tone]}55;
  }
`

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
`

export const TeamTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  div {
    display: grid;
    gap: 4px;
  }

  strong {
    color: #111827;
    font-size: 0.98rem;
  }

  span {
    color: #96a0b5;
    font-size: 0.78rem;
  }
`

export const IconBox = styled.div<{ $tone: StatusTone }>`
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 999px;
  color: ${({ $tone }) => toneColor[$tone]};
  background: ${({ $tone }) => toneColor[$tone]}19;
  border: 1px solid ${({ $tone }) => toneColor[$tone]}3d;
`

export const Usage = styled.span<{ $tone: StatusTone }>`
  min-width: 52px;
  padding: 7px 9px;
  border-radius: 999px;
  text-align: center;
  color: ${({ $tone }) => toneColor[$tone]};
  background: ${({ $tone }) => toneColor[$tone]}17;
  border: 1px solid ${({ $tone }) => toneColor[$tone]}3d;
  font-size: 0.76rem;
  font-weight: 800;
`

export const Metrics = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`

export const Metric = styled.div`
  min-width: 0;
  padding: 12px;
  border-radius: 14px;
  background: #f7f9fe;
  border: 1px solid #edf1f7;

  span {
    display: block;
    color: #8490a8;
    font-size: 0.72rem;
    line-height: 1.2;
  }

  strong {
    display: block;
    margin-top: 6px;
    color: #111827;
    font-size: 1.15rem;
  }
`

import styled from 'styled-components'
import type { StatusTone } from '../../utils/statusUtils'

const toneColor: Record<StatusTone, string> = {
  green: '#10B981',
  yellow: '#F59E0B',
  red: '#EF4444',
  neutral: '#64748B',
  blue: '#3B82F6',
}

export const Wrapper = styled.div`
  display: grid;
  gap: 8px;
`

export const Track = styled.div<{ $compact: boolean }>`
  width: 100%;
  height: ${({ $compact }) => ($compact ? '6px' : '8px')};
  overflow: hidden;
  border-radius: 999px;
  background: #edf1f7;
  border: 1px solid #e5ebf4;
`

export const Fill = styled.div<{ $percent: number; $tone: StatusTone }>`
  width: ${({ $percent }) => `${Math.min(100, Math.max(0, $percent))}%`};
  height: 100%;
  border-radius: inherit;
  background: ${({ $tone }) => toneColor[$tone]};
  box-shadow: 0 8px 18px ${({ $tone }) => toneColor[$tone]}26;
  transition:
    width 220ms ease,
    background 220ms ease;
`

export const Meta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #8490a8;
  font-size: 0.78rem;

  strong {
    color: #111827;
    font-weight: 700;
  }
`

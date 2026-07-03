import styled from 'styled-components'
import type { StatusTone } from '../../utils/statusUtils'

const toneColor: Record<StatusTone, string> = {
  green: '#10B981',
  yellow: '#F59E0B',
  red: '#EF4444',
  neutral: '#94A3B8',
  blue: '#3B82F6',
}

export const Badge = styled.span<{ $tone: StatusTone }>`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  color: ${({ $tone }) => toneColor[$tone]};
  background: ${({ $tone }) => toneColor[$tone]}14;
  border: 1px solid ${({ $tone }) => toneColor[$tone]}33;
  font-size: 0.76rem;
  font-weight: 700;
  white-space: nowrap;

  span {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: currentColor;
    box-shadow: 0 0 10px currentColor;
  }
`

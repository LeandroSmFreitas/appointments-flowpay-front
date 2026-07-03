import styled from 'styled-components'
import type { KpiVariant } from './index'

const variantColor: Record<KpiVariant, string> = {
  blue: '#3B82F6',
  green: '#10B981',
  yellow: '#F59E0B',
  purple: '#8B5CF6',
}

export const Card = styled.article<{ $variant: KpiVariant }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 112px;
  padding: 22px;
  overflow: hidden;
  border-radius: 18px;
  border: 1px solid #edf1f7;
  background:
    linear-gradient(145deg, ${({ $variant }) => variantColor[$variant]}12, transparent 58%),
    #ffffff;
  box-shadow: 0 18px 40px rgba(86, 101, 126, 0.08);
  transition:
    transform 180ms ease,
    border-color 180ms ease;

  &:hover {
    transform: translateY(-2px);
    border-color: ${({ $variant }) => variantColor[$variant]}55;
  }
`

export const IconBox = styled.div<{ $variant: KpiVariant }>`
  display: grid;
  flex: 0 0 auto;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 999px;
  color: ${({ $variant }) => variantColor[$variant]};
  background: ${({ $variant }) => variantColor[$variant]}18;
  border: 1px solid ${({ $variant }) => variantColor[$variant]}22;
`

export const Content = styled.div`
  display: grid;
  gap: 8px;

  span {
    color: #96a0b5;
    font-size: 0.82rem;
    font-weight: 700;
  }

  strong {
    color: #111827;
    font-size: clamp(1.72rem, 4vw, 2.25rem);
    line-height: 1;
  }

  p {
    max-width: 170px;
    margin: 0;
    color: #8490a8;
    font-size: 0.84rem;
    line-height: 1.35;
  }
`

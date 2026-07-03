import type { LucideIcon } from 'lucide-react'
import { formatInteger } from '../../utils/numberUtils'
import * as S from './styles'

export type KpiVariant = 'blue' | 'green' | 'yellow' | 'purple'

interface KpiCardProps {
  title: string
  value: number
  description: string
  icon: LucideIcon
  variant: KpiVariant
}

export function KpiCard({
  title,
  value,
  description,
  icon: Icon,
  variant,
}: KpiCardProps) {
  return (
    <S.Card $variant={variant}>
      <S.IconBox $variant={variant}>
        <Icon size={20} strokeWidth={2.2} />
      </S.IconBox>
      <S.Content>
        <span>{title}</span>
        <strong>{formatInteger(value)}</strong>
        <p>{description}</p>
      </S.Content>
    </S.Card>
  )
}

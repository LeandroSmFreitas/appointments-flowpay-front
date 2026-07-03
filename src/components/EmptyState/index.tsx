import type { LucideIcon } from 'lucide-react'
import * as S from './styles'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <S.Wrapper>
      <S.IconBox>
        <Icon size={24} />
      </S.IconBox>
      <strong>{title}</strong>
      <p>{description}</p>
    </S.Wrapper>
  )
}

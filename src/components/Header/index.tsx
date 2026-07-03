import { Menu, Radio } from 'lucide-react'
import type { ReactNode } from 'react'
import { useAppShell } from '../../context/useAppShell'
import * as S from './styles'

interface HeaderProps {
  title: string
  subtitle: string
  actions?: ReactNode
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  const { toggleSidebar } = useAppShell()

  return (
    <S.Header>
      <S.MobileMenuButton
        type="button"
        onClick={toggleSidebar}
        aria-label="Abrir menu"
      >
        <Menu size={20} />
      </S.MobileMenuButton>

      <S.TitleGroup>
        <S.LiveBadge>
          <Radio size={14} />
          Live
        </S.LiveBadge>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </S.TitleGroup>

      {actions && <S.RightSide>{actions}</S.RightSide>}
    </S.Header>
  )
}

import {
  Headphones,
  HelpCircle,
  LayoutDashboard,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAppShell } from '../../context/useAppShell'
import * as S from './styles'

const navigationItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    to: '/attendances',
    label: 'Atendimentos',
    icon: Headphones,
  },
  {
    to: '/agents',
    label: 'Agentes',
    icon: Users,
  },
] as const

export function Sidebar() {
  const { closeSidebar, isSidebarOpen } = useAppShell()

  return (
    <>
      <S.Overlay $isOpen={isSidebarOpen} onClick={closeSidebar} />
      <S.Aside $isOpen={isSidebarOpen}>
        <S.Panel>
          <S.MobileCloseButton
            type="button"
            onClick={closeSidebar}
            aria-label="Fechar menu"
          >
            <X size={18} />
          </S.MobileCloseButton>

          <S.Brand to="/dashboard" onClick={closeSidebar}>
            <S.BrandMark>
              <ShieldCheck size={20} />
            </S.BrandMark>
            <div>
              <strong>FlowPay</strong>
              <span>Operations v1.0</span>
            </div>
          </S.Brand>

          <S.Navigation aria-label="Navegação principal">
            {navigationItems.map((item) => (
              <S.NavItem key={item.to}>
                <NavLink to={item.to} onClick={closeSidebar}>
                  {({ isActive }) => (
                    <S.NavContent $isActive={isActive}>
                      <item.icon size={18} />
                      {item.label}
                    </S.NavContent>
                  )}
                </NavLink>
              </S.NavItem>
            ))}
          </S.Navigation>

          <S.SidebarFooter>
            <HelpCircle size={18} />
            <div>
              <span>Suporte</span>
              <strong>FlowPay Ops</strong>
            </div>
          </S.SidebarFooter>
        </S.Panel>
      </S.Aside>
    </>
  )
}

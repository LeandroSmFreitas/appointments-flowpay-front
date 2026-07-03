import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 30;
  display: none;
  background: rgba(15, 23, 42, 0.22);
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
  transition: opacity 180ms ease;

  @media (max-width: 1024px) {
    display: block;
  }
`

export const Aside = styled.aside<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 40;
  display: flex;
  width: 244px;
  background: #ffffff;
  border-right: 1px solid #edf1f7;
  box-shadow: 18px 0 44px rgba(86, 101, 126, 0.08);

  @media (max-width: 1024px) {
    transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '-100%')});
    transition: transform 220ms ease;
  }
`

export const Panel = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 28px;
  padding: 26px 22px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
`

export const MobileCloseButton = styled.button`
  display: none;
  position: absolute;
  top: 18px;
  right: 18px;
  width: 36px;
  height: 36px;
  place-items: center;
  border: 1px solid #edf1f7;
  border-radius: 12px;
  color: #111827;
  background: #f7f9fe;

  @media (max-width: 1024px) {
    display: grid;
  }
`

export const Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 2px 4px;

  div {
    display: grid;
    gap: 3px;
  }

  strong {
    color: #111827;
    font-size: 1.02rem;
    line-height: 1;
  }

  span {
    color: #96a0b5;
    font-size: 0.76rem;
    font-weight: 700;
  }
`

export const BrandMark = styled.span`
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border-radius: 8px;
  color: #111827;
  background: #f6f8fc;
  border: 1px solid #e8edf6;
`

export const Navigation = styled.nav`
  display: grid;
  gap: 10px;
`

export const NavItem = styled.div`
  a {
    display: block;
  }
`

export const NavContent = styled.span<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 11px;
  min-height: 44px;
  padding: 0 12px;
  border-radius: 9px;
  color: ${({ $isActive }) => ($isActive ? '#FFFFFF' : '#8490a8')};
  background: ${({ $isActive }) =>
    $isActive ? '#5B2EEA' : 'transparent'};
  border: 1px solid
    ${({ $isActive }) =>
      $isActive ? '#5B2EEA' : 'transparent'};
  font-size: 0.91rem;
  font-weight: 800;
  transition:
    color 160ms ease,
    background 160ms ease,
    border-color 160ms ease;

  &:hover {
    color: ${({ $isActive }) => ($isActive ? '#FFFFFF' : '#111827')};
    background: ${({ $isActive }) => ($isActive ? '#5B2EEA' : '#f6f8fc')};
    border-color: ${({ $isActive }) => ($isActive ? '#5B2EEA' : '#edf1f7')};
  }
`

export const SidebarFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: auto;
  padding: 4px;
  color: #8490a8;

  div {
    display: grid;
    gap: 5px;
  }

  span {
    color: #96a0b5;
    font-size: 0.76rem;
  }

  strong {
    color: #111827;
    font-size: 0.88rem;
  }
`

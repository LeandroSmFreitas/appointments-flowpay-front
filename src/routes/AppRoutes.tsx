import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { LoadingState } from '../components/LoadingState'

const Dashboard = lazy(async () => {
  const module = await import('../pages/Dashboard')

  return { default: module.Dashboard }
})

const Attendances = lazy(async () => {
  const module = await import('../pages/Attendances')

  return { default: module.Attendances }
})

const Agents = lazy(async () => {
  const module = await import('../pages/Agents')

  return { default: module.Agents }
})

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingState />}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/attendances" element={<Attendances />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  )
}

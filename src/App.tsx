import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Sidebar } from './components/Sidebar'
import { AppShellProvider } from './context/AppShellContext'
import { DashboardRealtimeProvider } from './context/DashboardRealtimeContext'
import { AppRoutes } from './routes/AppRoutes'
import * as S from './App.styles'

function App() {
  return (
    <BrowserRouter>
      <AppShellProvider>
        <DashboardRealtimeProvider>
          <S.Shell>
            <S.SkipLink href="#main-content">Pular para o conteúdo</S.SkipLink>
            <Sidebar />
            <S.Main id="main-content" tabIndex={-1}>
              <S.Content>
                <ErrorBoundary>
                  <AppRoutes />
                </ErrorBoundary>
              </S.Content>
            </S.Main>
          </S.Shell>
        </DashboardRealtimeProvider>
      </AppShellProvider>
    </BrowserRouter>
  )
}

export default App

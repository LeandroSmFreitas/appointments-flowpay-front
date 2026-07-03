import { BrowserRouter } from 'react-router-dom'
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
            <Sidebar />
            <S.Main>
              <S.Content>
                <AppRoutes />
              </S.Content>
            </S.Main>
          </S.Shell>
        </DashboardRealtimeProvider>
      </AppShellProvider>
    </BrowserRouter>
  )
}

export default App

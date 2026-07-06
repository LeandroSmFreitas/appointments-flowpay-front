import { Activity, Clock3, Headphones, Users } from 'lucide-react'
import { Header } from '../../components/Header'
import { KpiCard } from '../../components/KpiCard'
import { LoadingState } from '../../components/LoadingState'
import { TeamCard } from '../../components/TeamCard'
import { CapacityDonutChart } from './components/CapacityDonutChart'
import { LiveActivityFeed } from './components/LiveActivityFeed'
import { QueueLineChart } from './components/QueueLineChart'
import { useDashboard } from './hooks/dashboardHook'
import * as S from './styles'

export function Dashboard() {
  const {
    activities,
    error,
    loading,
    queueHistory,
    summary,
    totals,
  } = useDashboard()

  if (loading && !summary) {
    return (
      <>
        <Header title="Dashboard" subtitle="FlowPay Operations em tempo real" />
        <LoadingState />
      </>
    )
  }

  return (
    <>
      <Header title="Dashboard" subtitle="FlowPay Operations em tempo real" />

      {error && (
        <S.Notice role="alert">
          <span>{error}</span>
        </S.Notice>
      )}

      {summary && (
        <S.PageStack>
          <S.KpiGrid>
            <KpiCard
              title="Em atendimento"
              value={summary.totalInProgress}
              description="Conversas ativas"
              icon={Headphones}
              variant="green"
            />
            <KpiCard
              title="Na fila"
              value={summary.totalWaiting}
              description="Aguardando roteamento"
              icon={Activity}
              variant="yellow"
            />
            <KpiCard
              title="Finalizados hoje"
              value={summary.totalFinishedToday}
              description="Concluídos no dia"
              icon={Clock3}
              variant="blue"
            />
            <KpiCard
              title="Agentes online"
              value={totals.agentsOnline}
              description="Disponíveis agora"
              icon={Users}
              variant="purple"
            />
          </S.KpiGrid>

          <S.TeamGrid>
            {summary.teams.map((team) => (
              <TeamCard key={team.team} team={team} />
            ))}
          </S.TeamGrid>

          <S.AnalyticsGrid>
            <QueueLineChart data={queueHistory} />
            <CapacityDonutChart
              usedCapacity={totals.usedCapacity}
              availableCapacity={totals.availableCapacity}
            />
            <LiveActivityFeed activities={activities} />
          </S.AnalyticsGrid>
        </S.PageStack>
      )}
    </>
  )
}

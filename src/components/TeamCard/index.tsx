import { CreditCard, Landmark, MessageSquareText } from 'lucide-react'
import { TeamName } from '../../models/enum/teamName'
import type { TeamSummary } from '../../models/interface/dashboard'
import { getCapacityTone, teamLabels } from '../../utils/statusUtils'
import { toPercent } from '../../utils/numberUtils'
import { CapacityBar } from '../CapacityBar'
import * as S from './styles'

interface TeamCardProps {
  team: TeamSummary
}

const teamIcon = {
  [TeamName.CARTOES]: CreditCard,
  [TeamName.EMPRESTIMOS]: Landmark,
  [TeamName.OUTROS]: MessageSquareText,
} as const

export function TeamCard({ team }: TeamCardProps) {
  const Icon = teamIcon[team.team]
  const usagePercent = toPercent(team.usedCapacity, team.totalCapacity)
  const tone = getCapacityTone(usagePercent)

  return (
    <S.Card $tone={tone}>
      <S.Header>
        <S.TeamTitle>
          <S.IconBox $tone={tone}>
            <Icon size={20} />
          </S.IconBox>
          <div>
            <strong>{teamLabels[team.team]}</strong>
            <span>{team.agentsOnline} agentes online</span>
          </div>
        </S.TeamTitle>
        <S.Usage $tone={tone}>{usagePercent}%</S.Usage>
      </S.Header>

      <S.Metrics>
        <S.Metric>
          <span>Fila</span>
          <strong>{team.waiting}</strong>
        </S.Metric>
        <S.Metric>
          <span>Em atendimento</span>
          <strong>{team.inProgress}</strong>
        </S.Metric>
        <S.Metric>
          <span>Capacidade livre</span>
          <strong>{team.availableCapacity}</strong>
        </S.Metric>
      </S.Metrics>

      <CapacityBar
        usedCapacity={team.usedCapacity}
        totalCapacity={team.totalCapacity}
      />
    </S.Card>
  )
}

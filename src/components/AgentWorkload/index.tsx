import { CapacityBar } from '../CapacityBar'
import * as S from './styles'

interface AgentWorkloadProps {
  activeCount: number
}

const agentCapacityLimit = 3

export function AgentWorkload({ activeCount }: AgentWorkloadProps) {
  return (
    <S.Wrapper>
      <S.Label>
        <strong>
          {activeCount}/{agentCapacityLimit}
        </strong>
        <span>carga</span>
      </S.Label>
      <CapacityBar
        usedCapacity={activeCount}
        totalCapacity={agentCapacityLimit}
        compact
      />
    </S.Wrapper>
  )
}

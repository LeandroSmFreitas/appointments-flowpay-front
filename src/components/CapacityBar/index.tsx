import { getCapacityTone } from '../../utils/statusUtils'
import { toPercent } from '../../utils/numberUtils'
import * as S from './styles'

interface CapacityBarProps {
  usedCapacity: number
  totalCapacity: number
  compact?: boolean
}

export function CapacityBar({
  usedCapacity,
  totalCapacity,
  compact = false,
}: CapacityBarProps) {
  const percent = toPercent(usedCapacity, totalCapacity)
  const tone = getCapacityTone(percent)

  return (
    <S.Wrapper>
      <S.Track $compact={compact}>
        <S.Fill $percent={percent} $tone={tone} />
      </S.Track>
      {!compact && (
        <S.Meta>
          <span>{percent}% em uso</span>
          <strong>
            {usedCapacity}/{totalCapacity}
          </strong>
        </S.Meta>
      )}
    </S.Wrapper>
  )
}

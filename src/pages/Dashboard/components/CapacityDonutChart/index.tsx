import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { toPercent } from '../../../../utils/numberUtils'
import * as S from './styles'

interface CapacityDonutChartProps {
  usedCapacity: number
  availableCapacity: number
}

const chartColors = ['#3B82F6', '#10B981']

export function CapacityDonutChart({
  usedCapacity,
  availableCapacity,
}: CapacityDonutChartProps) {
  const totalCapacity = usedCapacity + availableCapacity
  const usagePercent = toPercent(usedCapacity, totalCapacity)
  const data = [
    { name: 'Usada', value: usedCapacity },
    { name: 'Disponível', value: availableCapacity },
  ]

  return (
    <S.ChartCard>
      <S.ChartHeader>
        <span>Capacidade geral</span>
        <strong>Uso consolidado</strong>
      </S.ChartHeader>

      <S.DonutArea>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius="68%"
              outerRadius="88%"
              paddingAngle={4}
              stroke="transparent"
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={chartColors[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <S.CenterLabel>
          <strong>{usagePercent}%</strong>
          <span>em uso</span>
        </S.CenterLabel>
      </S.DonutArea>

      <S.Legend>
        <S.LegendItem $color="#3B82F6">
          <span />
          Usada
          <strong>{usedCapacity}</strong>
        </S.LegendItem>
        <S.LegendItem $color="#10B981">
          <span />
          Disponível
          <strong>{availableCapacity}</strong>
        </S.LegendItem>
      </S.Legend>
    </S.ChartCard>
  )
}

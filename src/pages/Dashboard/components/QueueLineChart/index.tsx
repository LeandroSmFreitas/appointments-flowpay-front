import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { QueueHistoryPoint } from '../../../../models/interface/dashboard'
import * as S from './styles'

interface QueueLineChartProps {
  data: QueueHistoryPoint[]
}

export function QueueLineChart({ data }: QueueLineChartProps) {
  return (
    <S.ChartCard>
      <S.ChartHeader>
        <span>Fila em tempo real</span>
        <strong>Evolução operacional</strong>
      </S.ChartHeader>

      <S.ChartBody>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
            <CartesianGrid stroke="#EDF1F7" vertical={false} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9AA5B8', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9AA5B8', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                background: '#FFFFFF',
                border: '1px solid #EDF1F7',
                borderRadius: 14,
                color: '#111827',
                boxShadow: '0 18px 40px rgba(86, 101, 126, 0.12)',
              }}
              labelStyle={{ color: '#3F4757' }}
            />
            <Line
              type="monotone"
              dataKey="waiting"
              name="Na fila"
              stroke="#F59E0B"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="inProgress"
              name="Em atendimento"
              stroke="#10B981"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </S.ChartBody>
    </S.ChartCard>
  )
}

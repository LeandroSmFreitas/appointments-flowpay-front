import {
  CheckCircle2,
  CircleDot,
  GitBranchPlus,
  UserCog,
  XCircle,
} from 'lucide-react'
import type {
  ActivityType,
  LiveActivity,
} from '../../../../models/interface/dashboard'
import { minutesAgo } from '../../../../utils/dateUtils'
import * as S from './styles'

interface LiveActivityFeedProps {
  activities: LiveActivity[]
  error?: string | null
}

const activityIcon: Record<ActivityType, typeof CircleDot> = {
  CREATED: CircleDot,
  ASSIGNED: GitBranchPlus,
  FINISHED: CheckCircle2,
  CANCELLED: XCircle,
  AGENT_STATUS: UserCog,
}

export function LiveActivityFeed({ activities, error }: LiveActivityFeedProps) {
  return (
    <S.FeedCard>
      <S.FeedHeader>
        <span>Atividades recentes</span>
        <strong>Fluxo operacional</strong>
      </S.FeedHeader>

      {activities.length === 0 ? (
        <S.EmptyFeed>
          <strong>Nenhuma atividade recebida</strong>
          <p>{error ?? 'Aguardando eventos enviados pelo backend.'}</p>
        </S.EmptyFeed>
      ) : (
        <S.ActivityList>
          {activities.map((activity) => {
            const Icon = activityIcon[activity.type]

            return (
              <S.ActivityItem key={activity.id} $type={activity.type}>
                <S.ActivityIcon $type={activity.type}>
                  <Icon size={16} />
                </S.ActivityIcon>
                <div>
                  <strong>{activity.title}</strong>
                  <p>{activity.description}</p>
                  <span>{minutesAgo(activity.timestamp)}</span>
                </div>
              </S.ActivityItem>
            )
          })}
        </S.ActivityList>
      )}
    </S.FeedCard>
  )
}

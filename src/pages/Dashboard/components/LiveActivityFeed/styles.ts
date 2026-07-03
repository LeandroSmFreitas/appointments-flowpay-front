import styled from 'styled-components'
import type { ActivityType } from '../../../../models/interface/dashboard'

const activityColor: Record<ActivityType, string> = {
  CREATED: '#F59E0B',
  ASSIGNED: '#3B82F6',
  FINISHED: '#10B981',
  CANCELLED: '#EF4444',
  AGENT_STATUS: '#8B5CF6',
}

export const FeedCard = styled.aside`
  display: grid;
  gap: 18px;
  padding: 20px;
  border-radius: 18px;
  border: 1px solid #edf1f7;
  background: #ffffff;
  box-shadow: 0 18px 40px rgba(86, 101, 126, 0.08);
`

export const FeedHeader = styled.header`
  display: grid;
  gap: 4px;

  span {
    color: #96a0b5;
    font-size: 0.78rem;
    font-weight: 800;
  }

  strong {
    color: #111827;
    font-size: 1.08rem;
  }
`

export const ActivityList = styled.div`
  display: grid;
  gap: 14px;
`

export const EmptyFeed = styled.div`
  display: grid;
  gap: 6px;
  padding: 18px;
  border-radius: 14px;
  background: #f8faff;
  border: 1px solid #edf1f7;

  strong {
    color: #111827;
    font-size: 0.9rem;
  }

  p {
    margin: 0;
    color: #8490a8;
    font-size: 0.8rem;
    line-height: 1.45;
  }
`

export const ActivityItem = styled.article<{ $type: ActivityType }>`
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid #edf1f7;

  &:last-child {
    padding-bottom: 0;
    border-bottom: 0;
  }

  strong {
    display: block;
    color: #111827;
    font-size: 0.88rem;
  }

  p {
    margin: 4px 0 7px;
    color: #8490a8;
    font-size: 0.78rem;
    line-height: 1.45;
  }

  span {
    color: ${({ $type }) => activityColor[$type]};
    font-size: 0.72rem;
    font-weight: 800;
  }
`

export const ActivityIcon = styled.div<{ $type: ActivityType }>`
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 999px;
  color: ${({ $type }) => activityColor[$type]};
  background: ${({ $type }) => activityColor[$type]}17;
  border: 1px solid ${({ $type }) => activityColor[$type]}33;
`

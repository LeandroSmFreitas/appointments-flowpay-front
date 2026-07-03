export const theme = {
  colors: {
    background: '#0F172A',
    backgroundElevated: '#111827',
    card: '#1E293B',
    cardAlt: '#182235',
    border: '#334155',
    borderSoft: 'rgba(148, 163, 184, 0.18)',
    text: '#F8FAFC',
    textMuted: '#94A3B8',
    blue: '#3B82F6',
    green: '#10B981',
    yellow: '#F59E0B',
    red: '#EF4444',
    purple: '#8B5CF6',
    cyan: '#22D3EE',
    neutral: '#64748B',
  },
  radii: {
    sm: '6px',
    md: '8px',
    lg: '8px',
  },
  shadows: {
    soft: '0 18px 60px rgba(2, 6, 23, 0.36)',
  },
  breakpoints: {
    tablet: '1024px',
    mobile: '720px',
  },
} as const

export type Theme = typeof theme

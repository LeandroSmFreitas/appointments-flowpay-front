export const theme = {
  colors: {
    background: '#0F172A',
    page: '#F7F9FE',
    backgroundElevated: '#111827',
    card: '#1E293B',
    cardLight: '#FFFFFF',
    cardAlt: '#182235',
    border: '#334155',
    borderLight: '#EDF1F7',
    borderSoft: 'rgba(148, 163, 184, 0.18)',
    text: '#F8FAFC',
    textDark: '#111827',
    textMuted: '#94A3B8',
    textSubtle: '#8490A8',
    blue: '#3B82F6',
    green: '#10B981',
    yellow: '#F59E0B',
    red: '#EF4444',
    purple: '#8B5CF6',
    cyan: '#22D3EE',
    neutral: '#64748B',
    primary: '#5B2EEA',
    primarySoft: '#F2EFFF',
  },
  radii: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '18px',
    pill: '999px',
  },
  shadows: {
    soft: '0 18px 60px rgba(2, 6, 23, 0.36)',
    card: '0 18px 40px rgba(86, 101, 126, 0.08)',
    modal: '0 24px 80px rgba(86, 101, 126, 0.18)',
    focus: '0 0 0 4px rgba(91, 46, 234, 0.28)',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
  },
  typography: {
    family:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    weight: {
      medium: 700,
      bold: 800,
      black: 900,
    },
  },
  breakpoints: {
    tablet: '1024px',
    mobile: '720px',
  },
} as const

export type Theme = typeof theme

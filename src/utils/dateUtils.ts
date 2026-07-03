export const formatDateTime = (value: string | Date): string =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))

export const formatClock = (value: string | Date): string =>
  new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(value))

export const formatShortTime = (value: string | Date): string =>
  new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))

export const minutesAgo = (value: string | Date): string => {
  const diffInMinutes = Math.max(
    0,
    Math.round((Date.now() - new Date(value).getTime()) / 60000),
  )

  if (diffInMinutes === 0) {
    return 'agora'
  }

  if (diffInMinutes === 1) {
    return 'há 1 min'
  }

  return `há ${diffInMinutes} min`
}

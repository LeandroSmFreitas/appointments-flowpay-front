export const toPercent = (value: number, total: number): number => {
  if (total <= 0) {
    return 0
  }

  return Math.round((value / total) * 100)
}

export const formatInteger = (value: number): string =>
  new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(value)

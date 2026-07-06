import type { PageResponse } from '../services/serviceTypes'

export const createPageResponse = <TData>(
  content: TData[],
  page: number,
  size: number,
): PageResponse<TData> => {
  const totalElements = content.length
  const totalPages = Math.max(1, Math.ceil(totalElements / size))
  const start = page * size
  const pagedContent = content.slice(start, start + size)

  return {
    content: pagedContent,
    page,
    size,
    totalElements,
    totalPages,
    first: page <= 0,
    last: page >= totalPages - 1,
  }
}

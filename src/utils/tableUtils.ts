export type SortDirection = 'asc' | 'desc'

export interface SortState<TKey extends string = string> {
  key: TKey
  direction: SortDirection
}

export const pageSize = 8

export const getNextSortState = <TKey extends string>(
  currentSort: SortState<TKey>,
  key: TKey,
): SortState<TKey> => {
  if (currentSort.key !== key) {
    return { key, direction: 'asc' }
  }

  return {
    key,
    direction: currentSort.direction === 'asc' ? 'desc' : 'asc',
  }
}

export const getPageCount = (
  totalItems: number,
  currentPageSize = pageSize,
): number => Math.max(1, Math.ceil(totalItems / currentPageSize))

export const toApiSort = <TKey extends string>(
  sort: SortState<TKey>,
): `${TKey},${SortDirection}` => `${sort.key},${sort.direction}`

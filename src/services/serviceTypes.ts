export interface ServiceResult<TData> {
  data: TData
}

export interface ServiceReadOptions {
  force?: boolean
}

export interface PageResponse<TData> {
  content: TData[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first?: boolean
  last?: boolean
}

export interface PageQuery<TSortKey extends string = string> extends ServiceReadOptions {
  page: number
  size: number
  sort: `${TSortKey},${'asc' | 'desc'}`
  status?: string
  team?: string
}

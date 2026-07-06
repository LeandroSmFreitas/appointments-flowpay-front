import { describe, expect, it } from 'vitest'
import { createPageResponse } from '../utils/paginationUtils'

describe('paginationUtils', () => {
  it('creates a page response from a legacy array response', () => {
    const page = createPageResponse(['a', 'b', 'c'], 1, 2)

    expect(page).toEqual({
      content: ['c'],
      page: 1,
      size: 2,
      totalElements: 3,
      totalPages: 2,
      first: false,
      last: true,
    })
  })
})

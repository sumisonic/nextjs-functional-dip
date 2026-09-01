import { describe, expect, it } from 'vitest'

import { createApiClient } from '../api/createApiClient'
import { getPostModel, toPostModel } from './postRepository'

describe('postRepository', () => {
  it('builds a PostModel from a PostResponse', () => {
    const model = toPostModel({ id: 7, userId: 3, title: 'title', body: 'body' })

    expect(model).toEqual({ id: 7, userId: 3, title: 'title', body: 'body' })
  })

  it('returns the model built from the decoded response', async () => {
    const client = createApiClient({ mode: 'mock' })

    const model = await getPostModel(client, 2)

    expect(model).toEqual(toPostModel({ userId: 1, id: 2, title: 'Sample Post 2', body: 'Another sample post body with some content.' }))
  })
})

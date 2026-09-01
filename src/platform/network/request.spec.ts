import { describe, expect, it } from 'vitest'

import { createApiClient } from '../api/createApiClient'
import { postRequest } from './postRequest'
import { decodePostResponse } from './postResponse'
import { postsRequest } from './postsRequest'

const client = createApiClient({ mode: 'mock' })

describe('Request', () => {
  describe('postsRequest', () => {
    it('builds the right path', () => {
      expect(postsRequest.path()).toBe('/posts')
    })

    it('uses GET', () => {
      expect(postsRequest.method().type).toBe('GET')
    })

    it('returns 3 mock posts after passing them through decodeResponse', async () => {
      const result = await client.request(postsRequest)

      expect(result.length).toBe(3)
      const post = result[0]
      expect(typeof post.id).toBe('number')
      expect(typeof post.userId).toBe('number')
      expect(typeof post.title).toBe('string')
      expect(typeof post.body).toBe('string')
    })
  })

  describe('postRequest', () => {
    it('embeds the id in the path', () => {
      expect(postRequest.path({ id: 42 })).toBe('/posts/42')
    })

    it('returns the mock post matching the id', async () => {
      const result = await client.request(postRequest, { id: 2 })
      expect(result.id).toBe(2)
      expect(result.title).toBe('Sample Post 2')
    })

    it('rejects with a 404 ApiError for an unknown id', async () => {
      await expect(client.request(postRequest, { id: 999 })).rejects.toMatchObject({ type: 'server', status: 404 })
    })
  })

  describe('decodePostResponse', () => {
    it('throws when a field has the wrong type', () => {
      expect(() => decodePostResponse({ id: '1', userId: 1, title: 't', body: 'b' })).toThrow()
    })

    it('throws when the input is not an object', () => {
      expect(() => decodePostResponse(null)).toThrow()
    })
  })
})

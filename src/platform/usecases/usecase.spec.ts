import { describe, expect, it } from 'vitest'

import { isFailure, isSuccess } from '../../domain/common/Result'
import type { ApiClient } from '../api/ApiClient'
import { ApiError } from '../api/ApiError'
import { createApiClient } from '../api/createApiClient'
import { makeUseCaseProvider } from './makeUseCaseProvider'

describe('PostUseCase', () => {
  const client = createApiClient({ mode: 'mock' })
  const { postUseCase } = makeUseCaseProvider(client)

  describe('getPosts', () => {
    it('fetches the list of posts', async () => {
      const result = await postUseCase.getPosts()

      expect(isSuccess(result)).toBe(true)
      expect(isFailure(result)).toBe(false)
    })

    it('returns posts with the expected field types', async () => {
      const result = await postUseCase.getPosts()

      if (!result.success) {
        throw new Error('Expected success but got failure')
      }

      expect(result.value.length).toBe(3)
      const post = result.value[0]
      expect(typeof post.id).toBe('number')
      expect(typeof post.userId).toBe('number')
      expect(typeof post.title).toBe('string')
      expect(typeof post.body).toBe('string')
    })
  })

  describe('getPostIds', () => {
    it('returns the list of IDs', async () => {
      const result = await postUseCase.getPostIds()

      if (!result.success) {
        throw new Error('Expected success but got failure')
      }

      expect(result.value).toEqual([1, 2, 3])
    })
  })

  describe('error conversion', () => {
    it('returns a notFound DomainError for an unknown id', async () => {
      const result = await postUseCase.getPost(999)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.type).toBe('notFound')
      }
    })

    it('converts an ApiError thrown by the ApiClient into a DomainError', async () => {
      // This is where DIP pays off: inject an always-failing client to exercise the error path
      const failingClient: ApiClient = {
        request: async () => {
          throw ApiError.server(404, 'Not Found')
        },
      }
      const { postUseCase: failing } = makeUseCaseProvider(failingClient)

      const result = await failing.getPost(1)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.type).toBe('notFound')
      }
    })
  })
})

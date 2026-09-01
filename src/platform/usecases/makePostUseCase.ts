import { fromPromise } from '../../domain/common/Result'
import type { PostUseCase } from '../../domain/usecases/PostUseCase'
import type { ApiClient } from '../api/ApiClient'
import { toDomainError } from '../api/ApiError'
import { getPostIds, getPostModel, getPostModels } from '../repositories/postRepository'

/**
 * Creates the PostUseCase implementation.
 *
 * ApiError → DomainError conversion happens at this boundary, so
 * presentation only ever sees Result<T, DomainError>.
 * @param client - The ApiClient implementation to inject (live / mock)
 */
export const makePostUseCase = (client: ApiClient): PostUseCase => ({
  getPosts: () => fromPromise(getPostModels(client), toDomainError),
  getPost: (id: number) => fromPromise(getPostModel(client, id), toDomainError),
  getPostIds: () => fromPromise(getPostIds(client), toDomainError),
})

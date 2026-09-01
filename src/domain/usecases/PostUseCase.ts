import type { DomainError } from '../common/DomainError'
import type { Result } from '../common/Result'
import type { PostModel } from '../models/PostModel'

/**
 * Interface of the use cases for posts.
 * presentation depends only on this contract; the implementation lives on the platform side.
 */
export interface PostUseCase {
  /**
   * Fetches the list of posts
   */
  getPosts: () => Promise<Result<readonly PostModel[], DomainError>>

  /**
   * Fetches a single post
   * @param id - Post ID
   */
  getPost: (id: number) => Promise<Result<PostModel, DomainError>>

  /**
   * Fetches the IDs of all posts
   */
  getPostIds: () => Promise<Result<readonly number[], DomainError>>
}

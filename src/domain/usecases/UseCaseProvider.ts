import type { PostUseCase } from './PostUseCase'

/**
 * Interface that provides the full set of use cases.
 * presentation receives its use cases through this contract
 */
export interface UseCaseProvider {
  postUseCase: PostUseCase
}

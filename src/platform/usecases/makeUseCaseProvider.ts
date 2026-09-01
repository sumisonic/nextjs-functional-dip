import type { UseCaseProvider } from '../../domain/usecases/UseCaseProvider'
import type { ApiClient } from '../api/ApiClient'
import { makePostUseCase } from './makePostUseCase'

/**
 * Creates the UseCaseProvider
 * @param client - The ApiClient implementation to inject (live / mock)
 */
export const makeUseCaseProvider = (client: ApiClient): UseCaseProvider => ({
  postUseCase: makePostUseCase(client),
})

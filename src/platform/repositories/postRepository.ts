import type { PostModel } from '../../domain/models/PostModel'
import type { ApiClient } from '../api/ApiClient'
import { postRequest } from '../network/postRequest'
import type { PostResponse } from '../network/postResponse'
import { postsRequest } from '../network/postsRequest'

/**
 * Builds the domain model from the API response.
 *
 * The repository is where the wire format turns into the model. A model that needs data from
 * several requests is composed here as well.
 */
export const toPostModel = (response: PostResponse): PostModel => ({
  id: response.id,
  userId: response.userId,
  title: response.title,
  body: response.body,
})

/**
 * Fetches the list of posts (throws an ApiError on failure)
 */
export const getPostModels = async (client: ApiClient): Promise<readonly PostModel[]> => {
  const responses = await client.request(postsRequest)
  return responses.map(toPostModel)
}

/**
 * Fetches a single post (throws an ApiError on failure)
 * @param id - Post ID
 */
export const getPostModel = async (client: ApiClient, id: number): Promise<PostModel> =>
  toPostModel(await client.request(postRequest, { id }))

/**
 * Fetches the IDs of all posts
 */
export const getPostIds = async (client: ApiClient): Promise<readonly number[]> => {
  const posts = await getPostModels(client)
  return posts.map((post) => post.id)
}

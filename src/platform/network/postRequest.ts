import type { Request } from '../api/Request'
import { mockPosts } from './mockPosts'
import { decodePostResponse, type PostResponse } from './postResponse'

/**
 * Request definition for fetching a single post
 */
export const postRequest: Request<PostResponse, { id: number }> = {
  path: ({ id }) => `/posts/${id}`,
  method: () => ({ type: 'GET' }),
  decodeResponse: decodePostResponse,
  mock: ({ id }) => mockPosts.find((post) => post.id === id),
}

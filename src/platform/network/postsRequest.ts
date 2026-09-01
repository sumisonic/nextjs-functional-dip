import type { Request } from '../api/Request'
import { mockPosts } from './mockPosts'
import { decodePostsResponse, type PostResponse } from './postResponse'

/**
 * Request definition for fetching the list of posts
 */
export const postsRequest: Request<readonly PostResponse[]> = {
  path: () => '/posts',
  method: () => ({ type: 'GET' }),
  decodeResponse: decodePostsResponse,
  mock: () => mockPosts,
}

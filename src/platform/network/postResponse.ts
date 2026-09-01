/**
 * A post as JSONPlaceholder returns it (the wire format).
 *
 * This is the API's shape, not the domain's. It happens to match PostModel field for field,
 * but the two are kept separate: request definitions decode into this type, and the repository
 * builds the domain model from it (composing several responses when a model needs them).
 */
export type PostResponse = {
  readonly id: number
  readonly userId: number
  readonly title: string
  readonly body: string
}

/**
 * Decodes unknown into a PostResponse.
 * Throws an Error when the shape does not match; the ApiClient implementation converts it into ApiError.decode.
 */
export const decodePostResponse = (data: unknown): PostResponse => {
  if (typeof data !== 'object' || data === null) {
    throw new Error('PostResponse: not an object')
  }
  const { id, userId, title, body } = data as Record<string, unknown>
  if (typeof id !== 'number' || typeof userId !== 'number' || typeof title !== 'string' || typeof body !== 'string') {
    throw new Error('PostResponse: a field has the wrong type')
  }
  return { id, userId, title, body }
}

/**
 * Decodes unknown into an array of PostResponse
 */
export const decodePostsResponse = (data: unknown): readonly PostResponse[] => {
  if (!Array.isArray(data)) {
    throw new Error('PostResponse[]: not an array')
  }
  return data.map(decodePostResponse)
}

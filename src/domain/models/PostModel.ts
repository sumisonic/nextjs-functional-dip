/**
 * Post model
 *
 * The app's own shape for a post. It is not the API's shape: request definitions on the
 * platform side decode the response into PostResponse, and postRepository builds this model
 * from it.
 */
export type PostModel = {
  readonly id: number
  readonly userId: number
  readonly title: string
  readonly body: string
}

import type { Metadata } from 'next'

import { createApiClient } from '@/platform/api/createApiClient'
import { makeUseCaseProvider } from '@/platform/usecases/makeUseCaseProvider'
import PostDetailPage from '@/presentation/components/pages/post/PostDetailPage'
import { getApiConfig } from '../../apiConfig'

/**
 * Server-side composition root. Assembles the use cases at build time (SSG).
 */
const getUseCaseProvider = () => makeUseCaseProvider(createApiClient(getApiConfig()))

/**
 * Helper that fetches a post on the server
 */
const getPost = async (id: number) => {
  const { postUseCase } = getUseCaseProvider()
  const result = await postUseCase.getPost(id)
  if (!result.success) {
    throw result.error
  }
  return result.value
}

export type PostDetailRootProps = {
  params: Promise<{ id: string }>
}

/**
 * Fetches every post ID and generates the static paths
 */
export const generateStaticParams = async () => {
  const { postUseCase } = getUseCaseProvider()
  const result = await postUseCase.getPostIds()
  if (!result.success) {
    throw result.error
  }
  return result.value.map((id) => ({ id: String(id) }))
}

/**
 * Uses the post title as the page metadata
 */
export const generateMetadata = async ({ params }: PostDetailRootProps): Promise<Metadata> => {
  const { id } = await params
  const post = await getPost(Number(id))
  return { title: post.title }
}

/**
 * Post detail page - data is fetched on the server
 */
const PostDetailRoot = async ({ params }: PostDetailRootProps) => {
  const { id } = await params
  const post = await getPost(Number(id))
  return <PostDetailPage post={post} />
}

export default PostDetailRoot

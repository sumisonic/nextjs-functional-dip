'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { match } from 'ts-pattern'

import type { DomainError } from '@/domain/common/DomainError'
import type { PostModel } from '@/domain/models/PostModel'
import { PageContainer } from '@/presentation/components/pages/common/PageContainer'
import { useUseCases } from '@/presentation/contexts/UseCaseContext'

/**
 * State of the post list
 */
type PostsState =
  | { type: 'loading' }
  | { type: 'success'; posts: readonly PostModel[] }
  | { type: 'error'; error: DomainError }

/**
 * Turns a DomainError into a user-facing message
 */
const getErrorMessage = (error: DomainError): string =>
  match(error)
    .with({ type: 'notFound' }, ({ message }) => message)
    .with({ type: 'validation' }, ({ message }) => message)
    .with({ type: 'unexpected' }, () => 'An unexpected error occurred')
    .exhaustive()

/**
 * Home page - shows the list of posts (client-side data fetching pattern)
 */
const HomePage = () => {
  const [state, setState] = useState<PostsState>({ type: 'loading' })
  const { postUseCase } = useUseCases()

  useEffect(() => {
    const fetchPosts = async () => {
      const result = await postUseCase.getPosts()

      match(result)
        .with({ success: true }, ({ value }) => setState({ type: 'success', posts: value }))
        .with({ success: false }, ({ error }) => setState({ type: 'error', error }))
        .exhaustive()
    }
    fetchPosts()
  }, [postUseCase])

  return (
    <PageContainer>
      <h1>Posts</h1>
      <p className="muted">An example page that fetches its data on the client</p>

      {match(state)
        .with({ type: 'loading' }, () => <p>Loading...</p>)
        .with({ type: 'error' }, ({ error }) => <p className="error">Error: {getErrorMessage(error)}</p>)
        .with({ type: 'success' }, ({ posts }) => (
          <div className="stack">
            {posts.map((post) => (
              <Link key={post.id} href={`/posts/${post.id}`}>
                <article className="card">
                  <h2>{post.title}</h2>
                  <p>{post.body}</p>
                </article>
              </Link>
            ))}
          </div>
        ))
        .exhaustive()}
    </PageContainer>
  )
}

export default HomePage

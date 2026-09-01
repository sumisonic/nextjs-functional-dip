import Link from 'next/link'

import type { PostModel } from '@/domain/models/PostModel'
import { PageContainer } from '@/presentation/components/pages/common/PageContainer'

type PostDetailPageProps = {
  post: PostModel
}

/**
 * Post detail page - shows a post that was fetched on the server
 */
const PostDetailPage = ({ post }: PostDetailPageProps) => {
  return (
    <PageContainer>
      <p>
        <Link href="/">← Posts</Link>
      </p>
      <article>
        <h1>{post.title}</h1>
        <p className="muted">
          Post #{post.id} / User {post.userId}
        </p>
        <p>{post.body}</p>
      </article>
    </PageContainer>
  )
}

export default PostDetailPage

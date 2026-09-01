import { ReactNode } from 'react'

type PageContainerProps = {
  children: ReactNode
}

/**
 * Container that gives every page the same width and padding
 */
export const PageContainer = ({ children }: PageContainerProps) => {
  return <main className="container">{children}</main>
}

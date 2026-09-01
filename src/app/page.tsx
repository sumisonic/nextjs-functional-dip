import type { Metadata } from 'next'

import HomePage from '@/presentation/components/pages/home/HomePage'

export const metadata: Metadata = {
  title: 'Posts',
}

const HomeRoot = () => {
  return <HomePage />
}

export default HomeRoot

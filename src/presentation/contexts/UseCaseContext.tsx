'use client'

import { createContext, useContext, type ReactNode } from 'react'

import type { UseCaseProvider } from '../../domain/usecases/UseCaseProvider'

const UseCaseContext = createContext<UseCaseProvider | null>(null)

export type UseCaseContextProviderProps = {
  useCases: UseCaseProvider
  children: ReactNode
}

/**
 * Provider that hands an already-assembled set of use cases to the components below it.
 * It does no assembly (composition) itself; the composition root is app/providers.tsx
 */
export const UseCaseContextProvider = ({ useCases, children }: UseCaseContextProviderProps) => {
  return <UseCaseContext.Provider value={useCases}>{children}</UseCaseContext.Provider>
}

export const useUseCases = (): UseCaseProvider => {
  const context = useContext(UseCaseContext)
  if (!context) {
    throw new Error('useUseCases must be used within UseCaseContextProvider')
  }
  return context
}

'use client'

import { useMemo, type ReactNode } from 'react'

import { createApiClient } from '@/platform/api/createApiClient'
import { makeUseCaseProvider } from '@/platform/usecases/makeUseCaseProvider'
import { UseCaseContextProvider } from '@/presentation/contexts/UseCaseContext'
import { getApiConfig } from './apiConfig'

/**
 * Client-side composition root.
 * Builds the ApiClient from the environment and hands the use-case implementations to UseCaseContext
 */
export const Providers = ({ children }: { children: ReactNode }) => {
  const useCases = useMemo(() => makeUseCaseProvider(createApiClient(getApiConfig())), [])

  return <UseCaseContextProvider useCases={useCases}>{children}</UseCaseContextProvider>
}

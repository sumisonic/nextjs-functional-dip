import { afterEach, describe, expect, it, vi } from 'vitest'

import { isApiError } from './ApiError'
import { createFetchApiClient } from './FetchApiClient'
import type { Request } from './Request'

const echoRequest: Request<{ ok: boolean }> = {
  path: () => '/echo',
  method: () => ({ type: 'GET' }),
  decodeResponse: (data) => {
    if (typeof data !== 'object' || data === null || typeof (data as { ok?: unknown }).ok !== 'boolean') {
      throw new Error('decode failed')
    }
    return data as { ok: boolean }
  },
}

/** Captures and returns the value thrown by a rejected promise */
const captureError = async (promise: Promise<unknown>): Promise<unknown> => {
  try {
    await promise
    throw new Error('Expected rejection')
  } catch (cause) {
    return cause
  }
}

describe('FetchApiClient', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('passes the response through decodeResponse', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 })),
    )
    const client = createFetchApiClient('https://api.example.com')

    const result = await client.request(echoRequest)

    expect(result.ok).toBe(true)
    expect(vi.mocked(fetch).mock.calls[0][0]).toBe('https://api.example.com/echo')
  })

  it('turns a connection failure into ApiError.network', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new TypeError('fetch failed')
      }),
    )
    const client = createFetchApiClient('https://api.example.com')

    const error = await captureError(client.request(echoRequest))

    expect(isApiError(error) && error.type === 'network').toBe(true)
  })

  it('turns a non-2xx response into ApiError.server', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('not found', { status: 404, statusText: 'Not Found' })),
    )
    const client = createFetchApiClient('https://api.example.com')

    const error = await captureError(client.request(echoRequest))

    expect(isApiError(error) && error.type === 'server' && error.status === 404).toBe(true)
  })

  it('turns a non-JSON response into ApiError.decode', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('<html></html>', { status: 200 })),
    )
    const client = createFetchApiClient('https://api.example.com')

    const error = await captureError(client.request(echoRequest))

    expect(isApiError(error) && error.type === 'decode').toBe(true)
  })

  it('turns a decodeResponse failure into ApiError.decode', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ ok: 'yes' }), { status: 200 })),
    )
    const client = createFetchApiClient('https://api.example.com')

    const error = await captureError(client.request(echoRequest))

    expect(isApiError(error) && error.type === 'decode').toBe(true)
  })

  it('does not add Content-Type to GET requests', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 })),
    )
    const client = createFetchApiClient('https://api.example.com')

    await client.request(echoRequest)

    const init = vi.mocked(fetch).mock.calls[0][1]
    expect((init?.headers as Record<string, string>)['Content-Type']).toBeUndefined()
  })
})

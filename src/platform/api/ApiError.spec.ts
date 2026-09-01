import { describe, it, expect } from 'vitest'
import { ApiError, toDomainError, isApiError } from './ApiError'

describe('ApiError', () => {
  describe('factories', () => {
    it('creates a network error', () => {
      const cause = new Error('Connection failed')
      const error = ApiError.network('Network error', cause)

      expect(error.type).toBe('network')
      if (error.type === 'network') {
        expect(error.message).toBe('Network error')
        expect(error.cause).toBe(cause)
      }
    })

    it('creates a decode error', () => {
      const cause = new Error('Invalid JSON')
      const error = ApiError.decode('Decode error', cause)

      expect(error.type).toBe('decode')
      if (error.type === 'decode') {
        expect(error.message).toBe('Decode error')
        expect(error.cause).toBe(cause)
      }
    })

    it('creates a server error', () => {
      const error = ApiError.server(500, 'Internal Server Error')

      expect(error.type).toBe('server')
      if (error.type === 'server') {
        expect(error.status).toBe(500)
        expect(error.message).toBe('Internal Server Error')
      }
    })
  })

  describe('toDomainError', () => {
    describe('network errors', () => {
      it('become unexpected', () => {
        const apiError = ApiError.network('Connection timeout', new Error())
        const domainError = toDomainError(apiError)

        expect(domainError.type).toBe('unexpected')
        if (domainError.type === 'unexpected') {
          expect(domainError.cause).toBe(apiError)
        }
      })
    })

    describe('decode errors', () => {
      it('become unexpected', () => {
        const apiError = ApiError.decode('Schema validation failed', new Error())
        const domainError = toDomainError(apiError)

        expect(domainError.type).toBe('unexpected')
        if (domainError.type === 'unexpected') {
          expect(domainError.cause).toBe(apiError)
        }
      })
    })

    describe('server errors', () => {
      it('maps 404 to notFound', () => {
        const apiError = ApiError.server(404, 'Resource not found')
        const domainError = toDomainError(apiError)

        expect(domainError.type).toBe('notFound')
        if (domainError.type === 'notFound') {
          expect(domainError.message).toBe('Resource not found')
        }
      })

      it('maps 400 to validation', () => {
        const apiError = ApiError.server(400, 'Bad Request')
        const domainError = toDomainError(apiError)

        expect(domainError.type).toBe('validation')
        if (domainError.type === 'validation') {
          expect(domainError.message).toBe('Bad Request')
        }
      })

      it('maps 422 to validation', () => {
        const apiError = ApiError.server(422, 'Unprocessable Entity')
        const domainError = toDomainError(apiError)

        expect(domainError.type).toBe('validation')
        if (domainError.type === 'validation') {
          expect(domainError.message).toBe('Unprocessable Entity')
        }
      })

      it('maps 500 to unexpected', () => {
        const apiError = ApiError.server(500, 'Internal Server Error')
        const domainError = toDomainError(apiError)

        expect(domainError.type).toBe('unexpected')
        if (domainError.type === 'unexpected') {
          expect(domainError.cause).toBe(apiError)
        }
      })

      it('maps 503 to unexpected', () => {
        const apiError = ApiError.server(503, 'Service Unavailable')
        const domainError = toDomainError(apiError)

        expect(domainError.type).toBe('unexpected')
      })
    })

    // Pins down that unknown input is never swallowed: a DomainError always comes back
    describe('input that is not an ApiError', () => {
      it('maps an unknown object to unexpected', () => {
        const unknownObject = { name: 'UnknownError', message: 'boom' }
        const domainError = toDomainError(unknownObject)

        expect(domainError).toBeDefined()
        expect(domainError.type).toBe('unexpected')
      })

      it('maps a plain Error to unexpected', () => {
        const domainError = toDomainError(new Error('boom'))

        expect(domainError).toBeDefined()
        expect(domainError.type).toBe('unexpected')
      })

      it('maps undefined to unexpected', () => {
        const domainError = toDomainError(undefined)

        expect(domainError).toBeDefined()
        expect(domainError.type).toBe('unexpected')
      })
    })
  })

  describe('isApiError', () => {
    it('recognizes a network ApiError', () => {
      const apiError = ApiError.network('error', new Error())
      expect(isApiError(apiError)).toBe(true)
    })

    it('recognizes a decode ApiError', () => {
      const apiError = ApiError.decode('error', new Error())
      expect(isApiError(apiError)).toBe(true)
    })

    it('recognizes a server ApiError', () => {
      const apiError = ApiError.server(500, 'error')
      expect(isApiError(apiError)).toBe(true)
    })

    it('returns false for a plain Error', () => {
      const error = new Error('not an api error')
      expect(isApiError(error)).toBe(false)
    })

    it('returns false for null', () => {
      expect(isApiError(null)).toBe(false)
    })

    it('returns false for undefined', () => {
      expect(isApiError(undefined)).toBe(false)
    })

    it('returns false for a string', () => {
      expect(isApiError('error')).toBe(false)
    })

    it('returns false for an object with an unknown type', () => {
      expect(isApiError({ type: 'unknown' })).toBe(false)
    })
  })
})

/**
 * API types for Pik Pixel
 */

export interface ApiRequest<T = unknown> {
  body?: T
  query?: Record<string, string>
  params?: Record<string, string>
  headers?: Record<string, string>
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  pageSize: number
  total: number
  hasMore: boolean
}

export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy'
  version: string
  timestamp: string
  services?: {
    database: boolean
    cache: boolean
    queue: boolean
  }
}

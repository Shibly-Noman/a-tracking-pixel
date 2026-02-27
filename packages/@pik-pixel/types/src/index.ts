export * from './events'
export * from './api'
export * from './database'

/**
 * Pik Pixel Types Package
 * 
 * This package contains shared TypeScript types used across
 * the Pik Pixel monorepo applications and services.
 */

export interface Project {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}

/**
 * Database types for Pik Pixel
 */

export interface DatabaseConfig {
  host: string
  port: number
  database: string
  user: string
  password: string
  ssl?: boolean
}

export interface QueryResult<T> {
  rows: T[]
  rowCount: number
  fields: Array<{
    name: string
    dataTypeID: number
  }>
}

export interface EventFilter {
  projectId?: string
  eventName?: string
  startDate?: string
  endDate?: string
  userId?: string
  limit?: number
  offset?: number
}

export interface AnalyticsSummary {
  totalEvents: number
  uniqueUsers: number
  conversions: number
  revenue?: number
  topEvents: Array<{
    name: string
    count: number
  }>
}

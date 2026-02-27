/**
 * Event types for Pik Pixel tracking
 */

export interface PixelEvent {
  id: string
  projectId: string
  eventName: string
  timestamp: string
  userId?: string
  sessionId?: string
  properties?: Record<string, unknown>
}

export interface PageViewEvent extends PixelEvent {
  eventName: 'page_view'
  url: string
  referrer?: string
  title?: string
}

export interface CustomEvent extends PixelEvent {
  eventName: string
  properties: Record<string, unknown>
}

export interface ConversionEvent extends PixelEvent {
  eventName: 'conversion'
  conversionValue?: number
  conversionCurrency?: string
}

export type TrackingEvent = PageViewEvent | CustomEvent | ConversionEvent

import type { Metadata } from 'next'
import { DocsPageContent } from "./docs-page-content"

export const metadata: Metadata = {
  title: 'API Documentation - PeakPixel',
  description: 'Official PeakPixel API documentation. Learn how to integrate PeakPixel into your applications to automatically track mails with tracking pixels and trackable URLs.',
}

export default function DocsPage() {
  return <DocsPageContent />
}

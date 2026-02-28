import type { Metadata } from 'next'
import { DocsPageContent } from "./docs-page-content"

export const metadata: Metadata = {
  title: 'API Documentation - PastePixel',
  description: 'Official PastePixel API documentation. Learn how to integrate PastePixel into your applications to automatically track mails with tracking pixels and trackable URLs.',
}

export default function DocsPage() {
  return <DocsPageContent />
}

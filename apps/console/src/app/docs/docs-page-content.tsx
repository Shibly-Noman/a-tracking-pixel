"use client"

// PeakPixel API Documentation Page
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Logo } from '@/components/logo'
import { ModeToggle } from '@/components/mode-toggle'
import {
  Copy,
  Check,
  Menu,
  X,
  ExternalLink,
  BookOpen,
  Key,
  Mail,
  Image,
  Link2,
  AlertCircle,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavSection {
  id: string
  title: string
  icon: React.ElementType
  items: NavItem[]
}

interface NavItem {
  id: string
  title: string
  method?: 'GET' | 'POST' | 'DELETE' | 'PUT'
}

// ─── Navigation Structure ─────────────────────────────────────────────────────

const navSections: NavSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    icon: BookOpen,
    items: [
      { id: 'overview', title: 'Overview' },
      { id: 'authentication', title: 'Authentication' },
      { id: 'response-codes', title: 'Response Codes' },
    ],
  },
  {
    id: 'mail-tracking',
    title: 'Mail Tracking',
    icon: Mail,
    items: [
      { id: 'mail-tracking-create', title: 'Create', method: 'POST' },
      { id: 'mail-tracking-get', title: 'Get Information', method: 'GET' },
      { id: 'mail-tracking-delete', title: 'Delete', method: 'DELETE' },
    ],
  },
  {
    id: 'tracking-pixel',
    title: 'Tracking Pixel',
    icon: Image,
    items: [
      { id: 'pixel-create', title: 'Create', method: 'POST' },
      { id: 'pixel-get', title: 'Get Information', method: 'GET' },
      { id: 'pixel-data', title: 'Get Data', method: 'GET' },
    ],
  },
  {
    id: 'trackable-url',
    title: 'Trackable URL',
    icon: Link2,
    items: [
      { id: 'url-create', title: 'Create', method: 'POST' },
      { id: 'url-get', title: 'Get Information', method: 'GET' },
      { id: 'url-data', title: 'Get Data', method: 'GET' },
      { id: 'url-delete', title: 'Delete', method: 'DELETE' },
    ],
  },
]

// ─── Method Badge ─────────────────────────────────────────────────────────────

function MethodBadge({ method }: { method: 'GET' | 'POST' | 'DELETE' | 'PUT' }) {
  const colors: Record<string, string> = {
    GET: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    POST: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    PUT: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  }
  return (
    <span className={cn('inline-flex items-center rounded px-2 py-0.5 text-xs font-bold font-mono', colors[method])}>
      {method}
    </span>
  )
}

// ─── Code Block ───────────────────────────────────────────────────────────────

function CodeBlock({ code, language = 'bash' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group rounded-lg overflow-hidden border border-border bg-muted/50 my-4">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/80">
        <span className="text-xs text-muted-foreground font-mono">{language}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          onClick={handleCopy}
        >
          {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  )
}

// ─── JSON Block ───────────────────────────────────────────────────────────────

function JsonBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group rounded-lg overflow-hidden border border-border bg-muted/50 my-4">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/80">
        <span className="text-xs text-muted-foreground font-mono">{label ?? 'json'}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          onClick={handleCopy}
        >
          {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed text-foreground">
        <code>{code}</code>
      </pre>
    </div>
  )
}

// ─── Endpoint Header ─────────────────────────────────────────────────────────

function EndpointHeader({
  method,
  path,
}: {
  method: 'GET' | 'POST' | 'DELETE' | 'PUT'
  path: string
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/60 border border-border font-mono text-sm my-4">
      <MethodBadge method={method} />
      <span className="text-foreground">{path}</span>
    </div>
  )
}

// ─── Attribute Row ────────────────────────────────────────────────────────────

function AttrRow({
  name,
  type,
  required,
  defaultVal,
  children,
}: {
  name: string
  type: string
  required?: boolean
  defaultVal?: string
  children: React.ReactNode
}) {
  return (
    <div className="py-3 border-b border-border last:border-0">
      <div className="flex flex-wrap items-center gap-2 mb-1">
        <code className="text-sm font-semibold text-foreground bg-muted px-1.5 py-0.5 rounded">{name}</code>
        {required && (
          <Badge variant="destructive" className="text-xs px-1.5 py-0">
            required
          </Badge>
        )}
        <span className="text-xs text-muted-foreground font-mono">{type}</span>
        {defaultVal && (
          <span className="text-xs text-muted-foreground">
            defaults to <code className="bg-muted px-1 rounded">{defaultVal}</code>
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
    </div>
  )
}

// ─── Response Code Table ──────────────────────────────────────────────────────

const responseCodes = [
  { code: '200', name: 'OK', reason: 'Your request has succeeded.' },
  { code: '201', name: 'Created', reason: 'A new entity has successfully been created.' },
  { code: '400', name: 'Bad request', reason: 'Missing data that you should provide.' },
  {
    code: '401',
    name: 'Unauthorized',
    reason:
      'Your API-key is invalid or you are trying to create/delete/edit an entity for an account that isn\'t yours.',
  },
  {
    code: '403',
    name: 'Forbidden',
    reason:
      'You have exceeded your plan. For example, the number of mail tracking that you have created in a day.',
  },
  {
    code: '429',
    name: 'Too many requests',
    reason:
      'You\'ve exceeded the rate limit of 30 requests per minute. Wait one minute before performing another request.',
  },
  {
    code: '500',
    name: 'Internal server error',
    reason:
      'We experienced some kind of unexpected server-side error. Please contact us if you keep getting this error.',
  },
]

function codeColor(code: string) {
  if (code.startsWith('2')) return 'text-green-600 dark:text-green-400'
  if (code.startsWith('4')) return 'text-yellow-600 dark:text-yellow-400'
  if (code.startsWith('5')) return 'text-red-600 dark:text-red-400'
  return 'text-foreground'
}

// ─── Section Anchor ───────────────────────────────────────────────────────────

function SectionAnchor({ id }: { id: string }) {
  return <span id={id} className="scroll-mt-20 block" />
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function DocsPageContent() {
  const [activeSection, setActiveSection] = useState('overview')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  // Intersection observer to highlight active nav item
  useEffect(() => {
    const allIds = navSections.flatMap((s) => s.items.map((i) => i.id))
    const observers: IntersectionObserver[] = []

    allIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id)
        },
        { rootMargin: '-20% 0px -70% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setMobileNavOpen(false)
  }

  // ── Sidebar ────────────────────────────────────────────────────────────────

  const Sidebar = () => (
    <nav className="space-y-6">
      {navSections.map((section) => (
        <div key={section.id}>
          <div className="flex items-center gap-2 mb-2">
            <section.icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {section.title}
            </span>
          </div>
          <ul className="space-y-1 pl-6">
            {section.items.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollTo(item.id)}
                  className={cn(
                    'w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors cursor-pointer',
                    activeSection === item.id
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >
                  {item.method && <MethodBadge method={item.method} />}
                  <span>{item.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      {/* ── Top Nav ── */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile sidebar toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden cursor-pointer"
              onClick={() => setMobileNavOpen((v) => !v)}
            >
              {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link href="/landing" className="flex items-center gap-2 cursor-pointer">
              <Logo size={28} />
              <span className="font-bold text-lg">PeakPixel</span>
            </Link>
            <Separator orientation="vertical" className="h-5 hidden sm:block" />
            <span className="hidden sm:block text-sm text-muted-foreground">API Documentation</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="hidden sm:flex">v1</Badge>
            <ModeToggle variant="ghost" />
            <Button variant="outline" size="sm" asChild className="hidden sm:flex cursor-pointer">
              <Link href="/auth/sign-up">
                Get API Key
                <ExternalLink className="ml-1.5 h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* ── Desktop Sidebar ── */}
          <aside className="hidden lg:block w-64 shrink-0 py-8">
            <div className="sticky top-24">
              <ScrollArea className="h-[calc(100vh-8rem)]">
                <Sidebar />
              </ScrollArea>
            </div>
          </aside>

          {/* ── Mobile Sidebar Overlay ── */}
          {mobileNavOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                onClick={() => setMobileNavOpen(false)}
              />
              <aside className="absolute left-0 top-16 bottom-0 w-72 bg-background border-r p-6 overflow-y-auto">
                <Sidebar />
              </aside>
            </div>
          )}

          {/* ── Main Content ── */}
          <main className="flex-1 min-w-0 py-8 max-w-3xl">

            {/* ════════════════════════════════════════════════════════════════
                INTRODUCTION
            ════════════════════════════════════════════════════════════════ */}
            <SectionAnchor id="overview" />
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Introduction</h1>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-4">
                Welcome to the official <strong className="text-foreground">PeakPixel API</strong> documentation.
                In order to use the PeakPixel API you must have a{' '}
                <strong className="text-foreground">premium</strong> or{' '}
                <strong className="text-foreground">early bird</strong> account. Feel free to check out our{' '}
                <Link href="#pricing" className="text-primary underline underline-offset-4 hover:no-underline">
                  pricing page
                </Link>{' '}
                to see all our plans.
              </p>

              <p className="text-muted-foreground leading-relaxed mb-4">
                The latest version of the API is <Badge variant="outline">v1</Badge> currently. Using this API,
                you are able to integrate PeakPixel into your own applications and automatically track mails.
                This API allows you to create new mail trackings, tracking pixels and trackable URLs. We also
                provide endpoints to delete your mail tracking or a trackable URL.
              </p>

              <div className="rounded-lg border border-border bg-muted/40 p-4 mb-6">
                <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                  How to create a mail tracking with a pixel and trackable URLs?
                </h3>
                <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                  <li>
                    Create a new <strong className="text-foreground">mail tracking</strong> with a name (e.g.{' '}
                    <code className="bg-muted px-1 rounded">"Newsletter"</code>). This will be shown on your
                    dashboard.
                  </li>
                  <li>
                    Add a <strong className="text-foreground">tracking pixel</strong> to your mail tracking. This
                    gives you a URL to embed as an image in your e-mails. Note: a mail tracking can only have{' '}
                    <strong className="text-foreground">zero or one</strong> tracking pixel.
                  </li>
                  <li>
                    Add up to <strong className="text-foreground">twenty trackable URLs</strong> to your mail
                    tracking.
                  </li>
                </ol>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="rounded-lg border border-border p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Base URL</p>
                  <code className="text-sm font-mono text-foreground">https://peakpixel.com/api/v1</code>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Rate Limit</p>
                  <code className="text-sm font-mono text-foreground">30 requests / minute</code>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-yellow-200 dark:border-yellow-900/50 bg-yellow-50 dark:bg-yellow-900/10 p-4">
                <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  This API uses the principles of a <strong>REST-API</strong>. Use the appropriate HTTP methods
                  (GET, POST, DELETE, PUT) on our endpoints. Some endpoints require a JSON body.
                </p>
              </div>
            </section>

            <Separator className="my-8" />

            {/* ════════════════════════════════════════════════════════════════
                AUTHENTICATION
            ════════════════════════════════════════════════════════════════ */}
            <SectionAnchor id="authentication" />
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Key className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Authentication</h2>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-4">
                Each endpoint requires you to be authenticated. You have to create an API-key from your{' '}
                <strong className="text-foreground">My Account</strong> page. You authenticate yourself by adding
                a <code className="bg-muted px-1.5 py-0.5 rounded text-sm">key</code> parameter to each endpoint
                with your API-key as the value.
              </p>

              <div className="flex items-start gap-3 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 p-4 mb-6">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                <p className="text-sm text-red-800 dark:text-red-300">
                  <strong>Security warning:</strong> Please prevent calling our API from your public JavaScript
                  files, as this allows users on your website to see your API-key.
                </p>
              </div>

              <CodeBlock
                language="bash"
                code={`$ curl -X POST https://peakpixel.com/api/v1/mail-tracking?key=<KEY> \\
  -H "Content-type: application/json" \\
  -d '{"name":"Newsletter"}'`}
              />
            </section>

            <Separator className="my-8" />

            {/* ════════════════════════════════════════════════════════════════
                RESPONSE CODES
            ════════════════════════════════════════════════════════════════ */}
            <SectionAnchor id="response-codes" />
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Info className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Response Codes</h2>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6">
                Our API uses the following HTTP response codes:
              </p>

              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60 border-b border-border">
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-16">Code</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-40">Name</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {responseCodes.map((row) => (
                      <tr key={row.code} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className={cn('px-4 py-3 font-mono font-bold', codeColor(row.code))}>{row.code}</td>
                        <td className="px-4 py-3 font-medium text-foreground">{row.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{row.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <Separator className="my-8" />

            {/* ════════════════════════════════════════════════════════════════
                MAIL TRACKING
            ════════════════════════════════════════════════════════════════ */}
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Mail Tracking</h2>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-8">
              A <strong className="text-foreground">mail tracking</strong> is the entity with a name that can
              &apos;own&apos; a tracking pixel and zero or more trackable URLs. All created mail trackings can be
              seen on your dashboard.
            </p>

            {/* ── Mail Tracking: Create ── */}
            <SectionAnchor id="mail-tracking-create" />
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <MethodBadge method="POST" />
                <h3 className="text-xl font-semibold">Create Mail Tracking</h3>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-4">
                To create a new mail tracking, send a <strong className="text-foreground">POST</strong> request
                to the endpoint below. You should provide a JSON body with the following attributes:
              </p>

              <EndpointHeader method="POST" path="/mail-tracking" />

              <h4 className="font-semibold mb-3 mt-6">JSON Body Attributes</h4>
              <div className="rounded-lg border border-border divide-y divide-border">
                <AttrRow name="name" type="String (max. 64 chars)" required>
                  The name of your new mail tracking. This name can be found on your dashboard after creating
                  the mail tracking.
                </AttrRow>
                <AttrRow name="enabled" type="Boolean" defaultVal="true">
                  Whether data collection is paused or not. When disabled, your tracking pixel and URLs
                  won&apos;t collect any data. You can enable data tracking later on.
                </AttrRow>
                <AttrRow name="uniqueOpensOnly" type="Boolean" defaultVal="false">
                  Whether to collect only unique data. This is based on the IP-address of the tracked data, so
                  a tracking pixel can then track an IP-address at most one time.{' '}
                  <strong className="text-foreground">Important:</strong> If set to{' '}
                  <code className="bg-muted px-1 rounded">true</code>, then{' '}
                  <code className="bg-muted px-1 rounded">trackIpAddresses</code> must also be{' '}
                  <code className="bg-muted px-1 rounded">true</code>.
                </AttrRow>
                <AttrRow name="trackIpAddresses" type="Boolean" defaultVal="true">
                  Privacy setting on whether the tracking pixel and URLs should track IP-addresses. When
                  disabled, the mail tracking page also won&apos;t render the &quot;Location&quot; chart.{' '}
                  <strong className="text-foreground">This setting cannot be changed after creating the mail tracking.</strong>{' '}
                  When set to <code className="bg-muted px-1 rounded">false</code>,{' '}
                  <code className="bg-muted px-1 rounded">uniqueOpensOnly</code> cannot be{' '}
                  <code className="bg-muted px-1 rounded">true</code>.
                </AttrRow>
                <AttrRow name="trackUserAgents" type="Boolean" defaultVal="true">
                  Privacy setting on whether the tracking pixel and URLs should track user-agents. When
                  disabled, the mail tracking page also won&apos;t render the &quot;Devices&quot; chart.{' '}
                  <strong className="text-foreground">This setting cannot be changed after creating the mail tracking.</strong>
                </AttrRow>
                <AttrRow name="trackDateTimes" type="Boolean" defaultVal="true">
                  Privacy setting on whether the tracking pixel and URLs should track the date/times on which
                  they got triggered. When disabled, the mail tracking page also won&apos;t show the &quot;Times
                  opened&quot; and &quot;Time of day&quot; charts.{' '}
                  <strong className="text-foreground">This setting cannot be changed after creating the mail tracking.</strong>
                </AttrRow>
              </div>

              <h4 className="font-semibold mb-3 mt-6">Returns</h4>
              <p className="text-muted-foreground text-sm mb-4">
                Returns a <Badge variant="outline" className="text-green-600 dark:text-green-400">201 Created</Badge>{' '}
                response with a JSON body containing the ID of your newly created mail tracking. This ID can
                later be used to delete your mail tracking.
              </p>

              <CodeBlock
                language="bash"
                code={`$ curl -X POST "https://peakpixel.com/api/v1/mail-tracking?key=<KEY>" \\
  -H "Content-type: application/json" \\
  -d '{"name":"Newsletter","enabled":true,"uniqueOpensOnly":false,"trackIpAddresses":true,"trackUserAgents":true,"trackDateTimes":true}'`}
              />

              <JsonBlock
                label="201 Created — Response"
                code={`{
  "success": true,
  "msg": {
    "id": 465,
    "name": "Newsletter"
  }
}`}
              />
            </section>

            {/* ── Mail Tracking: Get ── */}
            <SectionAnchor id="mail-tracking-get" />
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <MethodBadge method="GET" />
                <h3 className="text-xl font-semibold">Get Mail Tracking Information</h3>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-4">
                To retrieve information about a mail tracking and its pixel and tracking URLs, send a{' '}
                <strong className="text-foreground">GET</strong> request to the endpoint below, where{' '}
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm">ID</code> is the ID of an existing
                mail tracking.
              </p>

              <EndpointHeader method="GET" path="/mail-tracking/<ID>" />

              <h4 className="font-semibold mb-3 mt-6">Returns</h4>
              <p className="text-muted-foreground text-sm mb-2">
                Returns a <Badge variant="outline" className="text-green-600 dark:text-green-400">200 OK</Badge>{' '}
                response with a JSON body containing:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside mb-4">
                <li><code className="bg-muted px-1 rounded">id</code> — ID of the mail tracking</li>
                <li><code className="bg-muted px-1 rounded">created</code> — timestamp of creation (ms since epoch)</li>
                <li><code className="bg-muted px-1 rounded">mailTrackingUrl</code> — URL to the PeakPixel dashboard page</li>
                <li><code className="bg-muted px-1 rounded">name</code> — name of the mail tracking</li>
                <li><code className="bg-muted px-1 rounded">enabled</code> — whether data collection is active</li>
                <li><code className="bg-muted px-1 rounded">uniqueOpensOnly</code> — whether unique opens only are collected</li>
                <li><code className="bg-muted px-1 rounded">privacySettings</code> — object with immutable privacy settings</li>
                <li><code className="bg-muted px-1 rounded">trackingPixel</code> — pixel info object or <code className="bg-muted px-1 rounded">null</code></li>
                <li><code className="bg-muted px-1 rounded">trackableUrls</code> — array of trackable URL info objects</li>
              </ul>

              <CodeBlock
                language="bash"
                code={`$ curl -X GET "https://peakpixel.com/api/v1/mail-tracking/465?key=<KEY>"`}
              />

              <JsonBlock
                label="200 OK — Response"
                code={`{
  "success": true,
  "msg": {
    "id": 465,
    "created": 1611599175410,
    "mailTrackingUrl": "https://peakpixel.com/tracking/465",
    "name": "Newsletter",
    "enabled": true,
    "uniqueOpensOnly": false,
    "privacySettings": {
      "trackIpAddresses": true,
      "trackUserAgents": true,
      "trackDateTimes": true
    },
    "trackingPixel": {
      "id": 123,
      "created": 1611599175410,
      "token": "fbAQfWDabnHgQNwf4CFZ.png",
      "url": "https://peakpixel.com/image/fbAQfWDabnHgQNwf4CFZ.png",
      "timesOpened": 50
    },
    "trackableUrls": [
      {
        "id": 756,
        "created": 1611599175410,
        "token": "fbAQfWDabnHgQNwf4Cqw",
        "trackableUrl": "https://peakpixel.com/url/fbAQfWDabnHgQNwf4Cqw",
        "originalUrl": "https://my-website.com/",
        "timesOpened": 50
      }
    ]
  }
}`}
              />
            </section>

            {/* ── Mail Tracking: Delete ── */}
            <SectionAnchor id="mail-tracking-delete" />
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-4">
                <MethodBadge method="DELETE" />
                <h3 className="text-xl font-semibold">Delete Mail Tracking</h3>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-4">
                To delete an existing mail tracking, send a{' '}
                <strong className="text-foreground">DELETE</strong> request to the endpoint below, where{' '}
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm">ID</code> is the ID of the mail
                tracking you want to delete.
              </p>

              <EndpointHeader method="DELETE" path="/mail-tracking/<ID>" />

              <h4 className="font-semibold mb-3 mt-6">Returns</h4>
              <p className="text-muted-foreground text-sm mb-4">
                Returns a <Badge variant="outline" className="text-green-600 dark:text-green-400">200 OK</Badge>{' '}
                response with a JSON body indicating that the mail tracking has successfully been deleted.
              </p>

              <CodeBlock
                language="bash"
                code={`$ curl -X DELETE "https://peakpixel.com/api/v1/mail-tracking/<ID>?key=<KEY>"`}
              />

              <JsonBlock
                label="200 OK — Response"
                code={`{
  "success": true,
  "msg": "Mail tracking successfully deleted."
}`}
              />
            </section>

            <Separator className="my-8" />

            {/* ════════════════════════════════════════════════════════════════
                TRACKING PIXEL
            ════════════════════════════════════════════════════════════════ */}
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-primary/10">
                <Image className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Tracking Pixel</h2>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-8">
              A <strong className="text-foreground">tracking pixel</strong> is the &apos;image&apos; that you
              put in your sent e-mails. This pixel allows you to track your e-mail. A tracking pixel belongs to
              one mail tracking and has a unique token.
            </p>

            {/* ── Pixel: Create ── */}
            <SectionAnchor id="pixel-create" />
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <MethodBadge method="POST" />
                <h3 className="text-xl font-semibold">Create Tracking Pixel</h3>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-4">
                To create a new tracking pixel, send a <strong className="text-foreground">POST</strong> request
                to the endpoint below, where{' '}
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm">ID</code> is the ID of an existing
                mail tracking that has <strong className="text-foreground">no pixel yet</strong>.
              </p>

              <EndpointHeader method="POST" path="/mail-tracking/<ID>/pixel" />

              <h4 className="font-semibold mb-3 mt-6">Returns</h4>
              <p className="text-muted-foreground text-sm mb-4">
                Returns a <Badge variant="outline" className="text-green-600 dark:text-green-400">201 Created</Badge>{' '}
                response with a JSON body containing the ID, unique token, and URL of the tracking pixel. Embed
                this URL as an image in your outgoing e-mails.
              </p>

              <CodeBlock
                language="bash"
                code={`$ curl -X POST "https://peakpixel.com/api/v1/mail-tracking/123/pixel?key=<KEY>"`}
              />

              <JsonBlock
                label="201 Created — Response"
                code={`{
  "success": true,
  "msg": {
    "id": 144,
    "token": "fbAQfWDabnHgQNwf4CFZ.png",
    "url": "https://peakpixel.com/image/fbAQfWDabnHgQNwf4CFZ.png"
  }
}`}
              />
            </section>

            {/* ── Pixel: Get ── */}
            <SectionAnchor id="pixel-get" />
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <MethodBadge method="GET" />
                <h3 className="text-xl font-semibold">Get Tracking Pixel Information</h3>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-4">
                To retrieve information about a tracking pixel, send a{' '}
                <strong className="text-foreground">GET</strong> request to the endpoint below, where{' '}
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm">ID</code> is the ID of an existing
                tracking pixel.
              </p>

              <EndpointHeader method="GET" path="/pixel/<ID>" />

              <h4 className="font-semibold mb-3 mt-6">Returns</h4>
              <p className="text-muted-foreground text-sm mb-2">
                Returns a <Badge variant="outline" className="text-green-600 dark:text-green-400">200 OK</Badge>{' '}
                response with a JSON body containing:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside mb-4">
                <li><code className="bg-muted px-1 rounded">id</code> — ID of the tracking pixel</li>
                <li><code className="bg-muted px-1 rounded">created</code> — timestamp of creation (ms since epoch)</li>
                <li><code className="bg-muted px-1 rounded">token</code> — unique token of the tracking pixel</li>
                <li><code className="bg-muted px-1 rounded">url</code> — image URL of the tracking pixel</li>
                <li><code className="bg-muted px-1 rounded">timesOpened</code> — number of times triggered (excluding blacklisted IPs)</li>
                <li><code className="bg-muted px-1 rounded">mailTrackingId</code> — ID of the parent mail tracking</li>
                <li><code className="bg-muted px-1 rounded">mailTrackingUrl</code> — URL of the mail tracking dashboard</li>
              </ul>

              <CodeBlock
                language="bash"
                code={`$ curl -X GET "https://peakpixel.com/api/v1/pixel/123?key=<KEY>"`}
              />

              <JsonBlock
                label="200 OK — Response"
                code={`{
  "success": true,
  "msg": {
    "id": 123,
    "created": 1611599175410,
    "token": "fbAQfWDabnHgQNwf4CFZ.png",
    "url": "https://peakpixel.com/image/fbAQfWDabnHgQNwf4CFZ.png",
    "timesOpened": 50,
    "mailTrackingId": 465,
    "mailTrackingUrl": "https://peakpixel.com/tracking/465"
  }
}`}
              />
            </section>

            {/* ── Pixel: Get Data ── */}
            <SectionAnchor id="pixel-data" />
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-4">
                <MethodBadge method="GET" />
                <h3 className="text-xl font-semibold">Get Tracking Pixel Data</h3>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-4">
                To retrieve paginated tracked data collected by your tracking pixel, send a{' '}
                <strong className="text-foreground">GET</strong> request to the endpoint below.{' '}
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm">ID</code> is the ID of an existing
                tracking pixel. Data is sorted from <strong className="text-foreground">new to old</strong>, so
                the first record is the most recent.
              </p>

              <EndpointHeader method="GET" path="/pixel/<ID>/data?offset=<OFFSET>&limit=<LIMIT>" />

              <h4 className="font-semibold mb-3 mt-6">URL Parameters</h4>
              <div className="rounded-lg border border-border divide-y divide-border">
                <AttrRow name="offset" type="Integer (min: 0, max: 45000)" defaultVal="0">
                  Offset for the paginated result. With an offset of 0, you start at the most recent data.
                </AttrRow>
                <AttrRow name="limit" type="Integer (min: 1, max: 100)" defaultVal="10">
                  Limit for the paginated result. This is the maximum number of results on the requested page.
                </AttrRow>
              </div>

              <h4 className="font-semibold mb-3 mt-6">Returns</h4>
              <p className="text-muted-foreground text-sm mb-2">
                Returns a <Badge variant="outline" className="text-green-600 dark:text-green-400">200 OK</Badge>{' '}
                response with a JSON body containing:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside mb-4">
                <li><code className="bg-muted px-1 rounded">timesOpened</code> — total count (accounts for blacklisted IPs)</li>
                <li><code className="bg-muted px-1 rounded">offset</code> — given offset of the page</li>
                <li><code className="bg-muted px-1 rounded">limit</code> — max number of results on the page</li>
                <li><code className="bg-muted px-1 rounded">data[].date</code> — timestamp (ms since epoch), or <code className="bg-muted px-1 rounded">null</code> if date/time tracking is off</li>
                <li><code className="bg-muted px-1 rounded">data[].ipAddress</code> — tracked IP address, or <code className="bg-muted px-1 rounded">null</code> if IP tracking is off</li>
                <li><code className="bg-muted px-1 rounded">data[].userAgent</code> — tracked user-agent, or <code className="bg-muted px-1 rounded">null</code> if user-agent tracking is off</li>
                <li><code className="bg-muted px-1 rounded">data[].customData</code> — tracked custom data (omitted if none)</li>
              </ul>

              <CodeBlock
                language="bash"
                code={`$ curl -X GET "https://peakpixel.com/api/v1/pixel/123/data?offset=3&limit=50&key=<KEY>"`}
              />

              <JsonBlock
                label="200 OK — Response"
                code={`{
  "success": true,
  "msg": {
    "timesOpened": 200,
    "offset": 3,
    "limit": 50,
    "data": [
      {
        "date": 1631113189648,
        "ipAddress": "255.255.255.255",
        "userAgent": "Mozilla/5.0 ...",
        "customData": "My custom data"
      },
      {
        "date": 1631113195648,
        "ipAddress": "255.255.255.255",
        "userAgent": "Mozilla/5.0 ..."
      }
    ]
  }
}`}
              />
            </section>

            <Separator className="my-8" />

            {/* ════════════════════════════════════════════════════════════════
                TRACKABLE URL
            ════════════════════════════════════════════════════════════════ */}
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-primary/10">
                <Link2 className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Trackable URL</h2>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-8">
              A <strong className="text-foreground">trackable URL</strong> is a URL that you can track, just
              like tracking pixels. Whenever someone opens the URL it redirects to the website you have entered.
              A mail tracking can have up to <strong className="text-foreground">20 trackable URLs</strong>.
            </p>

            {/* ── URL: Create ── */}
            <SectionAnchor id="url-create" />
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <MethodBadge method="POST" />
                <h3 className="text-xl font-semibold">Create Trackable URL</h3>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-4">
                To create a trackable URL, send a <strong className="text-foreground">POST</strong> request to
                the endpoint below, where{' '}
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm">ID</code> is the ID of an existing
                mail tracking that has fewer than 20 trackable URLs. Provide a JSON body with the following
                attribute:
              </p>

              <EndpointHeader method="POST" path="/mail-tracking/<ID>/url" />

              <h4 className="font-semibold mb-3 mt-6">JSON Body Attributes</h4>
              <div className="rounded-lg border border-border">
                <AttrRow name="url" type="String (max. 512 chars)" required>
                  The full URL of the web page that the trackable URL should redirect to.
                </AttrRow>
              </div>

              <h4 className="font-semibold mb-3 mt-6">Returns</h4>
              <p className="text-muted-foreground text-sm mb-4">
                Returns a <Badge variant="outline" className="text-green-600 dark:text-green-400">201 Created</Badge>{' '}
                response with a JSON body containing the trackable URL (use this in your e-mail instead of the
                original URL), the unique ID, and the token.
              </p>

              <CodeBlock
                language="bash"
                code={`$ curl -X POST "https://peakpixel.com/api/v1/mail-tracking/4/url?key=<KEY>" \\
  -H "Content-type: application/json" \\
  -d '{"url":"https://mywebsite.com/"}'`}
              />

              <JsonBlock
                label="201 Created — Response"
                code={`{
  "success": true,
  "msg": {
    "id": 235,
    "token": "ZHMhkAbySWXFQqdpB7PQ",
    "trackableUrl": "https://peakpixel.com/url/ZHMhkAbySWXFQqdpB7PQ",
    "originalUrl": "https://mywebsite.com/"
  }
}`}
              />
            </section>

            {/* ── URL: Get ── */}
            <SectionAnchor id="url-get" />
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <MethodBadge method="GET" />
                <h3 className="text-xl font-semibold">Get Trackable URL Information</h3>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-4">
                To retrieve information about a trackable URL, send a{' '}
                <strong className="text-foreground">GET</strong> request to the endpoint below, where{' '}
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm">ID</code> is the ID of an existing
                trackable URL.
              </p>

              <EndpointHeader method="GET" path="/url/<ID>" />

              <h4 className="font-semibold mb-3 mt-6">Returns</h4>
              <p className="text-muted-foreground text-sm mb-2">
                Returns a <Badge variant="outline" className="text-green-600 dark:text-green-400">200 OK</Badge>{' '}
                response with a JSON body containing:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside mb-4">
                <li><code className="bg-muted px-1 rounded">id</code> — ID of the tracking URL</li>
                <li><code className="bg-muted px-1 rounded">created</code> — timestamp of creation (ms since epoch)</li>
                <li><code className="bg-muted px-1 rounded">token</code> — unique token of the tracking URL</li>
                <li><code className="bg-muted px-1 rounded">trackableUrl</code> — the tracking URL that redirects to <code className="bg-muted px-1 rounded">originalUrl</code></li>
                <li><code className="bg-muted px-1 rounded">originalUrl</code> — the URL where the tracking URL redirects to</li>
                <li><code className="bg-muted px-1 rounded">timesOpened</code> — number of times opened (excluding blacklisted IPs)</li>
                <li><code className="bg-muted px-1 rounded">mailTrackingId</code> — ID of the parent mail tracking</li>
                <li><code className="bg-muted px-1 rounded">mailTrackingUrl</code> — URL of the mail tracking dashboard</li>
              </ul>

              <CodeBlock
                language="bash"
                code={`$ curl -X GET "https://peakpixel.com/api/v1/url/756?key=<KEY>"`}
              />

              <JsonBlock
                label="200 OK — Response"
                code={`{
  "success": true,
  "msg": {
    "id": 756,
    "created": 1611599175410,
    "token": "fbAQfWDabnHgQNwf4Cqw",
    "trackableUrl": "https://peakpixel.com/url/fbAQfWDabnHgQNwf4Cqw",
    "originalUrl": "https://my-website.com/",
    "timesOpened": 89,
    "mailTrackingId": 465,
    "mailTrackingUrl": "https://peakpixel.com/tracking/465"
  }
}`}
              />
            </section>

            {/* ── URL: Get Data ── */}
            <SectionAnchor id="url-data" />
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <MethodBadge method="GET" />
                <h3 className="text-xl font-semibold">Get Trackable URL Data</h3>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-4">
                To retrieve paginated tracked data collected by your trackable URL, send a{' '}
                <strong className="text-foreground">GET</strong> request to the endpoint below.{' '}
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm">ID</code> is the ID of an existing
                trackable URL. Data is sorted from <strong className="text-foreground">new to old</strong>.
              </p>

              <EndpointHeader method="GET" path="/url/<ID>/data?offset=<OFFSET>&limit=<LIMIT>" />

              <h4 className="font-semibold mb-3 mt-6">URL Parameters</h4>
              <div className="rounded-lg border border-border divide-y divide-border">
                <AttrRow name="offset" type="Integer (min: 0, max: 45000)" defaultVal="0">
                  Offset for the paginated result. With an offset of 0, you start at the most recent data.
                </AttrRow>
                <AttrRow name="limit" type="Integer (min: 1, max: 100)" defaultVal="10">
                  Limit for the paginated result. This is the maximum number of results on the requested page.
                </AttrRow>
              </div>

              <h4 className="font-semibold mb-3 mt-6">Returns</h4>
              <p className="text-muted-foreground text-sm mb-2">
                Returns a <Badge variant="outline" className="text-green-600 dark:text-green-400">200 OK</Badge>{' '}
                response with a JSON body containing:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside mb-4">
                <li><code className="bg-muted px-1 rounded">timesOpened</code> — total count (accounts for blacklisted IPs)</li>
                <li><code className="bg-muted px-1 rounded">offset</code> — given offset of the page</li>
                <li><code className="bg-muted px-1 rounded">limit</code> — max number of results on the page</li>
                <li><code className="bg-muted px-1 rounded">data[].date</code> — timestamp (ms since epoch), or <code className="bg-muted px-1 rounded">null</code> if date/time tracking is off</li>
                <li><code className="bg-muted px-1 rounded">data[].ipAddress</code> — tracked IP address, or <code className="bg-muted px-1 rounded">null</code> if IP tracking is off</li>
                <li><code className="bg-muted px-1 rounded">data[].userAgent</code> — tracked user-agent, or <code className="bg-muted px-1 rounded">null</code> if user-agent tracking is off</li>
                <li><code className="bg-muted px-1 rounded">data[].customData</code> — tracked custom data (omitted if none)</li>
              </ul>

              <CodeBlock
                language="bash"
                code={`$ curl -X GET "https://peakpixel.com/api/v1/url/756/data?offset=0&limit=10&key=<KEY>"`}
              />

              <JsonBlock
                label="200 OK — Response"
                code={`{
  "success": true,
  "msg": {
    "timesOpened": 20,
    "offset": 0,
    "limit": 10,
    "data": [
      {
        "date": 1631113189648,
        "ipAddress": "255.255.255.255",
        "userAgent": "Mozilla/5.0 ...",
        "customData": "My custom data"
      },
      {
        "date": 1631113195648,
        "ipAddress": "255.255.255.255",
        "userAgent": "Mozilla/5.0 ..."
      }
    ]
  }
}`}
              />
            </section>

            {/* ── URL: Delete ── */}
            <SectionAnchor id="url-delete" />
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-4">
                <MethodBadge method="DELETE" />
                <h3 className="text-xl font-semibold">Delete Trackable URL</h3>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-4">
                To delete a trackable URL, send a <strong className="text-foreground">DELETE</strong> request to
                the endpoint below, where{' '}
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm">ID</code> is the ID of the trackable
                URL you want to delete.
              </p>

              <EndpointHeader method="DELETE" path="/url/<ID>" />

              <h4 className="font-semibold mb-3 mt-6">Returns</h4>
              <p className="text-muted-foreground text-sm mb-4">
                Returns a <Badge variant="outline" className="text-green-600 dark:text-green-400">200 OK</Badge>{' '}
                response with a JSON body indicating that the trackable URL has successfully been deleted.
              </p>

              <CodeBlock
                language="bash"
                code={`$ curl -X DELETE "https://peakpixel.com/api/v1/url/235?key=<KEY>"`}
              />

              <JsonBlock
                label="200 OK — Response"
                code={`{
  "success": true,
  "msg": "Trackable url successfully deleted."
}`}
              />
            </section>

            {/* ── Footer ── */}
            <Separator className="my-8" />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Logo size={20} />
                <span>PeakPixel API Documentation</span>
                <Badge variant="outline">v1</Badge>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/landing" className="hover:text-foreground transition-colors">
                  Home
                </Link>
                <Link href="/auth/sign-up" className="hover:text-foreground transition-colors">
                  Get Started
                </Link>
              </div>
            </div>
          </main>

          {/* ── Right TOC (on very wide screens) ── */}
          <aside className="hidden xl:block w-48 shrink-0 py-8">
            <div className="sticky top-24">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                On this page
              </p>
              <ul className="space-y-1 text-sm">
                {navSections.flatMap((s) =>
                  s.items.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => scrollTo(item.id)}
                        className={cn(
                          'w-full text-left px-2 py-1 rounded text-xs transition-colors cursor-pointer',
                          activeSection === item.id
                            ? 'text-primary font-medium'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {item.title}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

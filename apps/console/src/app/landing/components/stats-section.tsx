"use client"

import {
  Gauge,
  ShieldCheck,
  Zap,
  Scale
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { DotPattern } from '@/components/dot-pattern'


const stats = [
  {
    icon: Gauge,
    value: '1M+',
    label: 'Events per second handled',
    description: 'Built for the enterprise, our system scales with your traffic.'
  },
  {
    icon: ShieldCheck,
    value: '99.99%',
    label: 'Data Accuracy',
    description: 'Precision attribution and session modeling without compromise.'
  },
  {
    icon: Zap,
    value: '< 3KB',
    label: 'Tracking Pixel',
    description: 'Blazing-fast and privacy-compliant for optimal site performance.'
  },
  {
    icon: Scale,
    value: '100%',
    label: 'Cookieless & Privacy Compliant',
    description: 'GDPR, CCPA, and ePrivacy standards met by design.'
  }
]

export function StatsSection() {
  return (
    <section className="py-12 sm:py-16 relative">
      {/* Background with transparency */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-transparent to-secondary/20" />
      <DotPattern className="opacity-75" size="md" fadeStyle="circle" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="mx-auto max-w-3xl text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Proven Performance. Unmatched Scale.
          </h2>
          <p className="text-lg text-muted-foreground">
            See how our platform transforms your data strategy, even at hyper-growth.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="text-center bg-background/60 backdrop-blur-sm border-border/50 py-0"
            >
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                    {stat.value}
                  </h3>
                  <p className="font-semibold text-foreground">{stat.label}</p>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { CardDecorator } from '@/components/ui/card-decorator'
import { ShieldCheck, Radar, Workflow, Scale } from 'lucide-react'

const values = [
  {
    icon: ShieldCheck,
    title: 'Privacy-First Architecture',
    description: 'Purpose-built infrastructure designed to collect actionable data while protecting user privacy from the first event onward.'
  },
  {
    icon: Radar,
    title: 'Accurate Measurement',
    description: 'Preserve marketing visibility with event intelligence and attribution modeling that stays reliable in a cookieless world.'
  },
  {
    icon: Workflow,
    title: 'Responsible Growth',
    description: 'Move from fragmented signals to cohesive user journey insights without compromising trust or performance.'
  },
  {
    icon: Scale,
    title: 'Compliance by Design',
    description: 'Stay aligned with evolving regulations through privacy-aware defaults and governance-ready data handling practices.'
  }
]

export function AboutSection() {
  return (
    <section id="about" className="py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-4xl text-center mb-16">
          <Badge variant="outline" className="mb-4">
            About Our Platform
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            Your Privacy-First Foundation for Growth.
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            In a world moving beyond cookies, staying compliant and insightful is no longer a trade-off. We provide
            the essential infrastructure.
          </p>
        </div>

        {/* Modern Values Grid with Enhanced Design */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-4 mb-12">
          {values.map((value, index) => (
            <Card key={index} className='group shadow-xs py-2'>
              <CardContent className='p-8'>
                <div className='flex flex-col items-center text-center'>
                  <CardDecorator>
                    <value.icon className='h-6 w-6' aria-hidden />
                  </CardDecorator>
                  <h3 className='mt-6 font-medium text-balance'>{value.title}</h3>
                  <p className='text-muted-foreground mt-3 text-sm'>{value.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* About Content */}
        <div className="mx-auto max-w-5xl space-y-6 text-center">
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            The digital landscape is evolving. Third-party cookies are disappearing, privacy regulations are
            tightening, and users demand more control over their data. This shift has left many businesses
            struggling to accurately measure marketing performance and understand user journeys. Our platform was
            born from this challenge.
          </p>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            We built a robust, event-driven system from the ground up to empower businesses like yours. Our
            cookieless approach ensures that you collect valuable first-party behavioral data, model anonymous user
            sessions with precision, and achieve accurate campaign attribution – all while upholding the highest
            standards of user privacy and regulatory compliance. Stop guessing, start growing responsibly.
          </p>
        </div>
      </div>
    </section>
  )
}

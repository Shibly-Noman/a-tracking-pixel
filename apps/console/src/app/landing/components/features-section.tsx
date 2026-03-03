"use client"

import {
  Activity,
  Shield,
  Network,
  ArrowRight,
  Scale,
  Gauge,
  Lock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Image3D } from '@/components/image-3d'

const mainFeatures = [
  {
    icon: Activity,
    title: 'Future-Proof Data Collection',
    description:
      'Capture comprehensive first-party behavioral events (page views, custom actions) using a tiny, privacy-preserving JavaScript pixel. No cookies, no local storage, just clean, actionable data.'
  },
  {
    icon: Shield,
    title: 'Intelligent Session Reconstruction',
    description:
      'Our advanced server-side heuristics intelligently group events into anonymous sessions, providing accurate user journey insights without storing personally identifiable information or relying on cross-site identifiers.'
  },
  {
    icon: Network,
    title: 'Tailored Performance Insights',
    description:
      'Understand the true impact of your marketing efforts with configurable attribution models. Choose from Last-Touch, First-Touch, Time-Decay, and more to precisely credit the right touchpoints.'
  }
]

const secondaryFeatures = [
  {
    icon: Scale,
    title: 'Instant Operational Clarity',
    description:
      'Access live, low-latency dashboards displaying key metrics like event counts, conversion rates, and campaign breakdowns. Make data-driven decisions as they happen, not hours later.'
  },
  {
    icon: Gauge,
    title: 'Designed for Hyper-Growth',
    description:
      'Our distributed, event-driven architecture is built to handle millions of events per second, ensuring your tracking infrastructure grows seamlessly with your business, without performance bottlenecks.'
  },
  {
    icon: Lock,
    title: 'Built-in Trust & Regulation Adherence',
    description:
      'With immediate IP hashing, strict data retention policies, and architectural choices that prioritize privacy, our platform helps you meet GDPR, CCPA, and ePrivacy regulations effortlessly.'
  }
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 sm:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <Badge variant="outline" className="mb-4">Features</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Intelligence Without Compromise.
          </h2>
          <p className="text-lg text-muted-foreground">
            Explore the core capabilities that set your analytics and attribution apart.
          </p>
        </div>

        {/* First Feature Section */}
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8 xl:gap-16 mb-24">
          {/* Left Image */}
          <Image3D
            lightSrc="/feature-1-light.png"
            darkSrc="/feature-1-dark.png"
            alt="Analytics dashboard"
            direction="left"
          />
          {/* Right Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                Cookieless Event Tracking
              </h3>
              <p className="text-muted-foreground text-base text-pretty">
                Capture privacy-safe behavioral events without sacrificing depth, speed, or measurement accuracy.
              </p>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2">
              {mainFeatures.map((feature, index) => (
                <li key={index} className="group hover:bg-accent/5 flex items-start gap-3 p-2 rounded-lg transition-colors">
                  <div className="mt-0.5 flex shrink-0 items-center justify-center">
                    <feature.icon className="size-5 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-foreground font-medium">{feature.title}</h3>
                    <p className="text-muted-foreground mt-1 text-sm">{feature.description}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 pe-4 pt-2">
              <Button size="lg" className="cursor-pointer">
                <a href="https://PeakPixel.com/templates" className='flex items-center'>
                  Get Started Free
                  <ArrowRight className="ms-2 size-4" aria-hidden="true" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="cursor-pointer">
                <a href="#contact">
                  Request a Demo
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Second Feature Section - Flipped Layout */}
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8 xl:gap-16">
          {/* Left Content */}
          <div className="space-y-6 order-2 lg:order-1">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                Privacy, Scale, and Real-Time Clarity
              </h3>
              <p className="text-muted-foreground text-base text-pretty">
                Turn high-volume event streams into immediate, compliant decision intelligence for every marketing and product team.
              </p>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2">
              {secondaryFeatures.map((feature, index) => (
                <li key={index} className="group hover:bg-accent/5 flex items-start gap-3 p-2 rounded-lg transition-colors">
                  <div className="mt-0.5 flex shrink-0 items-center justify-center">
                    <feature.icon className="size-5 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-foreground font-medium">{feature.title}</h3>
                    <p className="text-muted-foreground mt-1 text-sm">{feature.description}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 pe-4 pt-2">
              <Button size="lg" className="cursor-pointer">
                <a href="#" className='flex items-center'>
                  View Documentation
                  <ArrowRight className="ms-2 size-4" aria-hidden="true" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="cursor-pointer">
                <a href="#pricing">
                  View Pricing
                </a>
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <Image3D
            lightSrc="/feature-2-light.png"
            darkSrc="/feature-2-dark.png"
            alt="Performance dashboard"
            direction="right"
            className="order-1 lg:order-2"
          />
        </div>
      </div>
    </section>
  )
}

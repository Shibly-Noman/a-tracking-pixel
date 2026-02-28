"use client"

import { CircleHelp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'

type FaqItem = {
  value: string
  question: string
  answer: string
}

const faqItems: FaqItem[] = [
  {
    value: 'item-1',
    question: 'How does your platform track events without cookies?',
    answer:
      'We use a combination of server-side heuristics, hashed client properties (like IP and user-agent), and advanced modeling to create anonymous session identifiers without storing any data in the user\'s browser (cookies or local storage).',
  },
  {
    value: 'item-2',
    question: 'Is your platform GDPR and CCPA compliant?',
    answer:
      'Yes, absolutely. Privacy by Design is a core principle. We immediately hash IPs, do not store raw PII, and offer configurable data retention, making it inherently compliant with major global privacy regulations.',
  },
  {
    value: 'item-3',
    question: 'What attribution models do you support?',
    answer:
      'We support a range of models including Last-Touch, First-Touch, Time-Decay, and custom session-based models, giving you flexibility to align with your marketing objectives.',
  },
  {
    value: 'item-4',
    question: 'How does the "1M+ events/second" scalability work?',
    answer:
      'Our architecture is entirely event-driven and distributed. Components like the Ingestion API and stream processors are stateless and horizontally scalable, leveraging technologies like Kafka and ClickHouse, allowing us to handle immense volumes of data efficiently.',
  },
  {
    value: 'item-5',
    question: 'Can I integrate with my existing data warehouse or BI tools?',
    answer:
      'Yes, our Query API allows for flexible data extraction. We also offer enterprise options for direct data warehouse integration and server-to-server exports.',
  },
]

const FaqSection = () => {
  return (
    <section id="faq" className="py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <Badge variant="outline" className="mb-4">FAQ</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Got Questions? We Have Answers.
          </h2>
          <p className="text-lg text-muted-foreground">
            Find quick answers to the most common queries about our platform.
          </p>
        </div>

        {/* FAQ Content */}
        <div className="max-w-4xl mx-auto">
          <div className='bg-transparent'>
            <div className='p-0'>
              <Accordion type='single' collapsible className='space-y-5'>
                {faqItems.map(item => (
                  <AccordionItem key={item.value} value={item.value} className='rounded-md !border bg-transparent'>
                    <AccordionTrigger className='cursor-pointer items-center gap-4 rounded-none bg-transparent py-2 ps-3 pe-4 hover:no-underline data-[state=open]:border-b'>
                      <div className='flex items-center gap-4'>
                        <div className='bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-full'>
                          <CircleHelp className='size-5' />
                        </div>
                        <span className='text-start font-semibold'>{item.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className='p-4 bg-transparent'>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Contact Support CTA */}
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Still have questions? We&apos;re here to help.
            </p>
            <Button className='cursor-pointer' asChild>
              <a href="#contact">
                Send Message
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export { FaqSection }

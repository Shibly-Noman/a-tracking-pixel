"use client"

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const blogs = [
    {
      id: 1,
      image: 'https://ui.shadcn.com/placeholder.svg',
      category: 'Cookieless Tracking',
      title: 'The End of the Cookie: What It Means for Your Marketing Strategy',
      description:
        'An in-depth look at the impact of cookie deprecation and how to prepare.',
    },
    {
      id: 2,
      image: 'https://ui.shadcn.com/placeholder.svg',
      category: 'Privacy',
      title: 'Building Trust: How Privacy-First Analytics Drives Customer Loyalty',
      description:
        'Exploring the benefits of a privacy-centric approach to data collection.',
    },
    {
      id: 3,
      image: 'https://ui.shadcn.com/placeholder.svg',
      category: 'Attribution',
      title: 'Beyond Last-Click: Choosing the Right Attribution Model for Your Business',
      description:
        'A guide to understanding and implementing various attribution methodologies.',
    },
  ]

export function BlogSection() {
  return (
    <section id="blog" className="py-24 sm:py-32 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <Badge variant="outline" className="mb-4">Latest Insights</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Insights for the Evolving Digital Landscape.
          </h2>
          <p className="text-lg text-muted-foreground">
            Stay ahead with expert articles on cookieless tracking, privacy, and digital attribution.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {blogs.map(blog => (
            <Card key={blog.id} className="overflow-hidden py-0">
              <CardContent className="px-0">
                <div className="aspect-video">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    width={400}
                    height={225}
                    className="size-full object-cover dark:invert dark:brightness-[0.95]"
                    loading="lazy"
                  />
                </div>
                <div className="space-y-3 p-6">
                  <p className="text-muted-foreground text-xs tracking-widest uppercase">
                    {blog.category}
                  </p>
                  <a
                    href="#"
                    onClick={e => e.preventDefault()}
                    className="cursor-pointer"
                  >
                    <h3 className="text-xl font-bold hover:text-primary transition-colors">{blog.title}</h3>
                  </a>
                  <p className="text-muted-foreground">{blog.description}</p>
                  <a
                    href="#"
                    onClick={e => e.preventDefault()}
                    className="inline-flex items-center gap-2 text-primary hover:underline cursor-pointer"
                  >
                    Read Article
                    <ArrowRight className="size-4" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button className="cursor-pointer" asChild>
            <a
              href="#"
              onClick={e => e.preventDefault()}
              className="inline-flex items-center gap-2"
            >
              Visit Our Blog
              <ArrowRight className="size-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}

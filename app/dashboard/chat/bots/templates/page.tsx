"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Bot, Check, Search, Star, Tag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import DashboardLayout from "@/components/layout/dashboard-layout"

interface BotTemplate {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  popularity: number
  image?: string
}

// Mock data for bot templates
const mockTemplates: BotTemplate[] = [
  {
    id: 'template1',
    name: 'Customer Support Bot',
    description: 'A general-purpose support bot that can handle common customer inquiries, troubleshooting, and FAQs.',
    category: 'Support',
    tags: ['customer service', 'support', 'FAQ'],
    popularity: 4.8,
    image: '/templates/support-bot.png'
  },
  {
    id: 'template2',
    name: 'Lead Generation Bot',
    description: 'Engage website visitors, qualify leads, and book meetings with your sales team.',
    category: 'Sales',
    tags: ['lead gen', 'sales', 'qualification'],
    popularity: 4.6,
    image: '/templates/lead-bot.png'
  },
  {
    id: 'template3',
    name: 'E-commerce Assistant',
    description: 'Help customers find products, answer questions about inventory, and provide order status updates.',
    category: 'E-commerce',
    tags: ['shopping', 'products', 'orders'],
    popularity: 4.7,
    image: '/templates/ecommerce-bot.png'
  },
  {
    id: 'template4',
    name: 'Appointment Scheduler',
    description: 'Allow customers to book, reschedule, or cancel appointments through chat.',
    category: 'Scheduling',
    tags: ['appointments', 'calendar', 'booking'],
    popularity: 4.5,
    image: '/templates/scheduler-bot.png'
  },
  {
    id: 'template5',
    name: 'IT Helpdesk Bot',
    description: 'Provide first-line IT support, troubleshoot common issues, and escalate complex problems.',
    category: 'Support',
    tags: ['IT', 'helpdesk', 'troubleshooting'],
    popularity: 4.4,
    image: '/templates/it-bot.png'
  },
  {
    id: 'template6',
    name: 'HR Assistant',
    description: 'Answer employee questions about policies, benefits, and procedures.',
    category: 'HR',
    tags: ['human resources', 'employees', 'policies'],
    popularity: 4.3,
    image: '/templates/hr-bot.png'
  }
]

export default function ChatbotTemplatesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Filter templates based on search query and selected category
  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...Array.from(new Set(mockTemplates.map(t => t.category)))]

  const handleUseTemplate = (templateId: string) => {
    // In a real app, you would create a new bot based on the template
    // For now, just navigate to the create page
    router.push(`/dashboard/chat/bots/create?template=${templateId}`)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/chat/bots">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Chatbot Templates</h1>
              <p className="text-muted-foreground">Pre-built chatbots for common use cases</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-6">
            {filteredTemplates.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTemplates.map((template) => (
                  <Card key={template.id} className="overflow-hidden">
                    <div className="aspect-video bg-muted flex items-center justify-center relative">
                      {template.image ? (
                        <Image
                          src={template.image}
                          alt={template.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Bot className="h-12 w-12 text-muted-foreground/50" />
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{template.name}</CardTitle>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span className="ml-1 text-sm">{template.popularity}</span>
                        </div>
                      </div>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">
                          <Tag className="mr-1 h-3 w-3" />
                          {template.category}
                        </Badge>
                        {template.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="capitalize">
                            {tag}
                          </Badge>
                        ))}
                        {template.tags.length > 2 && (
                          <Badge variant="secondary">+{template.tags.length - 2}</Badge>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" asChild>
                        <Link href={`/dashboard/chat/bots/templates/${template.id}`}>
                          Preview
                        </Link>
                      </Button>
                      <Button onClick={() => handleUseTemplate(template.id)}>
                        Use Template <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <Bot className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">No templates found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  We couldn't find any templates matching your search criteria.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Can't find what you're looking for?</CardTitle>
            <CardDescription>Start from scratch and build a custom chatbot</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              If none of our templates fit your needs, you can create a custom chatbot from scratch.
              Our intuitive builder makes it easy to design, train, and deploy your own AI-powered chatbot.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/dashboard/chat/bots/create">
                <Check className="mr-2 h-4 w-4" /> Create Custom Chatbot
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}

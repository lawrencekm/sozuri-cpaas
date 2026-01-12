"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Plus, 
  Image, 
  Video, 
  MapPin, 
  Star,
  Edit,
  Copy,
  Trash2,
  Eye,
  MoreHorizontal,
  Calendar,
  Users
} from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/layout/dashboard-layout"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

// Mock rich card templates
const richCardTemplates = [
  {
    id: "1",
    name: "Product Showcase Carousel",
    type: "carousel",
    description: "Multi-product carousel with images and CTAs",
    thumbnail: "/api/placeholder/300/200",
    usage: 45,
    lastUsed: "2024-01-20",
    status: "active",
    cards: 4
  },
  {
    id: "2",
    name: "Store Location Card",
    type: "location",
    description: "Interactive map with store details",
    thumbnail: "/api/placeholder/300/200",
    usage: 23,
    lastUsed: "2024-01-18",
    status: "active",
    cards: 1
  },
  {
    id: "3",
    name: "Event Invitation",
    type: "media",
    description: "Rich media card with event details",
    thumbnail: "/api/placeholder/300/200",
    usage: 67,
    lastUsed: "2024-01-19",
    status: "active",
    cards: 1
  },
  {
    id: "4",
    name: "Survey Card",
    type: "interactive",
    description: "Interactive survey with quick replies",
    thumbnail: "/api/placeholder/300/200",
    usage: 34,
    lastUsed: "2024-01-17",
    status: "draft",
    cards: 1
  }
]

// Card type templates
const cardTypes = [
  {
    type: "standalone",
    icon: Image,
    title: "Standalone Card",
    description: "Single rich media card with image, text, and actions",
    color: "bg-blue-100 text-blue-600"
  },
  {
    type: "carousel",
    icon: Star,
    title: "Carousel Cards",
    description: "Multiple cards in a horizontal scrollable format",
    color: "bg-purple-100 text-purple-600"
  },
  {
    type: "location",
    icon: MapPin,
    title: "Location Card",
    description: "Interactive map with location details",
    color: "bg-green-100 text-green-600"
  },
  {
    type: "media",
    icon: Video,
    title: "Media Card",
    description: "Rich media with video or audio content",
    color: "bg-red-100 text-red-600"
  }
]

export default function RichCardsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("templates")

  const getTypeColor = (type: string) => {
    switch (type) {
      case "carousel": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "location": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "media": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "interactive": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "draft": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "archived": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleCardAction = (action: string, cardId: string) => {
    switch (action) {
      case "edit":
        router.push(`/dashboard/messaging/rcs/rich-cards/${cardId}/edit`)
        break
      case "preview":
        console.log("Preview card:", cardId)
        break
      case "duplicate":
        console.log("Duplicate card:", cardId)
        break
      case "delete":
        console.log("Delete card:", cardId)
        break
      default:
        break
    }
  }

  return (
    <DashboardLayout>
      <motion.div className="flex flex-col space-y-6" initial="hidden" animate="visible" variants={staggerContainer}>
        {/* Header */}
        <motion.div className="flex items-center justify-between" variants={fadeIn}>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/messaging/rcs")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">RCS Rich Cards</h1>
              <p className="text-muted-foreground">Create interactive rich media cards for RCS messaging</p>
            </div>
          </div>
          <Button onClick={() => router.push("/dashboard/messaging/rcs/rich-cards/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Create Rich Card
          </Button>
        </motion.div>

        <motion.div variants={fadeIn}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="templates">Card Templates</TabsTrigger>
              <TabsTrigger value="builder">Card Builder</TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="space-y-6 mt-6">
              {/* Templates Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {richCardTemplates.map((template) => (
                  <motion.div key={template.id} variants={fadeIn}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                      <div className="relative">
                        <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-lg flex items-center justify-center">
                          <div className="text-center">
                            <Image className="h-12 w-12 mx-auto mb-2 text-muted-foreground" alt="Rich card preview placeholder" />
                            <p className="text-sm text-muted-foreground">Rich Card Preview</p>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleCardAction("edit", template.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleCardAction("preview", template.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleCardAction("duplicate", template.id)}>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleCardAction("delete", template.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base mb-1">{template.name}</CardTitle>
                            <CardDescription className="text-sm">{template.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className={getTypeColor(template.type)}>
                            {template.type.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className={getStatusColor(template.status)}>
                            {template.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {template.usage} uses
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(template.lastUsed)}
                            </span>
                          </div>
                          <span>{template.cards} card{template.cards > 1 ? 's' : ''}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="builder" className="space-y-6 mt-6">
              {/* Card Type Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Choose Card Type</CardTitle>
                  <CardDescription>Select the type of rich card you want to create</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {cardTypes.map((cardType, index) => {
                      const IconComponent = cardType.icon
                      return (
                        <div 
                          key={index} 
                          className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
                          onClick={() => router.push(`/dashboard/messaging/rcs/rich-cards/new?type=${cardType.type}`)}
                        >
                          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${cardType.color} mb-3`}>
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <h3 className="font-medium mb-1">{cardType.title}</h3>
                          <p className="text-sm text-muted-foreground">{cardType.description}</p>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Rich Card Features */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Rich Media Features</CardTitle>
                    <CardDescription>What you can include in RCS rich cards</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          <Image className="h-4 w-4" alt="" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">High-resolution Images</p>
                          <p className="text-xs text-muted-foreground">Up to 2MB per image</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600">
                          <Video className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Video Content</p>
                          <p className="text-xs text-muted-foreground">MP4, up to 10MB</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Location Sharing</p>
                          <p className="text-xs text-muted-foreground">Interactive maps</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                          <Star className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Suggested Actions</p>
                          <p className="text-xs text-muted-foreground">Quick reply buttons</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Best Practices</CardTitle>
                    <CardDescription>Tips for creating effective rich cards</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-medium text-blue-900">Keep it Simple</p>
                        <p className="text-xs text-blue-700">Focus on one main message per card</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm font-medium text-green-900">Use High Quality Media</p>
                        <p className="text-xs text-green-700">Ensure images are crisp and videos are clear</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <p className="text-sm font-medium text-purple-900">Clear Call-to-Actions</p>
                        <p className="text-xs text-purple-700">Make buttons and actions obvious</p>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <p className="text-sm font-medium text-orange-900">Test on Devices</p>
                        <p className="text-xs text-orange-700">Preview on different screen sizes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}

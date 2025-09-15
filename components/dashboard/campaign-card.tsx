import { ArrowRight, BarChart2, Calendar, MessageCircle, MoreHorizontal, Phone, Mail, Users } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"

interface CampaignProps {
  campaign: {
    id: string
    name: string
    description: string
    channel?: string
    status: string
    created_at?: string
    created?: string
    updated_at?: string
    updated?: string
    projectId?: string
    project_id?: string
    audience?: {
      total: number
      delivered: number
      failed: number
      opened: number
      clicked: number
    }
  }
}

export function CampaignCard({ campaign }: CampaignProps) {
  const router = useRouter()

  const getChannelIcon = (channel?: string) => {
    if (!channel) return <MessageCircle className="h-4 w-4 text-gray-500" />
    
    switch (channel.toLowerCase()) {
      case "sms":
        return <MessageCircle className="h-4 w-4 text-blue-500" />
      case "voice":
        return <Phone className="h-4 w-4 text-purple-500" />
      case "email":
        return <Mail className="h-4 w-4 text-green-500" />
      default:
        return <MessageCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string): "default" | "outline" | "secondary" | "destructive" => {
    switch (status.toLowerCase()) {
      case "active":
        return "default"
      case "draft":
        return "outline"
      case "scheduled":
        return "secondary"
      case "paused":
      case "failed":
        return "destructive"
      default:
        return "default"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <div className="h-2 w-2 rounded-full bg-green-500" />
      case "paused":
        return <div className="h-2 w-2 rounded-full bg-yellow-500" />
      case "scheduled":
        return <div className="h-2 w-2 rounded-full bg-blue-500" />
      case "failed":
        return <div className="h-2 w-2 rounded-full bg-red-500" />
      default:
        return <div className="h-2 w-2 rounded-full bg-gray-500" />
    }
  }

  const getCompletionRate = () => {
    if (!campaign.audience) return 0
    const { total, delivered } = campaign.audience
    return total ? Math.round((delivered / total) * 100) : 0
  }

  const getEngagementRate = () => {
    if (!campaign.audience) return 0
    const { delivered, clicked } = campaign.audience
    return delivered ? Math.round((clicked / delivered) * 100) : 0
  }

  const formatDate = (date: string | undefined) => {
    if (!date) return "N/A"
    try {
      const parsedDate = new Date(date)
      // Check if the date is valid
      if (isNaN(parsedDate.getTime())) {
        return "Invalid date"
      }
      return formatDistanceToNow(parsedDate, { addSuffix: true })
    } catch (error) {
      return "Invalid date"
    }
  }

  return (
    <Card className="group hover:border-primary/50 hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl group-hover:text-primary transition-colors">
              {campaign.name}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {campaign.description}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  router.push(
                    `/dashboard/campaigns/${campaign.id}`
                  )
                }
              >
                <BarChart2 className="mr-2 h-4 w-4" />
                View Analytics
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push(
                    `/dashboard/campaigns/${campaign.id}/edit`
                  )
                }
              >
                Edit Campaign
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Delete Campaign
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="space-y-1.5">
            <p className="text-muted-foreground text-xs">Channel</p>
            <div className="flex items-center font-medium">
              {getChannelIcon(campaign.channel)}
              <span className="ml-1.5 capitalize">{campaign.channel || "Unknown"}</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="text-muted-foreground text-xs">Status</p>
            <div className="flex items-center space-x-2">
              {getStatusIcon(campaign.status)}
              <Badge variant={getStatusColor(campaign.status)} className="capitalize">
                {campaign.status}
              </Badge>
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="text-muted-foreground text-xs">Created</p>
            <p className="font-medium">
              {formatDate(campaign.created_at || campaign.created || "")}
            </p>
          </div>
        </div>

        {campaign.audience && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="rounded-lg border p-2">
                <p className="text-xs text-muted-foreground mb-1">Recipients</p>
                <p className="text-lg font-semibold">{campaign.audience.total}</p>
              </div>
              <div className="rounded-lg border p-2">
                <p className="text-xs text-muted-foreground mb-1">Delivered</p>
                <p className="text-lg font-semibold">
                  {((campaign.audience.delivered / campaign.audience.total) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="rounded-lg border p-2">
                <p className="text-xs text-muted-foreground mb-1">Engagement</p>
                <p className="text-lg font-semibold">{getEngagementRate()}%</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Delivery Progress</span>
                <span className="font-medium">{getCompletionRate()}% Complete</span>
              </div>
              <div className="relative">
                <Progress value={getCompletionRate()} className="h-2" />
                {campaign.audience.failed > 0 && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
                    <p className="text-xs text-destructive font-medium mr-1">
                      {((campaign.audience.failed / campaign.audience.total) * 100).toFixed(1)}% Failed
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="ghost"
          size="sm"
          className="w-full hover:bg-primary/5 hover:text-primary"
          onClick={() =>
            router.push(
              `/dashboard/projects/${campaign.project_id || campaign.projectId}/campaigns/${campaign.id}`
            )
          }
        >
          View Campaign <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

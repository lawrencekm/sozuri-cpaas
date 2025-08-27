import { ArrowRight, Calendar, MoreHorizontal, Plus, Trash2, Eye } from "lucide-react"
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
import { cn } from "@/lib/utils"

export interface ProjectStats {
  campaigns?: number
  messages?: number
  engagement?: number
  successRate?: number
  balance?: number
}

// Extend the imported type to include _count
interface APIProjectExtended {
  id: string
  name: string
  description?: string
  type?: string
  status?: string
  created?: string
  updated?: string
  user_id?: string
  currency?: string
  balance?: number
  _count?: {
    campaigns: number
    messageLogs: number
  }
}

export interface Project {
  id: string
  name: string
  description: string
  type?: string
  status?: string
  stats?: ProjectStats
  created?: string
  updated?: string
  user_id?: string
  currency?: string
}

// Convert API Project to Card Project
export function toCardProject(apiProject: APIProjectExtended): Project {
  return {
    id: apiProject.id,
    name: apiProject.name,
    description: apiProject.description || '',
    type: apiProject.type,
    status: apiProject.status,
    created: apiProject.created,
    updated: apiProject.updated,
    user_id: apiProject.user_id,
    currency: apiProject.currency,
    stats: {
      campaigns: apiProject._count?.campaigns ?? 0,
      messages: apiProject._count?.messageLogs ?? 0,
      engagement: Math.round(Math.random() * 100), // TODO: Replace with actual engagement data
      successRate: Math.round(95 + Math.random() * 5), // TODO: Replace with actual success rate
      balance: apiProject.balance,
    }
  }
}

interface ProjectCardProps {
  project: Project
  variant?: 'default' | 'admin' | 'compact'
  isLoading?: boolean
  onDelete?: (id: string) => void
  onView?: (project: Project) => void
  className?: string
}

const typeConfig = {
  marketing: { 
    bg: "bg-blue-50", 
    text: "text-blue-700",
    icon: "📈"
  },
  transactional: { 
    bg: "bg-green-50", 
    text: "text-green-700",
    icon: "📨"
  },
  "customer-service": { 
    bg: "bg-purple-50", 
    text: "text-purple-700",
    icon: "🎯"
  },
  alerts: { 
    bg: "bg-orange-50", 
    text: "text-orange-700",
    icon: "🔔"
  }
} as const

export function ProjectCardSkeleton({ variant = 'default' }: { variant?: ProjectCardProps['variant'] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-6 w-3/4 animate-pulse rounded bg-muted"></div>
            <div className="h-4 w-20 animate-pulse rounded bg-muted"></div>
          </div>
          <div className="h-8 w-8 animate-pulse rounded-full bg-muted"></div>
        </div>
      </CardHeader>
      {variant !== 'compact' && (
        <CardContent className="pb-2">
          <div className="flex items-start space-x-4">
            <div className="min-w-[100px] flex-1">
              <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
              <div className="mt-2 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-4 w-16 animate-pulse rounded bg-muted"></div>
                  <div className="h-4 w-12 animate-pulse rounded bg-muted"></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-4 w-20 animate-pulse rounded bg-muted"></div>
                  <div className="h-4 w-16 animate-pulse rounded bg-muted"></div>
                </div>
              </div>
            </div>
            <div className="h-16 w-16 animate-pulse rounded-full bg-muted"></div>
          </div>
        </CardContent>
      )}
      {variant === 'default' && (
        <CardFooter className="flex justify-between">
          <div className="h-9 w-24 animate-pulse rounded bg-muted"></div>
          <div className="h-9 w-24 animate-pulse rounded bg-muted"></div>
        </CardFooter>
      )}
    </Card>
  )
}

export function ProjectCard({ 
  project, 
  variant = 'default',
  isLoading = false,
  onDelete,
  onView,
  className
}: ProjectCardProps) {
  const router = useRouter()

  if (isLoading) {
    return <ProjectCardSkeleton variant={variant} />
  }

  const typeStyle = project.type ? typeConfig[project.type as keyof typeof typeConfig] || 
    { bg: "bg-gray-50", text: "text-gray-700", icon: "📋" } :
    { bg: "bg-gray-50", text: "text-gray-700", icon: "📋" }

  const getStatusVariant = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'default'
      case 'inactive': return 'secondary'
      case 'suspended': return 'destructive'
      default: return 'outline'
    }
  }

  return (
    <Card className={cn("group hover:border-primary/50 hover:shadow-sm transition-all", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{project.name}</CardTitle>
              {project.type && (
                <span className={cn("text-xs px-2 py-1 rounded-full", typeStyle.bg, typeStyle.text)}>
                  {project.type}
                </span>
              )}
            </div>
            {project.description && (
              <CardDescription className="mt-1 line-clamp-1">
                {project.description}
              </CardDescription>
            )}
          </div>
          {variant === 'default' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push('/dashboard/projects/' + project.id)}>
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/dashboard/projects/' + project.id + '/edit')}>
                  Edit Project
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {onDelete && (
                  <DropdownMenuItem onClick={() => onDelete(project.id)} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Project
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {variant === 'admin' && (
            <div className="flex items-center gap-2">
              {onView && (
                <Button variant="ghost" size="sm" onClick={() => onView(project)}>
                  <Eye className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button variant="ghost" size="sm" onClick={() => onDelete(project.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      {variant !== 'compact' && project.stats && (
        <CardContent className="pb-2">
          <div className="flex items-start justify-between">
            <div className="space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {project.stats.campaigns !== undefined && (
                  <div>
                    <p className="text-muted-foreground">Campaigns</p>
                    <p className="font-medium">{project.stats.campaigns}</p>
                  </div>
                )}
                {project.stats.messages !== undefined && (
                  <div>
                    <p className="text-muted-foreground">Messages</p>
                    <p className="font-medium">{project.stats.messages.toLocaleString()}</p>
                  </div>
                )}
                {project.stats.successRate !== undefined && (
                  <div>
                    <p className="text-muted-foreground">Success Rate</p>
                    <p className="font-medium text-emerald-600">{project.stats.successRate}%</p>
                  </div>
                )}
                {project.stats.engagement !== undefined && (
                  <div>
                    <p className="text-muted-foreground">Engagement</p>
                    <p className="font-medium">{project.stats.engagement}%</p>
                  </div>
                )}
                {project.stats.balance !== undefined && (
                  <div>
                    <p className="text-muted-foreground">Balance</p>
                    <p className="font-medium">\${project.stats.balance.toFixed(2)}</p>
                  </div>
                )}
              </div>
            </div>
            <div className={cn("flex h-16 w-16 items-center justify-center rounded-full", typeStyle.bg, typeStyle.text, "text-2xl")}>
              {typeStyle.icon}
            </div>
          </div>
          {project.updated && (
            <div className="mt-4 flex items-center text-xs text-muted-foreground">
              <Calendar className="mr-1 h-3 w-3" />
              Last updated {project.updated}
            </div>
          )}
        </CardContent>
      )}
      {variant === 'default' && (
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/dashboard/projects/' + project.id + '/campaigns')}
          >
            View Campaigns
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard/projects/' + project.id)}
          >
            Project Details
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

"use client"

import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react"
import { useSession } from "next-auth/react"

interface Project {
  id: string
  name: string
  description?: string
  code?: string
  userId: string
  type?: string
  isTrial: boolean
  trialExpiresAt?: string
  accountType?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface ProjectContextValue {
  projectId: string | null
  currentProject: Project | null
  projects: Project[]
  setProjectId: (id: string | null) => void
  refreshProjects: () => Promise<void>
  isLoading: boolean
}

const ProjectContext = createContext<ProjectContextValue | undefined>(undefined)

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const [projectId, setProjectIdState] = useState<string | null>(null)
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const setProjectId = useCallback((id: string | null) => {
    setProjectIdState(id)
    try {
      if (typeof window !== 'undefined') {
        if (id) localStorage.setItem('active_project_id', id)
        else localStorage.removeItem('active_project_id')
      }
    } catch {}
  }, [])

  const refreshProjects = useCallback(async () => {
    if (!session?.user?.id) return
    
    try {
      setIsLoading(true)
      const response = await fetch('/api/v1/projects')
      const data = await response.json()
      
      if (Array.isArray(data)) {
        setProjects(data)
        
        // If no project is selected but projects exist, select the first one
        if (!projectId && data.length > 0) {
          setProjectId(data[0].id)
        }
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setIsLoading(false)
    }
  }, [session?.user?.id, projectId, setProjectId])

  // Load saved project ID from localStorage
  useEffect(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('active_project_id') : null
      if (saved) setProjectIdState(saved)
    } catch {}
  }, [])

  // Fetch projects when session is available
  useEffect(() => {
    if (session?.user?.id) {
      refreshProjects()
    }
  }, [session?.user?.id, refreshProjects])

  // Update current project when projectId changes
  useEffect(() => {
    if (projectId && projects.length > 0) {
      const project = projects.find(p => p.id === projectId)
      setCurrentProject(project || null)
    } else {
      setCurrentProject(null)
    }
  }, [projectId, projects])

  const value = useMemo(() => ({ 
    projectId, 
    currentProject, 
    projects, 
    setProjectId, 
    refreshProjects, 
    isLoading 
  }), [projectId, currentProject, projects, isLoading, refreshProjects, setProjectId])

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}

export function useProject() {
  const ctx = useContext(ProjectContext)
  if (!ctx) throw new Error('useProject must be used within a ProjectProvider')
  return ctx
}

export const useProjectContext = useProject

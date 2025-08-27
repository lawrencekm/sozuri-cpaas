"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

interface ProjectContextValue {
  projectId: string | null
  setProjectId: (id: string | null) => void
}

const ProjectContext = createContext<ProjectContextValue | undefined>(undefined)

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projectId, setProjectIdState] = useState<string | null>(null)

  useEffect(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('active_project_id') : null
      if (saved) setProjectIdState(saved)
    } catch {}
  }, [])

  const setProjectId = (id: string | null) => {
    setProjectIdState(id)
    try {
      if (typeof window !== 'undefined') {
        if (id) localStorage.setItem('active_project_id', id)
        else localStorage.removeItem('active_project_id')
      }
    } catch {}
  }

  const value = useMemo(() => ({ projectId, setProjectId }), [projectId])

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}

export function useProject() {
  const ctx = useContext(ProjectContext)
  if (!ctx) throw new Error('useProject must be used within a ProjectProvider')
  return ctx
}
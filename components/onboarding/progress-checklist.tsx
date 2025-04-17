"use client"

import { CheckCircle, Circle } from "lucide-react"
import { motion } from "framer-motion"

export function ProgressChecklist({ items }: { items: { id: string, label: string, completed: boolean }[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <motion.div 
          key={item.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3"
        >
          {item.completed ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground" />
          )}
          <span className={item.completed ? 'text-muted-foreground line-through' : ''}>
            {item.label}
          </span>
        </motion.div>
      ))}
    </div>
  )
} 
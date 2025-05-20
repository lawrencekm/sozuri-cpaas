import { ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OnboardingCardProps {
  isOpen: boolean
  isMinimized: boolean
  title: string
  titleIcon: ReactNode
  completionPercentage: number
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
  children: ReactNode
}

export function OnboardingCard({
  isOpen,
  isMinimized,
  title,
  titleIcon,
  completionPercentage,
  onClose,
  onMinimize,
  onMaximize,
  children
}: OnboardingCardProps) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={`fixed bottom-4 right-4 z-50 ${isMinimized ? 'w-auto' : 'w-[420px]'} rounded-lg border bg-background shadow-xl`}
      >
        {isMinimized ? (
          <div className="p-3 flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={onMaximize}
            >
              {titleIcon}
              <span className="font-medium">Getting Started Guide</span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {completionPercentage}%
              </span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                {titleIcon}
                <h3 className="font-semibold">{title}</h3>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {completionPercentage}% Complete
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={onMinimize}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {children}
          </>
        )}
      </motion.div>
    </AnimatePresence>
  )
} 
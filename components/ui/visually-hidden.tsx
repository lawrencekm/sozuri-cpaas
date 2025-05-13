"use client"

import { forwardRef, HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

const VisuallyHidden = forwardRef<
  HTMLSpanElement,
  HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        "absolute h-px w-px p-0 overflow-hidden whitespace-nowrap border-0",
        className
      )}
      {...props}
    />
  )
})

VisuallyHidden.displayName = "VisuallyHidden"

export { VisuallyHidden } 
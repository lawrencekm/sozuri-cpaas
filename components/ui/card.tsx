import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "interactive" | "glass" | "bordered" | "flat"
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variantStyles = {
    default: "rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300",
    interactive: "rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer",
    glass: "rounded-xl border border-white/20 bg-white/80 backdrop-blur-md text-card-foreground shadow-md dark:bg-black/50 dark:border-white/10",
    bordered: "rounded-xl border-2 bg-card text-card-foreground transition-colors duration-300",
    flat: "rounded-xl bg-muted/50 text-card-foreground transition-colors duration-300",
  }

  return (
    <div
      ref={ref}
      className={cn(
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    withBorder?: boolean
    withBackground?: boolean
  }
>(({ className, withBorder = false, withBackground = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-3 p-8",
      withBorder && "border-b border-gray-200 pb-6 dark:border-gray-700",
      withBackground && "bg-gray-50/50 rounded-t-xl dark:bg-gray-800/50",
      className
    )}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: "default" | "lg" | "xl"
  }
>(({ className, size = "default", ...props }, ref) => {
  const sizeClasses = {
    default: "text-lg font-semibold leading-none tracking-tight",
    lg: "text-xl font-semibold leading-none tracking-tight",
    xl: "text-2xl font-bold leading-none tracking-tight"
  }

  return (
    <div
      ref={ref}
      className={cn(sizeClasses[size], className)}
      {...props}
    />
  )
})
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    truncate?: boolean
  }
>(({ className, truncate = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-sm text-gray-600 dark:text-gray-400 leading-relaxed",
      truncate && "truncate",
      className
    )}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    padded?: boolean | "sm" | "md" | "lg" | "xl"
  }
>(({ className, padded = true, ...props }, ref) => {
  const paddingClasses = {
    true: "p-8 pt-0",
    false: "p-0",
    sm: "p-4 pt-0",
    md: "p-6 pt-0",
    lg: "p-8 pt-0",
    xl: "p-10 pt-0"
  }

  return (
    <div
      ref={ref}
      className={cn(
        paddingClasses[padded as keyof typeof paddingClasses],
        className
      )}
      {...props}
    />
  )
})
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    withBorder?: boolean
    align?: "left" | "center" | "right" | "between"
  }
>(({ className, withBorder = false, align = "left", ...props }, ref) => {
  const alignClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
    between: "justify-between"
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center p-8 pt-0",
        withBorder && "border-t border-gray-200 mt-6 pt-6 dark:border-gray-700",
        alignClasses[align],
        className
      )}
      {...props}
    />
  )
})
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

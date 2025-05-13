"use client"

import { WalkthroughProvider } from "@/components/onboarding/tooltip-walkthrough"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/lib/query-client"
import { ErrorProvider } from "@/components/error-handling/error-provider"
import { MetricsProvider } from "@/components/metrics/metrics-context"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorProvider>
      <WalkthroughProvider>
        <QueryClientProvider client={queryClient}>
          <MetricsProvider>
            {children}
          </MetricsProvider>
        </QueryClientProvider>
      </WalkthroughProvider>
    </ErrorProvider>
  )
}
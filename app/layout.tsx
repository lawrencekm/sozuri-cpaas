import type { Metadata } from "next"
import { Inter } from "next/font/google"
import './globals.css'
import { ReactQueryProvider } from "@/components/providers"
import { WalkthroughProvider } from "@/components/onboarding/tooltip-walkthrough"
import { MetricsProvider } from "@/components/metrics/metrics-context"
import { ErrorProvider } from "@/components/error-handling/error-provider"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SOZURI CPaaS Dashboard",
  description: "Communications Platform as a Service Dashboard for SOZURI",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={inter.className}>
        <ErrorProvider>
          <WalkthroughProvider>
            <ReactQueryProvider>
              <MetricsProvider>
                {children}
                <Toaster position="top-right" />
              </MetricsProvider>
            </ReactQueryProvider>
          </WalkthroughProvider>
        </ErrorProvider>
      </body>
    </html>
  )
}
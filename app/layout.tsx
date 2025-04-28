import type { Metadata } from "next"
import { Inter } from "next/font/google"
import './globals.css'
import { ReactQueryProvider } from "@/components/providers"
import { WalkthroughProvider } from "@/components/onboarding/tooltip-walkthrough"
import { MetricsProvider } from "@/components/metrics/metrics-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SOZURI CPaaS Dashboard",
  description: "Communications Platform as a Service Dashboard for SOZURI",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalkthroughProvider>
          <ReactQueryProvider>
            <MetricsProvider>
              {children}
            </MetricsProvider>
          </ReactQueryProvider>
        </WalkthroughProvider>
      </body>
    </html>
  )
}
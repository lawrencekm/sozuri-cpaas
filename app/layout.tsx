import type { Metadata } from "next"
import { Inter } from "next/font/google"
import './globals.css'
import { ReactQueryProvider } from "@/components/providers"
import { WalkthroughProvider } from "@/components/onboarding/tooltip-walkthrough"
import { MetricsProvider } from "@/components/metrics/metrics-context"
import { ErrorProvider } from "@/components/error-handling/error-provider"
import { Toaster } from "react-hot-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SOZURI CPaaS Dashboard",
  description: "Communications Platform as a Service Dashboard for SOZURI",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorProvider>
          <WalkthroughProvider>
            <ReactQueryProvider>
              <MetricsProvider>
                {children}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 5000,
                    style: {
                      background: '#736565',
                      color: '#333333',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      borderRadius: '8px',
                      padding: '12px 16px',
                    },
                    success: {
                      iconTheme: {
                        primary: '#10B981',
                        secondary: '#FFFFFF',
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: '#EF4444',
                        secondary: '#FFFFFF',
                      },
                      style: {
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                      },
                    },
                  }}
                />
              </MetricsProvider>
            </ReactQueryProvider>
          </WalkthroughProvider>
        </ErrorProvider>
      </body>
    </html>
  )
}
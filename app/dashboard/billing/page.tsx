"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CreditCard, Download, FileText, History, LineChart, Plus, Receipt, RefreshCw, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/layout/dashboard-layout"

interface PaymentMethod {
  id: string
  type: 'card' | 'bank'
  last4?: string
  bankName?: string
  expiry?: string
}

// Top-up Dialog Component
function TopUpDialog() {
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [open, setOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Replace with actual API call
      // const response = await fetch('/api/billing/topup', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ amount, paymentMethod }),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setOpen(false)
    } catch (error) {
      console.error("Error processing top-up:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Top Up Balance
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Top Up Account Balance</DialogTitle>
            <DialogDescription>Add funds to your SOZURI Connect account</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                <Input
                  id="amount"
                  type="number"
                  min="10"
                  step="5"
                  className="pl-7"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-2 mt-1">
                {["50", "100", "200", "500"].map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(quickAmount)}
                  >
                    ${quickAmount}
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                    <CreditCard className="h-4 w-4" /> Credit/Debit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer">
                    <Wallet className="h-4 w-4" /> Bank Transfer
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!amount || isSubmitting}>
              {isSubmitting ? "Processing..." : "Confirm Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Recommended interface
interface BillingData {
  balance: number
  currency: string
  paymentMethods: PaymentMethod[]
  billingCycle: string
  nextInvoiceDate: string
  currentUsage: number
}

export default function BillingPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [billingData, setBillingData] = useState<BillingData | null>(null)

  useEffect(() => {
    console.log("Billing page mounted")
    // Fetch billing data
    const fetchBillingData = async () => {
      try {
        // Replace with actual API call
        // const response = await fetch('/api/billing');
        // if (!response.ok) throw new Error('Failed to fetch billing data');
        // const data = await response.json();
        // setBillingData(data);

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Set billing data to null to simulate empty state
        setBillingData(null)
      } catch (error) {
        console.error("Error fetching billing data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBillingData()
  }, [])

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6 flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Billing & Usage</h1>
            <p className="text-muted-foreground">Manage your account balance, usage, and billing information</p>
          </div>
          <TopUpDialog />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Account Balance</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
              ) : (
                <div className="text-2xl font-bold">${billingData?.balance || "0.00"}</div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/dashboard/billing/payment-methods">
                  <CreditCard className="mr-2 h-4 w-4" /> Payment Methods
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Usage</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
              ) : (
                <div className="text-2xl font-bold">${billingData?.currentUsage || "0.00"}</div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/dashboard/billing/usage-details">
                  <LineChart className="mr-2 h-4 w-4" /> Usage Details
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Billing Cycle</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
              ) : (
                <div className="text-2xl font-bold">{billingData?.billingCycle || "Monthly"}</div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/dashboard/billing/settings">
                  <RefreshCw className="mr-2 h-4 w-4" /> Billing Settings
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Next Invoice</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
              ) : (
                <div className="text-2xl font-bold">{billingData?.nextInvoiceDate || "N/A"}</div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/dashboard/billing/invoices">
                  <Receipt className="mr-2 h-4 w-4" /> View Invoices
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Tabs defaultValue="usage" className="w-full">
          <TabsList>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="plans">Plans & Add-ons</TabsTrigger>
          </TabsList>

          <TabsContent value="usage" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Usage Breakdown</CardTitle>
                    <CardDescription>Detailed breakdown of your service usage</CardDescription>
                  </div>
                  <Select defaultValue="30days">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">Last 7 days</SelectItem>
                      <SelectItem value="30days">Last 30 days</SelectItem>
                      <SelectItem value="90days">Last 90 days</SelectItem>
                      <SelectItem value="custom">Custom range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <div className="h-8 w-full animate-pulse rounded bg-muted"></div>
                    <div className="h-64 w-full animate-pulse rounded bg-muted"></div>
                  </div>
                ) : (
                  <div className="h-[400px] flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center text-center">
                      <LineChart className="h-10 w-10 text-muted-foreground/50" />
                      <h3 className="mt-4 text-lg font-medium">No Usage Data Available</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Start using our services to see your usage data here
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Invoices</CardTitle>
                    <CardDescription>View and download your invoices</CardDescription>
                  </div>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Export All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 w-full animate-pulse rounded bg-muted"></div>
                    ))}
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center text-center">
                      <FileText className="h-10 w-10 text-muted-foreground/50" />
                      <h3 className="mt-4 text-lg font-medium">No Invoices Available</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Your invoices will appear here once generated
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>View your account transactions</CardDescription>
                  </div>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-16 w-full animate-pulse rounded bg-muted"></div>
                    ))}
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center text-center">
                      <History className="h-10 w-10 text-muted-foreground/50" />
                      <h3 className="mt-4 text-lg font-medium">No Transactions Available</h3>
                      <p className="mt-2 text-sm text-muted-foreground">Your transaction history will appear here</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plans" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Plans & Add-ons</CardTitle>
                <CardDescription>Manage your subscription plans and add-ons</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-6">
                    <div className="h-32 w-full animate-pulse rounded bg-muted"></div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="h-48 w-full animate-pulse rounded bg-muted"></div>
                      <div className="h-48 w-full animate-pulse rounded bg-muted"></div>
                    </div>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center text-center">
                      <CreditCard className="h-10 w-10 text-muted-foreground/50" />
                      <h3 className="mt-4 text-lg font-medium">No Active Plans</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Subscribe to a plan to enhance your messaging capabilities
                      </p>
                      <Button className="mt-4" asChild>
                        <Link href="/dashboard/billing/plans">View Available Plans</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

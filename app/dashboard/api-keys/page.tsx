"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, Copy, Eye, EyeOff, Key, Plus, RefreshCw, Trash2 } from "lucide-react"
import { randomBytes } from "crypto"
import { toast } from "react-hot-toast"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/layout/dashboard-layout"

interface ApiKey {
  id: string
  name: string
  key: string
  permissions: 'read' | 'write' | 'admin'
  active: boolean
  created: string
  expires?: string
}

// New API Key Dialog
function NewApiKeyDialog() {
  const [name, setName] = useState("")
  const [permissions, setPermissions] = useState("read")
  const [expiresIn, setExpiresIn] = useState("never")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [open, setOpen] = useState(false)
  const [newKey, setNewKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Replace with actual API call
      // const response = await fetch('/api/api-keys', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ name, permissions, expiresIn }),
      // });
      // if (!response.ok) throw new Error('Failed to create API key');
      // const data = await response.json();

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate generated API key
      const newKey = randomBytes(32).toString('hex')
      setNewKey(newKey)
    } catch (error) {
      console.error("Error creating API key:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = () => {
    if (newKey) {
      navigator.clipboard.writeText(newKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const closeDialog = () => {
    setOpen(false)
    setNewKey(null)
    setName("")
    setPermissions("read")
    setExpiresIn("never")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create API Key
        </Button>
      </DialogTrigger>
      <DialogContent>
        {!newKey ? (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>Generate a new API key for your applications</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Key Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Production Server"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="permissions">Permissions</Label>
                <Select value={permissions} onValueChange={setPermissions}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select permissions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="read">Read Only</SelectItem>
                    <SelectItem value="write">Read & Write</SelectItem>
                    <SelectItem value="admin">Full Access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expires">Expires In</Label>
                <Select value={expiresIn} onValueChange={setExpiresIn}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select expiration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30days">30 Days</SelectItem>
                    <SelectItem value="90days">90 Days</SelectItem>
                    <SelectItem value="1year">1 Year</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={!name || isSubmitting}>
                {isSubmitting ? "Generating..." : "Generate Key"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>API Key Generated</DialogTitle>
              <DialogDescription>
                Make sure to copy your API key now. You won't be able to see it again!
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Your API Key</Label>
                <div className="flex items-center">
                  <div className="relative flex-1">
                    <Input value={newKey} readOnly className="pr-10 font-mono text-sm" />
                  </div>
                  <Button type="button" variant="ghost" size="icon" className="ml-2" onClick={copyToClipboard}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  This key will only be displayed once and cannot be retrieved later.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={closeDialog}>Done</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

// API Key Component
function ApiKeyItem({ apiKey, onDelete, onRegen }: { apiKey: ApiKey; onDelete: () => void; onRegen: () => void }) {
  const [showKey, setShowKey] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey.key)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col space-y-2 rounded-md border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Key className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{apiKey.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setShowKey(!showKey)}>
            {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={copyToClipboard}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={onRegen}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 font-mono text-xs text-muted-foreground">
          {showKey ? apiKey.key : apiKey.key.substring(0, 10) + "..." + apiKey.key.substring(apiKey.key.length - 5)}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Created: {apiKey.created}</span>
          {apiKey.expires && <span className="text-xs text-muted-foreground">Expires: {apiKey.expires}</span>}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-xs ${apiKey.permissions === "admin" ? "text-red-500" : "text-muted-foreground"}`}>
            {apiKey.permissions === "read"
              ? "Read Only"
              : apiKey.permissions === "write"
                ? "Read & Write"
                : "Full Access"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Status:</span>
          <span className={`text-xs ${apiKey.active ? "text-green-500" : "text-red-500"}`}>
            {apiKey.active ? "Active" : "Inactive"}
          </span>
          <Switch checked={apiKey.active} />
        </div>
      </div>
    </div>
  )
}

export default function ApiKeysPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  
  const { data: apiKeys, isLoading, isError, error } = useQuery({
    queryKey: ['apiKeys'],
    queryFn: async () => {
      const response = await fetch('/api/api-keys')
      if (!response.ok) throw new Error('Failed to fetch API keys')
      return response.json()
    },
    retry: 2
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetch(`/api/api-keys/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['apiKeys'] })
  })

  const regenerateMutation = useMutation({
    mutationFn: (id: string) => fetch(`/api/api-keys/${id}/regenerate`, { method: 'POST' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['apiKeys'] })
  })

  if (isError) return <div>Error: {error.message}</div>

  const handleDeleteKey = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id)
    } catch (error) {
      console.error("Error deleting API key:", error)
    }
  }

  const handleRegenerateKey = async (id: string) => {
    try {
      const isRateLimited = await rateLimitExceeded()
      if (isRateLimited) {
        toast.error("Too many requests - try again later")
        return
      }
      await regenerateMutation.mutateAsync(id)
    } catch (error) {
      console.error("Error regenerating API key:", error)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
            <p className="text-muted-foreground">Manage API keys for your applications</p>
          </div>
          <NewApiKeyDialog />
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList>
            <TabsTrigger value="active">Active Keys</TabsTrigger>
            <TabsTrigger value="expired">Expired Keys</TabsTrigger>
            <TabsTrigger value="usage">API Usage</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Active API Keys</CardTitle>
                <CardDescription>Manage your active API keys</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-24 w-full animate-pulse rounded bg-muted"></div>
                    ))}
                  </div>
                ) : apiKeys?.length > 0 ? (
                  <div className="space-y-4">
                    {apiKeys.map((apiKey: ApiKey) => (
                      <ApiKeyItem
                        key={apiKey.id}
                        apiKey={apiKey}
                        onDelete={() => handleDeleteKey(apiKey.id)}
                        onRegen={() => handleRegenerateKey(apiKey.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex h-[200px] items-center justify-center">
                    <div className="flex flex-col items-center justify-center text-center">
                      <Key className="h-10 w-10 text-muted-foreground/50" />
                      <h3 className="mt-4 text-lg font-medium">No API Keys</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Create your first API key to integrate with our services
                      </p>
                      <DialogTrigger asChild>
                        <Button className="mt-4">
                          <Plus className="mr-2 h-4 w-4" /> Create API Key
                        </Button>
                      </DialogTrigger>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expired" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Expired API Keys</CardTitle>
                <CardDescription>View your expired API keys</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-24 w-full animate-pulse rounded bg-muted"></div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-[200px] items-center justify-center">
                    <div className="flex flex-col items-center justify-center text-center">
                      <Key className="h-10 w-10 text-muted-foreground/50" />
                      <h3 className="mt-4 text-lg font-medium">No Expired Keys</h3>
                      <p className="mt-2 text-sm text-muted-foreground">Expired API keys will appear here</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>API Usage</CardTitle>
                <CardDescription>Monitor your API usage and rate limits</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-6">
                    <div className="h-8 w-full animate-pulse rounded bg-muted"></div>
                    <div className="h-64 w-full animate-pulse rounded bg-muted"></div>
                  </div>
                ) : (
                  <div className="flex h-[300px] items-center justify-center">
                    <div className="flex flex-col items-center justify-center text-center">
                      <RefreshCw className="h-10 w-10 text-muted-foreground/50" />
                      <h3 className="mt-4 text-lg font-medium">No API Usage Data</h3>
                      <p className="mt-2 text-sm text-muted-foreground">Start using our API to see usage statistics</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>API Documentation</CardTitle>
            <CardDescription>Learn how to integrate with our API</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <p className="text-sm text-muted-foreground">
                Our comprehensive API documentation provides all the information you need to integrate SOZURI Connect
                with your applications.
              </p>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Getting Started</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Learn the basics of our API and how to make your first request.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push("/dashboard/developers/getting-started")}
                    >
                      View Guide
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">API Reference</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Detailed documentation of all API endpoints, parameters, and responses.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push("/dashboard/developers/api-reference")}
                    >
                      View Reference
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Code Examples</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Sample code in various programming languages to help you get started.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push("/dashboard/developers/code-examples")}
                    >
                      View Examples
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => router.push("/dashboard/developers")}>
              Visit Developer Portal
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}

function rateLimitExceeded(): boolean {
  // Implement actual rate limiting logic
  return false // Return true if rate limited
}


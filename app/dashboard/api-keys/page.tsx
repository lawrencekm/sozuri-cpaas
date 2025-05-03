"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, Copy, Eye, EyeOff, Key, Plus, RefreshCw, Trash2, AlertTriangleIcon, ArrowLeft } from "lucide-react"
import { randomBytes } from "crypto"
import { toast } from "react-hot-toast"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { handleError, ErrorType } from "@/lib/error-handler"
import { useApi } from "@/hooks/use-api"
import { ErrorBoundary, ComponentErrorBoundary } from "@/components/error-handling/error-boundary"

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useWalkthrough } from "@/components/onboarding/tooltip-walkthrough"
import Link from "next/link"

interface ApiKey {
  id: string
  name: string
  key: string
  permissions: 'read' | 'write' | 'admin'
  active: boolean
  created: string
  expires?: string
}

// Define the expected shape of the data for key creation
interface CreateApiKeyPayload {
  name: string;
  permissions: string;
  expiresIn: string;
}

// Define the expected shape of the successful response (simulated)
interface CreateApiKeyResponse {
  key: string;
}

// New API Key Dialog Component Props
interface NewApiKeyDialogProps {
  onSuccess?: () => void; // Callback on successful creation
  // Allow passing walkthrough props if needed
  [key: string]: any; 
}

// New API Key Dialog
function NewApiKeyDialog({ onSuccess, ...props }: NewApiKeyDialogProps) {
  const [name, setName] = useState("")
  const [permissions, setPermissions] = useState("read")
  const [expiresIn, setExpiresIn] = useState("never")
  // isSubmitting state will be replaced by mutation.isPending
  const [open, setOpen] = useState(false)
  const [newKey, setNewKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const queryClient = useQueryClient(); // Get query client for invalidation

  // Define the mutation function (simulated API call)
  const createApiKeyFn = async (keyData: CreateApiKeyPayload): Promise<CreateApiKeyResponse> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    // Simulate generated API key
    const generatedKey = randomBytes(32).toString('hex') 
    return { key: generatedKey }
    // Replace above simulation with actual API call:
    // const response = await fetch('/api/api-keys', { // Assuming endpoint exists
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(keyData),
    // });
    // if (!response.ok) {
    //   const errorData = await response.json().catch(() => ({ message: 'Failed to create API key' }))
    //   throw new Error(errorData.message || 'Failed to create API key');
    // }
    // return await response.json();
  };

  // Use useMutation hook
  const mutation = useMutation<CreateApiKeyResponse, Error, CreateApiKeyPayload>({
    mutationFn: createApiKeyFn,
    onSuccess: (data) => {
      setNewKey(data.key)
      toast.success("API key created successfully")
      // Call the onSuccess prop passed from the parent (e.g., to invalidate queries)
      if (onSuccess) {
        onSuccess()
      }
    },
    onError: (error) => {
      // Use centralized error handler
      handleError(error, ErrorType.API, {
        toastMessage: "Failed to create API key. Please try again.",
        context: { source: 'NewApiKeyDialog.createMutation' }
      })
      // setError state could be used here if needed for inline errors
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // No need to manually set loading state, use mutation.isPending
    mutation.mutate({ name, permissions, expiresIn });
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
              <Button type="submit" disabled={!name || mutation.isPending}>
                {mutation.isPending ? "Generating..." : "Generate Key"}
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

// ----- Extracted Tab Content Components -----

interface ActiveApiKeysTabProps {
  apiKeys: ApiKey[] | undefined;
  isLoading: boolean;
  handleDeleteKey: (id: string) => void;
  handleRegenerateKey: (id: string) => void;
  deleteErrorKeyId: string | null;
  regenErrorKeyId: string | null;
  // Note: NewApiKeyDialog trigger is kept inside for the empty state
}

function ActiveApiKeysTab({ 
  apiKeys, 
  isLoading, 
  handleDeleteKey, 
  handleRegenerateKey, 
  deleteErrorKeyId, 
  regenErrorKeyId 
}: ActiveApiKeysTabProps) {
  // TODO: Implement copy, regen, delete actions on table buttons
  const handleCopyKey = (key: string) => {
     navigator.clipboard.writeText(key);
     toast.success("API Key copied to clipboard"); // Provide feedback
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active API Keys</CardTitle>
        <CardDescription>Manage your active API keys</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 w-full animate-pulse rounded bg-muted"></div> // Adjusted height
            ))}
          </div>
        ) : apiKeys && apiKeys.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Key Preview</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="text-right">Actions</TableHead> 
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((apiKey: ApiKey) => (
                <TableRow key={apiKey.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{apiKey.name}</TableCell>
                  <TableCell>
                    <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                      {apiKey.key.substring(0, 8)}...{apiKey.key.slice(-4)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={apiKey.permissions === 'admin' ? 'destructive' : 'outline'}>
                      {apiKey.permissions}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${apiKey.active ? 'bg-green-500' : 'bg-red-500'}`} />
                      {apiKey.active ? 'Active' : 'Inactive'}
                    </div>
                  </TableCell>
                  <TableCell>{apiKey.expires || 'Never'}</TableCell>
                  <TableCell className="text-right"> 
                    <Button variant="ghost" size="icon" onClick={() => handleCopyKey(apiKey.key)} title="Copy Key">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleRegenerateKey(apiKey.id)} title="Regenerate Key">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                     <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteKey(apiKey.id)} title="Delete Key">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex h-[200px] items-center justify-center">
            <div className="flex flex-col items-center justify-center text-center">
              <Key className="h-10 w-10 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">No Active API Keys</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Create your first API key to integrate with our services
              </p>
              {/* Keep DialogTrigger here for empty state */}
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
  );
}

// Placeholder for other tab components
function ExpiredApiKeysTab() {
 return (
    <Card>
      <CardHeader>
        <CardTitle>Expired API Keys</CardTitle>
        <CardDescription>View your expired API keys</CardDescription>
      </CardHeader>
      <CardContent>
          <div className="flex h-[200px] items-center justify-center">
            <div className="flex flex-col items-center justify-center text-center">
              <Key className="h-10 w-10 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">No Expired Keys</h3>
              <p className="mt-2 text-sm text-muted-foreground">Expired API keys will appear here</p>
            </div>
          </div>
      </CardContent>
    </Card>
  );
}

function ApiUsageTab({ isLoading }: { isLoading: boolean }) {
 return (
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
 );
}

// API Documentation Section Component
function ApiDocumentationSection() {
  const router = useRouter(); // Get router instance for navigation

  return (
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
                  onClick={() => router.push("/dashboard/developers/getting-started")} // Use router.push
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
                  onClick={() => router.push("/dashboard/developers/api-reference")} // Use router.push
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
                  onClick={() => router.push("/dashboard/developers/code-examples")} // Use router.push
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
  );
}

// ----- Main Page Component -----

export default function ApiKeysPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { endWalkthrough } = useWalkthrough()

  // State for inline error indicators
  const [deleteErrorKeyId, setDeleteErrorKeyId] = useState<string | null>(null);
  const [regenErrorKeyId, setRegenErrorKeyId] = useState<string | null>(null);

  // Use React Query with proper error handling - Corrected destructuring
  const { data: apiKeys, isLoading, isError, error } = useQuery<ApiKey[], Error>({
    queryKey: ['apiKeys'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/api-keys')
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to fetch API keys')
        }
        return response.json()
      } catch (error: any) {
        // Use our centralized error handler
        handleError(error, ErrorType.API, {
          toastMessage: "Failed to load API keys",
          context: { source: 'ApiKeysPage.fetchApiKeys' }
        })
        throw error
      }
    },
    retry: 2
  })

  // Delete API key mutation with error handling
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await fetch(`/api/api-keys/${id}`, { method: 'DELETE' })
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to delete API key')
        }
        return response.json()
      } catch (error: any) {
        handleError(error, ErrorType.API, {
          toastMessage: "Failed to delete API key",
          context: { keyId: id, source: 'ApiKeysPage.deleteMutation' }
        })
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] })
      toast.success("API key deleted successfully")
      setDeleteErrorKeyId(null); // Clear error on success
    },
    onError: (error, id) => {
      // Error already handled in mutationFn by handleError
      setDeleteErrorKeyId(id); // Set error state for the specific key
    }
  })

  // Regenerate API key mutation with error handling
  const regenerateMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await fetch(`/api/api-keys/${id}/regenerate`, { method: 'POST' })
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to regenerate API key')
        }
        return response.json()
      } catch (error: any) {
        handleError(error, ErrorType.API, {
          toastMessage: "Failed to regenerate API key",
          context: { keyId: id, source: 'ApiKeysPage.regenerateMutation' }
        })
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] })
      toast.success("API key regenerated successfully")
      setRegenErrorKeyId(null); // Clear error on success
    },
    onError: (error, id) => {
      // Error already handled in mutationFn by handleError
      setRegenErrorKeyId(id); // Set error state for the specific key
    }
  })

  // Filter keys (Example - adjust based on actual data structure if needed)
  const activeKeys = apiKeys?.filter((key: ApiKey) => key.active);
  const expiredKeys = apiKeys?.filter((key: ApiKey) => !key.active);

  // Custom error UI for the entire page
  if (isError) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100/80">
            <AlertTriangleIcon className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="mt-6 text-xl font-semibold">Failed to load API keys</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
          <Button
            onClick={() => queryClient.invalidateQueries({ queryKey: ['apiKeys'] })}
            className="mt-6"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  const handleDeleteKey = async (id: string) => {
    setDeleteErrorKeyId(null); // Clear previous error before trying again
    try {
      // TODO: Implement confirmation dialog before deleting
      await deleteMutation.mutateAsync(id)
    } catch (error) {
      // Error already handled in mutation
    }
  }

  const handleRegenerateKey = async (id: string) => {
    setRegenErrorKeyId(null); // Clear previous error before trying again
    try {
      // Removed client-side rate limit check here
      // Rely on server-side limiting and Axios interceptor for 429 errors
      await regenerateMutation.mutateAsync(id)
    } catch (error) {
      // Error already handled in mutation or Axios interceptor
    }
  }

  // When API key is created
  const handleCreateSuccess = () => {
    endWalkthrough()
  }

  return (
    <DashboardLayout>
      <ErrorBoundary>
        <div className="flex flex-col space-y-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/dashboard/webhooks">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Manage API Keys</h1>
              <p className="text-muted-foreground">Create and manage your API credentials.</p>
            </div>
          </div>

          <Tabs defaultValue="active" className="w-full">
            <TabsList>
              <TabsTrigger value="active">Active Keys</TabsTrigger>
              <TabsTrigger value="expired">Expired Keys</TabsTrigger>
              <TabsTrigger value="usage">API Usage</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4 pt-4">
              <ActiveApiKeysTab 
                apiKeys={activeKeys}
                isLoading={isLoading}
                handleDeleteKey={handleDeleteKey}
                handleRegenerateKey={handleRegenerateKey}
                deleteErrorKeyId={deleteErrorKeyId}
                regenErrorKeyId={regenErrorKeyId}
              />
            </TabsContent>

            <TabsContent value="expired" className="space-y-4 pt-4">
              <ExpiredApiKeysTab />
            </TabsContent>

            <TabsContent value="usage" className="space-y-4 pt-4">
              <ApiUsageTab isLoading={isLoading} />
            </TabsContent>
          </Tabs>

          {/* Render the extracted documentation section */}
          <ApiDocumentationSection />
        </div>
      </ErrorBoundary>
    </DashboardLayout>
  )
}


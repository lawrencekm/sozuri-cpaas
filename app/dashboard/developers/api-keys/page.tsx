"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Copy, Eye, EyeOff, Key, Loader2, MoreHorizontal, Plus, RefreshCw, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import DashboardLayout from "@/components/layout/dashboard-layout"

import chatService, { ApiKey } from "@/lib/services/chat-service"
import { formatTime } from "@/lib/date-formatter"

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({})
  const [isRegenerating, setIsRegenerating] = useState<Record<string, boolean>>({})
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyScopes, setNewKeyScopes] = useState<string[]>(['chat:read'])
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null)

  // Load API keys on component mount
  useEffect(() => {
    const loadApiKeys = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await chatService.getApiKeys()

        if (response.error) {
          setError(response.error.message)
          toast({
            title: "Error loading API keys",
            description: response.error.message,
            variant: "destructive"
          })
        } else if (response.data) {
          setApiKeys(response.data)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
        setError(errorMessage)
        toast({
          title: "Error loading API keys",
          description: errorMessage,
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadApiKeys()
  }, [])

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)

    try {
      const response = await chatService.createApiKey({
        name: newKeyName,
        scopes: newKeyScopes
      })

      if (response.error) {
        toast({
          title: "Error creating API key",
          description: response.error.message,
          variant: "destructive"
        })
      } else if (response.data) {
        setApiKeys([...apiKeys, response.data])
        setNewlyCreatedKey(response.data.key)
        setNewKeyName('')
        setNewKeyScopes(['chat:read'])
        setIsCreateDialogOpen(false)

        toast({
          title: "API key created",
          description: "Your new API key has been created successfully.",
          variant: "default"
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      toast({
        title: "Error creating API key",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteKey = async (keyId: string) => {
    setIsDeleting({ ...isDeleting, [keyId]: true })

    try {
      const response = await chatService.deleteApiKey(keyId)

      if (response.error) {
        toast({
          title: "Error deleting API key",
          description: response.error.message,
          variant: "destructive"
        })
      } else {
        setApiKeys(apiKeys.filter(key => key.id !== keyId))

        toast({
          title: "API key deleted",
          description: "The API key has been deleted successfully.",
          variant: "default"
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      toast({
        title: "Error deleting API key",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsDeleting({ ...isDeleting, [keyId]: false })
    }
  }

  const handleRegenerateKey = async (keyId: string) => {
    setIsRegenerating({ ...isRegenerating, [keyId]: true })

    try {
      const response = await chatService.regenerateApiKey(keyId)

      if (response.error) {
        toast({
          title: "Error regenerating API key",
          description: response.error.message,
          variant: "destructive"
        })
      } else if (response.data) {
        // Update the key in the list
        setApiKeys(apiKeys.map(key => 
          key.id === keyId && response.data ? response.data : key
        ))

        // Show the newly created key
        setNewlyCreatedKey(response.data.key)

        toast({
          title: "API key regenerated",
          description: "Your API key has been regenerated successfully.",
          variant: "default"
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      toast({
        title: "Error regenerating API key",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsRegenerating({ ...isRegenerating, [keyId]: false })
    }
  }

  const handleToggleKeyVisibility = (keyId: string) => {
    setShowKeys({
      ...showKeys,
      [keyId]: !showKeys[keyId]
    })
  }

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    toast({
      title: "API key copied",
      description: "The API key has been copied to your clipboard.",
      variant: "default"
    })
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/developers">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
              <p className="text-muted-foreground">Manage your API keys for accessing SOZURI Connect APIs</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
              // Reset form when dialog is closed
              if (!open) {
                setNewKeyName('')
                setNewKeyScopes(['chat:read'])
              }
              setIsCreateDialogOpen(open)
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Create API Key
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New API Key</DialogTitle>
                  <DialogDescription>
                    Create a new API key to access SOZURI Connect APIs.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateKey}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="key-name">Key Name</Label>
                      <Input
                        id="key-name"
                        placeholder="e.g., Production API Key"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        disabled={isCreating}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>API Scopes</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="scope-chat-read"
                            checked={newKeyScopes.includes('chat:read')}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewKeyScopes([...newKeyScopes, 'chat:read'])
                              } else {
                                setNewKeyScopes(newKeyScopes.filter(scope => scope !== 'chat:read'))
                              }
                            }}
                            disabled={isCreating}
                          />
                          <Label htmlFor="scope-chat-read">chat:read</Label>
                          <span className="text-xs text-muted-foreground">(Read chat data)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="scope-chat-write"
                            checked={newKeyScopes.includes('chat:write')}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewKeyScopes([...newKeyScopes, 'chat:write'])
                              } else {
                                setNewKeyScopes(newKeyScopes.filter(scope => scope !== 'chat:write'))
                              }
                            }}
                            disabled={isCreating}
                          />
                          <Label htmlFor="scope-chat-write">chat:write</Label>
                          <span className="text-xs text-muted-foreground">(Send messages and manage chats)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="scope-analytics-read"
                            checked={newKeyScopes.includes('analytics:read')}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewKeyScopes([...newKeyScopes, 'analytics:read'])
                              } else {
                                setNewKeyScopes(newKeyScopes.filter(scope => scope !== 'analytics:read'))
                              }
                            }}
                            disabled={isCreating}
                          />
                          <Label htmlFor="scope-analytics-read">analytics:read</Label>
                          <span className="text-xs text-muted-foreground">(Access analytics data)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      disabled={isCreating}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isCreating}>
                      {isCreating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>Create API Key</>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {newlyCreatedKey && (
          <Alert className="bg-green-50 border-green-200">
            <Key className="h-4 w-4 text-green-600" />
            <AlertTitle>API Key Created</AlertTitle>
            <AlertDescription className="flex flex-col space-y-2">
              <p>Your new API key has been created. Make sure to copy it now as you won't be able to see it again.</p>
              <div className="flex items-center space-x-2">
                <code className="rounded bg-green-100 px-2 py-1 font-mono text-sm">{newlyCreatedKey}</code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopyKey(newlyCreatedKey)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="self-end"
                onClick={() => setNewlyCreatedKey(null)}
              >
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>Manage your API keys for accessing SOZURI Connect APIs</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>API Key</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Scopes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    // Loading skeleton
                    Array.from({ length: 3 }).map((_, index) => (
                      <TableRow key={`loading-${index}`}>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : apiKeys.length > 0 ? (
                    apiKeys.map((apiKey) => (
                      <TableRow key={apiKey.id}>
                        <TableCell className="font-medium">{apiKey.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <code className="rounded bg-muted px-2 py-1 font-mono text-xs">
                              {showKeys[apiKey.id] ? apiKey.key : `${apiKey.key.substring(0, 8)}...`}
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleKeyVisibility(apiKey.id)}
                            >
                              {showKeys[apiKey.id] ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleCopyKey(apiKey.key)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{formatTime(apiKey.created_at)}</TableCell>
                        <TableCell>{apiKey.last_used_at ? formatTime(apiKey.last_used_at) : 'Never'}</TableCell>
                        <TableCell>
                          <Badge
                            variant={apiKey.status === 'active' ? 'default' : 'secondary'}
                            className="capitalize"
                          >
                            {apiKey.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {apiKey.scopes.map((scope) => (
                              <Badge key={scope} variant="outline" className="text-xs">
                                {scope}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleCopyKey(apiKey.key)}>
                                <Copy className="mr-2 h-4 w-4" /> Copy
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleRegenerateKey(apiKey.id)}
                                disabled={isRegenerating[apiKey.id]}
                              >
                                {isRegenerating[apiKey.id] ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                )}
                                Regenerate
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteKey(apiKey.id)}
                                disabled={isDeleting[apiKey.id]}
                              >
                                {isDeleting[apiKey.id] ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash className="mr-2 h-4 w-4" />
                                )}
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Key className="h-8 w-8 text-muted-foreground/50 mb-2" />
                          <p className="text-muted-foreground">No API keys found</p>
                          <p className="text-xs text-muted-foreground">Create your first API key to get started</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Key Security</CardTitle>
            <CardDescription>Best practices for securing your API keys</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-base font-medium">Keep Your API Keys Secure</h3>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Never expose your API keys in client-side code or public repositories</li>
                <li>Use environment variables to store API keys in your applications</li>
                <li>Implement proper access controls and restrict API key usage to specific IP addresses</li>
                <li>Rotate your API keys regularly, especially if you suspect they may have been compromised</li>
                <li>Use the minimum required scopes for each API key</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-medium">API Key Rate Limits</h3>
              <p className="text-sm text-muted-foreground">
                API keys are subject to rate limits to ensure fair usage of our services.
                The default rate limit is 100 requests per minute. If you need higher limits,
                please contact our support team.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild>
              <Link href="/dashboard/developers/chat">
                View API Documentation
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}

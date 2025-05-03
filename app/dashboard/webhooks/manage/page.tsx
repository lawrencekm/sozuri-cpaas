"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { ArrowLeft, AlertCircle, Trash2, Pencil, Plus, Webhook as WebhookIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { handleError, ErrorType } from "@/lib/error-handler";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// Type definition (should ideally be shared, maybe from lib/types)
interface WebhookConfig {
  id: string;
  url: string;
  description: string | null;
  events: string[];
  isActive: boolean;
  createdAt: string;
}

// --- API Functions (using fetch for simplicity here, use lib/api.ts pattern ideally) ---

const fetchWebhooks = async (): Promise<WebhookConfig[]> => {
  // TODO: Replace with actual call using configured Axios instance from lib/api
  const response = await fetch('/api/webhooks');
  if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch webhooks');
  }
  return response.json();
};

const deleteWebhookFn = async (id: string): Promise<void> => {
   // TODO: Replace with actual call using configured Axios instance from lib/api
  const response = await fetch(`/api/webhooks/${id}`, { method: 'DELETE' });
  if (!response.ok && response.status !== 204) { // 204 is success (No Content)
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to delete webhook');
  }
  // No need to return response.json() for DELETE 204
};

// --- Component --- 

export default function ManageWebhooksPage() {
  const queryClient = useQueryClient();
  const [deleteErrorWebhookId, setDeleteErrorWebhookId] = useState<string | null>(null);

  // Fetch Webhooks
  const { data: webhooks, isLoading, isError, error } = useQuery<WebhookConfig[], Error>({
    queryKey: ['webhooks'],
    queryFn: fetchWebhooks,
    retry: 1,
  });

  // Delete Webhook Mutation
  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: deleteWebhookFn,
    onSuccess: (_, id) => {
      toast.success("Webhook deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      setDeleteErrorWebhookId(null); // Clear error on success
    },
    onError: (error, id) => {
      handleError(error, ErrorType.API, { 
          toastMessage: "Failed to delete webhook. Please try again.",
          context: { webhookId: id, source: 'ManageWebhooksPage.deleteMutation' }
      });
      setDeleteErrorWebhookId(id);
    },
  });

  const handleDeleteWebhook = (id: string) => {
     setDeleteErrorWebhookId(null); // Clear previous error
     // Confirmation is handled by AlertDialogTrigger/AlertDialogContent
     deleteMutation.mutate(id);
  };
  
  // TODO: Implement Edit/Toggle Active mutations and handlers

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                 <CardTitle>Configured Webhooks</CardTitle>
                 <CardDescription>List of your current webhook endpoints</CardDescription>
              </div>
              <Button asChild>
                <Link href="/dashboard/webhooks/new">
                  <Plus className="mr-2 h-4 w-4" /> New Webhook
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              // Loading State - Skeleton Rows
              <div className="space-y-4">
                 {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded bg-muted animate-pulse">
                      <div className="space-y-2">
                          <div className="h-4 w-64 rounded bg-muted-foreground/20"></div>
                          <div className="h-3 w-48 rounded bg-muted-foreground/20"></div>
                      </div>
                       <div className="h-8 w-20 rounded bg-muted-foreground/20"></div>
                  </div>
                 ))}
              </div>
            ) : isError ? (
                // Error State
                <div className="text-center py-10 text-destructive">
                    <AlertCircle className="mx-auto h-10 w-10 mb-4" />
                    <p>Failed to load webhooks.</p>
                    <p className="text-sm text-muted-foreground">{(error as Error)?.message || "Please try again later."}</p>
                </div>
            ) : webhooks && webhooks.length > 0 ? (
                // Data State - Table
                <TooltipProvider>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>URL</TableHead>
                          <TableHead className="hidden md:table-cell">Description</TableHead>
                          <TableHead className="hidden sm:table-cell">Events</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {webhooks.map((webhook) => (
                          <TableRow key={webhook.id}>
                            <TableCell className="max-w-xs truncate" title={webhook.url}>{webhook.url}</TableCell>
                            <TableCell className="hidden md:table-cell">{webhook.description || '-'}</TableCell>
                            <TableCell className="hidden sm:table-cell max-w-xs">
                                <div className="flex flex-wrap gap-1">
                                    {webhook.events.map(event => (
                                        <Badge key={event} variant="secondary" className="whitespace-nowrap">{event}</Badge>
                                    ))}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Switch 
                                    checked={webhook.isActive} 
                                    // TODO: Add onCheckedChange handler with mutation
                                    disabled // Disable until mutation is implemented
                                    aria-label={webhook.isActive ? "Deactivate webhook" : "Activate webhook"} 
                                />
                            </TableCell>
                            <TableCell className="text-right">
                                {deleteErrorWebhookId === webhook.id && (
                                    <Tooltip delayDuration={100}>
                                        <TooltipTrigger asChild>
                                             <AlertCircle className="h-4 w-4 text-destructive inline-block mr-2" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Failed to delete</p>
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                                <Button variant="ghost" size="icon" disabled title="Edit Webhook (coming soon)">
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                
                                <AlertDialog>
                                    <Tooltip delayDuration={100}>
                                        <TooltipTrigger asChild>
                                            {/* Wrap button in span for tooltip when disabled */}
                                            <span tabIndex={deleteMutation.isPending && deleteMutation.variables === webhook.id ? 0 : undefined}>
                                                <AlertDialogTrigger asChild>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="text-destructive hover:text-destructive" 
                                                        disabled={deleteMutation.isPending && deleteMutation.variables === webhook.id}
                                                        title="Delete Webhook"
                                                    >
                                                        {deleteMutation.isPending && deleteMutation.variables === webhook.id ? 
                                                            <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"/> 
                                                            : <Trash2 className="h-4 w-4" />
                                                        }
                                                    </Button>
                                                 </AlertDialogTrigger>
                                             </span>
                                         </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Delete Webhook</p>
                                        </TooltipContent>
                                     </Tooltip>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the webhook configuration for <br/>
                                            <span className="font-medium break-all">{webhook.url}</span>.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction 
                                              onClick={() => handleDeleteWebhook(webhook.id)}
                                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                              disabled={deleteMutation.isPending && deleteMutation.variables === webhook.id}
                                          >
                                              Delete
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                 </TooltipProvider>
            ) : (
                // Empty State
                <div className="text-center py-10">
                    <WebhookIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-medium">No webhooks configured</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Create your first webhook to receive event notifications.
                    </p>
                    <Button className="mt-4" asChild>
                       <Link href="/dashboard/webhooks/new">
                         <Plus className="mr-2 h-4 w-4" /> Create Webhook
                       </Link>
                    </Button>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 
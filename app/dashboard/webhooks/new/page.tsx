"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { handleError, ErrorType } from "@/lib/error-handler"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useRouter } from 'next/navigation'

// Define available event types
const availableEvents = [
  { id: 'message.sent', label: 'Message Sent' },
  { id: 'message.delivered', label: 'Message Delivered' },
  { id: 'message.failed', label: 'Message Failed' },
  // Add more event types here as needed
] as const; // Use const assertion

type EventId = typeof availableEvents[number]['id'];

// Define Zod schema for validation
const WebhookSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }).min(1, { message: "URL is required." }),
  description: z.string().max(200, { message: "Description cannot exceed 200 characters." }).optional(),
  events: z.array(z.string()).min(1, { message: "Please select at least one event." }),
  // isActive could be added here if needed
});

type WebhookFormData = z.infer<typeof WebhookSchema>;

// --- API Function ---
const createWebhookFn = async (data: WebhookFormData): Promise<any> => {
   // TODO: Replace with actual call using configured Axios instance from lib/api
  const response = await fetch('/api/webhooks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create webhook');
  }
  return response.json();
};

// --- Component ---
export default function NewWebhookPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<WebhookFormData>({
    resolver: zodResolver(WebhookSchema),
    defaultValues: {
      url: "",
      description: "",
      events: [],
    },
  });

  const mutation = useMutation<any, Error, WebhookFormData>({
    mutationFn: createWebhookFn,
    onSuccess: () => {
      toast.success("Webhook created successfully!");
      queryClient.invalidateQueries({ queryKey: ['webhooks'] }); // Invalidate cache for the manage page
      router.push('/dashboard/webhooks/manage'); // Redirect on success
    },
    onError: (error) => {
       handleError(error, ErrorType.API, { 
          toastMessage: "Failed to create webhook. Please try again.",
          context: { source: 'NewWebhookPage.createMutation' }
      });
      // Could set form errors here if API returns field-specific issues
      // form.setError('root.serverError', { type: 'manual', message: error.message });
    },
  });

  const onSubmit = (data: WebhookFormData) => {
    mutation.mutate(data);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Webhook Configuration</CardTitle>
            <CardDescription>Enter the details for your new webhook endpoint.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* URL Field */}
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Webhook URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://your-service.com/webhook" {...field} />
                      </FormControl>
                      <FormDescription>
                        The endpoint URL where SOZURI will send event data.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description Field */}
                 <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Production event handler" {...field} />
                      </FormControl>
                       <FormDescription>
                        A short description to help you identify this webhook.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Events Field */}
                <FormField
                  control={form.control}
                  name="events"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                          <FormLabel className="text-base">Events</FormLabel>
                          <FormDescription>
                            Select the events you want to subscribe to.
                          </FormDescription>
                      </div>
                      <div className="space-y-2">
                        {availableEvents.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="events"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), item.id])
                                          : field.onChange(
                                              (field.value || []).filter(
                                                (value) => value !== item.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                        </div>
                      <FormMessage /> 
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Webhook
                </Button>
                 {/* Optional: Display root level server errors */}
                 {form.formState.errors.root?.serverError && (
                    <p className="text-sm font-medium text-destructive">
                        {form.formState.errors.root.serverError.message}
                    </p>
                 )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 
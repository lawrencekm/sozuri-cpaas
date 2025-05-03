"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { 
    ArrowLeft, Zap, Workflow, Users, ShoppingCart, MessageSquareMore, Mail, HelpCircle, 
    CheckCircle2, XCircle, Link as LinkIcon, AlertCircle, Trash2, Loader2, Settings 
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { handleError, ErrorType } from "@/lib/error-handler";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// --- Types --- (Should be shared)
interface PotentialIntegration {
    type: string; // Unique identifier (e.g., 'zapier', 'hubspot')
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    category: string; // For potential future filtering
}

interface ConfiguredIntegration {
  id: string;
  type: string; // Matches PotentialIntegration type
  name: string; // User-defined name for this specific connection
  connected: boolean; // Represents current connection status from backend
  createdAt: string;
  // Add other relevant fields like credentials ID, configuration details, etc.
}

// --- Potential Integrations List ---
// TODO: Fetch this from an API or define centrally
const potentialIntegrations: PotentialIntegration[] = [
    { type: 'zapier', title: 'Zapier', description: 'Connect SOZURI to thousands of apps via Zapier.', icon: Zap, category: 'Automation' },
    { type: 'make', title: 'Make.com', description: 'Automate workflows using Make.com (formerly Integromat).', icon: Workflow, category: 'Automation' },
    { type: 'salesforce', title: 'Salesforce', description: 'Sync contacts and communications with Salesforce CRM.', icon: Users, category: 'CRM' },
    { type: 'hubspot', title: 'HubSpot', description: 'Integrate with HubSpot CRM and Marketing Hub.', icon: Users, category: 'CRM' },
    { type: 'mailchimp', title: 'Mailchimp', description: 'Connect with Mailchimp for email marketing sync.', icon: Mail, category: 'Marketing' },
    { type: 'shopify', title: 'Shopify', description: 'Automate e-commerce notifications via Shopify.', icon: ShoppingCart, category: 'Ecommerce' },
    { type: 'zendesk', title: 'Zendesk', description: 'Streamline support by connecting with Zendesk.', icon: MessageSquareMore, category: 'Support' },
];

// --- API Functions ---

const fetchConfiguredIntegrations = async (): Promise<ConfiguredIntegration[]> => {
  // TODO: Replace with actual call using configured Axios instance from lib/api
  const response = await fetch('/api/integrations');
  if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch integrations');
  }
  return response.json();
};

const disconnectIntegrationFn = async (id: string): Promise<void> => {
   // TODO: Replace with actual call using configured Axios instance from lib/api
  const response = await fetch(`/api/integrations/${id}`, { method: 'DELETE' });
  if (!response.ok && response.status !== 204) { // 204 is success (No Content)
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to disconnect integration');
  }
};

// --- Integration Card Component ---

interface IntegrationCardProps {
    potential: PotentialIntegration;
    configured: ConfiguredIntegration | undefined;
    onDisconnect: (id: string, name: string) => void;
    isDisconnecting: boolean;
    disconnectErrorId: string | null;
}

function IntegrationCard({ potential, configured, onDisconnect, isDisconnecting, disconnectErrorId }: IntegrationCardProps) {
    const router = useRouter();
    const Icon = potential.icon;
    const isConfigured = !!configured;
    const isConnected = isConfigured && configured.connected;
    const currentErrorId = disconnectErrorId; // To track error for *this* card

    const handleConnect = () => {
        // TODO: Implement actual connection flow (e.g., OAuth or setup page)
        // router.push(`/dashboard/integrations/connect/${potential.type}`)
        toast.success(`Connect flow for ${potential.title} not implemented yet.`);
    };
    
    const handleManage = () => {
         // TODO: Implement navigation to a manage page
         // router.push(`/dashboard/integrations/manage/${configured?.id}`)
         toast.success(`Manage page for ${configured?.name || potential.title} not implemented yet.`);
    };

    return (
         <Card className="flex flex-col">
            <CardHeader className="flex-row items-start gap-4 space-y-0">
                <Icon className="h-8 w-8 text-primary flex-shrink-0" />
                <div className="flex-grow">
                    <CardTitle>{potential.title}</CardTitle>
                    <CardDescription>{potential.description}</CardDescription>
                </div>
                {isConfigured && (
                    <Badge 
                        variant={isConnected ? "default" : "destructive"} 
                        className={`ml-auto flex-shrink-0 ${isConnected ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}`}
                    >
                        {isConnected ? <CheckCircle2 className="h-3 w-3 mr-1"/> : <XCircle className="h-3 w-3 mr-1"/>}
                        {isConnected ? "Connected" : "Error"}
                    </Badge>
                )}
            </CardHeader>
            <CardContent className="flex-grow">
               {/* Optional: Display configured name or details */} 
                {configured && <p className="text-xs text-muted-foreground mb-2">Instance: {configured.name}</p>}
                 {currentErrorId === configured?.id && (
                    <p className="text-xs text-destructive flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1"/> Failed to disconnect
                    </p>
                )}
            </CardContent>
            <CardFooter>
                {!isConfigured ? (
                    <Button variant="outline" className="w-full" onClick={handleConnect}>
                        <LinkIcon className="mr-2 h-4 w-4"/> Connect
                    </Button>
                ) : (
                    <div className="flex w-full gap-2">
                        <Button variant="outline" className="flex-1" onClick={handleManage}>
                            <Settings className="mr-2 h-4 w-4"/> Manage
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button 
                                    variant="destructive" 
                                    className="flex-1" 
                                    disabled={isDisconnecting && currentErrorId !== configured.id} // Disable if another is pending
                                >
                                     {isDisconnecting && currentErrorId !== configured.id ? 
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : 
                                        <Trash2 className="mr-2 h-4 w-4"/>
                                    }
                                    Disconnect
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Disconnect {potential.title}?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to disconnect the "{configured.name}" integration?
                                    This may affect related workflows.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                      onClick={() => onDisconnect(configured.id, configured.name)} // Pass ID and name
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                      Disconnect
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                )}
            </CardFooter>
          </Card>
    );
}

// --- Main Page Component ---
export default function IntegrationsPage() {
  const queryClient = useQueryClient();
  const [disconnectErrorId, setDisconnectErrorId] = useState<string | null>(null);

  // Fetch Configured Integrations
  const { data: configuredIntegrations, isLoading, isError, error } = useQuery<ConfiguredIntegration[], Error>({
    queryKey: ['integrations'],
    queryFn: fetchConfiguredIntegrations,
    retry: 1,
  });

  // Disconnect Mutation
   const disconnectMutation = useMutation<void, Error, {id: string, name: string}>({
    mutationFn: ({ id }) => disconnectIntegrationFn(id),
    onSuccess: (_, variables) => {
      toast.success(`Successfully disconnected "${variables.name}"`);
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      setDisconnectErrorId(null);
    },
    onError: (error, variables) => {
      handleError(error, ErrorType.API, { 
          toastMessage: `Failed to disconnect "${variables.name}". Please try again.`, 
          context: { integrationId: variables.id, source: 'IntegrationsPage.disconnectMutation' } 
      });
      setDisconnectErrorId(variables.id);
    },
  });

  const handleDisconnect = (id: string, name: string) => {
    setDisconnectErrorId(null); // Clear previous error
    disconnectMutation.mutate({ id, name });
  };

  // Create a map for quick lookup of configured integrations by type
  const configuredMap = new Map(configuredIntegrations?.map(int => [int.type, int]) || []);

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <p className="text-sm text-muted-foreground">
          Extend the power of SOZURI by seamlessly connecting it with popular platforms. Automate workflows, sync data, 
          and enhance your communication capabilities across your entire software stack.
        </p>

        {/* Loading State */}
        {isLoading && (
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader className="flex-row items-start gap-4 space-y-0">
                            <div className="h-8 w-8 rounded bg-muted"></div>
                            <div className="space-y-2 flex-grow">
                                <div className="h-5 w-3/4 rounded bg-muted"></div>
                                <div className="h-4 w-full rounded bg-muted"></div>
                            </div>
                        </CardHeader>
                        <CardContent className="h-10"></CardContent> 
                        <CardFooter>
                            <div className="h-10 w-full rounded bg-muted"></div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
             <div className="text-center py-10 text-destructive border rounded-md">
                <AlertCircle className="mx-auto h-10 w-10 mb-4" />
                <p>Failed to load integrations.</p>
                <p className="text-sm text-muted-foreground">{(error as Error)?.message || "Please try again later."}</p>
            </div>
        )}

        {/* Data State */}
        {!isLoading && !isError && (
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {potentialIntegrations.map(potential => (
                    <IntegrationCard 
                        key={potential.type}
                        potential={potential}
                        configured={configuredMap.get(potential.type)}
                        onDisconnect={handleDisconnect}
                        isDisconnecting={disconnectMutation.isPending}
                        disconnectErrorId={disconnectErrorId}
                    />
                ))}
                 {/* Placeholder for adding custom/more integrations */}
                <Card className="border-dashed border-muted-foreground/50 flex items-center justify-center">
                    <CardContent className="text-center">
                        <p className="text-sm text-muted-foreground">More integrations coming soon!</p>
                    </CardContent>
                </Card>
            </div>
        )}
      </div>
    </DashboardLayout>
  )
} 
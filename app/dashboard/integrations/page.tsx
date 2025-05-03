import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { ArrowLeft, Zap, Workflow, Users, ShoppingCart, MessageSquareMore } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function IntegrationsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/webhooks">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Third-Party Integrations</h1>
            <p className="text-muted-foreground">Connect SOZURI with the tools you already use.</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Extend the power of SOZURI by seamlessly connecting it with popular platforms. Automate workflows, sync data, 
          and enhance your communication capabilities across your entire software stack.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Automation Platforms */}
          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Automation Platforms</CardTitle>
              <CardDescription>Connect SOZURI to thousands of apps</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Use platforms like Zapier or Make.com to build custom workflows between SOZURI and virtually any other online service without writing code.
              </p>
              <div className="mt-4 space-x-2">
                 {/* Add logos later if desired */}
                 <span className="inline-block bg-muted px-2 py-1 rounded text-xs">Zapier</span>
                 <span className="inline-block bg-muted px-2 py-1 rounded text-xs">Make.com</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>Connect (Coming Soon)</Button>
            </CardFooter>
          </Card>

          {/* CRM Systems */}
          <Card>
            <CardHeader>
              <Users className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>CRM Systems</CardTitle>
              <CardDescription>Sync contacts and communications</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Integrate with CRMs like Salesforce or HubSpot to log messages, sync contacts, and trigger automated communication based on customer data.
              </p>
               <div className="mt-4 space-x-2">
                 <span className="inline-block bg-muted px-2 py-1 rounded text-xs">Salesforce</span>
                 <span className="inline-block bg-muted px-2 py-1 rounded text-xs">HubSpot</span>
                 <span className="inline-block bg-muted px-2 py-1 rounded text-xs">Zoho CRM</span>
               </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>Connect (Coming Soon)</Button>
            </CardFooter>
          </Card>

          {/* Marketing Platforms */}
          <Card>
            <CardHeader>
              <Workflow className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Marketing Platforms</CardTitle>
              <CardDescription>Enhance marketing campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Connect with tools like Mailchimp or ActiveCampaign to add contacts to mailing lists, trigger marketing automations, or personalize outreach.
              </p>
               <div className="mt-4 space-x-2">
                 <span className="inline-block bg-muted px-2 py-1 rounded text-xs">Mailchimp</span>
                 <span className="inline-block bg-muted px-2 py-1 rounded text-xs">Klaviyo</span>
                 <span className="inline-block bg-muted px-2 py-1 rounded text-xs">ActiveCampaign</span>
               </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>Connect (Coming Soon)</Button>
            </CardFooter>
          </Card>

           {/* E-commerce Platforms */}
           <Card>
            <CardHeader>
              <ShoppingCart className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>E-commerce</CardTitle>
              <CardDescription>Automate order notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Integrate with platforms like Shopify or WooCommerce to send automated order confirmations, shipping updates, or abandoned cart reminders via SMS/WhatsApp.
              </p>
               <div className="mt-4 space-x-2">
                 <span className="inline-block bg-muted px-2 py-1 rounded text-xs">Shopify</span>
                 <span className="inline-block bg-muted px-2 py-1 rounded text-xs">WooCommerce</span>
               </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>Connect (Coming Soon)</Button>
            </CardFooter>
          </Card>

          {/* Support Desks */}
          <Card>
            <CardHeader>
              <MessageSquareMore className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Support Desks</CardTitle>
              <CardDescription>Streamline customer support</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Connect with Zendesk, Help Scout, or others to create support tickets from incoming messages or log communication history automatically.
              </p>
               <div className="mt-4 space-x-2">
                 <span className="inline-block bg-muted px-2 py-1 rounded text-xs">Zendesk</span>
                 <span className="inline-block bg-muted px-2 py-1 rounded text-xs">Help Scout</span>
                 <span className="inline-block bg-muted px-2 py-1 rounded text-xs">Jira</span>
               </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>Connect (Coming Soon)</Button>
            </CardFooter>
          </Card>

           {/* Add more categories as needed */}
           <Card className="border-dashed border-muted-foreground/50 flex items-center justify-center">
             <CardContent className="text-center">
               <p className="text-sm text-muted-foreground">More integrations coming soon!</p>
             </CardContent>
           </Card>

        </div>
      </div>
    </DashboardLayout>
  )
} 
import { Download, Filter, Plus, Search, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/layout/dashboard-layout"

export default function ContactsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Audience</h1>
            <p className="text-muted-foreground">Manage your contacts and audience segments</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Import
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Contact
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search contacts..." className="pl-8" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Contacts</TabsTrigger>
            <TabsTrigger value="segments">Segments</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="lists">Lists</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Contact Management</CardTitle>
                <CardDescription>View and manage all your contacts</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center justify-center text-center">
                  <Users className="h-10 w-10 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">Contact Database</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Manage your contacts and their communication preferences
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="segments" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Audience Segments</CardTitle>
                <CardDescription>Create and manage audience segments for targeted messaging</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center justify-center text-center">
                  <Users className="h-10 w-10 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">Segmentation</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Create dynamic segments based on user attributes and behaviors
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="groups" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Contact Groups</CardTitle>
                <CardDescription>Organize contacts into static groups</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center justify-center text-center">
                  <Users className="h-10 w-10 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">Contact Groups</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Create and manage static groups of contacts</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="lists" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Distribution Lists</CardTitle>
                <CardDescription>Manage your communication distribution lists</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center justify-center text-center">
                  <Users className="h-10 w-10 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">Distribution Lists</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Create and manage lists for regular communications
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

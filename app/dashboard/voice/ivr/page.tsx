import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { GitBranchPlus, Workflow, Pencil, Trash2 } from "lucide-react"

import DashboardLayout from "@/components/layout/dashboard-layout"

export default function IvrPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">IVR Systems</h1>
            <p className="text-muted-foreground">Design and manage Interactive Voice Response flows</p>
          </div>
          <Button>
            <GitBranchPlus className="mr-2 h-4 w-4" /> Create New IVR Flow
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>My IVR Flows</CardTitle>
            <CardDescription>
              Manage your existing IVR systems and associated phone numbers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Flow Name</TableHead>
                  <TableHead>Assigned Number</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Example Row - Replace with dynamic data */}
                <TableRow>
                  <TableCell className="font-medium">Main Support Line</TableCell>
                  <TableCell>+15559876543</TableCell>
                  <TableCell>2023-10-26 02:15 PM</TableCell>
                  <TableCell><span className="text-green-600">Active</span></TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="mr-1">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">After Hours Support</TableCell>
                  <TableCell>+15551234567</TableCell>
                  <TableCell>2023-09-10 11:00 AM</TableCell>
                  <TableCell><span className="text-green-600">Active</span></TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="mr-1">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                {/* Add more rows or empty state here */}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>IVR Designer</CardTitle>
              <CardDescription>Visual tool to build call flows.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Use our drag-and-drop interface to create complex IVR logic, integrate TTS/STT, handle DTMF input, and connect to your backend APIs.
              </p>
              <Button variant="outline">Launch Designer</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Speech Recognition & TTS</CardTitle>
              <CardDescription>Configure voice interaction settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Manage supported languages, voices, and grammars for Speech-to-Text and Text-to-Speech within your IVR flows.
              </p>
              <Button variant="outline">Configure Speech Services</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
} 
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PhoneForwarded, PhoneIncoming, PhoneOutgoing } from "lucide-react"

import DashboardLayout from "@/components/layout/dashboard-layout"

export default function VoiceCallsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Voice Calls</h1>
            <p className="text-muted-foreground">Make and receive voice calls</p>
          </div>
          <Button>
            <PhoneOutgoing className="mr-2 h-4 w-4" /> Make a Call
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Call Logs</CardTitle>
            <CardDescription>
              View recent incoming, outgoing, and in-progress calls.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Direction</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Example Row - Replace with dynamic data */}
                <TableRow>
                  <TableCell><PhoneIncoming className="h-4 w-4 text-green-500" /></TableCell>
                  <TableCell>+15551234567</TableCell>
                  <TableCell>+15559876543</TableCell>
                  <TableCell>2m 30s</TableCell>
                  <TableCell>Completed</TableCell>
                  <TableCell>2023-10-27 10:00 AM</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">Details</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><PhoneOutgoing className="h-4 w-4 text-blue-500" /></TableCell>
                  <TableCell>+15559876543</TableCell>
                  <TableCell>+15551112222</TableCell>
                  <TableCell>1m 15s</TableCell>
                  <TableCell>Completed</TableCell>
                  <TableCell>2023-10-27 09:45 AM</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">Details</Button>
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
              <CardTitle>Manage Numbers</CardTitle>
              <CardDescription>Configure your purchased phone numbers.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Assign call handling logic, enable features like call recording, and manage SIP endpoints.
              </p>
              <Button variant="outline">Go to Number Management</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Voice API & SDKs</CardTitle>
              <CardDescription>Integrate voice capabilities programmatically.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Explore our documentation to build custom voice applications, control calls, and access real-time events.
              </p>
              <Button variant="outline">View Documentation</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
} 
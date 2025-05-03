import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MessageSquarePlus, BotMessageSquare, Pencil, Trash2, Play } from "lucide-react"

import DashboardLayout from "@/components/layout/dashboard-layout"

export default function VoiceMessagingPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Voice Messaging</h1>
            <p className="text-muted-foreground">Send automated voice messages and alerts at scale</p>
          </div>
          <Button>
            <MessageSquarePlus className="mr-2 h-4 w-4" /> New Voice Message
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Message Campaigns</CardTitle>
            <CardDescription>
              Manage your scheduled and sent voice message campaigns.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign Name</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Sent Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Example Row - Replace with dynamic data */}
                <TableRow>
                  <TableCell className="font-medium">Appointment Reminders - Nov</TableCell>
                  <TableCell>1,250</TableCell>
                  <TableCell>2023-11-01 09:00 AM</TableCell>
                  <TableCell><span className="text-green-600">Completed</span></TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="mr-1">Details</Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Promotional Offer Blast</TableCell>
                  <TableCell>5,000</TableCell>
                  <TableCell>2023-10-28 11:00 AM</TableCell>
                  <TableCell><span className="text-green-600">Completed</span></TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="mr-1">Details</Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                 <TableRow>
                  <TableCell className="font-medium">Upcoming Maintenance Alert</TableCell>
                  <TableCell>800</TableCell>
                  <TableCell>Scheduled: 2023-11-05 08:00 PM</TableCell>
                  <TableCell><span className="text-blue-600">Scheduled</span></TableCell>
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
              <CardTitle>Text-to-Speech (TTS)</CardTitle>
              <CardDescription>Configure voices for your messages.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Select languages and voices, adjust speed and pitch, and use variables for personalized message content.
              </p>
              <Button variant="outline">Manage TTS Settings</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Audio Files</CardTitle>
              <CardDescription>Manage pre-recorded audio.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Upload and manage your own audio files (.wav, .mp3) to use in your voice messages instead of TTS.
              </p>
              <Button variant="outline">Manage Audio Library</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
} 
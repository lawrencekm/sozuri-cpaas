import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import DashboardLayout from "@/components/layout/dashboard-layout"

export default function NewVoiceCampaignPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Create New Voice Campaign</CardTitle>
            <CardDescription>Configure and launch a new voice campaign (e.g., calls, IVR, messaging).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Campaign Name</Label>
              <Input id="campaign-name" placeholder="e.g., Welcome Call Series, Support IVR" />
            </div>

            <div className="space-y-2">
              <Label>Campaign Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select campaign type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call-broadcast">Voice Call Broadcast</SelectItem>
                  <SelectItem value="ivr">Interactive IVR</SelectItem>
                  <SelectItem value="voice-message">Voice Message Blast</SelectItem>
                  <SelectItem value="api-triggered">API Triggered Call</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="caller-id">Caller ID Number</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a verified number" />
                </SelectTrigger>
                <SelectContent>
                  {/* Populate with user's verified numbers */}
                  <SelectItem value="+15551112222">+1 555 111 2222</SelectItem>
                  <SelectItem value="+15553334444">+1 555 333 4444</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Conditional fields based on campaign type would go here */}
            {/* Example for Voice Message: */}
            <div className="space-y-3 rounded-md border p-4">
               <Label>Message Content</Label>
                <RadioGroup defaultValue="tts" className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tts" id="r1" />
                    <Label htmlFor="r1">Text-to-Speech</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="audio" id="r2" />
                    <Label htmlFor="r2">Pre-recorded Audio</Label>
                  </div>
                </RadioGroup>
               <Textarea placeholder="Enter your message here..." />
               {/* Or a select dropdown for pre-recorded audio files */}
            </div>

             <div className="space-y-2">
              <Label htmlFor="recipients">Recipients</Label>
              {/* Placeholder for recipient list upload/selection */}
              <Button variant="outline">Upload Recipient List (.csv)</Button>
            </div>

             <div className="space-y-2">
              <Label>Scheduling</Label>
              {/* Placeholder for scheduling options */}
               <RadioGroup defaultValue="now" className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="now" id="s1" />
                    <Label htmlFor="s1">Send Now</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="later" id="s2" />
                    <Label htmlFor="s2">Schedule for Later</Label>
                  </div>
                </RadioGroup>
                {/* Add Date/Time picker if 'Schedule for Later' selected */}
            </div>

          </CardContent>
          <CardFooter>
            <Button>Create Campaign</Button>
            <Button variant="outline" className="ml-2">Cancel</Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
} 
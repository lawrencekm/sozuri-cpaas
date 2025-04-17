"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  Book,
  Code,
  Copy,
  FileCode,
  FileJson,
  Github,
  Globe,
  MessageSquare,
  Phone,
  Search,
  Terminal,
  Check,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/layout/dashboard-layout"

// Code Block Component
function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative rounded-md bg-slate-950 text-slate-50">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2">
        <span className="text-xs font-medium text-slate-400">{language}</span>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400" onClick={copyToClipboard}>
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export default function DevelopersPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Developer Portal</h1>
          <p className="text-muted-foreground">
            Integrate SOZURI Connect's communication services into your applications
          </p>
        </div>

        <div className="flex items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search documentation..." className="pl-8" />
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="api-reference">API Reference</TabsTrigger>
            <TabsTrigger value="sdks">SDKs & Libraries</TabsTrigger>
            <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>Learn how to integrate with SOZURI Connect</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>
                    SOZURI Connect provides a comprehensive set of APIs for integrating communication services into your
                    applications. Follow these steps to get started:
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        1
                      </div>
                      <div>
                        <h3 className="text-base font-medium">Create an API key</h3>
                        <p className="text-sm text-muted-foreground">
                          Generate an API key in the{" "}
                          <Link href="/dashboard/api-keys" className="text-primary underline">
                            API Keys
                          </Link>{" "}
                          section to authenticate your requests.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        2
                      </div>
                      <div>
                        <h3 className="text-base font-medium">Choose your integration method</h3>
                        <p className="text-sm text-muted-foreground">
                          Integrate using our RESTful API directly or use one of our client libraries for your
                          programming language.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        3
                      </div>
                      <div>
                        <h3 className="text-base font-medium">Make your first API call</h3>
                        <p className="text-sm text-muted-foreground">
                          Follow our quickstart guide to make your first API call and start integrating our services.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/dashboard/developers/quickstart">
                    Quickstart Guide <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <CardTitle>Messaging API</CardTitle>
                  </div>
                  <CardDescription>Send SMS, WhatsApp, Viber, and RCS messages</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Integrate our messaging APIs to send and receive messages across multiple channels.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard/developers/messaging">
                      View Documentation <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    <CardTitle>Voice API</CardTitle>
                  </div>
                  <CardDescription>Make and receive voice calls programmatically</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Integrate voice calling, IVR systems, and voice messaging into your applications.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard/developers/voice">
                      View Documentation <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    <CardTitle>Chat API</CardTitle>
                  </div>
                  <CardDescription>Integrate live chat and chatbots</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Add live chat functionality and AI-powered chatbots to your website and applications.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard/developers/chat">
                      View Documentation <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>API Examples</CardTitle>
                <CardDescription>Sample code for common use cases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Tabs defaultValue="javascript" className="w-full">
                    <TabsList>
                      <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                      <TabsTrigger value="python">Python</TabsTrigger>
                      <TabsTrigger value="php">PHP</TabsTrigger>
                      <TabsTrigger value="java">Java</TabsTrigger>
                    </TabsList>

                    <TabsContent value="javascript" className="pt-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Sending an SMS message</h3>
                        <div className="rounded-md bg-slate-950 text-slate-50">
                          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2">
                            <span className="text-xs font-medium text-slate-400">JavaScript</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400">
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <pre className="overflow-x-auto p-4 text-sm">
                            <code>{`// Replace with your API key
const apiKey = 'YOUR_API_KEY';

// API endpoint
const url = 'https://api.sozuri.com/v1/messaging/sms/send';

// Message data
const data = {
  to: '+1234567890',
  message: 'Hello from SOZURI Connect!',
  from: 'SOZURI'
};

// Send the request
fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${apiKey}\`
  },
  body: JSON.stringify(data)
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));`}</code>
                          </pre>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="python" className="pt-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Sending an SMS message</h3>
                        <div className="rounded-md bg-slate-950 text-slate-50">
                          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2">
                            <span className="text-xs font-medium text-slate-400">Python</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400">
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <pre className="overflow-x-auto p-4 text-sm">
                            <code>{`import requests
import json

# Replace with your API key
api_key = 'YOUR_API_KEY'

# API endpoint
url = 'https://api.sozuri.com/v1/messaging/sms/send'

# Message data
data = {
    'to': '+1234567890',
    'message': 'Hello from SOZURI Connect!',
    'from': 'SOZURI'
}

# Headers
headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {api_key}'
}

# Send the request
response = requests.post(url, headers=headers, data=json.dumps(data))

# Print the response
print(response.json())`}</code>
                          </pre>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="php" className="pt-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Sending an SMS message</h3>
                        <div className="rounded-md bg-slate-950 text-slate-50">
                          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2">
                            <span className="text-xs font-medium text-slate-400">PHP</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400">
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <pre className="overflow-x-auto p-4 text-sm">
                            <code>{`<?php
// Replace with your API key
$apiKey = 'YOUR_API_KEY';

// API endpoint
$url = 'https://api.sozuri.com/v1/messaging/sms/send';

// Message data
$data = array(
    'to' => '+1234567890',
    'message' => 'Hello from SOZURI Connect!',
    'from' => 'SOZURI'
);

// Initialize cURL
$ch = curl_init($url);

// Set cURL options
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey
));

// Execute the request
$response = curl_exec($ch);

// Close cURL
curl_close($ch);

// Print the response
echo $response;
?>`}</code>
                          </pre>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="java" className="pt-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Sending an SMS message</h3>
                        <div className="rounded-md bg-slate-950 text-slate-50">
                          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2">
                            <span className="text-xs font-medium text-slate-400">Java</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400">
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <pre className="overflow-x-auto p-4 text-sm">
                            <code>{`import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

public class SendSMS {
    public static void main(String[] args) {
        try {
            // Replace with your API key
            String apiKey = "YOUR_API_KEY";
            
            // API endpoint
            URL url = new URL("https://api.sozuri.com/v1/messaging/sms/send");
            
            // Open connection
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("Authorization", "Bearer " + apiKey);
            conn.setDoOutput(true);
            
            // Message data
            String jsonData = "{" +
                "\"to\": \"+1234567890\"," +
                "\"message\": \"Hello from SOZURI Connect!\"," +
                "\"from\": \"SOZURI\"" +
                "}";
            
            // Send the request
            try (OutputStream os = conn.getOutputStream()) {
                byte[] input = jsonData.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }
            
            // Get the response
            int responseCode = conn.getResponseCode();
            System.out.println("Response Code: " + responseCode);
            
            // Close connection
            conn.disconnect();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}`}</code>
                          </pre>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/dashboard/developers/examples">
                    View More Examples <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="api-reference" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>API Reference</CardTitle>
                <CardDescription>Complete documentation of all API endpoints</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <FileJson className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg">REST API</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Complete reference for our RESTful API endpoints, parameters, and responses.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full" asChild>
                          <Link href="/dashboard/developers/api-reference/rest">View Reference</Link>
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <FileCode className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg">Webhooks</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Learn how to receive and process webhook events from our platform.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full" asChild>
                          <Link href="/dashboard/developers/api-reference/webhooks">View Reference</Link>
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <Terminal className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg">CLI</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Command-line interface for interacting with our API from your terminal.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full" asChild>
                          <Link href="/dashboard/developers/api-reference/cli">View Reference</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">API Endpoints</h3>
                    <div className="space-y-2">
                      <div className="rounded-md border p-4">
                        <div className="flex items-center gap-2">
                          <div className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700">GET</div>
                          <code className="text-sm">/v1/messaging/sms</code>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">List all SMS messages</p>
                      </div>
                      <div className="rounded-md border p-4">
                        <div className="flex items-center gap-2">
                          <div className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">POST</div>
                          <code className="text-sm">/v1/messaging/sms/send</code>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">Send an SMS message</p>
                      </div>
                      <div className="rounded-md border p-4">
                        <div className="flex items-center gap-2">
                          <div className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700">GET</div>
                          <code className="text-sm">/v1/messaging/sms/{"{id}"}</code>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">Get details of a specific SMS message</p>
                      </div>
                      <div className="rounded-md border p-4">
                        <div className="flex items-center gap-2">
                          <div className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">POST</div>
                          <code className="text-sm">/v1/messaging/whatsapp/send</code>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">Send a WhatsApp message</p>
                      </div>
                      <div className="rounded-md border p-4">
                        <div className="flex items-center gap-2">
                          <div className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">POST</div>
                          <code className="text-sm">/v1/voice/calls/make</code>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">Make a voice call</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/dashboard/developers/api-reference">
                    View Full API Reference <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="sdks" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>SDKs & Libraries</CardTitle>
                <CardDescription>Official client libraries for various programming languages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Code className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">JavaScript</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Official JavaScript/TypeScript SDK for Node.js and browser applications.
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm" asChild>
                        <Link href="https://github.com/sozuri/javascript-sdk" target="_blank">
                          <Github className="mr-2 h-4 w-4" /> GitHub
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/dashboard/developers/sdks/javascript">
                          Docs <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Code className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">Python</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Official Python SDK for server-side applications and scripts.
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm" asChild>
                        <Link href="https://github.com/sozuri/python-sdk" target="_blank">
                          <Github className="mr-2 h-4 w-4" /> GitHub
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/dashboard/developers/sdks/python">
                          Docs <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Code className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">PHP</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Official PHP SDK for web applications and frameworks like Laravel.
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm" asChild>
                        <Link href="https://github.com/sozuri/php-sdk" target="_blank">
                          <Github className="mr-2 h-4 w-4" /> GitHub
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/dashboard/developers/sdks/php">
                          Docs <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Code className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">Java</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Official Java SDK for enterprise applications and Android development.
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm" asChild>
                        <Link href="https://github.com/sozuri/java-sdk" target="_blank">
                          <Github className="mr-2 h-4 w-4" /> GitHub
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/dashboard/developers/sdks/java">
                          Docs <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Code className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">.NET</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Official .NET SDK for C# applications and Microsoft ecosystem.
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm" asChild>
                        <Link href="https://github.com/sozuri/dotnet-sdk" target="_blank">
                          <Github className="mr-2 h-4 w-4" /> GitHub
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/dashboard/developers/sdks/dotnet">
                          Docs <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Code className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">Go</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Official Go SDK for high-performance applications and microservices.
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm" asChild>
                        <Link href="https://github.com/sozuri/go-sdk" target="_blank">
                          <Github className="mr-2 h-4 w-4" /> GitHub
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/dashboard/developers/sdks/go">
                          Docs <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tutorials" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Tutorials & Guides</CardTitle>
                <CardDescription>Step-by-step guides for common use cases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <Book className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg">Getting Started</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Learn the basics of integrating with SOZURI Connect's API.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full" asChild>
                          <Link href="/dashboard/developers/tutorials/getting-started">Read Tutorial</Link>
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <Book className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg">SMS Notifications</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Implement SMS notifications for your application's users.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full" asChild>
                          <Link href="/dashboard/developers/tutorials/sms-notifications">Read Tutorial</Link>
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <Book className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg">WhatsApp Integration</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Add WhatsApp messaging capabilities to your application.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full" asChild>
                          <Link href="/dashboard/developers/tutorials/whatsapp-integration">Read Tutorial</Link>
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <Book className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg">Two-Factor Authentication</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Implement SMS-based two-factor authentication for your users.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full" asChild>
                          <Link href="/dashboard/developers/tutorials/two-factor-authentication">Read Tutorial</Link>
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <Book className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg">Webhook Setup</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Configure webhooks to receive real-time event notifications.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full" asChild>
                          <Link href="/dashboard/developers/tutorials/webhook-setup">Read Tutorial</Link>
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <Book className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg">Voice IVR System</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Build an interactive voice response system for your business.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full" asChild>
                          <Link href="/dashboard/developers/tutorials/voice-ivr-system">Read Tutorial</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/dashboard/developers/tutorials">
                    View All Tutorials <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

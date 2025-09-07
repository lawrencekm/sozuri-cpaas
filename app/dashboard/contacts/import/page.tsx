"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  Download, 
  CheckCircle, 
  AlertCircle,
  Users,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Tag
} from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import DashboardLayout from "@/components/layout/dashboard-layout"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

// Import steps
const importSteps = [
  { id: 1, title: "Upload File", description: "Choose your contact file" },
  { id: 2, title: "Map Fields", description: "Match columns to contact fields" },
  { id: 3, title: "Review & Import", description: "Confirm and import contacts" },
  { id: 4, title: "Complete", description: "Import finished successfully" }
]

// Sample field mappings
const availableFields = [
  { key: "firstName", label: "First Name", required: true, icon: Users },
  { key: "lastName", label: "Last Name", required: false, icon: Users },
  { key: "email", label: "Email Address", required: false, icon: Mail },
  { key: "phone", label: "Phone Number", required: true, icon: Phone },
  { key: "company", label: "Company", required: false, icon: FileText },
  { key: "address", label: "Address", required: false, icon: MapPin },
  { key: "city", label: "City", required: false, icon: MapPin },
  { key: "country", label: "Country", required: false, icon: MapPin },
  { key: "birthday", label: "Birthday", required: false, icon: Calendar },
  { key: "tags", label: "Tags", required: false, icon: Tag }
]

export default function ContactImportPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [importProgress, setImportProgress] = useState(0)
  const [isImporting, setIsImporting] = useState(false)
  const [importResults, setImportResults] = useState<any>(null)
  const [fieldMappings, setFieldMappings] = useState<Record<string, string>>({})
  const [selectedColumns, setSelectedColumns] = useState<string[]>([])
  const [duplicateHandling, setDuplicateHandling] = useState("skip")

  // Mock CSV columns detected from uploaded file
  const detectedColumns = [
    "Name", "Email", "Phone", "Company", "Address", "City", "Country", "Notes"
  ]

  // Mock preview data
  const previewData = [
    {
      "Name": "John Doe",
      "Email": "john@example.com", 
      "Phone": "+1234567890",
      "Company": "Acme Corp",
      "Address": "123 Main St",
      "City": "New York",
      "Country": "USA",
      "Notes": "VIP Customer"
    },
    {
      "Name": "Jane Smith",
      "Email": "jane@example.com",
      "Phone": "+1987654321", 
      "Company": "Tech Inc",
      "Address": "456 Oak Ave",
      "City": "San Francisco",
      "Country": "USA",
      "Notes": "Premium Plan"
    }
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      setCurrentStep(2)
    }
  }

  const handleFieldMapping = (column: string, field: string) => {
    setFieldMappings(prev => ({
      ...prev,
      [column]: field
    }))
  }

  const handleColumnSelection = (column: string, checked: boolean) => {
    setSelectedColumns(prev => 
      checked 
        ? [...prev, column]
        : prev.filter(col => col !== column)
    )
  }

  const startImport = async () => {
    setIsImporting(true)
    setCurrentStep(4)
    
    // Simulate import progress
    for (let i = 0; i <= 100; i += 10) {
      setImportProgress(i)
      await new Promise(resolve => setTimeout(resolve, 200))
    }
    
    // Mock import results
    setImportResults({
      total: 1250,
      imported: 1198,
      skipped: 45,
      errors: 7,
      duplicates: 52
    })
    
    setIsImporting(false)
  }

  const downloadTemplate = () => {
    // In real app, generate and download CSV template
    console.log("Downloading CSV template...")
  }

  return (
    <DashboardLayout>
      <motion.div className="flex flex-col space-y-6" initial="hidden" animate="visible" variants={staggerContainer}>
        {/* Header */}
        <motion.div className="flex items-center justify-between" variants={fadeIn}>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/contacts")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Import Contacts</h1>
              <p className="text-muted-foreground">Upload and import contacts from CSV or Excel files</p>
            </div>
          </div>
          <Button variant="outline" onClick={downloadTemplate}>
            <Download className="mr-2 h-4 w-4" />
            Download Template
          </Button>
        </motion.div>

        {/* Progress Steps */}
        <motion.div className="flex items-center justify-between" variants={fadeIn}>
          {importSteps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                currentStep >= step.id 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'border-muted-foreground text-muted-foreground'
              }`}>
                {currentStep > step.id ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
              {index < importSteps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </motion.div>

        <motion.div variants={fadeIn}>
          <Tabs value={currentStep.toString()} className="w-full">
            {/* Step 1: Upload File */}
            <TabsContent value="1" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Contact File</CardTitle>
                  <CardDescription>
                    Upload a CSV or Excel file containing your contacts. Maximum file size: 10MB
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <p className="mt-4 text-lg font-medium">Upload your contact file</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Drag and drop a CSV or Excel file, or click to browse
                    </p>
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button variant="outline" className="cursor-pointer">
                        Browse Files
                      </Button>
                    </label>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Supported formats: CSV, Excel (.xlsx, .xls). Make sure your file includes headers in the first row.
                    </AlertDescription>
                  </Alert>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Required Fields</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">First Name</span>
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Phone Number</span>
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Optional Fields</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Email Address</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Company</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Address</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Step 2: Map Fields */}
            <TabsContent value="2" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Map Fields</CardTitle>
                  <CardDescription>
                    Match the columns in your file to contact fields in SOZURI
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {uploadedFile && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        File uploaded: <strong>{uploadedFile.name}</strong> ({(uploadedFile.size / 1024).toFixed(1)} KB)
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-4">
                    <Label className="text-base font-medium">Field Mapping</Label>
                    <div className="grid gap-4">
                      {detectedColumns.map((column) => (
                        <div key={column} className="flex items-center gap-4 p-4 border rounded-lg">
                          <Checkbox
                            checked={selectedColumns.includes(column)}
                            onCheckedChange={(checked) => handleColumnSelection(column, checked as boolean)}
                          />
                          <div className="flex-1">
                            <Label className="font-medium">{column}</Label>
                            <p className="text-sm text-muted-foreground">
                              Sample: {previewData[0][column as keyof typeof previewData[0]]}
                            </p>
                          </div>
                          <div className="w-48">
                            <Select 
                              value={fieldMappings[column] || ""} 
                              onValueChange={(value) => handleFieldMapping(column, value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select field" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">Don't import</SelectItem>
                                {availableFields.map((field) => (
                                  <SelectItem key={field.key} value={field.key}>
                                    <div className="flex items-center gap-2">
                                      <field.icon className="h-4 w-4" />
                                      {field.label}
                                      {field.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-medium">Duplicate Handling</Label>
                    <Select value={duplicateHandling} onValueChange={setDuplicateHandling}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="skip">Skip duplicates</SelectItem>
                        <SelectItem value="update">Update existing contacts</SelectItem>
                        <SelectItem value="create">Create new contacts anyway</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setCurrentStep(1)}>
                      Back
                    </Button>
                    <Button onClick={() => setCurrentStep(3)}>
                      Continue to Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Step 3: Review & Import */}
            <TabsContent value="3" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Review & Import</CardTitle>
                  <CardDescription>
                    Review your import settings and start the import process
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label className="text-sm font-medium">File</Label>
                      <p className="text-sm text-muted-foreground">{uploadedFile?.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Columns to Import</Label>
                      <p className="text-sm text-muted-foreground">{selectedColumns.length} columns selected</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Duplicate Handling</Label>
                      <p className="text-sm text-muted-foreground capitalize">{duplicateHandling.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Estimated Contacts</Label>
                      <p className="text-sm text-muted-foreground">~1,250 contacts</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Field Mappings</Label>
                    <div className="space-y-2">
                      {Object.entries(fieldMappings).map(([column, field]) => {
                        const fieldInfo = availableFields.find(f => f.key === field)
                        return fieldInfo ? (
                          <div key={column} className="flex items-center justify-between p-2 bg-muted rounded">
                            <span className="text-sm font-medium">{column}</span>
                            <div className="flex items-center gap-2">
                              <fieldInfo.icon className="h-4 w-4" />
                              <span className="text-sm">{fieldInfo.label}</span>
                              {fieldInfo.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                            </div>
                          </div>
                        ) : null
                      })}
                    </div>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This action will import contacts into your database. Make sure all mappings are correct before proceeding.
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setCurrentStep(2)}>
                      Back
                    </Button>
                    <Button onClick={startImport}>
                      Start Import
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Step 4: Import Progress & Results */}
            <TabsContent value="4" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {isImporting ? "Importing Contacts..." : "Import Complete"}
                  </CardTitle>
                  <CardDescription>
                    {isImporting ? "Please wait while we import your contacts" : "Your contacts have been imported successfully"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isImporting ? (
                    <div className="space-y-4">
                      <Progress value={importProgress} className="w-full" />
                      <p className="text-sm text-muted-foreground text-center">
                        {importProgress}% complete
                      </p>
                    </div>
                  ) : importResults && (
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">{importResults.imported}</div>
                            <p className="text-xs text-muted-foreground">Imported</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-yellow-600">{importResults.skipped}</div>
                            <p className="text-xs text-muted-foreground">Skipped</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">{importResults.duplicates}</div>
                            <p className="text-xs text-muted-foreground">Duplicates</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-red-600">{importResults.errors}</div>
                            <p className="text-xs text-muted-foreground">Errors</p>
                          </CardContent>
                        </Card>
                      </div>

                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          Successfully imported {importResults.imported} out of {importResults.total} contacts.
                        </AlertDescription>
                      </Alert>

                      <div className="flex gap-2">
                        <Button onClick={() => router.push("/dashboard/contacts")}>
                          View Contacts
                        </Button>
                        <Button variant="outline" onClick={() => {
                          setCurrentStep(1)
                          setUploadedFile(null)
                          setImportResults(null)
                          setImportProgress(0)
                        }}>
                          Import More
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}

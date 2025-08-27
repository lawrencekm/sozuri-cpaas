
"use client"

import { useState, useRef, ChangeEvent, FormEvent, useEffect, useCallback } from "react"
import { Download, Filter, Plus, Search, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import * as XLSX from 'xlsx'
import { useToast } from "@/components/ui/use-toast"

type Contact = {
  id?: string;
  mobile: string;
  email?: string;
  city?: string;
  fname?: string;
  mname?: string;
  lname?: string;
  type?: string;
  job?: string;
  company?: string;
  detail?: string;
  projectId?: string;
  userId?: string;
}

export default function ContactsPage() {
  // Types for segments, groups, and lists
  type Segment = {
    name: string;
    description: string;
    rules: {
      field: string;
      operator: string;
      value: string;
    }[];
  }

  type Group = {
    name: string;
    description: string;
    tags?: string[];
  }

  type List = {
    name: string;
    description: string;
    type: 'sms' | 'whatsapp' | 'email';
    frequency?: 'daily' | 'weekly' | 'monthly' | 'custom';
  }

  // State
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("")
  const [showImport, setShowImport] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [showCreateSegment, setShowCreateSegment] = useState(false)
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [showCreateList, setShowCreateList] = useState(false)
  const fileInputRef = useRef(null)
  const [newContact, setNewContact] = useState<Contact>({ mobile: "", fname: "", email: "" })
  const [newSegment, setNewSegment] = useState<Segment>({ name: "", description: "", rules: [] })
  const [newGroup, setNewGroup] = useState<Group>({ name: "", description: "" })
  const [newList, setNewList] = useState<List>({ name: "", description: "", type: 'sms' })
  const { toast } = useToast()

  // Fetch contacts
  const fetchContacts = useCallback(async () => {
    try {
      const response = await fetch('/api/v1/contacts')
      if (!response.ok) throw new Error('Failed to fetch contacts')
      const data = await response.json()
      setContacts(data.contacts)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load contacts",
        variant: "destructive"
      })
    }
  }, [toast])

  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  // Handlers
  const handleImportClick = () => setShowImport(true)
  const handleAddClick = () => setShowAdd(true)
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)
  const handleFilterClick = () => setFilter(filter === "active" ? "" : "active")

  // Excel upload
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    try {
      setIsLoading(true)
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json<Contact>(worksheet)
      
      // Validate data
      const invalidRows = jsonData.filter(row => !row.mobile?.match(/^\+25472/))
      if (invalidRows.length > 0) {
        toast({
          title: "Invalid Data",
          description: "Some mobile numbers are invalid. Please ensure all numbers start with +25472",
          variant: "destructive"
        })
        return
      }

      // Upload contacts in batches
      const results = await Promise.allSettled(
        jsonData.map(contact =>
          fetch('/api/v1/contacts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contact)
          })
        )
      )

      const successful = results.filter(result => result.status === 'fulfilled').length
      const failed = results.filter(result => result.status === 'rejected').length

      toast({
        title: "Import Complete",
        description: `Successfully imported ${successful} contacts${failed > 0 ? `, ${failed} failed` : ''}`,
        variant: successful > 0 ? "default" : "destructive"
      })

      if (successful > 0) {
        await fetchContacts() // Refresh the contacts list
        setShowImport(false)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to parse Excel file. Please ensure it follows the required format.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Add contact
  const handleAddContact = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newContact.mobile || !newContact.fname) return
    
    try {
      setIsLoading(true)
      const response = await fetch('/api/v1/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContact)
      })

      if (!response.ok) throw new Error('Failed to add contact')

      toast({
        title: "Success",
        description: "Contact added successfully"
      })

      await fetchContacts() // Refresh the contacts list
      setNewContact({ mobile: "", fname: "", email: "" })
      setShowAdd(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add contact",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Create segment
  const handleCreateSegment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newSegment.name) return
    
    try {
      setIsLoading(true)
      const response = await fetch('/api/v1/segments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSegment)
      })

      if (!response.ok) throw new Error('Failed to create segment')

      toast({
        title: "Success",
        description: "Segment created successfully"
      })

      setNewSegment({ name: "", description: "", rules: [] })
      setShowCreateSegment(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create segment",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Create group
  const handleCreateGroup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newGroup.name) return
    
    try {
      setIsLoading(true)
      const response = await fetch('/api/v1/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGroup)
      })

      if (!response.ok) throw new Error('Failed to create group')

      toast({
        title: "Success",
        description: "Group created successfully"
      })

      setNewGroup({ name: "", description: "" })
      setShowCreateGroup(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create group",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Create list
  const handleCreateList = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newList.name || !newList.type) return
    
    try {
      setIsLoading(true)
      const response = await fetch('/api/v1/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newList)
      })

      if (!response.ok) throw new Error('Failed to create list')

      toast({
        title: "Success",
        description: "Distribution list created successfully"
      })

      setNewList({ name: "", description: "", type: 'sms' })
      setShowCreateList(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create distribution list",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Filtered contacts
  const filteredContacts = contacts.filter((c) => {
    const searchLower = search.toLowerCase()
    const matchesSearch = search === "" || 
      c.mobile?.includes(search) || // Don't lowercase phone numbers
      c.email?.toLowerCase().includes(searchLower) ||
      c.city?.toLowerCase().includes(searchLower) ||
      c.fname?.toLowerCase().includes(searchLower) ||
      c.mname?.toLowerCase().includes(searchLower) ||
      c.lname?.toLowerCase().includes(searchLower) ||
      c.company?.toLowerCase().includes(searchLower)
    const matchesFilter = filter === "" || c.type === filter
    return matchesSearch && matchesFilter
  })

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Audience</h1>
            <p className="text-muted-foreground">Manage your contacts and audience segments</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={showImport} onOpenChange={setShowImport}>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={handleImportClick}>
                  <Download className="mr-2 h-4 w-4" /> Import
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="space-y-2">
                  <DialogTitle>Import Contacts</DialogTitle>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <DialogDescription>
                      Upload multiple contacts from an MS Excel file (.XLSX)
                    </DialogDescription>
                    <div className="text-sm text-muted-foreground">
                      Ensure that your Excel file has the ten headers:
                      <div className="grid grid-cols-5 gap-2 mt-1">
                        <span className="font-medium">mobile*</span>
                        <span>email</span>
                        <span>city</span>
                        <span>fname</span>
                        <span>mname</span>
                        <span>lname</span>
                        <span>type</span>
                        <span>job</span>
                        <span>company</span>
                        <span>detail</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      * The &quot;mobile&quot; field is mandatory and must follow the international format +25472X..
                    </div>
                  </div>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <label htmlFor="csv-upload" className="text-sm font-medium">Excel File</label>
                    <input 
                      id="csv-upload" 
                      type="file" 
                      accept=".xlsx" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      title="Upload Excel file" 
                      className="w-full text-sm p-2 border rounded-md" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Example format:</p>
                    <div className="bg-muted rounded-md">
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr>
                              <th className="p-2 text-left">mobile</th>
                              <th className="p-2 text-left">email</th>
                              <th className="p-2 text-left">city</th>
                              <th className="p-2 text-left">fname</th>
                              <th className="p-2 text-left">other fields...</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="p-2">+254725164293</td>
                              <td className="p-2">hello@sozuri.net</td>
                              <td className="p-2">Nairobi</td>
                              <td className="p-2">Sozuri</td>
                              <td className="p-2">...</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Add to Contact Groups</label>
                    <p className="text-xs text-muted-foreground">[Ctrl + Click to add contacts to multiple groups]</p>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" type="button" onClick={() => setShowImport(false)} disabled={isLoading}>
                    Cancel
                  </Button>
                </DialogFooter>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog open={showAdd} onOpenChange={setShowAdd}>
              <DialogTrigger asChild>
                <Button onClick={handleAddClick}>
                  <Plus className="mr-2 h-4 w-4" /> Add Contact
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Contact</DialogTitle>
                  <DialogDescription>Enter contact details</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddContact} className="space-y-2">
                  <label htmlFor="contact-mobile" className="block mb-1 text-sm font-medium text-gray-700">Mobile*</label>
                  <Input 
                    id="contact-mobile" 
                    placeholder="+254720000000" 
                    value={newContact.mobile} 
                    onChange={e => setNewContact({ ...newContact, mobile: e.target.value })} 
                    required 
                    pattern="^\+25472\d+"
                  />
                  <label htmlFor="contact-fname" className="block mb-1 text-sm font-medium text-gray-700 mt-2">First Name*</label>
                  <Input 
                    id="contact-fname" 
                    placeholder="First Name" 
                    value={newContact.fname} 
                    onChange={e => setNewContact({ ...newContact, fname: e.target.value })} 
                    required 
                  />
                  <label htmlFor="contact-email" className="block mb-1 text-sm font-medium text-gray-700 mt-2">Email</label>
                  <Input 
                    id="contact-email" 
                    type="email"
                    placeholder="Email" 
                    value={newContact.email || ""} 
                    onChange={e => setNewContact({ ...newContact, email: e.target.value })} 
                  />
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <label htmlFor="contact-mname" className="block mb-1 text-sm font-medium text-gray-700">Middle Name</label>
                      <Input 
                        id="contact-mname" 
                        placeholder="Middle Name" 
                        value={newContact.mname || ""} 
                        onChange={e => setNewContact({ ...newContact, mname: e.target.value })} 
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-lname" className="block mb-1 text-sm font-medium text-gray-700">Last Name</label>
                      <Input 
                        id="contact-lname" 
                        placeholder="Last Name" 
                        value={newContact.lname || ""} 
                        onChange={e => setNewContact({ ...newContact, lname: e.target.value })} 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <label htmlFor="contact-city" className="block mb-1 text-sm font-medium text-gray-700">City</label>
                      <Input 
                        id="contact-city" 
                        placeholder="City" 
                        value={newContact.city || ""} 
                        onChange={e => setNewContact({ ...newContact, city: e.target.value })} 
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-type" className="block mb-1 text-sm font-medium text-gray-700">Type</label>
                      <Input 
                        id="contact-type" 
                        placeholder="Type" 
                        value={newContact.type || ""} 
                        onChange={e => setNewContact({ ...newContact, type: e.target.value })} 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <label htmlFor="contact-job" className="block mb-1 text-sm font-medium text-gray-700">Job</label>
                      <Input 
                        id="contact-job" 
                        placeholder="Job Title" 
                        value={newContact.job || ""} 
                        onChange={e => setNewContact({ ...newContact, job: e.target.value })} 
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-company" className="block mb-1 text-sm font-medium text-gray-700">Company</label>
                      <Input 
                        id="contact-company" 
                        placeholder="Company" 
                        value={newContact.company || ""} 
                        onChange={e => setNewContact({ ...newContact, company: e.target.value })} 
                      />
                    </div>
                  </div>
                  <div className="mt-2">
                    <label htmlFor="contact-detail" className="block mb-1 text-sm font-medium text-gray-700">Detail</label>
                    <Input 
                      id="contact-detail" 
                      placeholder="Additional Details" 
                      value={newContact.detail || ""} 
                      onChange={e => setNewContact({ ...newContact, detail: e.target.value })} 
                    />
                  </div>
                  <DialogFooter className="mt-4">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Adding..." : "Add"}
                    </Button>
                    <Button variant="outline" type="button" onClick={() => setShowAdd(false)} disabled={isLoading}>
                      Cancel
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search contacts..." className="pl-8" value={search} onChange={handleSearchChange} />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleFilterClick} aria-pressed={filter === "active"}>
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
              <CardContent className="min-h-[400px]">
                {filteredContacts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center h-full">
                    <Users className="h-10 w-10 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-medium">Contact Database</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Manage your contacts and their communication preferences
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border mt-2">
                      <thead>
                        <tr>
                          <th className="px-2 py-1 whitespace-nowrap">Mobile</th>
                          <th className="px-2 py-1">Email</th>
                          <th className="px-2 py-1">City</th>
                          <th className="px-2 py-1">First Name</th>
                          <th className="px-2 py-1">Middle Name</th>
                          <th className="px-2 py-1">Last Name</th>
                          <th className="px-2 py-1">Type</th>
                          <th className="px-2 py-1">Job</th>
                          <th className="px-2 py-1">Company</th>
                          <th className="px-2 py-1">Detail</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredContacts.map((c, idx) => (
                          <tr key={idx} className="border-t">
                            <td className="px-2 py-1 whitespace-nowrap">{c.mobile}</td>
                            <td className="px-2 py-1">{c.email}</td>
                            <td className="px-2 py-1">{c.city}</td>
                            <td className="px-2 py-1">{c.fname}</td>
                            <td className="px-2 py-1">{c.mname}</td>
                            <td className="px-2 py-1">{c.lname}</td>
                            <td className="px-2 py-1">{c.type}</td>
                            <td className="px-2 py-1">{c.job}</td>
                            <td className="px-2 py-1">{c.company}</td>
                            <td className="px-2 py-1">{c.detail}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          {/* ...existing code for other tabs... */}
          <TabsContent value="segments" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Audience Segments</h2>
                <p className="text-sm text-muted-foreground">Create dynamic segments based on contact attributes and behaviors</p>
              </div>
              <Dialog open={showCreateSegment} onOpenChange={setShowCreateSegment}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Create Segment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Audience Segment</DialogTitle>
                    <DialogDescription>
                      Define rules to automatically segment your contacts based on their attributes and behaviors.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateSegment} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="segment-name" className="text-sm font-medium">Segment Name*</label>
                      <Input
                        id="segment-name"
                        placeholder="e.g., High Value Customers"
                        value={newSegment.name}
                        onChange={e => setNewSegment({ ...newSegment, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="segment-description" className="text-sm font-medium">Description</label>
                      <Input
                        id="segment-description"
                        placeholder="Describe the purpose of this segment"
                        value={newSegment.description}
                        onChange={e => setNewSegment({ ...newSegment, description: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Segment Rules</label>
                      <div className="space-y-4">
                        {newSegment.rules.map((rule, index) => (
                          <div key={index} className="grid grid-cols-3 gap-2">
                            <Input
                              placeholder="Field"
                              value={rule.field}
                              onChange={e => {
                                const rules = [...newSegment.rules]
                                rules[index].field = e.target.value
                                setNewSegment({ ...newSegment, rules })
                              }}
                            />
                            <Input
                              placeholder="Operator"
                              value={rule.operator}
                              onChange={e => {
                                const rules = [...newSegment.rules]
                                rules[index].operator = e.target.value
                                setNewSegment({ ...newSegment, rules })
                              }}
                            />
                            <Input
                              placeholder="Value"
                              value={rule.value}
                              onChange={e => {
                                const rules = [...newSegment.rules]
                                rules[index].value = e.target.value
                                setNewSegment({ ...newSegment, rules })
                              }}
                            />
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setNewSegment({
                            ...newSegment,
                            rules: [...newSegment.rules, { field: '', operator: '', value: '' }]
                          })}
                        >
                          Add Rule
                        </Button>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create Segment"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowCreateSegment(false)} disabled={isLoading}>
                        Cancel
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Location Based</CardTitle>
                  <CardDescription>Segment contacts by city, region, or timezone</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Contacts</p>
                        <p className="text-lg font-medium">0</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Active Rules</p>
                        <p className="text-lg font-medium">0</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Level</CardTitle>
                  <CardDescription>Segment by message interaction rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Contacts</p>
                        <p className="text-lg font-medium">0</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Active Rules</p>
                        <p className="text-lg font-medium">0</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Custom Attributes</CardTitle>
                  <CardDescription>Segment based on custom fields</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Contacts</p>
                        <p className="text-lg font-medium">0</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Active Rules</p>
                        <p className="text-lg font-medium">0</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="groups" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Contact Groups</h2>
                <p className="text-sm text-muted-foreground">Organize contacts into static groups for targeted messaging</p>
              </div>
              <Dialog open={showCreateGroup} onOpenChange={setShowCreateGroup}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Create Group
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Contact Group</DialogTitle>
                    <DialogDescription>
                      Create a static group to organize your contacts for targeted communications.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateGroup} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="group-name" className="text-sm font-medium">Group Name*</label>
                      <Input
                        id="group-name"
                        placeholder="e.g., VIP Customers"
                        value={newGroup.name}
                        onChange={e => setNewGroup({ ...newGroup, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="group-description" className="text-sm font-medium">Description</label>
                      <Input
                        id="group-description"
                        placeholder="Describe the purpose of this group"
                        value={newGroup.description}
                        onChange={e => setNewGroup({ ...newGroup, description: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="group-tags" className="text-sm font-medium">Tags</label>
                      <Input
                        id="group-tags"
                        placeholder="Enter tags separated by commas"
                        value={newGroup.tags?.join(', ') || ''}
                        onChange={e => setNewGroup({ 
                          ...newGroup, 
                          tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                        })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Tags help you categorize and filter groups easily
                      </p>
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create Group"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowCreateGroup(false)} disabled={isLoading}>
                        Cancel
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>VIP Customers</CardTitle>
                  <CardDescription>High-value customer group</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Members</p>
                        <p className="text-lg font-medium">0</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Updated</p>
                        <p className="text-sm text-muted-foreground">Never</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Opt-in Marketing</CardTitle>
                  <CardDescription>Marketing communication subscribers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Members</p>
                        <p className="text-lg font-medium">0</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Updated</p>
                        <p className="text-sm text-muted-foreground">Never</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Beta Testers</CardTitle>
                  <CardDescription>Product testing group</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Members</p>
                        <p className="text-lg font-medium">0</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Updated</p>
                        <p className="text-sm text-muted-foreground">Never</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="lists" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Distribution Lists</h2>
                <p className="text-sm text-muted-foreground">Manage targeted communication channels</p>
              </div>
              <Dialog open={showCreateList} onOpenChange={setShowCreateList}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Create List
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Distribution List</DialogTitle>
                    <DialogDescription>
                      Set up a distribution list for regular communications with your contacts.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateList} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="list-name" className="text-sm font-medium">List Name*</label>
                      <Input
                        id="list-name"
                        placeholder="e.g., Weekly Newsletter"
                        value={newList.name}
                        onChange={e => setNewList({ ...newList, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="list-description" className="text-sm font-medium">Description</label>
                      <Input
                        id="list-description"
                        placeholder="Describe the purpose of this distribution list"
                        value={newList.description}
                        onChange={e => setNewList({ ...newList, description: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="list-type" className="text-sm font-medium">Communication Channel*</label>
                      <select
                        id="list-type"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={newList.type}
                        onChange={e => setNewList({ ...newList, type: e.target.value as 'sms' | 'whatsapp' | 'email' })}
                        required
                      >
                        <option value="sms">SMS</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="email">Email</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="list-frequency" className="text-sm font-medium">Communication Frequency</label>
                      <select
                        id="list-frequency"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={newList.frequency || ''}
                        onChange={e => setNewList({ ...newList, frequency: e.target.value as 'daily' | 'weekly' | 'monthly' | 'custom' })}
                      >
                        <option value="">Select frequency</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create List"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowCreateList(false)} disabled={isLoading}>
                        Cancel
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Newsletter</CardTitle>
                  <CardDescription>Weekly newsletter distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Subscribers</p>
                        <p className="text-lg font-medium">0</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Sent</p>
                        <p className="text-sm text-muted-foreground">Never</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Announcements</CardTitle>
                  <CardDescription>Important updates and notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Subscribers</p>
                        <p className="text-lg font-medium">0</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Sent</p>
                        <p className="text-sm text-muted-foreground">Never</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Promotions</CardTitle>
                  <CardDescription>Special offers and promotions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Subscribers</p>
                        <p className="text-lg font-medium">0</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Sent</p>
                        <p className="text-sm text-muted-foreground">Never</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

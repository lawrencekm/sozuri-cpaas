
"use client"

import { useState, useRef, ChangeEvent, FormEvent } from "react"
import { Download, Filter, Plus, Search, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import * as XLSX from 'xlsx'

export default function ContactsPage() {
  // State
  type Contact = {
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
  }
  const [contacts, setContacts] = useState<Contact[]>([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("")
  const [showImport, setShowImport] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const fileInputRef = useRef(null)
  const [newContact, setNewContact] = useState<Contact>({ mobile: "", fname: "", email: "" })

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
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json<Contact>(worksheet)
      
      // Validate data
      const invalidRows = jsonData.filter(row => !row.mobile?.match(/^\+25472/))
      if (invalidRows.length > 0) {
        alert("Some mobile numbers are invalid. Please ensure all numbers start with +25472")
        return
      }

      setContacts((prev) => [...prev, ...jsonData])
      setShowImport(false)
    } catch (error) {
      alert("Failed to parse Excel file. Please ensure it follows the required format.")
    }
  }

  // Add contact
  const handleAddContact = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newContact.mobile || !newContact.fname) return
    setContacts((prev) => [...prev, newContact])
    setNewContact({ mobile: "", fname: "", email: "" })
    setShowAdd(false)
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
                <DialogHeader>
                  <DialogTitle>Import Contacts</DialogTitle>
                  <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                    <DialogDescription>
                      Upload multiple contacts from an MS Excel file (.XLSX)
                    </DialogDescription>
                    <div className="text-sm text-muted-foreground">
                      Ensure that your Excel file has the ten headers: mobile, email, city, fname, mname, lname, type, job, company, detail.
                    </div>
                    <div className="text-sm text-muted-foreground">
                      The &quot;mobile&quot; field is mandatory and must follow the international format +25472X..
                    </div>
                  </div>
                </DialogHeader>
                <div className="space-y-4">
                  <label htmlFor="csv-upload" className="block mb-2 text-sm font-medium text-gray-700">Excel File</label>
                  <input id="csv-upload" type="file" accept=".xlsx" ref={fileInputRef} onChange={handleFileUpload} title="Upload Excel file" className="w-full" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium">Example format:</p>
                    <div className="mt-2 p-2 bg-muted rounded-md overflow-x-auto">
                      <pre className="text-xs">
                        mobile          | email            | city    | fname  | mname  | lname  | type   | job    | company | detail
                        +254725164293   | hello@sozuri.net | Nairobi | Sozuri | Sozuri | Sozuri | Sozuri | Sozuri | Sozuri  | Sozuri
                      </pre>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-sm font-medium">Add to Contact Groups</label>
                    <p className="text-xs text-muted-foreground mt-1">[Ctrl + Click to add contacts to multiple groups]</p>
                  </div>
                </div>
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
                    <Button type="submit">Add</Button>
                    <DialogClose asChild>
                      <Button variant="outline" type="button">Cancel</Button>
                    </DialogClose>
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

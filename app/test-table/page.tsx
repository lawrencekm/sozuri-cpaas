"use client";

import { EnhancedTable, StatusBadge } from "@/components/ui/enhanced-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";

// Sample data for testing
const sampleData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    status: "active",
    role: "Admin",
    lastLogin: "2024-01-15",
    messages: 1247
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    status: "pending",
    role: "User",
    lastLogin: "2024-01-14",
    messages: 856
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    status: "inactive",
    role: "User",
    lastLogin: "2024-01-10",
    messages: 423
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@example.com",
    status: "active",
    role: "Moderator",
    lastLogin: "2024-01-16",
    messages: 2134
  },
  {
    id: 5,
    name: "Charlie Wilson",
    email: "charlie@example.com",
    status: "error",
    role: "User",
    lastLogin: "2024-01-12",
    messages: 67
  }
];

// Define columns for the table
const columns = [
  {
    key: "name" as keyof typeof sampleData[0],
    header: "Name",
    sortable: true,
    render: (value: string, row: typeof sampleData[0]) => (
      <div className="flex flex-col">
        <span className="font-medium text-gray-900 dark:text-gray-100">{value}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{row.email}</span>
      </div>
    )
  },
  {
    key: "status" as keyof typeof sampleData[0],
    header: "Status",
    sortable: true,
    render: (value: string) => <StatusBadge status={value} />
  },
  {
    key: "role" as keyof typeof sampleData[0],
    header: "Role",
    sortable: true,
    render: (value: string) => (
      <Badge variant="outline" className="text-xs">
        {value}
      </Badge>
    )
  },
  {
    key: "messages" as keyof typeof sampleData[0],
    header: "Messages",
    sortable: true,
    render: (value: number) => (
      <span className="font-mono text-sm">{value.toLocaleString()}</span>
    )
  },
  {
    key: "lastLogin" as keyof typeof sampleData[0],
    header: "Last Login",
    sortable: true,
    render: (value: string) => (
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {new Date(value).toLocaleDateString()}
      </span>
    )
  },
  {
    key: "id" as keyof typeof sampleData[0],
    header: "Actions",
    render: (value: number, row: typeof sampleData[0]) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    )
  }
];

export default function TestTablePage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Enhanced Table Component Test
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Testing the new enhanced table component with improved styling, search, and sorting.
        </p>
      </div>

      {/* Basic Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Basic Table
        </h2>
        <EnhancedTable
          data={sampleData}
          columns={columns}
        />
      </div>

      {/* Table with Search */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Table with Search
        </h2>
        <EnhancedTable
          data={sampleData}
          columns={columns}
          searchable={true}
        />
      </div>

      {/* Table with Search and Pagination */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Table with Search and Pagination
        </h2>
        <EnhancedTable
          data={sampleData}
          columns={columns}
          searchable={true}
          pagination={true}
          pageSize={3}
        />
      </div>

      {/* Loading State */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Loading State
        </h2>
        <EnhancedTable
          data={[]}
          columns={columns}
          searchable={true}
          loading={true}
        />
      </div>

      {/* Empty State */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Empty State
        </h2>
        <EnhancedTable
          data={[]}
          columns={columns}
          searchable={true}
          emptyMessage="No users found. Try adjusting your search criteria."
        />
      </div>
    </div>
  );
}

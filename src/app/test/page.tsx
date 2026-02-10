"use client";

import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { DataTable, TableDialog } from "@/components/tables";

// Define data type
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

// Mock data
const initialData: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    createdAt: new Date("2024-02-20"),
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "User",
    createdAt: new Date("2024-03-10"),
  },
];

export default function TestPage() {
  const [data, setData] = useState<User[]>(initialData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "User",
  });

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setData(data.filter((user) => user.id !== id));
      toast.success("User deleted successfully");
    }
  };

  // Define columns
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: (info) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              info.getValue() === "Admin"
                ? "bg-purple-100 text-purple-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: (info) => format(info.getValue() as Date, "MMM dd, yyyy"),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(row.original)}
            >
              <Edit size={16} />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(row.original.id)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", role: "User" });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      // Update
      setData(
        data.map((user) =>
          user.id === editingUser.id
            ? { ...user, ...formData, createdAt: user.createdAt }
            : user
        )
      );
      toast.success("User updated successfully");
    } else {
      // Create
      const newUser: User = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date(),
      };
      setData([...data, newUser]);
      toast.success("User created successfully");
    }
    setIsDialogOpen(false);
    setFormData({ name: "", email: "", role: "User" });
  };

  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        searchPlaceholder="Search users..."
        pageSize={5}
        onAdd={handleCreate}
        addButtonLabel="Add User"
        title="Test Page - User Management"
        subtitle="This is an unprotected route for testing CRUD operations"
      />

      <TableDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={editingUser ? "Edit User" : "Create User"}
        onSubmit={handleSubmit}
        submitLabel={editingUser ? "Update" : "Create"}
      >
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <Input
            value={formData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, name: e.target.value as string })
            }
            required
            placeholder="Enter name"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, email: e.target.value as string })
            }
            required
            placeholder="Enter email"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Role</label>
          <select
            value={formData.role}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setFormData({ ...formData, role: e.target.value as string })
            }
            className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
            required
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      </TableDialog>
    </>
  );
}

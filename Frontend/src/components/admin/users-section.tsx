"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Eye, Search } from "lucide-react";
import { UserOrdersDialog } from "./user-orders-dialog";
import { toast } from "sonner";
import axios from "axios";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
}

// Mock data - replace with API calls
const mockUsers: User[] = [
  {
    _id: "1",
    name: "john_doe",
    email: "john@example.com",
    role: "USER",
    createdAt: "2024-01-15",
  },
  {
    _id: "2",
    name: "jane_smith",
    email: "jane@example.com",
    role: "ADMIN",
    createdAt: "2024-01-10",
  },
  {
    _id: "3",
    name: "bob_wilson",
    email: "bob@example.com",
    role: "USER",
    createdAt: "2024-02-01",
  },
  {
    _id: "4",
    name: "alice_jones",
    email: "alice@example.com",
    role: "USER",
    createdAt: "2024-02-15",
  },
];

const BASE_URL = import.meta.env.VITE_BASE_URL;

export function UsersSection() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isOrdersDialogOpen, setIsOrdersDialogOpen] = useState(false);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewOrders = (user: User) => {
    setSelectedUser(user);
    setIsOrdersDialogOpen(true);
  };

  const getAllUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/all-users`, {
        withCredentials: true,
      });
      console.log("Users fetched:", response.data);
      setUsers(response.data.data);
      toast.success("Users fetched successfully!");
    } catch (error) {
      console.log("Error fetching users:", error);
      toast.error("Failed to fetch users. Please try again.");
    }
  }

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <>
      <Card className="border-border shadow-sm transition-shadow duration-200 hover:shadow-md">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl">Users</CardTitle>
              <CardDescription>
                Manage all registered users and view their orders
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 transition-all duration-200 focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow
                    key={user._id}
                    className="transition-colors duration-150 hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "ADMIN" ? "default" : "secondary"
                        }
                        className="transition-transform duration-150 hover:scale-105"
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewOrders(user)}
                        className="transition-all duration-150 hover:bg-accent"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Orders
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <UserOrdersDialog
        user={selectedUser}
        isOpen={isOrdersDialogOpen}
        onClose={() => setIsOrdersDialogOpen(false)}
      />
    </>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { hasPermission } from "@/lib/permissions";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  Search,
  Loader2,
  UserPlus,
  Shield,
} from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  Badge,
  Input,
  Label,
  Checkbox,
  Switch,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui";
import { PERMISSIONS, PERMISSION_DESCRIPTIONS } from "@/modules/rbac/constants";
import type { PermissionKey } from "@/modules/rbac/constants";

// ── Types ────────────────────────────────────────────────────────────────────

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "SUPER_ADMIN";
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  imageUrl: string | null;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

interface Permission {
  id: string;
  name: string;
  description: string | null;
}

type ModalMode = "add" | "edit" | "view" | null;

// ── Helpers ──────────────────────────────────────────────────────────────────

const permissionKeys = Object.keys(PERMISSIONS) as PermissionKey[];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";

  useEffect(() => {
    if (session && !hasPermission(session, "MANAGE_USERS")) {
      router.push("/admin");
    }
  }, [session, router]);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formStatus, setFormStatus] = useState<AdminUser["status"]>("APPROVED");
  const [formPermissions, setFormPermissions] = useState<string[]>([]);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchData = useCallback(async () => {
    try {
      const [usersRes, permsRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/permissions"),
      ]);

      if (!usersRes.ok || !permsRes.ok) {
        toast.error("Failed to load data");
        return;
      }

      const usersData = await usersRes.json();
      const permsData = await permsRes.json();

      setUsers(usersData.data);
      setPermissions(permsData.data);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Filtered users ─────────────────────────────────────────────────────────

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // ── Modal helpers ──────────────────────────────────────────────────────────

  const openAddModal = () => {
    setFormName("");
    setFormEmail("");
    setFormPassword("");
    setFormStatus("APPROVED");
    setFormPermissions([]);
    setSelectedUser(null);
    setModalMode("add");
  };

  const openEditModal = (user: AdminUser) => {
    setFormName(user.name);
    setFormEmail(user.email);
    setFormPassword("");
    setFormStatus(user.status);
    setFormPermissions(user.permissions);
    setSelectedUser(user);
    setModalMode("edit");
  };

  const openViewModal = (user: AdminUser) => {
    setSelectedUser(user);
    setModalMode("view");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedUser(null);
  };

  const togglePermission = (name: string) => {
    setFormPermissions((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name],
    );
  };

  // ── Actions ────────────────────────────────────────────────────────────────

  const handleAdd = async () => {
    if (!formName || !formEmail || !formPassword) {
      toast.error("Name, email, and password are required");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          password: formPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Assign permissions
      if (formPermissions.length > 0 && data.data?.id) {
        const permRes = await fetch("/api/admin/users/permissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: data.data.id, permissions: formPermissions }),
        });
        if (!permRes.ok) throw new Error("Failed to assign permissions");
      }

      toast.success("Admin created successfully");
      closeModal();
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create admin");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedUser) return;
    if (!formName || !formEmail) {
      toast.error("Name and email are required");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          password: formPassword || undefined,
          status: formStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Update permissions
        const permRes = await fetch("/api/admin/users/permissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: selectedUser.id, permissions: formPermissions }),
        });
        if (!permRes.ok) throw new Error("Failed to update permissions");

      toast.success("Admin updated successfully");
      closeModal();
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update admin");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (user: AdminUser) => {
    if (user.role === "SUPER_ADMIN") {
      toast.error("Cannot delete super admin");
      return;
    }
    if (user.id === currentUserId) {
      toast.error("Cannot delete yourself");
      return;
    }

    if (!confirm(`Delete ${user.name}? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Admin deleted");
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete admin");
    }
  };

  const handleToggleStatus = async (user: AdminUser) => {
    if (user.id === currentUserId) {
      toast.error("Cannot disable yourself");
      return;
    }

    const newStatus = user.status === "APPROVED" ? "SUSPENDED" : "APPROVED";

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      toast.success(`${user.name} ${newStatus === "APPROVED" ? "activated" : "suspended"}`);
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl py-4 sm:py-6 2xl:py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary sm:text-sm">
            Admin Panel
          </p>
          <h1 className="text-xl font-bold sm:text-2xl 2xl:text-3xl">User Management</h1>
        </div>
        <Button onClick={openAddModal} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Admin
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or email..."
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Avatar</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  {searchQuery ? "No users match your search" : "No admins found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    {user.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt={user.name}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {getInitials(user.name)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === "SUPER_ADMIN" ? "default" : "secondary"}
                      className={
                        user.role === "SUPER_ADMIN"
                          ? "bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30"
                          : "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30"
                      }
                    >
                      <Shield className="mr-1 h-3 w-3" />
                      {user.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {user.permissions.length === 0 ? (
                        <span className="text-xs text-muted-foreground">None</span>
                      ) : (
                        user.permissions.slice(0, 3).map((perm) => (
                          <span
                            key={perm}
                            className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                          >
                            {perm.replace(/_/g, " ")}
                          </span>
                        ))
                      )}
                      {user.permissions.length > 3 && (
                        <span className="text-[10px] text-muted-foreground">
                          +{user.permissions.length - 3} more
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={user.status === "APPROVED"}
                      onCheckedChange={() => handleToggleStatus(user)}
                      disabled={user.id === currentUserId}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openViewModal(user)}
                        className="h-8 w-8"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditModal(user)}
                        className="h-8 w-8"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(user)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        title="Delete"
                        disabled={
                          user.role === "SUPER_ADMIN" || user.id === currentUserId
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Modal */}
      {(modalMode === "add" || modalMode === "edit") && (
        <Dialog open onOpenChange={(open) => !open && closeModal()}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {modalMode === "add" ? (
                  <span className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Add New Admin
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Pencil className="h-5 w-5" />
                    Edit Admin
                  </span>
                )}
              </DialogTitle>
              <DialogDescription>
                {modalMode === "add"
                  ? "Create a new admin account and assign permissions."
                  : "Update admin details and manage permissions."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Name */}
              <div className="grid gap-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="admin@raynklabs.com"
                />
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <Label htmlFor="password">
                  Password {modalMode === "edit" ? "(leave blank to keep current)" : "*"}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder={modalMode === "add" ? "Enter password" : "Enter new password"}
                />
              </div>

              {/* Status (edit only) */}
              {modalMode === "edit" && (
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <Label>Status</Label>
                    <p className="text-xs text-muted-foreground">
                      {formStatus === "APPROVED" ? "Active" : "Disabled"}
                    </p>
                  </div>
                  <Switch
                    checked={formStatus === "APPROVED"}
                    onCheckedChange={(checked) =>
                      setFormStatus(checked ? "APPROVED" : "SUSPENDED")
                    }
                  />
                </div>
              )}

              {/* Permissions */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Permissions
                </Label>
                <p className="text-xs text-muted-foreground">
                  Select which sections this admin can manage.
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {permissionKeys.map((key) => (
                    <label
                      key={key}
                      className="flex items-start gap-2 rounded-lg border p-2.5 cursor-pointer transition-colors hover:bg-muted/50 has-[[data-state=checked]]:border-primary/50 has-[[data-state=checked]]:bg-primary/5"
                    >
                      <Checkbox
                        checked={formPermissions.includes(key)}
                        onCheckedChange={() => togglePermission(key)}
                        className="mt-0.5"
                      />
                      <div>
                        <p className="text-sm font-medium">{key.replace(/_/g, " ")}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {PERMISSION_DESCRIPTIONS[key]}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={closeModal} disabled={submitting}>
                Cancel
              </Button>
              <Button
                onClick={modalMode === "add" ? handleAdd : handleEdit}
                disabled={submitting}
              >
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {modalMode === "add" ? "Create Admin" : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* View Modal */}
      {modalMode === "view" && selectedUser && (
        <Dialog open onOpenChange={(open) => !open && closeModal()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Admin Details
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                {selectedUser.imageUrl ? (
                  <img
                    src={selectedUser.imageUrl}
                    alt={selectedUser.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                    {getInitials(selectedUser.name)}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                <div>
                  <p className="text-xs text-muted-foreground">Role</p>
                  <Badge
                    variant={selectedUser.role === "SUPER_ADMIN" ? "default" : "secondary"}
                    className={
                      selectedUser.role === "SUPER_ADMIN"
                        ? "bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30"
                        : "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30"
                    }
                  >
                    {selectedUser.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge
                    variant={
                      selectedUser.status === "APPROVED" ? "default" : "destructive"
                    }
                    className={
                      selectedUser.status === "APPROVED"
                        ? "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30"
                        : "bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30"
                    }
                  >
                    {selectedUser.status}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Permissions</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedUser.permissions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No permissions assigned</p>
                  ) : (
                    selectedUser.permissions.map((perm) => (
                      <span
                        key={perm}
                        className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {perm.replace(/_/g, " ")}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                <p>Created: {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                <p>Last updated: {new Date(selectedUser.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={closeModal}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

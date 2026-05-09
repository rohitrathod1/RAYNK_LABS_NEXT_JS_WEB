"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import {
  Download,
  Eye,
  FileSpreadsheet,
  Inbox,
  Loader2,
  MailOpen,
  Search,
  Trash2,
} from "lucide-react";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";

type SubmissionStatus = "read" | "unread";

interface Submission {
  id: string;
  type: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  subject: string | null;
  message: string | null;
  company: string | null;
  service: string | null;
  status: SubmissionStatus;
  sourcePage: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

interface SubmissionStats {
  total: number;
  unread: number;
  read: number;
  types: number;
  typeCounts: Array<{ type: string; count: number }>;
}

const TYPE_FILTERS = ["all", "contact", "service", "feedback", "team", "project"] as const;
const STATUS_FILTERS = ["all", "unread", "read"] as const;

function label(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function exportRows(rows: Submission[]) {
  return rows.map((submission) => ({
    Name: submission.name ?? "",
    Email: submission.email ?? "",
    Phone: submission.phone ?? "",
    Type: label(submission.type),
    Status: label(submission.status),
    Subject: submission.subject ?? "",
    Service: submission.service ?? "",
    Company: submission.company ?? "",
    Message: submission.message ?? "",
    "Source Page": submission.sourcePage ?? "",
    Date: formatDate(submission.createdAt),
  }));
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [stats, setStats] = useState<SubmissionStats>({ total: 0, unread: 0, read: 0, types: 0, typeCounts: [] });
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [type, setType] = useState<(typeof TYPE_FILTERS)[number]>("all");
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>("all");
  const [selected, setSelected] = useState<Submission | null>(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (type !== "all") params.set("type", type);
      if (status !== "all") params.set("status", status);
      const response = await fetch(`/api/submissions?${params.toString()}`, { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.error ?? "Failed to load submissions");
      setSubmissions(payload.data.submissions);
      setStats(payload.data.stats);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load submissions");
    } finally {
      setLoading(false);
    }
  }, [query, status, type]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      void fetchSubmissions();
    }, 250);
    return () => window.clearTimeout(id);
  }, [fetchSubmissions]);

  const filteredRows = useMemo(() => exportRows(submissions), [submissions]);

  function exportExcel() {
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Submissions");
    XLSX.writeFile(workbook, `submissions-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  function exportCsv() {
    const csv = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(filteredRows));
    downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), `submissions-${new Date().toISOString().slice(0, 10)}.csv`);
  }

  async function markRead(submission: Submission) {
    try {
      const nextStatus = submission.status === "read" ? "unread" : "read";
      const response = await fetch(`/api/submissions/${submission.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.error ?? "Failed to update status");
      await fetchSubmissions();
      if (selected?.id === submission.id) setSelected(payload.data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update status");
    }
  }

  async function deleteSubmission(submission: Submission) {
    if (!confirm(`Delete submission from ${submission.name ?? submission.email ?? "visitor"}?`)) return;
    try {
      const response = await fetch(`/api/submissions/${submission.id}`, { method: "DELETE" });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.error ?? "Failed to delete submission");
      setSelected(null);
      await fetchSubmissions();
      toast.success("Submission deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete submission");
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary sm:text-sm">Admin Panel</p>
          <h1 className="text-2xl font-bold sm:text-3xl">Form Submissions</h1>
          <p className="mt-2 text-sm text-muted-foreground">Search, filter, review, and export real website form submissions.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={exportExcel} disabled={submissions.length === 0} className="cursor-pointer gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] hover:bg-primary/90">
            <FileSpreadsheet className="h-4 w-4" /> Export Excel
          </Button>
          <Button onClick={exportCsv} disabled={submissions.length === 0} variant="outline" className="cursor-pointer gap-2 border-border transition-all hover:scale-[1.02] hover:border-primary/50 hover:bg-primary/10">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      <section className="rounded-3xl border border-border bg-card/80 p-4 shadow-sm backdrop-blur-xl sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, email, or message..."
              className="h-11 border-border bg-background/60 pl-10 focus-visible:ring-primary/30"
            />
          </div>
          <Select value={type} onValueChange={(value) => setType(value as (typeof TYPE_FILTERS)[number])}>
            <SelectTrigger className="h-11 border-border bg-background/60">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {TYPE_FILTERS.map((item) => (
                <SelectItem key={item} value={item}>{label(item)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(value) => setStatus(value as (typeof STATUS_FILTERS)[number])}>
            <SelectTrigger className="h-11 border-border bg-background/60">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTERS.map((item) => (
                <SelectItem key={item} value={item}>{label(item)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-border bg-card/80 shadow-sm backdrop-blur-xl">
        {loading ? (
          <div className="flex min-h-80 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : submissions.length === 0 ? (
          <div className="flex min-h-80 flex-col items-center justify-center p-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Inbox className="h-8 w-8" />
            </div>
            <h2 className="mt-5 text-xl font-bold">No submissions found</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Real website form submissions will appear here automatically after visitors submit a form.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden lg:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id} className="transition hover:bg-primary/5">
                      <TableCell className="font-medium">{submission.name ?? "Visitor"}</TableCell>
                      <TableCell>{submission.email ?? "-"}</TableCell>
                      <TableCell><Badge variant="secondary">{label(submission.type)}</Badge></TableCell>
                      <TableCell>
                        <Badge variant={submission.status === "unread" ? "default" : "secondary"}>
                          {label(submission.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(submission.createdAt)}</TableCell>
                      <TableCell className="max-w-40 truncate text-muted-foreground">{submission.sourcePage ?? "-"}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <IconButton title="View" onClick={() => setSelected(submission)}><Eye className="h-4 w-4" /></IconButton>
                          <IconButton title="Toggle read" onClick={() => void markRead(submission)}><MailOpen className="h-4 w-4" /></IconButton>
                          <IconButton title="Delete" destructive onClick={() => void deleteSubmission(submission)}><Trash2 className="h-4 w-4" /></IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="grid gap-3 p-4 lg:hidden">
              {submissions.map((submission) => (
                <article key={submission.id} className="rounded-2xl border border-border bg-background/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-bold">{submission.name ?? "Visitor"}</h3>
                      <p className="truncate text-sm text-muted-foreground">{submission.email ?? submission.phone ?? "-"}</p>
                    </div>
                    <Badge variant={submission.status === "unread" ? "default" : "secondary"}>{label(submission.status)}</Badge>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{submission.message ?? submission.subject ?? "No message"}</p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">{formatDate(submission.createdAt)}</span>
                    <div className="flex gap-1">
                      <IconButton title="View" onClick={() => setSelected(submission)}><Eye className="h-4 w-4" /></IconButton>
                      <IconButton title="Toggle read" onClick={() => void markRead(submission)}><MailOpen className="h-4 w-4" /></IconButton>
                      <IconButton title="Delete" destructive onClick={() => void deleteSubmission(submission)}><Trash2 className="h-4 w-4" /></IconButton>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Unread" value={stats.unread} />
        <StatCard label="Read" value={stats.read} />
        <StatCard label="Types" value={stats.types} />
      </section>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="grid gap-4 py-2">
              <Detail label="Name" value={selected.name} />
              <Detail label="Email" value={selected.email} />
              <Detail label="Phone" value={selected.phone} />
              <Detail label="Subject" value={selected.subject} />
              <Detail label="Message" value={selected.message} multiline />
              <Detail label="Service" value={selected.service} />
              <Detail label="Company" value={selected.company} />
              <Detail label="Source Page" value={selected.sourcePage} />
              <Detail label="Submitted Date" value={formatDate(selected.createdAt)} />
            </div>
          )}
          <DialogFooter>
            {selected && (
              <>
                <Button variant="outline" onClick={() => void markRead(selected)} className="cursor-pointer">
                  Mark {selected.status === "read" ? "Unread" : "Read"}
                </Button>
                <Button variant="destructive" onClick={() => void deleteSubmission(selected)} className="cursor-pointer">
                  Delete
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function IconButton({
  title,
  destructive,
  onClick,
  children,
}: {
  title: string;
  destructive?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      title={title}
      onClick={onClick}
      className={`h-8 w-8 cursor-pointer ${destructive ? "text-destructive hover:text-destructive" : ""}`}
    >
      {children}
    </Button>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-border bg-card/80 p-5 shadow-sm backdrop-blur-xl transition hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10">
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-3 text-3xl font-black text-primary">{value}</p>
    </div>
  );
}

function Detail({ label: title, value, multiline }: { label: string; value?: string | null; multiline?: boolean }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</p>
      <p className={`mt-1 rounded-xl border border-border bg-background/60 p-3 text-sm ${multiline ? "min-h-24 whitespace-pre-wrap" : ""}`}>
        {value || "-"}
      </p>
    </div>
  );
}

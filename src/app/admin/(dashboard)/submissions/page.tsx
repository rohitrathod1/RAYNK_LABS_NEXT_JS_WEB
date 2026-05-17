"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import {
  ChevronDown,
  Download,
  Eye,
  FileSpreadsheet,
  Inbox,
  MailOpen,
  Search,
  Trash2,
} from "lucide-react";
import { EmptyState, TableSkeleton } from "@/components/shared";
import {
  Badge,
  Button,
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
  serviceName: string | null;
  budget: string | null;
  timeline: string | null;
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
  services: string[];
}

const TYPE_FILTERS = [
  "all",
  "contact",
  "service",
  "feedback",
  "team",
  "project",
  "work_with_us",
  "join_team",
  "partnership",
  "project_inquiry",
] as const;
const STATUS_FILTERS = ["all", "unread", "read"] as const;

function label(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(value),
  );
}

function exportRows(rows: Submission[]) {
  return rows.map((submission) => ({
    Name: submission.name ?? "",
    Email: submission.email ?? "",
    Phone: submission.phone ?? "",
    Type: label(submission.type),
    Status: label(submission.status),
    Service: submission.serviceName ?? submission.service ?? "",
    Budget: submission.budget ?? "",
    Timeline: submission.timeline ?? "",
    Company: submission.company ?? "",
    Message: submission.message ?? "",
    "Source Page": submission.sourcePage ?? "",
    Date: formatDate(submission.createdAt),
  }));
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [stats, setStats] = useState<SubmissionStats>({
    total: 0,
    unread: 0,
    read: 0,
    types: 0,
    typeCounts: [],
    services: [],
  });
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [type, setType] = useState<(typeof TYPE_FILTERS)[number]>("all");
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>("all");
  const [service, setService] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (type !== "all") params.set("type", type);
      if (status !== "all") params.set("status", status);
      if (service !== "all") params.set("service", service);
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
  }, [query, service, status, type]);

  useEffect(() => {
    const id = window.setTimeout(() => void fetchSubmissions(), 220);
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
    downloadBlob(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
      `submissions-${new Date().toISOString().slice(0, 10)}.csv`,
    );
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
      if (expandedId === submission.id) setExpandedId(null);
      await fetchSubmissions();
      toast.success("Submission deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete submission");
    }
  }

  function toggleExpanded(id: string) {
    setExpandedId((current) => (current === id ? null : id));
  }

  return (
    <div className="mx-auto max-w-7xl space-y-5 py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary sm:text-sm">Admin Panel</p>
          <h1 className="text-2xl font-bold sm:text-3xl">Form Submissions</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Search, filter, review, and export real website form submissions.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            onClick={exportExcel}
            disabled={submissions.length === 0}
            className="cursor-pointer gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] hover:bg-primary/90"
          >
            <FileSpreadsheet className="h-4 w-4" /> Export Excel
          </Button>
          <Button
            onClick={exportCsv}
            disabled={submissions.length === 0}
            variant="outline"
            className="cursor-pointer gap-2 border-border transition-all hover:scale-[1.02] hover:border-primary/50 hover:bg-primary/10"
          >
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      <section className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm backdrop-blur-xl sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_170px_170px_210px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, email, or message..."
              className="h-10 border-border bg-background/60 pl-10 focus-visible:ring-primary/30"
            />
          </div>
          <Select value={type} onValueChange={(value) => setType(value as (typeof TYPE_FILTERS)[number])}>
            <SelectTrigger className="h-10 border-border bg-background/60">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {TYPE_FILTERS.map((item) => (
                <SelectItem key={item} value={item}>
                  {label(item)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(value) => setStatus(value as (typeof STATUS_FILTERS)[number])}>
            <SelectTrigger className="h-10 border-border bg-background/60">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTERS.map((item) => (
                <SelectItem key={item} value={item}>
                  {label(item)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={service} onValueChange={setService}>
            <SelectTrigger className="h-10 border-border bg-background/60">
              <SelectValue placeholder="Service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              {stats.services.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-border bg-card/80 shadow-sm backdrop-blur-xl">
        {loading ? (
          <TableSkeleton rows={6} className="min-h-80 border-0 bg-transparent" />
        ) : submissions.length === 0 ? (
          <EmptyState
            icon={<Inbox className="h-8 w-8" />}
            eyebrow="Submissions"
            title="No submissions found"
            description="Real website form submissions will appear here automatically after visitors submit a form."
            className="min-h-80 border-0 bg-transparent"
          />
        ) : (
          <>
            <div className="hidden xl:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => {
                    const expanded = expandedId === submission.id;
                    return (
                      <FragmentRow
                        key={submission.id}
                        summary={
                          <TableRow
                            className="cursor-pointer transition hover:bg-primary/5"
                            onClick={() => toggleExpanded(submission.id)}
                          >
                            <TableCell className="font-medium">{submission.name ?? "Visitor"}</TableCell>
                            <TableCell>{submission.email ?? "-"}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{label(submission.type)}</Badge>
                            </TableCell>
                            <TableCell className="max-w-40 truncate text-muted-foreground">
                              {submission.service ?? metadataValue(submission.metadata, "serviceName") ?? "-"}
                            </TableCell>
                            <TableCell>
                              <Badge variant={submission.status === "unread" ? "default" : "secondary"}>
                                {label(submission.status)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{formatDate(submission.createdAt)}</TableCell>
                            <TableCell>
                              <div className="flex justify-end gap-1" onClick={(event) => event.stopPropagation()}>
                                <IconButton title="Expand" onClick={() => toggleExpanded(submission.id)}>
                                  <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
                                </IconButton>
                                <IconButton title="View" onClick={() => toggleExpanded(submission.id)}>
                                  <Eye className="h-4 w-4" />
                                </IconButton>
                                <IconButton title="Toggle read" onClick={() => void markRead(submission)}>
                                  <MailOpen className="h-4 w-4" />
                                </IconButton>
                                <IconButton title="Delete" destructive onClick={() => void deleteSubmission(submission)}>
                                  <Trash2 className="h-4 w-4" />
                                </IconButton>
                              </div>
                            </TableCell>
                          </TableRow>
                        }
                        detail={
                          expanded ? (
                            <TableRow>
                              <TableCell colSpan={7} className="border-t border-border/70 bg-background/40 px-4 py-4">
                                <SubmissionExpandedRow submission={submission} />
                              </TableCell>
                            </TableRow>
                          ) : null
                        }
                      />
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="grid gap-3 p-4 xl:hidden">
              {submissions.map((submission) => {
                const expanded = expandedId === submission.id;
                return (
                  <article key={submission.id} className="rounded-xl border border-border bg-background/60 p-4">
                    <button
                      type="button"
                      onClick={() => toggleExpanded(submission.id)}
                      className="w-full text-left"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate font-bold">{submission.name ?? "Visitor"}</h3>
                          <p className="truncate text-sm text-muted-foreground">
                            {submission.email ?? submission.phone ?? "-"}
                          </p>
                        </div>
                        <Badge variant={submission.status === "unread" ? "default" : "secondary"}>
                          {label(submission.status)}
                        </Badge>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <p className="truncate text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                          {submission.service ?? metadataValue(submission.metadata, "serviceName") ?? label(submission.type)}
                        </p>
                        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`} />
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {submission.message ?? submission.subject ?? "No message"}
                      </p>
                    </button>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="text-xs text-muted-foreground">{formatDate(submission.createdAt)}</span>
                      <div className="flex gap-1">
                        <IconButton title="View" onClick={() => toggleExpanded(submission.id)}>
                          <Eye className="h-4 w-4" />
                        </IconButton>
                        <IconButton title="Toggle read" onClick={() => void markRead(submission)}>
                          <MailOpen className="h-4 w-4" />
                        </IconButton>
                        <IconButton title="Delete" destructive onClick={() => void deleteSubmission(submission)}>
                          <Trash2 className="h-4 w-4" />
                        </IconButton>
                      </div>
                    </div>

                    {expanded ? <div className="mt-4"><SubmissionExpandedRow submission={submission} /></div> : null}
                  </article>
                );
              })}
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
    </div>
  );
}

function FragmentRow({ summary, detail }: { summary: ReactNode; detail: ReactNode }) {
  return (
    <>
      {summary}
      {detail}
    </>
  );
}

function SubmissionExpandedRow({ submission }: { submission: Submission }) {
  const details = [
    { label: "Name", value: submission.name },
    { label: "Email", value: submission.email },
    { label: "Phone", value: submission.phone },
    { label: "Type", value: label(submission.type) },
    { label: "Service", value: submission.service ?? metadataValue(submission.metadata, "serviceName") },
    { label: "Role Interested In", value: metadataValue(submission.metadata, "roleInterestedIn") },
    { label: "Experience Level", value: metadataValue(submission.metadata, "experienceLevel") },
    { label: "Portfolio URL", value: metadataValue(submission.metadata, "portfolioUrl") },
    { label: "Resume", value: metadataValue(submission.metadata, "resumeUrl"), isLink: true },
    { label: "Budget", value: submission.budget ?? metadataValue(submission.metadata, "budget") },
    { label: "Timeline", value: submission.timeline ?? metadataValue(submission.metadata, "timeline") },
    { label: "Company", value: submission.company },
    { label: "Subject", value: submission.subject },
    { label: "Message", value: submission.message, wide: true },
    { label: "Source Page", value: submission.sourcePage },
    { label: "Submitted Date", value: formatDate(submission.createdAt) },
  ];

  return (
    <div className="overflow-x-auto no-scrollbar">
      <div className="flex min-w-max gap-3">
        {details.map((detail) => (
          <div
            key={detail.label}
            className={`rounded-xl border border-border bg-card/80 p-3 shadow-sm ${detail.wide ? "w-[380px]" : "w-[240px]"}`}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{detail.label}</p>
            {detail.isLink && detail.value ? (
              <a
                href={detail.value}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block truncate text-sm font-medium text-primary underline underline-offset-4"
              >
                Open resume
              </a>
            ) : (
              <p className={`mt-2 text-sm text-foreground ${detail.wide ? "whitespace-pre-wrap leading-6" : "truncate"}`}>
                {detail.value || "-"}
              </p>
            )}
          </div>
        ))}
      </div>
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
  children: ReactNode;
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
    <div className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm backdrop-blur-xl transition hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10">
      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-black text-primary">{value}</p>
    </div>
  );
}

function metadataValue(metadata: Record<string, unknown> | null, key: string) {
  const value = metadata?.[key];
  return typeof value === "string" ? value : null;
}


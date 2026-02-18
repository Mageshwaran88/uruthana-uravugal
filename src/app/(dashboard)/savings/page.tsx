"use client";

import { useEffect, useState } from "react";
import { PiggyBank, Download, Plus, Calendar, TrendingUp, Wallet, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useSavingsStore } from "@/stores/use-savings-store";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function SavingsPage() {
  const { user } = useAuth();
  const {
    records,
    summary,
    meta,
    isLoading,
    error,
    fetchAll,
    fetchSummary,
    create,
    downloadReport,
  } = useSavingsStore();

  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("monthly");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [typeFilter, setTypeFilter] = useState<"CREDIT" | "DEBIT" | "">("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const [addDate, setAddDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [addNote, setAddNote] = useState("");

  const dateRange = (() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (period === "daily") return { from: today, to: today };
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    if (period === "weekly") {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      return { from: weekStart, to: weekEnd };
    }
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { from: monthStart, to: monthEnd };
  })();

  const effectiveFrom = fromDate || format(dateRange.from, "yyyy-MM-dd");
  const effectiveTo = toDate || format(dateRange.to, "yyyy-MM-dd");

  useEffect(() => {
    fetchAll({
      fromDate: effectiveFrom,
      toDate: effectiveTo,
      page,
      limit: 20,
      ...(typeFilter && { type: typeFilter }),
      sortBy,
      sortOrder,
    });
  }, [effectiveFrom, effectiveTo, page, typeFilter, sortBy, sortOrder, fetchAll]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const handleAdd = async () => {
    const amount = parseFloat(addAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    try {
      await create({ amount, date: addDate, note: addNote || undefined });
      setIsAddOpen(false);
      setAddAmount("");
      setAddNote("");
      toast.success("Savings added");
    } catch {
      toast.error("Failed to add");
    }
  };

  const handleDownload = async () => {
    try {
      await downloadReport({ fromDate: effectiveFrom, toDate: effectiveTo });
      toast.success("Report downloaded");
    } catch {
      toast.error("Download failed");
    }
  };

  const stats = [
    { title: "Total Balance", value: `₹${summary?.total?.toFixed(2) ?? "0.00"}`, icon: PiggyBank },
    { title: "Today", value: `₹${summary?.daily?.toFixed(2) ?? "0.00"}`, icon: Calendar },
    { title: "This Week", value: `₹${summary?.weekly?.toFixed(2) ?? "0.00"}`, icon: TrendingUp },
    { title: "This Month", value: `₹${summary?.monthly?.toFixed(2) ?? "0.00"}`, icon: Wallet },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Savings</h1>
          <p className="text-muted-foreground mt-1">
            View credit/debit history. Created by and amount audit trail.
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" />Add Credit</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Credit</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-sm font-medium">Amount (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    className="mt-1 w-full rounded-md border px-3 py-2"
                    placeholder="100.00"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Date</label>
                  <input
                    type="date"
                    value={addDate}
                    onChange={(e) => setAddDate(e.target.value)}
                    className="mt-1 w-full rounded-md border px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Note (optional)</label>
                  <input
                    type="text"
                    value={addNote}
                    onChange={(e) => setAddNote(e.target.value)}
                    className="mt-1 w-full rounded-md border px-3 py-2"
                    placeholder="From friend / self"
                  />
                </div>
                <Button onClick={handleAdd} className="w-full">Add</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />Export Excel
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{s.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{s.value}</div></CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        {(["daily", "weekly", "monthly"] as const).map((p) => (
          <Button
            key={p}
            variant={period === p ? "default" : "outline"}
            size="sm"
            onClick={() => { setPeriod(p); setFromDate(""); setToDate(""); setPage(1); }}
          >
            {p === "daily" ? "Today" : p === "weekly" ? "This Week" : "This Month"}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
        <span className="text-muted-foreground">to</span>
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as "CREDIT" | "DEBIT" | "")}
          className="rounded-md border px-3 py-2 text-sm"
        >
          <option value="">All types</option>
          <option value="CREDIT">Credit</option>
          <option value="DEBIT">Debit</option>
        </select>
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [s, o] = (e.target.value as string).split("-");
            setSortBy(s);
            setSortOrder((o as "asc" | "desc") || "desc");
          }}
          className="rounded-md border px-3 py-2 text-sm"
        >
          <option value="date-desc">Date (newest)</option>
          <option value="date-asc">Date (oldest)</option>
          <option value="amount-desc">Amount (high–low)</option>
          <option value="amount-asc">Amount (low–high)</option>
        </select>
      </div>

      <Card>
        <CardHeader><CardTitle>Transactions (who created, type, amount)</CardTitle></CardHeader>
        <CardContent>
          {error && <p className="text-destructive mb-4">{error}</p>}
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-12 rounded bg-muted animate-pulse" />)}
            </div>
          ) : records.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">No records yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Type</th>
                    <th className="text-right py-2">Amount</th>
                    <th className="text-left py-2">Created By</th>
                    <th className="text-left py-2">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <tr key={r.id} className="border-b">
                      <td className="py-3">{r.date}</td>
                      <td>
                        <span className={cn(
                          "inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium",
                          r.type === "CREDIT"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        )}>
                          {r.type === "CREDIT" ? <ArrowUpCircle className="h-3 w-3" /> : <ArrowDownCircle className="h-3 w-3" />}
                          {r.type}
                        </span>
                      </td>
                      <td className={cn("text-right font-medium", r.type === "DEBIT" && "text-red-600")}>
                        {r.type === "DEBIT" ? "-" : "+"}₹{r.amount}
                      </td>
                      <td>{r.createdByName}</td>
                      <td>{r.note || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {meta && meta.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
                  <span className="py-2 text-sm">Page {page} of {meta.totalPages}</span>
                  <Button variant="outline" size="sm" disabled={page >= meta.totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

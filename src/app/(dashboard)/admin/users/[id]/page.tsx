"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { format } from "date-fns";
import {
  usersApi,
  getAvatarUrl,
} from "@/lib/api/users";
import { savingsApi } from "@/lib/api/savings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, User, Plus, Minus, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.id as string;
  const [addOpen, setAddOpen] = useState(false);
  const [debitOpen, setDebitOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [txDate, setTxDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["admin-user", id],
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  });

  const { data: savingsData, isLoading: savingsLoading } = useQuery({
    queryKey: ["savings", id],
    queryFn: () => savingsApi.getAll({ userId: id, limit: 50, sortBy: "date", sortOrder: "desc" }),
    enabled: !!id,
  });

  const { data: summary } = useQuery({
    queryKey: ["savings-summary", id],
    queryFn: () => savingsApi.getSummary(id),
    enabled: !!id,
  });

  const creditDebitMutation = useMutation({
    mutationFn: (body: {
      userId: string;
      amount: number;
      type: "CREDIT" | "DEBIT";
      date: string;
      note?: string;
    }) => savingsApi.creditDebit(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savings", id] });
      queryClient.invalidateQueries({ queryKey: ["savings-summary", id] });
      setAmount("");
      setNote("");
      setAddOpen(false);
      setDebitOpen(false);
      toast.success("Transaction recorded");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function handleCredit() {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    creditDebitMutation.mutate({
      userId: id,
      amount: num,
      type: "CREDIT",
      date: txDate,
      note: note || undefined,
    });
  }

  function handleDebit() {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    creditDebitMutation.mutate({
      userId: id,
      amount: num,
      type: "DEBIT",
      date: txDate,
      note: note || undefined,
    });
  }

  if (userLoading || !user) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.push("/admin/users")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="h-48 rounded-lg bg-muted animate-pulse" />
      </div>
    );
  }

  const records = savingsData?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push("/admin/users")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User details
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-6">
          <div className="h-20 w-20 rounded-full overflow-hidden bg-muted shrink-0">
            {getAvatarUrl(user.avatarUrl) ? (
              <img
                src={getAvatarUrl(user.avatarUrl)}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <User className="h-10 w-10 text-muted-foreground" />
              </div>
            )}
          </div>
          <div>
            <p className="text-xl font-semibold">{user.name}</p>
            <p className="text-muted-foreground">{user.email ?? "—"}</p>
            <p className="text-muted-foreground">{user.mobile ?? "—"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Balance summary</CardTitle>
          <p className="text-sm text-muted-foreground">
            Total: ₹{summary?.total?.toFixed(2) ?? "0.00"} · Daily: ₹
            {summary?.daily?.toFixed(2) ?? "0.00"} · Weekly: ₹
            {summary?.weekly?.toFixed(2) ?? "0.00"} · Monthly: ₹
            {summary?.monthly?.toFixed(2) ?? "0.00"}
          </p>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add money
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add money (Credit)</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-sm font-medium">Amount (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1 w-full rounded-md border px-3 py-2"
                    placeholder="100.00"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Date</label>
                  <input
                    type="date"
                    value={txDate}
                    onChange={(e) => setTxDate(e.target.value)}
                    className="mt-1 w-full rounded-md border px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Note (optional)</label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="mt-1 w-full rounded-md border px-3 py-2"
                  />
                </div>
                <Button
                  onClick={handleCredit}
                  disabled={creditDebitMutation.isPending}
                  className="w-full"
                >
                  Add
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={debitOpen} onOpenChange={setDebitOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Minus className="mr-2 h-4 w-4" />
                Debit money
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Debit money</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-sm font-medium">Amount (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1 w-full rounded-md border px-3 py-2"
                    placeholder="100.00"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Date</label>
                  <input
                    type="date"
                    value={txDate}
                    onChange={(e) => setTxDate(e.target.value)}
                    className="mt-1 w-full rounded-md border px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Note (optional)</label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="mt-1 w-full rounded-md border px-3 py-2"
                  />
                </div>
                <Button
                  variant="destructive"
                  onClick={handleDebit}
                  disabled={creditDebitMutation.isPending}
                  className="w-full"
                >
                  Debit
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Savings history</CardTitle>
        </CardHeader>
        <CardContent>
          {savingsLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 rounded bg-muted animate-pulse" />
              ))}
            </div>
          ) : records.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">
              No transactions yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Type</th>
                    <th className="text-right py-2">Amount</th>
                    <th className="text-left py-2">Created by</th>
                    <th className="text-left py-2">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <tr key={r.id} className="border-b">
                      <td className="py-3">{r.date}</td>
                      <td>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium",
                            r.type === "CREDIT"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          )}
                        >
                          {r.type === "CREDIT" ? (
                            <ArrowUpCircle className="h-3 w-3" />
                          ) : (
                            <ArrowDownCircle className="h-3 w-3" />
                          )}
                          {r.type}
                        </span>
                      </td>
                      <td
                        className={cn(
                          "text-right font-medium",
                          r.type === "DEBIT" && "text-red-600"
                        )}
                      >
                        {r.type === "DEBIT" ? "-" : "+"}₹{r.amount}
                      </td>
                      <td>{r.createdByName}</td>
                      <td>{r.note || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

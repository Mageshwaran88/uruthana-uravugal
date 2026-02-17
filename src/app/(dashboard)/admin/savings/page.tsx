"use client";

import { useEffect, useState } from "react";
import { PiggyBank, Users, Download, Plus, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
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

export default function AdminSavingsPage() {
  const { user } = useAuth();
  const {
    records,
    summary,
    meta,
    adminOverall,
    adminByUser,
    isLoading,
    error,
    fetchAll,
    fetchSummary,
    fetchAdminOverall,
    fetchAdminByUser,
    creditDebit,
    downloadReport,
  } = useSavingsStore();

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isCreditOpen, setIsCreditOpen] = useState(false);
  const [isDebitOpen, setIsDebitOpen] = useState(false);
  const [targetUserId, setTargetUserId] = useState("");
  const [targetUserName, setTargetUserName] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [txDate, setTxDate] = useState(format(new Date(), "yyyy-MM-dd"));

  useEffect(() => {
    fetchAdminOverall();
    fetchAdminByUser();
  }, [fetchAdminOverall, fetchAdminByUser]);

  useEffect(() => {
    if (selectedUserId) {
      fetchAll({ userId: selectedUserId, page, limit: 20 });
      fetchSummary(selectedUserId);
    }
  }, [selectedUserId, page, fetchAll, fetchSummary]);

  const handleCredit = async () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0 || !targetUserId) {
      toast.error("Enter valid amount and select user");
      return;
    }
    try {
      await creditDebit({
        userId: targetUserId,
        amount: amt,
        type: "CREDIT",
        date: txDate,
        note: note || undefined,
      });
      setIsCreditOpen(false);
      setAmount("");
      setNote("");
      toast.success("Credited successfully");
    } catch {
      toast.error("Credit failed");
    }
  };

  const handleDebit = async () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0 || !targetUserId) {
      toast.error("Enter valid amount and select user");
      return;
    }
    try {
      await creditDebit({
        userId: targetUserId,
        amount: amt,
        type: "DEBIT",
        date: txDate,
        note: note || undefined,
      });
      setIsDebitOpen(false);
      setAmount("");
      setNote("");
      toast.success("Debited successfully");
    } catch {
      toast.error("Debit failed");
    }
  };

  const openCredit = (uid: string, name: string) => {
    setTargetUserId(uid);
    setTargetUserName(name);
    setAmount("");
    setNote("");
    setTxDate(format(new Date(), "yyyy-MM-dd"));
    setIsCreditOpen(true);
  };

  const openDebit = (uid: string, name: string) => {
    setTargetUserId(uid);
    setTargetUserName(name);
    setAmount("");
    setNote("");
    setTxDate(format(new Date(), "yyyy-MM-dd"));
    setIsDebitOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Savings</h1>
        <p className="text-muted-foreground mt-2">
          Credit or debit user amounts. Full audit: who created each record.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overall Total</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{adminOverall?.total?.toFixed(2) ?? "0.00"}</div>
            <p className="text-xs text-muted-foreground mt-1">{adminOverall?.userCount ?? 0} users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Export</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" onClick={() => downloadReport().then(() => toast.success("Downloaded")).catch(() => toast.error("Failed"))}>
              Download All Excel
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Per-User Balances</CardTitle>
        </CardHeader>
        <CardContent>
          {adminByUser.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">No records yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">User</th>
                    <th className="text-left py-2">Email</th>
                    <th className="text-right py-2">Balance</th>
                    <th className="text-right py-2">Records</th>
                    <th className="text-left py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminByUser.map((u) => (
                    <tr key={u.userId} className="border-b">
                      <td className="py-3 font-medium">{u.userName}</td>
                      <td className="text-muted-foreground">{u.userEmail || "-"}</td>
                      <td className="text-right font-medium">₹{u.totalAmount}</td>
                      <td className="text-right">{u.recordCount}</td>
                      <td className="flex gap-2 py-2">
                        <Button variant="outline" size="sm" onClick={() => openCredit(u.userId, u.userName)} className="text-green-600">
                          <ArrowUpCircle className="h-4 w-4 mr-1" />Credit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openDebit(u.userId, u.userName)} className="text-red-600">
                          <ArrowDownCircle className="h-4 w-4 mr-1" />Debit
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedUserId(selectedUserId === u.userId ? null : u.userId)}>
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Credit Dialog */}
      <Dialog open={isCreditOpen} onOpenChange={setIsCreditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Credit Amount - {targetUserName}</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium">Amount (₹)</label>
              <input type="number" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
            </div>
            <div>
              <label className="text-sm font-medium">Date</label>
              <input type="date" value={txDate} onChange={(e) => setTxDate(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
            </div>
            <div>
              <label className="text-sm font-medium">Note</label>
              <input type="text" value={note} onChange={(e) => setNote(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" placeholder="Reason" />
            </div>
            <Button onClick={handleCredit} className="w-full bg-green-600 hover:bg-green-700">Credit</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Debit Dialog */}
      <Dialog open={isDebitOpen} onOpenChange={setIsDebitOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Debit Amount - {targetUserName}</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium">Amount (₹)</label>
              <input type="number" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
            </div>
            <div>
              <label className="text-sm font-medium">Date</label>
              <input type="date" value={txDate} onChange={(e) => setTxDate(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
            </div>
            <div>
              <label className="text-sm font-medium">Note</label>
              <input type="text" value={note} onChange={(e) => setNote(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" placeholder="Reason" />
            </div>
            <Button onClick={handleDebit} variant="destructive" className="w-full">Debit</Button>
          </div>
        </DialogContent>
      </Dialog>

      {selectedUserId && (
        <Card>
          <CardHeader><CardTitle>Transactions for selected user</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => <div key={i} className="h-12 rounded bg-muted animate-pulse" />)}
              </div>
            ) : (
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
                      <td className="py-2">{r.date}</td>
                      <td>
                        <span className={cn(
                          "inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs",
                          r.type === "CREDIT" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        )}>{r.type}</span>
                      </td>
                      <td className={cn("text-right", r.type === "DEBIT" && "text-red-600")}>{r.type === "DEBIT" ? "-" : "+"}₹{r.amount}</td>
                      <td>{r.createdByName}</td>
                      <td>{r.note || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

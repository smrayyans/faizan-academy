"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, Search, X } from "lucide-react";
import { CLASS_OPTIONS, MONTHS } from "@/lib/types";
import type { Fee, FeeStatus } from "@/lib/types";
import toast from "react-hot-toast";

export default function FeesPage() {
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);
  const [grSearch, setGrSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    gr_number: "", month: "", year: new Date().getFullYear().toString(),
    amount: "", status: "Pending" as FeeStatus, notes: "",
  });

  const fetchFees = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/fees?gr=${grSearch}`);
    const data = await res.json();
    setFees(data.fees ?? []);
    setLoading(false);
  }, [grSearch]);

  useEffect(() => { fetchFees(); }, [fetchFees]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/fees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success("Fee record added!");
      setShowModal(false);
      fetchFees();
    } else {
      const d = await res.json();
      toast.error(d.error ?? "Failed to save.");
    }
    setSaving(false);
  };

  const updateStatus = async (id: string, status: FeeStatus) => {
    const res = await fetch("/api/fees", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) { toast.success("Status updated!"); fetchFees(); }
    else toast.error("Failed to update.");
  };

  return (
    <DashboardLayout>
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">Fee Records</h1>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus className="w-4 h-4" /> Add Fee Record
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
          <input className="input pl-9" placeholder="Filter by GR number..." value={grSearch}
            onChange={(e) => setGrSearch(e.target.value)} />
        </div>

        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["GR #", "Student", "Class", "Month", "Year", "Amount", "Status", "Action"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-10 text-gray-400">Loading...</td></tr>
              ) : fees.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-10 text-gray-400">No fee records found.</td></tr>
              ) : fees.map(f => (
                <tr key={f.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{f.student?.gr_number}</td>
                  <td className="px-4 py-3 font-medium">{f.student?.name}</td>
                  <td className="px-4 py-3 text-xs">
                    <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded font-semibold">
                      {f.student?.class}
                    </span>
                  </td>
                  <td className="px-4 py-3">{MONTHS[f.month - 1]}</td>
                  <td className="px-4 py-3">{f.year}</td>
                  <td className="px-4 py-3 font-medium">Rs. {Number(f.amount).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    {f.status === "Paid" ? <span className="badge-paid">Paid</span>
                      : f.status === "Partial" ? <span className="badge-partial">Partial</span>
                      : <span className="badge-pending">Pending</span>}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      className="text-xs border border-gray-200 rounded px-2 py-1"
                      value={f.status}
                      onChange={(e) => updateStatus(f.id, e.target.value as FeeStatus)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Partial">Partial</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-bold text-lg">Add Fee Record</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="label">GR Number *</label>
                <input required className="input" placeholder="FA-001" value={form.gr_number}
                  onChange={e => setForm(p => ({ ...p, gr_number: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Month *</label>
                  <select required className="input" value={form.month}
                    onChange={e => setForm(p => ({ ...p, month: e.target.value }))}>
                    <option value="">Select</option>
                    {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Year *</label>
                  <input required type="number" className="input" value={form.year}
                    onChange={e => setForm(p => ({ ...p, year: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Amount (Rs.) *</label>
                  <input required type="number" className="input" placeholder="1500" value={form.amount}
                    onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Status</label>
                  <select className="input" value={form.status}
                    onChange={e => setForm(p => ({ ...p, status: e.target.value as FeeStatus }))}>
                    <option>Pending</option>
                    <option>Partial</option>
                    <option>Paid</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Notes</label>
                <input className="input" placeholder="Optional notes" value={form.notes}
                  onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1 justify-center">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
                  {saving ? "Saving..." : "Add Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { MONTHS } from "@/lib/types";
import type { Fee, FeeStatus } from "@/lib/types";
import toast from "react-hot-toast";
import { Search } from "lucide-react";

export default function MerchantDashboard() {
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);
  const [grSearch, setGrSearch] = useState("");

  const fetchFees = async () => {
    setLoading(true);
    const res = await fetch(`/api/fees?gr=${grSearch}&status=Pending`);
    const data = await res.json();
    setFees(data.fees ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchFees(); }, []);

  const updateStatus = async (id: string, status: FeeStatus) => {
    const res = await fetch("/api/fees", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) { toast.success("Fee status updated!"); fetchFees(); }
    else toast.error("Failed to update. Check your permissions.");
  };

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-bold mb-2">Pending Fees</h1>
        <p className="text-gray-500 text-sm mb-6">
          Update fee status after receiving payment screenshots on WhatsApp.
        </p>

        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            <input className="input pl-9" placeholder="Filter by GR number..." value={grSearch}
              onChange={e => setGrSearch(e.target.value)} />
          </div>
          <button onClick={fetchFees} className="btn-primary shrink-0">Search</button>
        </div>

        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["GR #", "Student", "Class", "Month / Year", "Amount", "Current Status", "Update"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400">Loading...</td></tr>
              ) : fees.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400">No pending fees found.</td></tr>
              ) : fees.map(f => (
                <tr key={f.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{f.student?.gr_number}</td>
                  <td className="px-4 py-3 font-medium">{f.student?.name}</td>
                  <td className="px-4 py-3">
                    <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded font-semibold">
                      {f.student?.class}
                    </span>
                  </td>
                  <td className="px-4 py-3">{MONTHS[f.month - 1]} {f.year}</td>
                  <td className="px-4 py-3 font-semibold">Rs. {Number(f.amount).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    {f.status === "Paid" ? <span className="badge-paid">Paid</span>
                      : f.status === "Partial" ? <span className="badge-partial">Partial</span>
                      : <span className="badge-pending">Pending</span>}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      className="text-xs border border-gray-200 rounded px-2 py-1.5 bg-white"
                      value={f.status}
                      onChange={e => updateStatus(f.id, e.target.value as FeeStatus)}
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
    </DashboardLayout>
  );
}

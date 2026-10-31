"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import type { Admission } from "@/lib/types";
import toast from "react-hot-toast";
import { Check, X } from "lucide-react";

export default function AdminAdmissionsPage() {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdmissions = async () => {
    setLoading(true);
    const res = await fetch("/api/admissions");
    const data = await res.json();
    setAdmissions(data.admissions ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchAdmissions(); }, []);

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    const res = await fetch("/api/admissions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) { toast.success(`Application ${status}!`); fetchAdmissions(); }
    else toast.error("Failed to update.");
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Admission Applications</h1>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Student", "Father", "Class", "Phone", "Date", "Status", "Actions"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400">Loading...</td></tr>
            ) : admissions.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400">No applications yet.</td></tr>
            ) : admissions.map(a => (
              <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{a.student_name}</td>
                <td className="px-4 py-3 text-gray-600">{a.father_name}</td>
                <td className="px-4 py-3">
                  <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded font-semibold">
                    {a.class_applying === "Hifz" || a.class_applying === "Nazra" ? a.class_applying : `Class ${a.class_applying}`}
                  </span>
                </td>
                <td className="px-4 py-3">{a.phone}</td>
                <td className="px-4 py-3 text-gray-500">{new Date(a.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  {a.status === "approved" ? <span className="badge-paid">Approved</span>
                    : a.status === "rejected" ? <span className="badge-pending">Rejected</span>
                    : <span className="badge-partial">Pending</span>}
                </td>
                <td className="px-4 py-3">
                  {a.status === "pending" && (
                    <div className="flex gap-2">
                      <button onClick={() => updateStatus(a.id, "approved")}
                        className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => updateStatus(a.id, "rejected")}
                        className="p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

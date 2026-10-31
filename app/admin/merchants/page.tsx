"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, X, ToggleLeft, ToggleRight } from "lucide-react";
import type { User } from "@/lib/types";
import toast from "react-hot-toast";

export default function MerchantsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", can_update_fees: true });

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch("/api/merchants");
    const data = await res.json();
    setUsers(data.users ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/merchants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) { toast.success("Merchant created!"); setShowModal(false); fetchUsers(); }
    else { const d = await res.json(); toast.error(d.error ?? "Failed."); }
    setSaving(false);
  };

  const togglePermission = async (id: string, can_update_fees: boolean) => {
    const res = await fetch("/api/merchants", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, can_update_fees: !can_update_fees }),
    });
    if (res.ok) { toast.success("Permission updated!"); fetchUsers(); }
    else toast.error("Failed.");
  };

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Merchants</h1>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus className="w-4 h-4" /> Add Merchant
          </button>
        </div>

        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Name", "Email", "Role", "Can Update Fees", ""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-10 text-gray-400">Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-gray-400">No merchants added yet.</td></tr>
              ) : users.map(u => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => togglePermission(u.id, u.can_update_fees)}
                      className="flex items-center gap-2 text-sm font-medium">
                      {u.can_update_fees
                        ? <><ToggleRight className="w-6 h-6 text-secondary" /> <span className="text-secondary">Enabled</span></>
                        : <><ToggleLeft className="w-6 h-6 text-gray-400" /> <span className="text-gray-400">Disabled</span></>}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {new Date(u.created_at).toLocaleDateString()}
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
              <h2 className="font-bold text-lg">Add Merchant</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-4">
              <div>
                <label className="label">Full Name *</label>
                <input required className="input" placeholder="Ahmad Khan" value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label className="label">Email *</label>
                <input required type="email" className="input" placeholder="merchant@example.com" value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div>
                <label className="label">Password *</label>
                <input required type="password" className="input" placeholder="••••••••" value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.can_update_fees}
                  onChange={e => setForm(p => ({ ...p, can_update_fees: e.target.checked }))}
                  className="w-4 h-4 accent-primary" />
                <span className="text-sm font-medium">Allow to update fee status</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1 justify-center">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
                  {saving ? "Creating..." : "Create Merchant"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

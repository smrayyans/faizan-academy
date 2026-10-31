"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, Search, Edit, Trash2, X } from "lucide-react";
import { CLASS_OPTIONS } from "@/lib/types";
import type { Student, ClassType } from "@/lib/types";
import toast from "react-hot-toast";

const emptyForm = {
  gr_number: "", name: "", father_name: "",
  class: "" as ClassType | "", phone: "", address: "",
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/students?search=${search}`);
    const data = await res.json();
    setStudents(data.students ?? []);
    setLoading(false);
  }, [search]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (s: Student) => {
    setEditing(s);
    setForm({ gr_number: s.gr_number, name: s.name, father_name: s.father_name, class: s.class, phone: s.phone ?? "", address: s.address ?? "" });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const method = editing ? "PUT" : "POST";
    const body = editing ? { ...form, id: editing.id } : form;

    const res = await fetch("/api/students", {
      method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });

    if (res.ok) {
      toast.success(editing ? "Student updated!" : "Student added!");
      setShowModal(false);
      fetchStudents();
    } else {
      const d = await res.json();
      toast.error(d.error ?? "Something went wrong.");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this student? All fee records will also be deleted.")) return;
    const res = await fetch(`/api/students?id=${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Student deleted."); fetchStudents(); }
    else toast.error("Failed to delete.");
  };

  return (
    <DashboardLayout>
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">Students</h1>
          <button onClick={openAdd} className="btn-primary">
            <Plus className="w-4 h-4" /> Add Student
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
          <input
            className="input pl-9"
            placeholder="Search by name or GR number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["GR #", "Name", "Father", "Class", "Phone", "Status", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400">Loading...</td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400">No students found.</td></tr>
              ) : students.map((s) => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{s.gr_number}</td>
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3 text-gray-600">{s.father_name}</td>
                  <td className="px-4 py-3">
                    <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded">
                      {s.class === "Hifz" || s.class === "Nazra" ? s.class : `Class ${s.class}`}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{s.phone}</td>
                  <td className="px-4 py-3">
                    <span className={s.status === "active" ? "badge-paid" : "badge-pending"}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(s)} className="text-gray-400 hover:text-primary"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(s.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-bold text-lg">{editing ? "Edit Student" : "Add Student"}</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">GR Number *</label>
                  <input required className="input" placeholder="FA-001" value={form.gr_number}
                    onChange={(e) => setForm(p => ({ ...p, gr_number: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Class *</label>
                  <select required className="input" value={form.class}
                    onChange={(e) => setForm(p => ({ ...p, class: e.target.value as ClassType }))}>
                    <option value="">Select</option>
                    {CLASS_OPTIONS.map(c => (
                      <option key={c} value={c}>{c === "Hifz" || c === "Nazra" ? c : `Class ${c}`}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Full Name *</label>
                <input required className="input" placeholder="Muhammad Ahmed" value={form.name}
                  onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label className="label">Father&apos;s Name *</label>
                <input required className="input" placeholder="Muhammad Ali" value={form.father_name}
                  onChange={(e) => setForm(p => ({ ...p, father_name: e.target.value }))} />
              </div>
              <div>
                <label className="label">Phone</label>
                <input className="input" placeholder="+92 300 1234567" value={form.phone}
                  onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))} />
              </div>
              <div>
                <label className="label">Address</label>
                <input className="input" placeholder="Home address" value={form.address}
                  onChange={(e) => setForm(p => ({ ...p, address: e.target.value }))} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1 justify-center">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
                  {saving ? "Saving..." : editing ? "Update" : "Add Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

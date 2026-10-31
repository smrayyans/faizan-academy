import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import DashboardLayout from "@/components/DashboardLayout";
import { Users, CreditCard, FileText, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if ((session.user as any).role !== "admin") redirect("/merchant");

  const [
    { count: studentCount },
    { count: pendingFees },
    { count: admissionCount },
  ] = await Promise.all([
    supabaseAdmin.from("students").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabaseAdmin.from("fees").select("*", { count: "exact", head: true }).eq("status", "Pending"),
    supabaseAdmin.from("admissions").select("*", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  const stats = [
    { label: "Active Students", value: studentCount ?? 0, icon: Users, color: "text-blue-600 bg-blue-50" },
    { label: "Pending Fees", value: pendingFees ?? 0, icon: CreditCard, color: "text-yellow-600 bg-yellow-50" },
    { label: "New Admissions", value: admissionCount ?? 0, icon: FileText, color: "text-green-600 bg-green-50" },
    { label: "Total Programs", value: 12, icon: TrendingUp, color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="card flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="font-bold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { href: "/admin/students", label: "Add New Student", color: "btn-primary" },
                { href: "/admin/fees", label: "Manage Fees", color: "btn-secondary" },
                { href: "/admin/admissions", label: "View Applications", color: "btn-outline" },
              ].map((a) => (
                <a key={a.href} href={a.href} className={`${a.color} w-full justify-center`}>
                  {a.label}
                </a>
              ))}
            </div>
          </div>
          <div className="card">
            <h2 className="font-bold mb-4">School Info</h2>
            <div className="space-y-2 text-sm">
              {[
                ["Name", "Faizan Academy"],
                ["Location", "Siddiqabad"],
                ["Programs", "Class 1–10, Hifz, Nazra"],
                ["WhatsApp", "+92 300 123 4567"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import {
  LayoutDashboard, Users, CreditCard, FileText,
  UserCog, Menu, X, LogOut,
} from "lucide-react";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/fees", label: "Fees", icon: CreditCard },
  { href: "/admin/admissions", label: "Admissions", icon: FileText },
  { href: "/admin/merchants", label: "Merchants", icon: UserCog },
];

const merchantLinks = [
  { href: "/merchant", label: "Dashboard", icon: LayoutDashboard },
  { href: "/merchant/fees", label: "Update Fees", icon: CreditCard },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const role = (session?.user as any)?.role;
  const links = role === "admin" ? adminLinks : merchantLinks;

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-dark text-white flex flex-col transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-white/10 flex items-center gap-3">
          <Image src="/logo.jpg" alt="Faizan Academy" width={36} height={36} className="rounded-full border-2 border-primary object-cover shrink-0" />
          <div>
            <p className="font-bold text-sm text-cream">Faizan Academy</p>
            <p className="text-xs text-gray-400 capitalize">{role} Panel</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto md:hidden text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User + logout */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-bold">
              {session?.user?.name?.[0] ?? "U"}
            </div>
            <div className="text-sm overflow-hidden">
              <p className="font-medium truncate">{session?.user?.name}</p>
              <p className="text-gray-400 text-xs capitalize">{role}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors px-2 py-1.5"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-500">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-semibold text-sm">Faizan Academy</span>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

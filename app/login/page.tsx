"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/logo.jpg"
            alt="Faizan Academy"
            width={80}
            height={80}
            className="rounded-full border-4 border-primary object-cover mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-white">Faizan Academy</h1>
          <p className="text-gray-400 text-sm mt-1">Staff Dashboard Login</p>
        </div>

        <form onSubmit={handleSubmit} className="card">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="label">Email</label>
            <input
              type="email"
              required
              className="input"
              placeholder="admin@faizanacademy.pk"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            />
          </div>

          <div className="mb-6">
            <label className="label">Password</label>
            <input
              type="password"
              required
              className="input"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

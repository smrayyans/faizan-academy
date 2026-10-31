"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle, Send } from "lucide-react";
import { CLASS_OPTIONS } from "@/lib/types";
import toast from "react-hot-toast";

export default function AdmissionsPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    student_name: "",
    father_name: "",
    class_applying: "",
    phone: "",
    address: "",
    dob: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        toast.error(data.error || "Submission failed. Try again.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <CheckCircle className="w-16 h-16 text-secondary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
            <p className="text-gray-500 mb-6">
              Thank you for applying to Faizan Academy. We will contact you
              shortly on the number you provided.
            </p>
            <button
              onClick={() => { setSubmitted(false); setForm({ student_name: "", father_name: "", class_applying: "", phone: "", address: "", dob: "" }); }}
              className="btn-primary"
            >
              Submit Another Application
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Apply for Admission</h1>
            <p className="text-gray-500">
              Fill in the form below and we will get back to you within 24 hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="card space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="label">Student&apos;s Full Name *</label>
                <input
                  name="student_name"
                  required
                  className="input"
                  placeholder="Muhammad Ahmed"
                  value={form.student_name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="label">Father&apos;s Name *</label>
                <input
                  name="father_name"
                  required
                  className="input"
                  placeholder="Muhammad Ali"
                  value={form.father_name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="label">Class Applying For *</label>
                <select
                  name="class_applying"
                  required
                  className="input"
                  value={form.class_applying}
                  onChange={handleChange}
                >
                  <option value="">Select class</option>
                  {CLASS_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c === "Hifz" || c === "Nazra" ? c : `Class ${c}`}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  className="input"
                  value={form.dob}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="label">Contact Number *</label>
              <input
                name="phone"
                required
                type="tel"
                className="input"
                placeholder="+92 300 1234567"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="label">Address</label>
              <textarea
                name="address"
                rows={3}
                className="input resize-none"
                placeholder="Home address"
                value={form.address}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

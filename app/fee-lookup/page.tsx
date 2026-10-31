"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, AlertCircle, CheckCircle, Clock, CreditCard } from "lucide-react";
import { MONTHS } from "@/lib/types";
import type { Student, Fee } from "@/lib/types";

interface LookupResult {
  student: Student;
  fees: Fee[];
}

function StatusBadge({ status }: { status: string }) {
  if (status === "Paid") return <span className="badge-paid">Paid</span>;
  if (status === "Partial") return <span className="badge-partial">Partial</span>;
  return <span className="badge-pending">Pending</span>;
}

export default function FeeLookupPage() {
  const [gr, setGr] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LookupResult | null>(null);
  const [error, setError] = useState("");

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gr.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/fee-lookup?gr=${gr.trim()}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Student not found.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalDue = result?.fees
    .filter((f) => f.status !== "Paid")
    .reduce((sum, f) => sum + Number(f.amount), 0) ?? 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Fee Lookup</h1>
            <p className="text-gray-500">
              Enter your GR number to view your fee statement
            </p>
          </div>

          {/* Search form */}
          <form onSubmit={handleLookup} className="card mb-6">
            <label className="label">GR Number</label>
            <div className="flex gap-3">
              <input
                type="text"
                className="input"
                placeholder="e.g. FA-001"
                value={gr}
                onChange={(e) => setGr(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary shrink-0"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </form>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-4">
              {/* Student info */}
              <div className="card">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-secondary" />
                  Student Details
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">GR Number</p>
                    <p className="font-semibold">{result.student.gr_number}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p className="font-semibold">{result.student.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Father&apos;s Name</p>
                    <p className="font-semibold">{result.student.father_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Class</p>
                    <p className="font-semibold">
                      {result.student.class === "Hifz" || result.student.class === "Nazra"
                        ? result.student.class
                        : `Class ${result.student.class}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Outstanding balance */}
              {totalDue > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-red-500 shrink-0" />
                  <div>
                    <p className="font-semibold text-red-700">Outstanding Balance</p>
                    <p className="text-sm text-red-600">Rs. {totalDue.toLocaleString()} pending</p>
                  </div>
                </div>
              )}

              {/* Fee records */}
              <div className="card">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Fee Statement
                </h2>

                {result.fees.length === 0 ? (
                  <p className="text-gray-400 text-center py-6">No fee records found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left py-3 text-gray-500 font-medium">Month</th>
                          <th className="text-left py-3 text-gray-500 font-medium">Year</th>
                          <th className="text-left py-3 text-gray-500 font-medium">Amount</th>
                          <th className="text-left py-3 text-gray-500 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.fees.map((fee) => (
                          <tr key={fee.id} className="border-b border-gray-50">
                            <td className="py-3">{MONTHS[fee.month - 1]}</td>
                            <td className="py-3">{fee.year}</td>
                            <td className="py-3 font-medium">Rs. {Number(fee.amount).toLocaleString()}</td>
                            <td className="py-3">
                              <StatusBadge status={fee.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Payment instructions */}
              <div className="card bg-cream border-cream-dark">
                <h3 className="font-bold mb-3">How to Pay</h3>
                <ol className="text-sm space-y-2 text-gray-700 list-decimal list-inside">
                  <li>
                    Transfer fee to:{" "}
                    <strong>HBL Bank — Faizan Academy</strong>
                    <br />
                    <span className="ml-5 text-gray-500">Account: 12345678901234</span>
                  </li>
                  <li>
                    Take a screenshot of the payment confirmation
                  </li>
                  <li>
                    Send the screenshot to WhatsApp:{" "}
                    <a
                      href="https://wa.me/923001234567"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary font-semibold hover:underline"
                    >
                      +92 300 123 4567
                    </a>{" "}
                    with your GR number
                  </li>
                  <li>Your fee status will be updated within 24 hours</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

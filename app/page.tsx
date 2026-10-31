import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen, Users, Award, Search,
  ArrowRight, Phone, MapPin, CheckCircle,
} from "lucide-react";

const programs = [
  {
    title: "Classes 1 – 10",
    desc: "Strong academic foundation with qualified teachers and a structured curriculum.",
    icon: "📚",
    color: "bg-blue-50 border-blue-200",
  },
  {
    title: "Hifz Program",
    desc: "Dedicated Quran memorization program under expert Huffaz instructors.",
    icon: "🕌",
    color: "bg-green-50 border-green-200",
  },
  {
    title: "Nazra Program",
    desc: "Quran reading with Tajweed for students of all ages.",
    icon: "📖",
    color: "bg-amber-50 border-amber-200",
  },
];

const features = [
  "Qualified & experienced teaching staff",
  "Separate Hifz & Nazra departments",
  "Online fee management system",
  "Regular parent-teacher meetings",
  "Safe and nurturing environment",
  "Affordable monthly fees",
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-dark text-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <Image
            src="/logo.jpg"
            alt="Faizan Academy"
            width={100}
            height={100}
            className="rounded-full border-4 border-primary mx-auto mb-6 object-cover shadow-2xl"
          />
          <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 text-cream text-sm px-4 py-2 rounded-full mb-6">
            <Award className="w-4 h-4" />
            Admissions Open 2025–26
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Welcome to{" "}
            <span className="text-primary">Faizan Academy</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Quality Islamic &amp; academic education in Siddiqabad. Enroll your
            child in our Classes 1–10, Hifz, or Nazra program today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/admissions" className="btn-primary text-base">
              Apply for Admission <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/fee-lookup" className="btn-outline border-white text-white hover:bg-white hover:text-dark text-base">
              <Search className="w-4 h-4" /> Check Fee Status
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary py-10">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          {[
            { value: "500+", label: "Students" },
            { value: "12", label: "Programs" },
            { value: "20+", label: "Teachers" },
            { value: "10+", label: "Years" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-sm opacity-80 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Programs */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-dark mb-3">Our Programs</h2>
            <p className="text-gray-500">Comprehensive education for every child</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {programs.map((p) => (
              <div key={p.title} className={`card border ${p.color}`}>
                <div className="text-4xl mb-4">{p.icon}</div>
                <h3 className="text-lg font-bold mb-2">{p.title}</h3>
                <p className="text-gray-600 text-sm">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fee Lookup CTA */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <Search className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-3">Check Your Fee Status</h2>
          <p className="text-gray-500 mb-6">
            Enter your child&apos;s GR number to instantly view their fee statement,
            class, and payment history.
          </p>
          <Link href="/fee-lookup" className="btn-primary text-base">
            Go to Fee Lookup <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Why Choose Faizan Academy?</h2>
            <p className="text-gray-500 mb-6">
              We combine modern academics with Islamic values to produce well-rounded
              students ready for the future.
            </p>
            <ul className="space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-5 h-5 text-secondary shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-dark rounded-2xl p-8 text-white">
            <h3 className="text-xl font-bold mb-6 text-cream">Get In Touch</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span>Siddiqabad, Pakistan</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <a href="tel:+923001234567">+92 300 123 4567</a>
              </div>
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-primary" />
                <span>Mon – Sat: 7:00 AM – 2:00 PM</span>
              </div>
            </div>
            <Link href="/admissions" className="btn-primary w-full justify-center mt-6">
              Apply Now
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

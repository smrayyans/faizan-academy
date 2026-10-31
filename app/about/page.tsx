import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Award, Users, BookOpen, Heart } from "lucide-react";

const values = [
  { icon: BookOpen, title: "Academic Excellence", desc: "Strong curriculum from Class 1 to 10 with experienced teachers." },
  { icon: Heart, title: "Islamic Values", desc: "We instill Islamic character alongside modern education." },
  { icon: Users, title: "Community", desc: "A welcoming environment where every student is family." },
  { icon: Award, title: "Achievement", desc: "We celebrate every student's milestone and growth." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-dark text-white py-16 px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">About Faizan Academy</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Serving the Siddiqabad community with quality education that
            combines Islamic values with modern academic standards.
          </p>
        </section>

        {/* Mission */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                Faizan Academy was established to provide accessible, high-quality
                education in Siddiqabad. We believe every child deserves an
                education that prepares them for both this world and the hereafter.
              </p>
              <p className="text-gray-600">
                Our dedicated staff work tirelessly to ensure each student
                reaches their full potential — academically, spiritually, and
                morally.
              </p>
            </div>
            <div className="bg-cream rounded-2xl p-8">
              <div className="space-y-4 text-sm">
                {[
                  ["Founded", "Siddiqabad, Pakistan"],
                  ["Programs", "Classes 1–10, Hifz, Nazra"],
                  ["Medium", "Urdu & English"],
                  ["Timing", "7:00 AM – 2:00 PM"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-cream-dark pb-3">
                    <span className="font-medium text-gray-600">{k}</span>
                    <span className="font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10">Our Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v) => (
                <div key={v.title} className="card text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <v.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold mb-2">{v.title}</h3>
                  <p className="text-sm text-gray-500">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

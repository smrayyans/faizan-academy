import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Phone, MapPin, Facebook, Instagram, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="bg-dark text-white py-16 px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-300 max-w-xl mx-auto">
            We&apos;re here to answer your questions about admissions, fees, or anything else.
          </p>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Contact details */}
            <div className="card space-y-6">
              <h2 className="text-xl font-bold">Get In Touch</h2>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-gray-500">Siddiqabad, Pakistan</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Phone / WhatsApp</p>
                    <a href="tel:+923001234567" className="text-primary hover:underline">
                      +92 300 123 4567
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">School Hours</p>
                    <p className="text-gray-500">Monday – Saturday: 7:00 AM – 2:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Facebook className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Facebook</p>
                    <a
                      href="https://www.facebook.com/FaizanAcademy/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      facebook.com/FaizanAcademy
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Instagram className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Instagram</p>
                    <a
                      href="https://instagram.com/faizan_academy/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      @faizan_academy
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="card bg-secondary text-white flex flex-col justify-center items-center text-center gap-4">
              <div className="text-6xl">💬</div>
              <h3 className="text-xl font-bold">Chat on WhatsApp</h3>
              <p className="text-sm opacity-80">
                For quick queries about admissions or fee payments, message us directly.
              </p>
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-secondary font-semibold px-6 py-3 rounded-lg hover:bg-cream transition-colors"
              >
                Open WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

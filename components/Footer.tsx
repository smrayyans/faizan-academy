import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <Image src="/logo.jpg" alt="Faizan Academy" width={40} height={40} className="rounded-full border-2 border-primary object-cover" />
            <h3 className="text-cream font-bold text-lg">Faizan Academy</h3>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Providing quality Islamic and academic education in Siddiqabad.
            Classes 1–10, Hifz, and Nazra programs.
          </p>
          <div className="flex gap-3">
            <a
              href="https://www.facebook.com/FaizanAcademy/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 bg-white/10 hover:bg-primary rounded-lg flex items-center justify-center transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com/faizan_academy/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 bg-white/10 hover:bg-primary rounded-lg flex items-center justify-center transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[
              { href: "/admissions", label: "Apply for Admission" },
              { href: "/fee-lookup", label: "Fee Lookup" },
              { href: "/about", label: "About Us" },
              { href: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-cream transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-3">Contact Us</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span>Siddiqabad, Pakistan</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary shrink-0" />
              <a href="tel:+923001234567" className="hover:text-cream transition-colors">
                +92 300 123 4567
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Faizan Academy, Siddiqabad. All rights reserved.
      </div>
    </footer>
  );
}

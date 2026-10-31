import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Faizan Academy — Siddiqabad",
  description:
    "Faizan Academy Siddiqabad — Quality Islamic & academic education. Classes 1–10, Hifz, and Nazra programs. Online admissions and fee management.",
  keywords: [
    "Faizan Academy",
    "Siddiqabad school",
    "Islamic school Siddiqabad",
    "Hifz school",
    "Nazra school",
    "school admission Siddiqabad",
  ],
  openGraph: {
    title: "Faizan Academy — Siddiqabad",
    description: "Quality Islamic & academic education in Siddiqabad.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <Providers>
          {children}
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}

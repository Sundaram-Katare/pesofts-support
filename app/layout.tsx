import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/components/layout/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PeSofts Platform | Online Assessment & Examination Guide",
  description: "Learn everything about Online Examination Software, AI Proctoring, Digital Assessments, and modern examination practices. Explore detailed guides, resources, and articles.",
  keywords: "online exam software, AI proctoring, computer based testing, question banks, digital assessments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="font-sans antialiased text-pesofts-gray-800 bg-white flex flex-col min-h-screen">
        <AuthProvider>
          <Header />
          <main className="flex-grow flex flex-col">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

import React from "react";
import { Metadata } from "next";
import { BookOpen, FileText, Users, ArrowRight, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { HeroSearch } from "@/components/home/HeroSearch";

export const metadata: Metadata = {
  title: "PeSofts Support Platform | Help, Documentation & Guides",
  description: "Learn about online examination software, AI proctoring, CBT solutions, proctoring security standards, and find answers to your support queries.",
  keywords: "online exam software, AI proctoring, computer based testing, question banks, digital assessments, examination security, support",
  alternates: {
    canonical: "https://pesofts-support.vercel.app",
  },
  openGraph: {
    title: "PeSofts Support Platform | Help, Documentation & Guides",
    description: "Learn about online examination software, AI proctoring, CBT solutions, proctoring security standards, and find support resources.",
    url: "https://pesofts-support.vercel.app",
    type: "website",
    siteName: "PeSofts Support",
  },
  twitter: {
    card: "summary_large_image",
    title: "PeSofts Support Platform | Help, Documentation & Guides",
    description: "Learn about online examination software, AI proctoring, CBT solutions, proctoring security standards, and find support resources.",
  },
};

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-36 bg-white border-b border-neutral-100">
        {/* Radial spotlight effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-orange-500/10 via-white to-white pointer-events-none" />
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          {/* Top pill badge */}
          {/* <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-8 rounded-full border border-orange-200 bg-orange-50/50 text-orange-600 text-xs font-bold uppercase tracking-wider shadow-sm select-none">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            Support & Knowledge Hub
          </div> */}

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-pesofts-gray-900 tracking-tight leading-[1.15] mb-8">
            PeSofts{" "}
            <span className="inline-flex items-center gap-2 px-5 py-1.5 md:py-2 md:px-6 mx-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl shadow-[0_6px_20px_rgba(249,115,22,0.45),_inset_0_2px_4px_rgba(255,255,255,0.4)] border border-orange-400 transform -rotate-[1.5deg] hover:rotate-0 transition-transform duration-300 select-none align-middle">
              <LifeBuoy className="w-5 h-5 md:w-7 md:h-7 shrink-0 text-orange-100" />
              Support
            </span>{" "}
            Platform
          </h1>
          
          <p className="text-lg md:text-xl text-pesofts-gray-600 font-light leading-relaxed mb-10 max-w-2xl mx-auto">
            Explore guides, browse our extensive knowledge base, and ask questions to coordinate examinations with ease.
          </p>

          <HeroSearch />
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-pesofts-gray-900 tracking-tight">
            How can we help you today?
          </h2>
          <p className="mt-4 text-base md:text-lg text-pesofts-gray-500 font-light">
            Select a hub to explore resources, ask questions, or review technical documentation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Knowledge Base */}
          <div className="bg-white border border-pesofts-gray-200 rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-orange-500 hover:-translate-y-2 transition-all duration-300 group">
            <div>
              <div className="bg-orange-50 text-orange-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-pesofts-gray-900 mb-3 flex items-center">
                Knowledge Base
                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
                  Live
                </span>
              </h3>
              <p className="text-pesofts-gray-500 mb-8 leading-relaxed text-sm font-light">
                Explore comprehensive articles, guides, and best practices about Online Examination Software, AI Proctoring, and CBT solutions.
              </p>
            </div>
            <Button
              href="/knowledge-base"
              variant="primary"
              className="w-full flex items-center justify-center font-bold shadow-sm group-hover:scale-[1.01] transition-transform duration-200"
            >
              Browse Knowledge Base
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Card 2: Documentation */}
          <div className="bg-white border border-pesofts-gray-200 rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-orange-500 hover:-translate-y-2 transition-all duration-300 group">
            <div>
              <div className="bg-orange-50 text-orange-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-pesofts-gray-900 mb-3 flex items-center">
                Documentation
                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
                  Live
                </span>
              </h3>
              <p className="text-pesofts-gray-500 mb-8 leading-relaxed text-sm font-light">
                Official guides covering features, platform setup, proctoring settings, candidate management, and developer API references.
              </p>
            </div>
            <Button
              href="/docs"
              variant="primary"
              className="w-full flex items-center justify-center font-bold shadow-sm group-hover:scale-[1.01] transition-transform duration-200"
            >
              Explore Documentation
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Card 3: Community */}
          <div className="bg-white border border-pesofts-gray-200 rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-orange-500 hover:-translate-y-2 transition-all duration-300 group">
            <div>
              <div className="bg-orange-50 text-orange-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-pesofts-gray-900 mb-3 flex items-center">
                Community Forum
                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
                  Live
                </span>
              </h3>
              <p className="text-pesofts-gray-500 mb-8 leading-relaxed text-sm font-light">
                Connect with educators, ask configuration questions, share assessment workflows, and discuss exam integrity techniques.
              </p>
            </div>
            <Button
              href="/community"
              variant="primary"
              className="w-full flex items-center justify-center font-bold shadow-sm group-hover:scale-[1.01] transition-transform duration-200"
            >
              Join Community Forum
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

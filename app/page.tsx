"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, FileText, GraduationCap, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/knowledge-base?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/knowledge-base");
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-20 md:py-28 border-b border-pesofts-gray-100 bg-pesofts-gray-50/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-pesofts-gray-900 tracking-tight mb-6">
            PeSofts <span className="text-pesofts-red">Knowledge</span> Platform
          </h1>
          <p className="text-lg md:text-xl text-pesofts-gray-600 font-normal leading-relaxed mb-10 max-w-3xl mx-auto">
            Learn everything about Online Examination Software, AI Proctoring, Digital Assessments and modern examination practices.
          </p>

          {/* Large Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-pesofts-gray-400 group-focus-within:text-pesofts-red transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts, articles, security tools..."
              className="block w-full pl-11 pr-32 py-4 text-base text-pesofts-gray-900 placeholder-pesofts-gray-400 bg-white border border-pesofts-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pesofts-red focus:border-transparent transition-all duration-150"
            />
            <div className="absolute inset-y-2 right-2 flex items-center">
              <Button type="submit" variant="primary" className="h-full !py-0 !px-5 rounded-lg !text-xs font-bold">
                Search
              </Button>
            </div>
          </form>

          {/* Quick links under search */}
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-pesofts-gray-400">
            <span>Popular:</span>
            <button
              onClick={() => router.push("/knowledge-base?q=AI%20Proctoring")}
              className="text-pesofts-gray-500 hover:text-pesofts-red underline decoration-dotted"
            >
              AI Proctoring
            </button>
            <span>•</span>
            <button
              onClick={() => router.push("/knowledge-base?q=Browser%20Lock")}
              className="text-pesofts-gray-500 hover:text-pesofts-red underline decoration-dotted"
            >
              Browser Lock
            </button>
            <span>•</span>
            <button
              onClick={() => router.push("/knowledge-base?q=CBT")}
              className="text-pesofts-gray-500 hover:text-pesofts-red underline decoration-dotted"
            >
              Computer Based Testing
            </button>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-pesofts-gray-900 tracking-tight">
            How can we help you today?
          </h2>
          <p className="mt-3 text-lg text-pesofts-gray-500">
            Select a section to explore resources and documentation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Knowledge Base (Fully Working) */}
          <div className="bg-white border-2 border-pesofts-red/20 rounded-2xl p-8 flex flex-col justify-between hover:shadow-lg hover:border-pesofts-red transition-all duration-200">
            <div>
              <div className="bg-pesofts-red-50 text-pesofts-red w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-pesofts-gray-900 mb-3 flex items-center">
                Knowledge Base
                <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                  Fully Working
                </span>
              </h3>
              <p className="text-pesofts-gray-500 mb-8 leading-relaxed">
                Explore articles, concepts and best practices related to Online Examination Software, AI Proctoring, CBT, and more.
              </p>
            </div>
            <Button
              href="/knowledge-base"
              variant="primary"
              className="w-full flex items-center justify-center font-bold"
            >
              Browse Knowledge Base
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Card 2: Documentation (Static Card) */}
          <div className="bg-pesofts-gray-50/50 border border-pesofts-gray-200 rounded-2xl p-8 flex flex-col justify-between opacity-85 select-none relative overflow-hidden">
            <div>
              <div className="bg-pesofts-gray-100 text-pesofts-gray-400 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-pesofts-gray-700 mb-3 flex items-center justify-between">
                Documentation
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-pesofts-gray-100 text-pesofts-gray-400 border border-pesofts-gray-200">
                  Coming Soon
                </span>
              </h3>
              <p className="text-pesofts-gray-400 mb-8 leading-relaxed">
                Official documentation of PeSofts features, integrations, API reference logs, and installation guides.
              </p>
            </div>
            <Button
              variant="outline"
              disabled
              className="w-full bg-pesofts-gray-50 border-pesofts-gray-200 text-pesofts-gray-400 cursor-not-allowed hover:bg-pesofts-gray-50"
            >
              Docs Locked
            </Button>
          </div>

          {/* Card 3: Learning Academy (Static Card) */}
          <div className="bg-pesofts-gray-50/50 border border-pesofts-gray-200 rounded-2xl p-8 flex flex-col justify-between opacity-85 select-none relative overflow-hidden">
            <div>
              <div className="bg-pesofts-gray-100 text-pesofts-gray-400 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-pesofts-gray-700 mb-3 flex items-center justify-between">
                Learning Academy
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-pesofts-gray-100 text-pesofts-gray-400 border border-pesofts-gray-200">
                  Coming Soon
                </span>
              </h3>
              <p className="text-pesofts-gray-400 mb-8 leading-relaxed">
                Step-by-step learning resources, video courses, and certification pathways for educators and administrators.
              </p>
            </div>
            <Button
              variant="outline"
              disabled
              className="w-full bg-pesofts-gray-50 border-pesofts-gray-200 text-pesofts-gray-400 cursor-not-allowed hover:bg-pesofts-gray-50"
            >
              Academy Locked
            </Button>
          </div>

          {/* Card 4: Community (Static Card) */}
          <div className="bg-pesofts-gray-50/50 border border-pesofts-gray-200 rounded-2xl p-8 flex flex-col justify-between opacity-85 select-none relative overflow-hidden">
            <div>
              <div className="bg-pesofts-gray-100 text-pesofts-gray-400 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-pesofts-gray-700 mb-3 flex items-center justify-between">
                Community
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-pesofts-gray-100 text-pesofts-gray-400 border border-pesofts-gray-200">
                  Coming Soon
                </span>
              </h3>
              <p className="text-pesofts-gray-400 mb-8 leading-relaxed">
                Ask questions, share strategies, and learn from other educators, administrators, and exam security experts.
              </p>
            </div>
            <Button
              variant="outline"
              disabled
              className="w-full bg-pesofts-gray-50 border-pesofts-gray-200 text-pesofts-gray-400 cursor-not-allowed hover:bg-pesofts-gray-50"
            >
              Forum Locked
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, MessageSquare } from "lucide-react";

interface Profile {
  id: string;
  full_name: string | null;
  role: string | null;
  title: string | null;
  organization: string | null;
  avatar_url: string | null;
}

interface Question {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  is_pinned: boolean;
  is_solved: boolean;
  views: number;
  created_at: string;
  profiles?: Profile;
}

interface QuestionSidebarProps {
  question: Question;
  repliesCount: number;
  upvotesCount: number;
  getInitials: (fullName: string | null, email: string | null) => string;
}

export const QuestionSidebar: React.FC<QuestionSidebarProps> = ({
  question,
  repliesCount,
  upvotesCount,
  getInitials,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Thread Details Info Card */}
      <div className="bg-white border border-pesofts-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-[10px] font-bold text-pesofts-gray-400 uppercase tracking-widest mb-4">
          Discussion Meta
        </h3>

        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-pesofts-gray-500">Category</span>
            <span className="font-bold text-black">{question.category}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-pesofts-gray-500">Views</span>
            <span className="font-bold text-black flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-black stroke-[2.5]" /> {question.views}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-pesofts-gray-500">Replies</span>
            <span className="font-bold text-black flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-[#A8A8A8] fill-[#A8A8A8] stroke-none" /> {repliesCount}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-pesofts-gray-500">Upvotes</span>
            <span className="font-bold text-black flex items-center gap-1">
              <span className="text-xs">▲</span> {upvotesCount}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-pesofts-gray-500">Status</span>
            {question.is_solved ? (
              <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                <span className="text-xs">●</span> Solved
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[#E65C24] font-bold">
                <span className="text-xs">●</span> Open
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Author Profile Summary */}
      <div className="bg-white border border-pesofts-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-[10px] font-bold text-pesofts-gray-400 uppercase tracking-widest mb-4">
          Author
        </h3>

        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
            {question.profiles?.avatar_url ? (
              <Image
                src={question.profiles.avatar_url}
                alt={question.profiles.full_name || ""}
                width={40}
                height={40}
                unoptimized
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getInitials(question.profiles?.full_name || null, question.profiles?.id || null)
            )}
          </div>
          <div>
            <div className="text-sm font-bold text-black">
              {question.profiles?.full_name || "Community Member"}
            </div>
            <div className="text-[10px] text-[#E65C24] font-bold uppercase tracking-wider mt-0.5">
              {question.profiles?.role === "admin" ? "ADMIN" : question.profiles?.role || "USER"}
            </div>
          </div>
        </div>
      </div>

      {/* Still stuck? Card */}
      <div className="bg-black text-white rounded-2xl p-6 shadow-sm space-y-4 border border-black">
        <div>
          <h4 className="font-bold text-sm text-white">Still stuck?</h4>
          <p className="text-xs text-pesofts-gray-400 mt-2 leading-relaxed font-normal">
            Browse the Knowledge Base for step-by-step guides on exams, grading, and integrations.
          </p>
        </div>
        <Link
          href="/knowledge-base"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-2.5 px-4 bg-[#E65C24] hover:bg-[#d04b1e] text-black font-bold text-xs rounded-xl text-center transition-colors"
        >
          Visit knowledge base
        </Link>
      </div>
    </div>
  );
};

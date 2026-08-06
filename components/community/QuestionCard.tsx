"use client";

import React from "react";
import Image from "next/image";

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

interface QuestionCardProps {
  question: Question;
  upvotesCount: number;
  hasUpvoted: boolean | undefined;
  isQuestionOwner: boolean | undefined;
  onUpvote: () => void;
  onMarkSolved: () => void;
  getInitials: (fullName: string | null, email: string | null) => string;
  timeAgo: (dateString: string) => string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  upvotesCount,
  hasUpvoted,
  isQuestionOwner,
  onUpvote,
  onMarkSolved,
  getInitials,
  timeAgo,
}) => {
  return (
    <div className="bg-white border border-pesofts-gray-200 rounded-2xl p-6 md:p-8 shadow-sm animate-in fade-in duration-200">
      {/* Badges + Category row at top */}
      <div className="flex items-center gap-3 mb-4 text-xs font-semibold text-black select-none">
        {question.is_solved ? (
          <span className="inline-flex items-center text-[10px] font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md uppercase">
            Solved
          </span>
        ) : (
          <span className="inline-flex items-center text-[10px] font-bold tracking-wider text-[#E65C24] bg-[#FFEFE6] px-2.5 py-1 rounded-md uppercase">
            Open
          </span>
        )}
        <span className="text-sm font-medium text-pesofts-gray-500">{question.category}</span>
      </div>

      {/* Avatar + Title + Author row */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-base flex-shrink-0">
          {question.profiles?.avatar_url ? (
            <Image
              src={question.profiles.avatar_url}
              alt={question.profiles.full_name || ""}
              width={48}
              height={48}
              unoptimized
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            getInitials(question.profiles?.full_name || null, question.profiles?.id || null)
          )}
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-black tracking-tight leading-snug break-words">
            {question.title}
          </h1>
          <p className="text-xs text-pesofts-gray-500 font-medium mt-1">
            {question.profiles?.full_name || "Community Member"} · {timeAgo(question.created_at)}
          </p>
        </div>
      </div>

      {/* Question Content */}
      <div className="text-sm text-black leading-relaxed whitespace-pre-wrap mb-6 border-t border-pesofts-gray-100 pt-6">
        {question.content}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between border-t border-pesofts-gray-100 pt-6">
        <button
          onClick={onUpvote}
          className={`inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
            hasUpvoted
              ? "bg-[#E65C24] text-white border-transparent shadow-sm"
              : "bg-white hover:bg-pesofts-gray-50 text-black border-pesofts-gray-200"
          }`}
        >
          <span className="mr-1.5">▲</span> Upvote · {upvotesCount}
        </button>

        {isQuestionOwner && (
          <button
            onClick={onMarkSolved}
            className={`inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
              question.is_solved
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                : "bg-white hover:bg-[#FFEFE6]/30 text-[#E65C24] border-[#E65C24]/80 hover:border-[#E65C24]"
            }`}
          >
            <span>{question.is_solved ? "✓ Solved" : "✓ Mark as solved"}</span>
          </button>
        )}
      </div>
    </div>
  );
};

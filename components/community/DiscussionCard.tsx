"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageSquare, Eye, Pin, CheckCircle2, ArrowUp } from "lucide-react";

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
  community_replies?: { id: string; user_id: string }[];
  community_upvotes?: { id: string; user_id: string }[];
}

interface DiscussionCardProps {
  question: Question;
  currentUserId: string | undefined;
  onUpvote: (e: React.MouseEvent, questionId: string) => void;
  getInitials: (fullName: string | null, email: string | null) => string;
  timeAgo: (dateString: string) => string;
}

export const DiscussionCard: React.FC<DiscussionCardProps> = ({
  question,
  currentUserId,
  onUpvote,
  getInitials,
  timeAgo,
}) => {
  const replyCount = (question.community_replies || []).length;
  const upvoteCount = (question.community_upvotes || []).length;
  const hasUpvoted = currentUserId && (question.community_upvotes || []).some((u) => u.user_id === currentUserId);

  return (
    <Link
      href={`/community/question/${question.id}`}
      className="block bg-white hover:border-orange-500 border border-pesofts-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start space-x-4">
        {/* User Avatar */}
        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-black bg-pesofts-gray-100 border border-pesofts-gray-200 flex-shrink-0">
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

        {/* Card Contents */}
        <div className="flex-grow min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {question.is_pinned && (
              <span className="inline-flex items-center text-[10px] font-extrabold text-orange-500 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full">
                <Pin className="h-3 w-3 mr-0.5" /> Pinned
              </span>
            )}
            {question.is_solved ? (
              <span className="inline-flex items-center text-[10px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="h-3 w-3 mr-0.5" /> Solved
              </span>
            ) : (
              <span className="inline-flex items-center text-[10px] font-extrabold text-black bg-pesofts-gray-100 border border-pesofts-gray-200 px-2 py-0.5 rounded-full">
                Open
              </span>
            )}
            <span className="text-[10px] font-semibold text-black">
              · {question.category}
            </span>
          </div>

          <h3 className="font-bold text-black text-base mb-1.5 hover:text-orange-500 leading-snug break-words">
            {question.title}
          </h3>

          <div className="text-xs text-black flex flex-wrap items-center gap-1 leading-none">
            <span className="font-semibold text-black">
              {question.profiles?.full_name || "Community Member"}
            </span>
            {question.profiles?.title && (
              <>
                <span>·</span>
                <span>{question.profiles.title}</span>
              </>
            )}
            {question.profiles?.organization && (
              <>
                <span>·</span>
                <span>{question.profiles.organization}</span>
              </>
            )}
          </div>
        </div>

        {/* Right stats and Time */}
        <div className="flex flex-col items-end justify-between self-stretch flex-shrink-0 text-right text-sm text-black pl-2">
          <div className="flex items-center space-x-3 mb-4">
            <span className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-1.5" /> {replyCount}
            </span>
            <span className="flex items-center">
              <Eye className="h-5 w-5 mr-1.5" /> {question.views}
            </span>
          </div>

          <span className="text-xs font-semibold text-black">
            Last: {timeAgo(question.created_at)}
          </span>
        </div>
      </div>

      {/* Vote Footer Action */}
      <div className="mt-4 pt-4 border-t border-pesofts-gray-100 flex items-center justify-between">
        <button
          onClick={(e) => onUpvote(e, question.id)}
          className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
            hasUpvoted
              ? "bg-orange-500 text-white border-transparent"
              : "bg-white hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 text-black border-pesofts-gray-200"
          }`}
        >
          <ArrowUp className="h-3.5 w-3.5 mr-1" />
          <span>Upvote {upvoteCount > 0 ? `(${upvoteCount})` : ""}</span>
        </button>
      </div>
    </Link>
  );
};

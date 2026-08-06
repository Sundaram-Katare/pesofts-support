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

interface Reply {
  id: string;
  question_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: Profile;
  community_reply_upvotes?: { id: string; user_id: string }[];
}

interface ReplyCardProps {
  reply: Reply;
  currentUserId: string | undefined;
  onUpvote: (replyId: string) => void;
  getInitials: (fullName: string | null, email: string | null) => string;
  timeAgo: (dateString: string) => string;
}

export const ReplyCard: React.FC<ReplyCardProps> = ({
  reply,
  currentUserId,
  onUpvote,
  getInitials,
  timeAgo,
}) => {
  const replyUpvoteCount = (reply.community_reply_upvotes || []).length;
  const hasUpvotedReply = currentUserId && (reply.community_reply_upvotes || []).some((u) => u.user_id === currentUserId);

  return (
    <div className="bg-white border border-pesofts-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* Reply Author Avatar */}
          <div className="w-10 h-10 rounded-full bg-[#FFEFE6] flex items-center justify-center font-bold text-sm text-[#E65C24] flex-shrink-0">
            {reply.profiles?.avatar_url ? (
              <Image
                src={reply.profiles.avatar_url}
                alt={reply.profiles.full_name || ""}
                width={40}
                height={40}
                unoptimized
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getInitials(reply.profiles?.full_name || null, reply.profiles?.id || null)
            )}
          </div>
          <div>
            <div className="text-sm font-bold text-black leading-tight">
              {reply.profiles?.full_name || "Community Member"}
            </div>
            <div className="text-[10px] text-pesofts-gray-400 font-semibold mt-0.5">
              {timeAgo(reply.created_at)}
            </div>
          </div>
        </div>

        <button
          onClick={() => onUpvote(reply.id)}
          className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
            hasUpvotedReply
              ? "bg-[#E65C24] text-white border-transparent"
              : "bg-white hover:bg-pesofts-gray-50 text-[#555555] border-pesofts-gray-200"
          }`}
        >
          <span className="mr-1">▲</span> Upvote {replyUpvoteCount > 0 ? `· ${replyUpvoteCount}` : ""}
        </button>
      </div>

      <div className="text-sm text-pesofts-gray-800 leading-relaxed">
        {reply.content}
      </div>
    </div>
  );
};

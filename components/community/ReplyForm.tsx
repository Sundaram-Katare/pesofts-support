"use client";

import React from "react";
import { Button } from "@/components/ui/Button";

interface ReplyFormProps {
  user: any;
  replyContent: string;
  setReplyContent: (content: string) => void;
  replyError: string;
  submittingReply: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const ReplyForm: React.FC<ReplyFormProps> = ({
  user,
  replyContent,
  setReplyContent,
  replyError,
  submittingReply,
  onSubmit,
}) => {
  return (
    <div className="bg-white border border-pesofts-gray-200 rounded-2xl p-6 shadow-sm">
      <h3 className="text-sm font-bold text-black mb-4">Post a reply</h3>

      {user ? (
        <form onSubmit={onSubmit} className="space-y-4">
          {replyError && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-xs text-orange-600 font-semibold">
              {replyError}
            </div>
          )}
          <textarea
            rows={4}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Type your reply here..."
            required
            className="block w-full px-4 py-3 text-sm text-black placeholder-pesofts-gray-500 bg-white border border-pesofts-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E65C24] focus:border-transparent transition-all"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submittingReply}
              className="px-5 py-2.5 bg-[#E65C24] hover:bg-[#d04b1e] text-white text-xs font-bold rounded-xl shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submittingReply ? "Posting..." : "Post reply"}
            </button>
          </div>
        </form>
      ) : (
        <div className="p-6 bg-pesofts-gray-50 border border-pesofts-gray-100 rounded-xl text-center">
          <p className="text-sm text-black mb-3">
            You must be logged in to reply to this discussion.
          </p>
          <Button 
            href="/login" 
            variant="outline" 
            className="bg-white text-black hover:bg-pesofts-gray-100 !py-1.5 !px-4"
          >
            Login
          </Button>
        </div>
      )}
    </div>
  );
};

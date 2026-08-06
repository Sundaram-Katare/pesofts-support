"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/layout/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { QuestionCard } from "@/components/community/QuestionCard";
import { ReplyCard } from "@/components/community/ReplyCard";
import { ReplyForm } from "@/components/community/ReplyForm";
import { QuestionSidebar } from "@/components/community/QuestionSidebar";

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

interface Upvote {
  id: string;
  question_id: string;
  user_id: string;
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

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function QuestionDetailsPage({ params }: PageProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [questionId, setQuestionId] = useState<string | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [upvotes, setUpvotes] = useState<Upvote[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [replyContent, setReplyContent] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [replyError, setReplyError] = useState("");

  const loadThreadDetails = useCallback(async () => {
    if (!questionId) return;
    setLoading(true);
    try {
      const { data: qData, error: qError } = await supabase
        .from("community_questions")
        .select("*, profiles:user_id(*)")
        .eq("id", questionId)
        .single();

      if (qError || !qData) {
        console.error("Error loading question:", qError);
        setLoading(false);
        return;
      }

      const currentQuestion = qData as Question;
      setQuestion(currentQuestion);

      let rData: any = null;

      try {
        const res = await supabase
          .from("community_replies")
          .select("*, profiles:user_id(*), community_reply_upvotes(id, user_id)")
          .eq("question_id", questionId)
          .order("created_at", { ascending: true });

        if (res.error) {
          const fallbackRes = await supabase
            .from("community_replies")
            .select("*, profiles:user_id(*)")
            .eq("question_id", questionId)
            .order("created_at", { ascending: true });

          if (!fallbackRes.error) {
            rData = fallbackRes.data?.map((reply: any) => ({ ...reply, community_reply_upvotes: [] }));
          }
        } else {
          rData = res.data;
        }
      } catch {
        const fallbackRes = await supabase
          .from("community_replies")
          .select("*, profiles:user_id(*)")
          .eq("question_id", questionId)
          .order("created_at", { ascending: true });
        if (!fallbackRes.error) {
          rData = fallbackRes.data?.map((reply: any) => ({ ...reply, community_reply_upvotes: [] }));
        }
      }

      if (rData) {
        setReplies(rData as Reply[]);
      }

      const { data: uData, error: uError } = await supabase
        .from("community_upvotes")
        .select("*")
        .eq("question_id", questionId);

      if (!uError && uData) {
        setUpvotes(uData as Upvote[]);
      }

      await supabase
        .from("community_questions")
        .update({ views: currentQuestion.views + 1 })
        .eq("id", questionId);

    } catch (err) {
      console.error("Failed to load thread details:", err);
    } finally {
      setLoading(false);
    }
  }, [questionId]);

  useEffect(() => {
    params.then((p) => setQuestionId(p.id));
  }, [params]);

  useEffect(() => {
    if (questionId) {
      loadThreadDetails();
    }
  }, [questionId, loadThreadDetails]);

  const handleUpvote = async () => {
    if (!user || !questionId) {
      router.push("/login");
      return;
    }

    const userUpvote = upvotes.find((u) => u.user_id === user.id);

    if (userUpvote) {
      const { error } = await supabase
        .from("community_upvotes")
        .delete()
        .eq("id", userUpvote.id);

      if (!error) {
        setUpvotes((prev) => prev.filter((u) => u.id !== userUpvote.id));
      }
    } else {
      const { data, error } = await supabase
        .from("community_upvotes")
        .insert({ question_id: questionId, user_id: user.id })
        .select()
        .single();

      if (!error && data) {
        setUpvotes((prev) => [...prev, data]);
      }
    }
  };

  const handleReplyUpvote = async (replyId: string) => {
    if (!user) {
      router.push("/login");
      return;
    }

    const reply = replies.find((r) => r.id === replyId);
    if (!reply) return;

    const upvotesList = reply.community_reply_upvotes || [];
    const userUpvote = upvotesList.find((u) => u.user_id === user.id);

    if (userUpvote) {
      const { error } = await supabase
        .from("community_reply_upvotes")
        .delete()
        .eq("id", userUpvote.id);

      if (!error) {
        setReplies((prev) =>
          prev.map((r) => {
            if (r.id === replyId) {
              return {
                ...r,
                community_reply_upvotes: upvotesList.filter((u) => u.id !== userUpvote.id),
              };
            }
            return r;
          })
        );
      }
    } else {
      const { data, error } = await supabase
        .from("community_reply_upvotes")
        .insert({ reply_id: replyId, user_id: user.id })
        .select()
        .single();

      if (!error && data) {
        setReplies((prev) =>
          prev.map((r) => {
            if (r.id === replyId) {
              return {
                ...r,
                community_reply_upvotes: [...upvotesList, data],
              };
            }
            return r;
          })
        );
      }
    }
  };

  const handleMarkSolved = async () => {
    if (!user || !question || !questionId) return;

    const isOwner = question.user_id === user.id;
    const isAdmin = user.role === "admin";
    if (!isOwner && !isAdmin) return;

    const newSolvedState = !question.is_solved;

    const { error } = await supabase
      .from("community_questions")
      .update({ is_solved: newSolvedState })
      .eq("id", questionId);

    if (!error) {
      setQuestion((prev) => (prev ? { ...prev, is_solved: newSolvedState } : null));
    }
  };

  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !questionId) return;

    if (!replyContent.trim()) {
      setReplyError("Reply cannot be empty.");
      return;
    }

    setSubmittingReply(true);
    setReplyError("");

    try {
      const { data, error } = await supabase
        .from("community_replies")
        .insert({
          question_id: questionId,
          user_id: user.id,
          content: replyContent.trim(),
        })
        .select("*, profiles:user_id(*)")
        .single();

      if (error) {
        setReplyError(error.message || "Failed to post reply.");
      } else if (data) {
        setReplies((prev) => [...prev, { ...data, community_reply_upvotes: [] } as Reply]);
        setReplyContent("");
      }
    } catch (err: any) {
      setReplyError(err.message || "An unexpected error occurred.");
    } finally {
      setSubmittingReply(false);
    }
  };

  const getInitials = (fullName: string | null, email: string | null) => {
    if (fullName) {
      const parts = fullName.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return parts[0].substring(0, 2).toUpperCase();
    }
    return email ? email.substring(0, 2).toUpperCase() : "??";
  };

  const timeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval}y ago`;
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval}mo ago`;
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval}d ago`;
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval}h ago`;
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval}m ago`;
    return "just now";
  };

  const hasUpvoted = !!(user && upvotes.some((u) => u.user_id === user.id));
  const isQuestionOwner = !!(user && question && (question.user_id === user.id || user.role === "admin"));

  if (loading || !question) {
    return (
      <div className="bg-pesofts-gray-50 flex-grow flex items-center justify-center py-20">
        {loading ? (
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
        ) : (
          <div className="text-center py-10">
            <h2 className="text-xl font-bold text-black mb-2">Discussion Not Found</h2>
            <Button href="/community" variant="primary">Return to community</Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-pesofts-gray-50 flex-grow font-sans py-10 text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        <button
          onClick={() => router.push("/community")}
          className="text-pesofts-gray-600 hover:text-black font-normal flex items-center mb-6 text-sm transition-colors"
        >
          ← Back to discussions
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <QuestionCard
              question={question}
              upvotesCount={upvotes.length}
              hasUpvoted={hasUpvoted}
              isQuestionOwner={isQuestionOwner}
              onUpvote={handleUpvote}
              onMarkSolved={handleMarkSolved}
              getInitials={getInitials}
              timeAgo={timeAgo}
            />

            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-black flex items-center select-none gap-1.5 mb-4">
                <span>💬</span> Replies ({replies.length})
              </h2>
            </div>

            {replies.length === 0 ? (
              <div className="bg-white border border-pesofts-gray-200 rounded-2xl p-8 text-center text-sm text-black shadow-sm">
                No replies yet. Be the first to reply to this question!
              </div>
            ) : (
              <div className="space-y-4">
                {replies.map((reply) => (
                  <ReplyCard
                    key={reply.id}
                    reply={reply}
                    currentUserId={user?.id}
                    onUpvote={handleReplyUpvote}
                    getInitials={getInitials}
                    timeAgo={timeAgo}
                  />
                ))}
              </div>
            )}

            <ReplyForm
              user={user}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              replyError={replyError}
              submittingReply={submittingReply}
              onSubmit={handlePostReply}
            />
          </div>

          {/* Right Column: Meta Info / Stats */}
          <div className="lg:col-span-4">
            <QuestionSidebar
              question={question}
              repliesCount={replies.length}
              upvotesCount={upvotes.length}
              getInitials={getInitials}
            />
          </div>

        </div>
      </div>

    </div>
  );
}

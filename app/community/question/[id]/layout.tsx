import { Metadata } from "next";
import { supabase } from "@/lib/supabase";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const { id } = await params;
    const { data: question } = await supabase
      .from("community_questions")
      .select("title, content, category")
      .eq("id", id)
      .single();

    if (!question) {
      return {
        title: "Community Q&A | PeSofts Platform",
        description: "Read community questions and answers regarding online exams and AI proctoring on PeSofts.",
      };
    }

    const cleanDescription = question.content
      ? question.content.replace(/[#*`_-]/g, "").substring(0, 155).trim() + "..."
      : "Discussion about online examination software and AI proctoring techniques.";

    return {
      title: `${question.title} - PeSofts Community`,
      description: cleanDescription,
      keywords: `${question.category ? question.category.toLowerCase() : "proctoring"}, online exams, exam security help`,
    };
  } catch (error) {
    console.error("Error generating metadata for community question:", error);
    return {
      title: "Community Thread | PeSofts Platform",
      description: "Read community questions and answers regarding online exams and AI proctoring on PeSofts.",
    };
  }
}

interface Profile {
  full_name: string | null;
}

interface Reply {
  content: string;
  created_at: string;
  profiles: Profile | null;
}

export default async function QuestionLayout({ children, params }: LayoutProps) {
  try {
    const { id } = await params;

    // 1. Fetch Question details
    const { data: question } = await supabase
      .from("community_questions")
      .select("*, profiles:user_id(*)")
      .eq("id", id)
      .single();

    if (!question) {
      return <>{children}</>;
    }

    // 2. Fetch Replies details
    const { data: replies } = await supabase
      .from("community_replies")
      .select("*, profiles:user_id(*)")
      .eq("question_id", id)
      .order("created_at", { ascending: true });

    // 3. Construct QAPage JSON-LD
    const suggestedAnswers = ((replies || []) as unknown as Reply[]).map((reply) => ({
      "@type": "Answer",
      "text": reply.content,
      "dateCreated": reply.created_at,
      "author": {
        "@type": "Person",
        "name": reply.profiles?.full_name || "Community Member"
      }
    }));

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "QAPage",
      "mainEntity": {
        "@type": "Question",
        "name": question.title,
        "text": question.content,
        "dateCreated": question.created_at,
        "answerCount": suggestedAnswers.length,
        "author": {
          "@type": "Person",
          "name": question.profiles?.full_name || "Community Member"
        },
        ...(suggestedAnswers.length > 0 ? { "suggestedAnswer": suggestedAnswers } : {})
      }
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </>
    );
  } catch (err) {
    console.error("Failed to construct QAPage JSON-LD inside question layout:", err);
    return <>{children}</>;
  }
}

export interface DocArticle {
  slug: string;
  title: string;
  description: string;
  categorySlug: string;
  categoryName: string;
  content: string;
  readingTime: string;
  updatedDate: string;
}

export interface DocCategory {
  slug: string;
  name: string;
  items: {
    slug: string;
    title: string;
  }[];
}

export const DOC_CATEGORIES: DocCategory[] = [
  {
    slug: "getting-started",
    name: "Getting Started",
    items: [
      { slug: "overview", title: "Overview" },
      { slug: "signing-in", title: "Signing in" },
      { slug: "your-first-exam", title: "Your first exam" },
      { slug: "concepts", title: "Concepts" }
    ]
  },
  {
    slug: "exam-creation",
    name: "Exam Creation",
    items: [
      { slug: "creating-exams", title: "Creating exams" },
      { slug: "sections-timing", title: "Sections & timing" },
      { slug: "grading-rules", title: "Grading rules" },
      { slug: "publish-flow", title: "Publish flow" }
    ]
  },
  {
    slug: "question-bank",
    name: "Question Bank",
    items: [
      { slug: "structure", title: "Structure" },
      { slug: "importing-questions", title: "Importing questions" },
      { slug: "tags-difficulty", title: "Tags & difficulty" },
      { slug: "randomization", title: "Randomization" }
    ]
  },
  {
    slug: "candidate-management",
    name: "Candidate Management",
    items: [
      { slug: "bulk-import", title: "Bulk import" },
      { slug: "groups", title: "Groups" },
      { slug: "communication", title: "Communication" },
      { slug: "attendance", title: "Attendance" }
    ]
  },
  {
    slug: "ai-proctoring",
    name: "AI Proctoring",
    items: [
      { slug: "how-it-works", title: "How it works" },
      { slug: "settings", title: "AI Proctoring Settings" },
      { slug: "live-proctoring", title: "Live proctoring" }
    ]
  },
  {
    slug: "features",
    name: "Platform Features",
    items: [
      { slug: "reports-analytics", title: "Reports & Analytics" },
      { slug: "user-roles", title: "User Roles & Permissions" },
      { slug: "multi-language", title: "Multi-language Exams" },
      { slug: "scheduling", title: "Exam Scheduling" }
    ]
  },
  {
    slug: "advanced",
    name: "Advanced Settings",
    items: [
      { slug: "integrations", title: "Integrations" },
      { slug: "platform-settings", title: "Platform Settings" },
      { slug: "troubleshooting", title: "Troubleshooting" },
      { slug: "api-docs", title: "API Documentation (Future)" }
    ]
  }
];

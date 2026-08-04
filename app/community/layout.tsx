import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Forum | Ask & Answer - PeSofts Platform",
  description: "Engage with proctoring experts, school administrators, and educators. Discuss online exam configurations, AI proctoring setups, and student authentication methods.",
  keywords: "proctoring forum, exam software discussion, educator Q&A, test administration help",
};

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | PeSofts Platform Support & Knowledge",
  description: "Sign in to the PeSofts platform to manage bookmarks, edit article drafts, and access community discussions.",
  robots: {
    index: false, // Do not index the login page to avoid noise in search results
    follow: true,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

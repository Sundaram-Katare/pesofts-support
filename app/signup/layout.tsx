import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | PeSofts Platform Support & Knowledge",
  description: "Join the PeSofts support community to ask questions, share answers, and access exam security insights.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

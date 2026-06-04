import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in | RethinkJobs",
  description: "Create a RethinkJobs account with email or Google. Connect Gmail later for Track Jobs only.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}

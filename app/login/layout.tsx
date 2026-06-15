import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `Sign in | ${SITE_NAME}`,
  description: `Create a ${SITE_NAME} account with email or Google. Connect Gmail later for Track Jobs only.`,
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import { redirect } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Contact",
  description: "Contact the SuperInterns team.",
  path: "/contact",
});

export default function ContactPage() {
  redirect("/contact-us");
}

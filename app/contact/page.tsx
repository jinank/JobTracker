import { redirect } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Contact",
  description: "Contact the Summer Internships team.",
  path: "/contact",
});

export default function ContactPage() {
  redirect("/contact-us");
}

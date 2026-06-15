import { redirect } from "next/navigation";

export const metadata = {
  title: "Contact – Summer Internships",
  description: "Get in touch with the Summer Internships team.",
};

export default function ContactPage() {
  redirect("/contact-us");
}

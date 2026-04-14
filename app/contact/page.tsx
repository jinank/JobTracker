import { redirect } from "next/navigation";

export const metadata = {
  title: "Contact – Rethinkjobs",
  description: "Get in touch with the Rethinkjobs team.",
};

export default function ContactPage() {
  redirect("/contact-us");
}

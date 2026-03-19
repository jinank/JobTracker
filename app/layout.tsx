import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rethinkjobs – Job Application Tracker",
  description:
    "Automatically tracks your job applications from Gmail using AI classification.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${jakarta.className} min-h-screen bg-slate-50 antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

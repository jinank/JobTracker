import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import { Footer } from "@/components/Footer";
import { RootJsonLd } from "@/components/seo/RootJsonLd";
import { getMetadataBase, getSiteOrigin } from "@/lib/site";
import { Providers } from "./providers";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
});

const SITE_TITLE_DEFAULT =
  "RethinkJobs | AI Job Application Tracker for Students & Professionals";

/** ~155 characters, primary keyword + CTA */
const SITE_DESCRIPTION =
  "RethinkJobs is the AI job application tracker that syncs Gmail to track job applications and internships. Free for students. Start free today—organize your entire pipeline.";

const SITE_KEYWORDS = [
  "job application tracker",
  "AI job search tool",
  "track job applications",
  "internship tracker",
  "job search organizer",
  "Gmail job tracker",
  "student job search",
  "application pipeline",
  "RethinkJobs",
];

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: SITE_TITLE_DEFAULT,
    template: "%s | RethinkJobs",
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: "RethinkJobs" }],
  creator: "RethinkJobs",
  publisher: "RethinkJobs",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: getSiteOrigin(),
    siteName: "RethinkJobs",
    title: SITE_TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "RethinkJobs — AI-powered job application tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
    images: [{ url: "/opengraph-image", alt: "RethinkJobs — AI job application tracker" }],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  category: "technology",
  formatDetection: { telephone: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <RootJsonLd />
      </head>
      <body
        className={`${jakarta.className} min-h-screen bg-slate-50 antialiased flex flex-col`}
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HT0DDBS8E3"
          strategy="afterInteractive"
        />
        <Script id="google-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HT0DDBS8E3');
            gtag('config', 'AW-18093007265');
          `}
        </Script>
        <Providers>
          <div className="flex-1 flex flex-col min-h-0">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

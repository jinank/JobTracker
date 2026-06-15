import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import { Footer } from "@/components/Footer";
import { RootJsonLd } from "@/components/seo/RootJsonLd";
import { getMetadataBase, getSiteOrigin, SITE_NAME } from "@/lib/site";
import { Providers } from "./providers";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

const SITE_TITLE_DEFAULT =
  "Summer Internships | USA internship search for students";

/** ~155 characters, primary keyword + CTA */
const SITE_DESCRIPTION =
  "Summer Internships helps students find USA internships from company career pages, track applications from Gmail, practice interviews with AI, and unlock member perks. Free for students.";

const SITE_KEYWORDS = [
  "summer internships",
  "USA internships",
  "internship search",
  "student internships",
  "internship tracker",
  "job application tracker",
  "internship application tracker",
  "Summer Internships",
];

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: SITE_TITLE_DEFAULT,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
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
    siteName: SITE_NAME,
    title: SITE_TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} | USA internship search for students`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
    images: [{ url: "/opengraph-image", alt: `${SITE_NAME} | USA internship search` }],
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
        className={`${jakarta.variable} ${jakarta.className} min-h-screen bg-slate-50 antialiased flex flex-col`}
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-L0WY604E6K"
          strategy="afterInteractive"
        />
        <Script id="google-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-L0WY604E6K');
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

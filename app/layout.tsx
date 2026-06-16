import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import { Footer } from "@/components/Footer";
import { RootJsonLd } from "@/components/seo/RootJsonLd";
import { buildRootMetadata } from "@/lib/seo";
import { Providers } from "./providers";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

export const metadata: Metadata = buildRootMetadata();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6b46fe",
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

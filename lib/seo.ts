import type { Metadata } from "next";
import { getMetadataBase, getSiteOrigin, SITE_NAME } from "@/lib/site";

export const DEFAULT_OG_IMAGE = "/opengraph-image";
export const DEFAULT_OG_IMAGE_WIDTH = 1200;
export const DEFAULT_OG_IMAGE_HEIGHT = 630;

export const SITE_TITLE_DEFAULT =
  "SuperInterns | USA internship search for students";

export const SITE_DESCRIPTION_DEFAULT =
  "SuperInterns helps students find USA internships from company career pages, track applications from Gmail, practice interviews with AI, and unlock member perks. Free for students.";

export const SITE_KEYWORDS = [
  "summer internships",
  "USA internships",
  "internship search",
  "student internships",
  "internship tracker",
  "job application tracker",
  "internship application tracker",
  "SuperInterns",
];

type BuildPageMetadataOptions = {
  /** Page title without site suffix (template adds ` | SuperInterns`). */
  title: string;
  description: string;
  /** Canonical path, e.g. `/find-jobs`. */
  path: string;
  keywords?: string[];
  noIndex?: boolean;
  /** Override Open Graph / Twitter title when different from `title`. */
  ogTitle?: string;
};

function ogImages(alt: string): NonNullable<Metadata["openGraph"]>["images"] {
  return [
    {
      url: DEFAULT_OG_IMAGE,
      width: DEFAULT_OG_IMAGE_WIDTH,
      height: DEFAULT_OG_IMAGE_HEIGHT,
      alt,
    },
  ];
}

export function buildPageMetadata(options: BuildPageMetadataOptions): Metadata {
  const { title, description, path, keywords, noIndex, ogTitle } = options;
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const pageUrl = `${getSiteOrigin()}${canonicalPath === "/" ? "" : canonicalPath}`;
  const socialTitle = ogTitle ?? title;
  const imageAlt = `${SITE_NAME} — ${socialTitle}`;

  return {
    title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: { canonical: canonicalPath },
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: false,
            googleBot: { index: false, follow: false },
          },
        }
      : {}),
    openGraph: {
      type: "website",
      locale: "en_US",
      url: pageUrl,
      siteName: SITE_NAME,
      title: socialTitle,
      description,
      images: ogImages(imageAlt),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [{ url: DEFAULT_OG_IMAGE, alt: imageAlt }],
    },
  };
}

export function buildRootMetadata(): Metadata {
  return {
    metadataBase: getMetadataBase(),
    title: {
      default: SITE_TITLE_DEFAULT,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION_DEFAULT,
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
      description: SITE_DESCRIPTION_DEFAULT,
      images: ogImages(`${SITE_NAME} | USA internship search for students`),
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_TITLE_DEFAULT,
      description: SITE_DESCRIPTION_DEFAULT,
      images: [{ url: DEFAULT_OG_IMAGE, alt: `${SITE_NAME} | USA internship search` }],
    },
    icons: {
      icon: [
        { url: "/icon.png", type: "image/png", sizes: "512x512" },
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      shortcut: "/icon.png",
      apple: "/icon.png",
    },
    category: "technology",
    formatDetection: { telephone: false },
  };
}

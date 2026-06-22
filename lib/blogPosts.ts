import type { ComponentType } from "react";
import { InternshipSearchChecklist } from "@/components/blog/posts/InternshipSearchChecklist";
import { Summer2027ProgramsOpen } from "@/components/blog/posts/Summer2027ProgramsOpen";
import { Summer2027SearchGuide } from "@/components/blog/posts/Summer2027SearchGuide";
import { TrackApplicationsWithoutSpreadsheet } from "@/components/blog/posts/TrackApplicationsWithoutSpreadsheet";
import { UsaInternshipsOffJobBoards } from "@/components/blog/posts/UsaInternshipsOffJobBoards";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  readMinutes: number;
  category: string;
  tags: string[];
  Content: ComponentType;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "summer-2027-internship-search-guide",
    title: "Summer 2027 Internships: A Practical Search Guide for College Students",
    description:
      "When to apply for summer 2027 internships, where to find roles, how to track applications with Gmail, get referrals, prepare for interviews, and use campus recruiting.",
    publishedAt: "2026-06-21",
    updatedAt: "2026-06-21",
    readMinutes: 18,
    category: "Internship Strategy",
    tags: [
      "summer 2027",
      "internship search",
      "college students",
      "campus recruiting",
      "application tracking",
    ],
    Content: Summer2027SearchGuide,
  },
  {
    slug: "summer-2027-internship-programs-open-now",
    title: "Summer 2027 Internship Programs Open Right Now",
    description:
      "A running list of Summer 2027 internship applications that are live today—finance, tech, consulting, and more—with direct apply links to company career pages.",
    publishedAt: "2026-06-20",
    updatedAt: "2026-06-20",
    readMinutes: 6,
    category: "Internship Strategy",
    tags: ["summer 2027", "internship programs", "finance internships", "tech internships"],
    Content: Summer2027ProgramsOpen,
  },
  {
    slug: "track-internship-applications-without-spreadsheet",
    title: "How to track internship applications without a spreadsheet",
    description:
      "A simple system for students to track every internship application, follow-up, and interview stage without losing rows in a messy Google Sheet.",
    publishedAt: "2026-06-01",
    readMinutes: 6,
    category: "Application tracking",
    tags: ["internship tracker", "job applications", "organization"],
    Content: TrackApplicationsWithoutSpreadsheet,
  },
  {
    slug: "usa-internship-search-checklist",
    title: "USA internship search checklist for campus recruiting season",
    description:
      "A week-by-week checklist for finding USA internships, tailoring materials, applying on company sites, and staying on top of recruiter replies.",
    publishedAt: "2026-06-02",
    readMinutes: 8,
    category: "Internship search",
    tags: ["summer internships", "USA internships", "checklist"],
    Content: InternshipSearchChecklist,
  },
  {
    slug: "find-internships-not-on-linkedin",
    title: "Where to find internships that are not on LinkedIn",
    description:
      "Why company career pages beat crowded job boards for internship hunting, and how to discover US roles before they get hundreds of applicants.",
    publishedAt: "2026-06-03",
    readMinutes: 7,
    category: "Internship search",
    tags: ["Greenhouse", "Lever", "hidden jobs", "internships"],
    Content: UsaInternshipsOffJobBoards,
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getBlogPostsNewestFirst(): BlogPost[] {
  return [...BLOG_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function formatBlogDate(isoDate: string): string {
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

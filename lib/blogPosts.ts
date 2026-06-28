import type { ComponentType } from "react";
import { InternshipSearchChecklist } from "@/components/blog/posts/InternshipSearchChecklist";
import { SummerInternshipsGuide } from "@/components/blog/posts/SummerInternshipsGuide";
import { Summer2027InternshipsCompleteGuide } from "@/components/blog/posts/Summer2027InternshipsCompleteGuide";
import { RemoteSummer2027InternshipsGuide } from "@/components/blog/posts/RemoteSummer2027InternshipsGuide";
import { Summer2027InternshipsPracticalGuide } from "@/components/blog/posts/Summer2027InternshipsPracticalGuide";
import { Summer2027InternshipsTimelineGuide } from "@/components/blog/posts/Summer2027InternshipsTimelineGuide";
import { Summer2027InternshipsUsaGuide } from "@/components/blog/posts/Summer2027InternshipsUsaGuide";
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
    slug: "summer-2027-internships-complete-guide",
    title: "Summer 2027 Internships: Complete Student Search Guide",
    description:
      "When to apply for summer 2027 internships, where to find U.S. roles, build a SuperInterns workflow, track with Gmail, get referrals, and prep for interviews.",
    publishedAt: "2026-06-28",
    updatedAt: "2026-06-28",
    readMinutes: 28,
    category: "Internship Strategy",
    tags: [
      "summer 2027 internships",
      "summer 2027 internship guide",
      "USA internships",
      "internship search",
      "college students",
      "application tracking",
      "Gmail tracking",
    ],
    Content: Summer2027InternshipsCompleteGuide,
  },
  {
    slug: "remote-summer-2027-internships",
    title: "Remote Summer 2027 Internships: A Practical Student Search Guide",
    description:
      "Find remote summer 2027 internships in the USA, track applications with Gmail, get referrals, prep for video interviews, and follow a 30-day search plan.",
    publishedAt: "2026-06-27",
    updatedAt: "2026-06-27",
    readMinutes: 26,
    category: "Internship Strategy",
    tags: [
      "remote summer 2027 internships",
      "summer 2027 internships",
      "virtual internships",
      "USA internships",
      "internship search",
      "college students",
      "application tracking",
    ],
    Content: RemoteSummer2027InternshipsGuide,
  },
  {
    slug: "2027-summer-internships-practical-guide",
    title: "2027 Summer Internships: A Practical Student Guide to Getting Ahead",
    description:
      "When to apply for 2027 summer internships, where to find U.S. roles, build a resume, track applications with Gmail, get referrals, and prep for interviews.",
    publishedAt: "2026-06-26",
    updatedAt: "2026-06-26",
    readMinutes: 22,
    category: "Internship Strategy",
    tags: [
      "2027 summer internships",
      "summer 2027 internships",
      "USA internships",
      "internship search",
      "college students",
      "campus recruiting",
      "application tracking",
    ],
    Content: Summer2027InternshipsPracticalGuide,
  },
  {
    slug: "summer-2027-internships",
    title: "Summer 2027 Internships: A Practical Search Timeline for Students",
    description:
      "When to apply for summer 2027 internships, where to find U.S. roles, build a resume, track applications with Gmail, get referrals, and prep for interviews.",
    publishedAt: "2026-06-25",
    updatedAt: "2026-06-25",
    readMinutes: 24,
    category: "Internship Strategy",
    tags: [
      "summer 2027 internships",
      "summer 2027 internship timeline",
      "USA internships",
      "internship search",
      "college students",
      "campus recruiting",
      "application tracking",
    ],
    Content: Summer2027InternshipsTimelineGuide,
  },
  {
    slug: "summer-internships-student-guide",
    title: "Summer Internships: A Student's Guide to Landing One",
    description:
      "When to apply for summer internships, where to find U.S. roles, build a resume, track applications with Gmail, get referrals, and prep for interviews.",
    publishedAt: "2026-06-23",
    updatedAt: "2026-06-23",
    readMinutes: 20,
    category: "Internship Strategy",
    tags: [
      "summer internships",
      "summer internship search",
      "USA internships",
      "college students",
      "campus recruiting",
      "internship applications",
    ],
    Content: SummerInternshipsGuide,
  },
  {
    slug: "2027-summer-internships-usa",
    title: "2027 Summer Internships USA: Student Search Guide",
    description:
      "When to apply for 2027 summer internships in the USA, where to find roles on company career pages, track applications with Gmail, get referrals, and prep for interviews.",
    publishedAt: "2026-06-22",
    updatedAt: "2026-06-22",
    readMinutes: 22,
    category: "Internship Strategy",
    tags: [
      "2027 summer internships usa",
      "summer 2027 internships",
      "USA internships",
      "internship search",
      "college students",
      "campus recruiting",
    ],
    Content: Summer2027InternshipsUsaGuide,
  },
  {
    slug: "summer-2027-internship-search-guide",
    title: "Summer 2027 Internship Search Guide",
    description:
      "When to apply for Summer 2027 internships, where to find US roles, track applications from Gmail, get referrals, and prep for interviews.",
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
      "A running list of Summer 2027 internship applications that are live today, finance, tech, consulting, and more, with direct apply links to company career pages.",
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

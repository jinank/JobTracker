"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark } from "@/components/LogoMark";

const links: { href: string; label: string }[] = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/students", label: "Student requests" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/admin" className="flex items-center gap-2 text-slate-900">
          <LogoMark className="h-8 w-8" iconClassName="w-4 h-4" />
          <span className="text-sm font-bold">Rethinkjobs Admin</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-1">
          {links.map(({ href, label }) => {
            const active = pathname === href || (href !== "/admin" && pathname.startsWith(href + "/"));
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
                  active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <Link href="/" className="text-xs font-medium text-slate-500 hover:text-slate-800">
          ← App home
        </Link>
      </div>
    </header>
  );
}

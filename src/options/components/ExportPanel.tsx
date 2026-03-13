import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { getDb } from "@/db/client";
import type { Chain } from "@/types/chain";
import type { AppEvent } from "@/types/event";

interface Row {
  Company: string;
  Role: string;
  Status: string;
  Stage: string;
  "Event Date": string;
  Recruiter: string;
  Deadline: string;
  Links: string;
  Evidence: string;
}

const EVENT_LABEL: Record<string, string> = {
  APPLICATION_RECEIVED: "Applied",
  ASSESSMENT_INVITE: "Assessment",
  INTERVIEW_INVITE: "Interview",
  OFFER: "Offer",
  REJECTION: "Rejected",
  FOLLOW_UP: "Follow-up",
  DEADLINE: "Deadline",
  OTHER: "Other",
};

function fmt(ms: number | null | undefined) {
  if (!ms) return "";
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ExportPanel() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const db = await getDb();
      const chains: Chain[] = await db.getAll("chains");
      const events: AppEvent[] = await db.getAll("events");

      const eventsByChain = new Map<string, AppEvent[]>();
      for (const ev of events) {
        const arr = eventsByChain.get(ev.chain_id) ?? [];
        arr.push(ev);
        eventsByChain.set(ev.chain_id, arr);
      }

      const built: Row[] = [];
      for (const chain of chains) {
        const chainEvents = (eventsByChain.get(chain.chain_id) ?? []).sort(
          (a, b) => a.event_time - b.event_time
        );
        for (const ev of chainEvents) {
          const e = ev.extracted_entities;
          built.push({
            Company: chain.canonical_company,
            Role: chain.role_title,
            Status: chain.status,
            Stage: EVENT_LABEL[ev.event_type] ?? ev.event_type,
            "Event Date": fmt(ev.event_time),
            Recruiter: e.recruiter_name ?? "",
            Deadline: ev.due_at ? fmt(ev.due_at) : e.deadline_raw ?? "",
            Links: (e.links ?? []).join(", "),
            Evidence: ev.evidence.slice(0, 120),
          });
        }
      }

      setRows(built);
      setLoading(false);
    })();
  }, []);

  function downloadExcel() {
    const ws = XLSX.utils.json_to_sheet(rows);

    // Column widths
    ws["!cols"] = [
      { wch: 20 }, // Company
      { wch: 28 }, // Role
      { wch: 14 }, // Status
      { wch: 14 }, // Stage
      { wch: 14 }, // Event Date
      { wch: 18 }, // Recruiter
      { wch: 20 }, // Deadline
      { wch: 40 }, // Links
      { wch: 60 }, // Evidence
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Applications");
    XLSX.writeFile(wb, "glance-ai-applications.xlsx");
  }

  if (loading) {
    return <p className="text-sm text-gray-400">Loading data…</p>;
  }

  if (rows.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No application data yet. Connect Gmail and sync to see your data here.
      </p>
    );
  }

  const columns: (keyof Row)[] = [
    "Company",
    "Role",
    "Status",
    "Stage",
    "Event Date",
    "Recruiter",
    "Deadline",
    "Links",
    "Evidence",
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {rows.length} event{rows.length !== 1 ? "s" : ""} across your applications
        </p>
        <button
          onClick={downloadExcel}
          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download .xlsx
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap">{row.Company}</td>
                <td className="px-3 py-2 text-gray-700 whitespace-nowrap">{row.Role}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <StatusBadge status={row.Status} />
                </td>
                <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{row.Stage}</td>
                <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{row["Event Date"]}</td>
                <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{row.Recruiter}</td>
                <td className="px-3 py-2 text-amber-600 whitespace-nowrap">{row.Deadline}</td>
                <td className="px-3 py-2 max-w-[180px] truncate">
                  {row.Links ? (
                    <a href={row.Links.split(", ")[0]} target="_blank" rel="noreferrer"
                      className="text-blue-500 hover:underline truncate block">
                      {row.Links.split(", ")[0]}
                    </a>
                  ) : null}
                </td>
                <td className="px-3 py-2 text-gray-400 max-w-[260px] truncate" title={row.Evidence}>
                  {row.Evidence}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, string> = {
    OFFER:        "bg-emerald-100 text-emerald-700",
    INTERVIEWING: "bg-blue-100 text-blue-700",
    ASSESSMENT:   "bg-purple-100 text-purple-700",
    APPLIED:      "bg-gray-100 text-gray-600",
    REJECTED:     "bg-red-100 text-red-600",
    GHOSTED:      "bg-yellow-100 text-yellow-700",
    WITHDRAWN:    "bg-orange-100 text-orange-600",
  };
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${cfg[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

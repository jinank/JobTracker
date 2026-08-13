import type { NamedCount } from "@/lib/applicationReport";

export function ReportBarChart({
  title,
  items,
  emptyLabel = "No applications in this range",
  compact = false,
}: {
  title: string;
  items: NamedCount[];
  emptyLabel?: string;
  compact?: boolean;
}) {
  const max = Math.max(1, ...items.map((i) => i.count));
  const hasAny = items.some((i) => i.count > 0);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-slate-900">{title}</h2>
      {!hasAny ? (
        <p className="mt-6 text-sm text-slate-500">{emptyLabel}</p>
      ) : (
        <div
          className={`mt-5 flex items-end gap-1.5 overflow-x-auto pb-1 ${
            compact ? "min-h-[9rem]" : "min-h-[12rem]"
          }`}
        >
          {items.map((item) => {
            const h = Math.max(item.count > 0 ? 8 : 2, Math.round((item.count / max) * (compact ? 96 : 140)));
            return (
              <div
                key={item.key}
                className="flex min-w-[1.6rem] flex-1 flex-col items-center gap-1.5"
                title={`${item.label}: ${item.count}`}
              >
                <span className="text-[10px] font-semibold tabular-nums text-slate-500">
                  {item.count > 0 ? item.count : ""}
                </span>
                <div
                  className="w-full max-w-[2rem] rounded-t-md bg-scale-purple/85"
                  style={{ height: h }}
                />
                <span className="w-full truncate text-center text-[10px] leading-tight text-slate-500">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export function ReportHBarList({
  title,
  items,
  emptyLabel = "Nothing to show yet",
}: {
  title: string;
  items: NamedCount[];
  emptyLabel?: string;
}) {
  const max = Math.max(1, ...items.map((i) => i.count));
  const hasAny = items.some((i) => i.count > 0);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-slate-900">{title}</h2>
      {!hasAny ? (
        <p className="mt-6 text-sm text-slate-500">{emptyLabel}</p>
      ) : (
        <ul className="mt-4 space-y-2.5">
          {items.map((item) => (
            <li key={item.key}>
              <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                <span className="truncate font-medium text-slate-700">{item.label}</span>
                <span className="shrink-0 tabular-nums text-slate-500">{item.count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-scale-purple"
                  style={{ width: `${Math.max(4, (item.count / max) * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

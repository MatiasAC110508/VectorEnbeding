import { ReactNode } from "react";

interface Column<TItem> {
  key: string;
  title: string;
  render: (item: TItem) => ReactNode;
}

interface DataTableProps<TItem> {
  columns: Column<TItem>[];
  items: TItem[];
  emptyState: ReactNode;
  getRowId: (item: TItem) => string;
}

export function DataTable<TItem>({
  columns,
  items,
  emptyState,
  getRowId,
}: DataTableProps<TItem>) {
  if (items.length === 0) {
    return <>{emptyState}</>;
  }

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
      <div className="hidden grid-cols-[1.2fr_1.2fr_0.9fr_0.9fr_0.8fr] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 lg:grid">
        {columns.map((column) => (
          <span key={column.key}>{column.title}</span>
        ))}
      </div>
      <div className="divide-y divide-slate-200">
        {items.map((item) => (
          <div
            key={getRowId(item)}
            className="grid gap-4 px-5 py-5 lg:grid-cols-[1.2fr_1.2fr_0.9fr_0.9fr_0.8fr] lg:items-center"
          >
            {columns.map((column) => (
              <div key={column.key} className="grid gap-1">
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-slate-400 lg:hidden">
                  {column.title}
                </span>
                <div>{column.render(item)}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

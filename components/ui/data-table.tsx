import type { ReactNode } from "react"

/** Large table composition: query controls, data actions, scrollable rows and pagination. */
export function DataTable({ query, actions, children, pagination, loading = false }: {
  query: ReactNode; actions?: ReactNode; children: ReactNode; pagination: ReactNode; loading?: boolean
}) {
  return <div data-slot="data-table" className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">{query}</div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
    <div className="overflow-x-auto" aria-busy={loading}>{children}</div>
    {pagination}
  </div>
}

"use client"

import { Button } from "@/components/ui/button"

export function SegmentedProgress({ count, page, progress, onPageChange, label = "Story pages", getPageLabel = page => `Story ${page}` }: { count: number; page: number; progress: number; onPageChange: (page: number) => void; label?: string; getPageLabel?: (page: number) => string }) {
  const total = Math.max(0, Math.floor(Number.isFinite(count) ? count : 0))
  return <nav aria-label={label} data-slot="segmented-progress" className="flex w-full items-center gap-1">
    {Array.from({length: total}, (_, i) => <Button key={i} variant="ghost" className="h-8 min-w-0 flex-1 rounded-none px-0 hover:bg-transparent" aria-label={getPageLabel(i+1)} aria-current={page===i+1 ? "page" : undefined} onClick={()=>onPageChange(i+1)}>
      <span aria-hidden className="relative h-1 w-full overflow-hidden rounded-full bg-current/30"><span className="absolute inset-y-0 left-0 rounded-full bg-current" style={{width:`${i+1<page ? 100 : i+1===page ? Math.max(0,Math.min(1,Number.isFinite(progress)?progress:0))*100 : 0}%`}} /></span>
    </Button>)}
  </nav>
}

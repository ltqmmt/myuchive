"use client"

import { useEffect, useRef, useState } from "react"
import { Pause, Play, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export type PlaybackPaginationProps = {
  page: number
  count: number
  onPageChange: (page: number) => void
  duration?: number
  autoPlay?: boolean
  label?: string
  playLabel?: string
  pauseLabel?: string
  replayLabel?: string
  getPageLabel?: (page: number) => string
}

/** One-based slideshow navigation. Pausing preserves elapsed playback time. */
export function PlaybackPagination({ page, count, onPageChange, duration = 5000, autoPlay = true, label = "Slideshow pages", playLabel = "Play slideshow", pauseLabel = "Pause slideshow", replayLabel = "Replay slideshow", getPageLabel = page => `Page ${page}` }: PlaybackPaginationProps) {
  const total = Math.max(0, Math.floor(Number.isFinite(count) ? count : 0))
  const current = Math.min(total, Math.max(1, page))
  const interval = Number.isFinite(duration) ? Math.max(250, duration) : 5000
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const elapsed = useRef(0)
  const change = useRef(onPageChange)
  useEffect(() => { change.current = onPageChange }, [onPageChange])
  useEffect(() => { const frame = requestAnimationFrame(() => setPlaying(autoPlay && !window.matchMedia("(prefers-reduced-motion: reduce)").matches)); return () => cancelAnimationFrame(frame) }, [autoPlay])
  useEffect(() => { elapsed.current = 0; const frame = requestAnimationFrame(() => setProgress(0)); return () => cancelAnimationFrame(frame) }, [page, total, interval])
  useEffect(() => {
    if (!playing || total < 2) return
    let frame = 0
    let previous: number | null = null
    let active = true
    const tick = (time: number) => {
      if (!active) return
      if (document.hidden) { previous = null; frame = requestAnimationFrame(tick); return }
      if (previous !== null) elapsed.current += Math.min(time - previous, 100)
      previous = time
      setProgress(Math.min(1, elapsed.current / interval))
      if (elapsed.current >= interval) {
        elapsed.current = 0
        if (current >= total) { elapsed.current = interval; setProgress(1); setPlaying(false) }
        else change.current(current + 1)
        return
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => { active = false; cancelAnimationFrame(frame) }
  }, [playing, current, total, interval])
  const completed = current === total && progress >= 1 && !playing
  if (!total) return null
  return <nav aria-label={label} data-slot="playback-pagination" className="flex max-w-full items-center justify-center gap-2">
    <div className="flex min-w-0 items-center rounded-full bg-muted px-1 py-2" data-corner="continuous">
      {Array.from({ length: total }, (_, i) => <Button key={i} size="icon-xs" variant="ghost" aria-label={getPageLabel(i + 1)} aria-current={current === i + 1 ? "page" : undefined} className={`active:not-disabled:not-aria-disabled:scale-100 transition-[width] duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none ${current === i + 1 ? "w-12" : "w-5"}`} onClick={() => { elapsed.current = 0; setProgress(0); onPageChange(i + 1) }}>
        <span aria-hidden className={`relative h-2 shrink-0 overflow-hidden rounded-full transition-[width,background-color] duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none ${current === i + 1 ? "w-9 bg-foreground/20" : "w-2 bg-foreground/45"}`}><span className="absolute inset-y-0 left-0 rounded-full bg-foreground" style={{width:current === i + 1 ? `${progress * 100}%` : "100%"}} /></span>
      </Button>)}
    </div>
    <Button size="icon" variant="tertiary" data-corner="continuous" disabled={total < 2} aria-label={completed ? replayLabel : playing ? pauseLabel : playLabel} onClick={() => { if (!playing && elapsed.current >= interval && current === total) { elapsed.current = 0; setProgress(0); onPageChange(1) } setPlaying(value => !value) }}>{completed ? <RotateCcw /> : playing ? <Pause className="fill-current" /> : <Play className="fill-current" />}</Button>
  </nav>
}

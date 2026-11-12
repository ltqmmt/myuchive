"use client"

import { Slider as SliderPrimitive } from "radix-ui"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function MediaTimeline({ start, end, position, onRangeChange, onPositionChange }: {
  start: number; end: number; position: number
  onRangeChange: (range: number[]) => void
  onPositionChange: (position: number) => void
}) {
  return <div className="relative h-16 select-none" data-slot="media-timeline">
    <div className="absolute inset-x-4 inset-y-2 overflow-hidden bg-muted">
      <canvas id="timeline-filmstrip" className="h-full w-full" aria-hidden="true" />
      <div className="absolute inset-y-0 left-0 bg-background/65" style={{width: `${start / 10}%`}} />
      <div className="absolute inset-y-0 right-0 bg-background/65" style={{width: `${(1000 - end) / 10}%`}} />
    </div>
    <SliderPrimitive.Root className="absolute inset-x-4 inset-y-0 z-20 flex touch-none items-center overflow-hidden" min={0} max={1000} step={1} value={[Math.max(start, Math.min(end, position))]} onValueChange={([value]) => onPositionChange(Math.max(start, Math.min(end, value)))}>
      <SliderPrimitive.Track className="relative h-full grow"><SliderPrimitive.Range className="hidden" /></SliderPrimitive.Track>
      <SliderPrimitive.Thumb aria-label="현재 재생 위치" className="relative block h-16 w-px cursor-ew-resize outline-none before:absolute before:-inset-x-2 before:inset-y-0 focus-visible:[&>span]:ring-3 focus-visible:[&>span]:ring-ring/50"><span className="absolute inset-y-0 left-0 w-[3px] bg-primary" style={{transform: `translateX(${Math.max(start, Math.min(end, position)) / 1000 - 1.5}px)`}} /></SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
    <SliderPrimitive.Root className="pointer-events-none absolute inset-x-4 inset-y-2 z-30 flex touch-none items-center" min={0} max={1000} step={1} minStepsBetweenThumbs={1} value={[start,end]} onValueChange={onRangeChange}>
      <SliderPrimitive.Track className="relative h-full grow"><SliderPrimitive.Range className="absolute h-full border-y-2 border-primary" /></SliderPrimitive.Track>
      {([['시작 지점', ChevronLeft, 'right-0 rounded-l-sm'], ['끝 지점', ChevronRight, 'left-0 rounded-r-sm']] as const).map(([label, Icon, placement]) => <SliderPrimitive.Thumb key={label} aria-label={label} className="pointer-events-auto relative block h-12 w-px cursor-ew-resize outline-none focus-visible:[&>span]:ring-3 focus-visible:[&>span]:ring-ring/50">
        <span data-slot="media-trim-handle" className={`absolute inset-y-0 flex w-4 items-center justify-center bg-primary text-primary-foreground ${placement}`} style={{transform: `translateX(${label === "시작 지점" ? start / 1000 - 1 : end / 1000}px)`}}><Icon className="size-4" aria-hidden="true" /></span>
      </SliderPrimitive.Thumb>)}
    </SliderPrimitive.Root>
  </div>
}

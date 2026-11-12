"use client"

import { useState } from "react"
import { Popover as PopoverPrimitive } from "radix-ui"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

export function DatePicker({ value, onValueChange, label = "날짜 선택", disabled = false, minDate, className }: {
  value: string; onValueChange: (value: string) => void; label?: string; disabled?: boolean; minDate?: string; className?: string
}) {
  const [open, setOpen] = useState(false)
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T12:00:00`) : undefined
  const selected = date && Number.isFinite(date.getTime()) ? date : undefined
  const display = selected ? `${value.slice(2,4)}.${value.slice(5,7)}.${value.slice(8,10)}` : "날짜 선택"
  return <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
    <PopoverPrimitive.Trigger asChild><Button type="button" variant="outline" shape="field" disabled={disabled} aria-label={label} className={cn("tabular-nums", className)} data-slot="date-picker" data-value={value}>{display}</Button></PopoverPrimitive.Trigger>
    <PopoverPrimitive.Portal><PopoverPrimitive.Content align="start" sideOffset={8} collisionPadding={16} aria-label={label} className="z-50 max-h-[var(--radix-popover-content-available-height)] w-72 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-md">
      <Calendar disabled={minDate ? day => `${day.getFullYear()}-${String(day.getMonth()+1).padStart(2,"0")}-${String(day.getDate()).padStart(2,"0")}` < minDate : undefined} selected={selected} onSelect={next => {
        if (!next) return
        onValueChange(`${next.getFullYear()}-${String(next.getMonth()+1).padStart(2,"0")}-${String(next.getDate()).padStart(2,"0")}`)
        setOpen(false)
      }} />
      <Button type="button" variant="tertiary" className="mt-3 w-full" disabled={!value} onClick={() => { onValueChange(""); setOpen(false) }}>지우기</Button>
    </PopoverPrimitive.Content></PopoverPrimitive.Portal>
  </PopoverPrimitive.Root>
}

"use client"

import { WheelPicker, WheelPickerWrapper } from "@ncdai/react-wheel-picker"
import { Popover as PopoverPrimitive } from "radix-ui"
import { cn } from "cn"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

type TimePickerProps = {
  value: string
  onValueChange: (value: string) => void
  label?: string
  periodLabel?: string
  hourLabel?: string
  minuteLabel?: string
  amLabel?: string
  pmLabel?: string
  isValueDisabled?: (value: string) => boolean
  confirmLabel?: string
  showIcon?: boolean
  disabled?: boolean
  className?: string
  minuteStep?: 1 | 5 | 10 | 15 | 30
}

function TimePicker({
  value,
  onValueChange,
  label = "Time",
  periodLabel = "AM or PM",
  hourLabel = "Hour",
  minuteLabel = "Minute",
  amLabel = "AM",
  pmLabel = "PM",
  minuteStep = 5,
  confirmLabel,
  isValueDisabled,
  showIcon = true,
  disabled = false,
  className,
}: TimePickerProps) {
  const [keyboardNavigation, setKeyboardNavigation] = useState(false)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(value)
  const selectedValue = confirmLabel && open ? draft : value
  const valid = /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(selectedValue) ? selectedValue : "10:00"
  const [hour24, minute] = valid.split(":").map(Number)
  const period = hour24 >= 12 ? "pm" : "am"
  const hour = hour24 % 12 || 12
  const hours = Array.from({ length: 12 }, (_, index) => ({
    value: index + 1,
    label: String(index + 1),
  }))
  const minutes = [
    ...new Set([
      ...Array.from(
        { length: 60 / minuteStep },
        (_, index) => index * minuteStep
      ),
      minute,
    ]),
  ]
    .sort((a, b) => a - b)
    .map((value) => ({ value, label: String(value).padStart(2, "0") }))
  const classNames = {
    optionItem: "text-xl! font-medium text-muted-foreground/30",
    highlightWrapper: "rounded-xl bg-transparent",
    highlightItem: "text-xl! font-medium text-popover-foreground",
  }
  function update(nextPeriod: string, nextHour: number, nextMinute: number) {
    const nextHour24 = (nextHour % 12) + (nextPeriod === "pm" ? 12 : 0)
    const change = confirmLabel ? setDraft : onValueChange
    const next = `${String(nextHour24).padStart(2, "0")}:${String(nextMinute).padStart(2, "0")}`
    if (!confirmLabel && isValueDisabled?.(next)) return
    change(next)
  }
  const display = `${period === "am" ? amLabel : pmLabel} ${hour}:${String(minute).padStart(2, "0")}`
  return (
    <PopoverPrimitive.Root open={open} onOpenChange={next => { setKeyboardNavigation(false); if (next) setDraft(value); setOpen(next) }}>
      <PopoverPrimitive.Trigger asChild>
        <Button
          type="button"
          disabled={disabled}
          data-input-trigger
          variant="outline"
          shape="field"
          className={cn("max-w-full", className)}
          aria-label={`${label}: ${display}`}
        >
          {showIcon && <Clock className="size-5" aria-hidden="true" />}
          {display}
        </Button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          collisionPadding={16}
          sideOffset={8}
          aria-label={label}
          data-slot="time-picker-popover"
          className="z-50 max-h-[min(80svh,var(--radix-popover-content-available-height))] w-[min(320px,calc(100vw-2rem))] origin-(--radix-popover-content-transform-origin) overflow-y-auto rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-md duration-200 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-75 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 motion-reduce:animate-none motion-reduce:duration-0"
        >
          <div
            role="group"
            aria-label={label}
            data-slot="time-picker"
            data-value={valid}
            data-pointer-feedback="none"
            onKeyDownCapture={() => setKeyboardNavigation(true)}
            onPointerDownCapture={() => setKeyboardNavigation(false)}
            className="relative w-full min-w-0 overflow-hidden"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-1/2 h-10 -translate-y-1/2 rounded-xl bg-muted/60"
            />
            <WheelPickerWrapper className={`relative [&_[data-rwp]]:rounded-xl [&_[data-rwp]]:cursor-grab! [&_[data-rwp]]:[mask-image:linear-gradient(to_bottom,transparent_15%,black_32%,black_68%,transparent_85%)]! [&_[data-rwp]]:active:cursor-grabbing! ${keyboardNavigation ? "[&_[data-rwp-focused]]:ring-2 [&_[data-rwp-focused]]:ring-ring/40 [&_[data-rwp-focused]]:ring-inset" : ""}`}>
              <div
                role="group"
                aria-label={periodLabel}
                className="min-w-0 flex-1"
              >
                <WheelPicker
                  options={[
                    { value: "am", label: amLabel },
                    { value: "pm", label: pmLabel },
                  ]}
                  value={period}
                  onValueChange={(next) => update(next, hour, minute)}
                  visibleCount={12}
                  optionItemHeight={40}
                  classNames={classNames}
                />
              </div>
              <div
                role="group"
                aria-label={hourLabel}
                className="min-w-0 flex-1"
              >
                <WheelPicker
                  options={hours}
                  value={hour}
                  onValueChange={(next) => update(period, next, minute)}
                  infinite
                  visibleCount={12}
                  optionItemHeight={40}
                  classNames={classNames}
                />
              </div>
              <div
                role="group"
                aria-label={minuteLabel}
                className="min-w-0 flex-1"
              >
                <WheelPicker
                  options={minutes}
                  value={minute}
                  onValueChange={(next) => update(period, hour, next)}
                  infinite
                  visibleCount={12}
                  optionItemHeight={40}
                  classNames={classNames}
                />
              </div>
            </WheelPickerWrapper>
            <span role="status" className="sr-only">
              {display}
            </span>
          </div>
          {confirmLabel && <Button type="button" className="mt-4 w-full" disabled={isValueDisabled?.(valid)} onClick={() => { if (isValueDisabled?.(valid)) return; onValueChange(valid); setOpen(false) }}>{confirmLabel}</Button>}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

export { TimePicker }
export type { TimePickerProps }

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import styles from "./glass-tabbar.module.css"

export type GlassTabBarItem = { value: string; label: string; icon: React.ReactNode; badge?: number; disabled?: boolean }
export type GlassTabBarProps = {
  items: GlassTabBarItem[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  compact?: boolean
  compactOnScroll?: boolean
  scrollRef?: React.RefObject<HTMLElement | null>
  className?: string
  "aria-label"?: string
}

/** Floating primary navigation. Supply the selected section through value. */
export function GlassTabBar({ items, value, defaultValue, onValueChange, compact, compactOnScroll = true, scrollRef, className, "aria-label": label = "Main navigation" }: GlassTabBarProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? items.find(item => !item.disabled)?.value)
  const [scrolled, setScrolled] = React.useState(false)
  const [dragIndex, setDragIndex] = React.useState<number | null>(null)
  const root = React.useRef<HTMLElement>(null)
  const buttons = React.useRef<(HTMLButtonElement | null)[]>([])
  const pointer = React.useRef<number | null>(null)
  const active = value ?? internalValue
  const index = dragIndex ?? items.findIndex(item => item.value === active)
  const small = compact ?? scrolled

  React.useEffect(() => {
    if (!compactOnScroll || compact !== undefined) return
    const target = scrollRef?.current ?? window
    const scrollTop = () => target instanceof Window ? target.scrollY : target.scrollTop
    let previous = scrollTop()
    const onScroll = () => {
      const next = scrollTop()
      if (Math.abs(next - previous) < 8) return
      setScrolled(next > previous && next > 64)
      previous = next
    }
    target.addEventListener("scroll", onScroll, { passive: true })
    return () => target.removeEventListener("scroll", onScroll)
  }, [compactOnScroll, compact, scrollRef])

  function select(next: number) {
    const item = items[next]
    if (!item || item.disabled) return
    if (value === undefined) setInternalValue(item.value)
    if (item.value !== active) onValueChange?.(item.value)
  }
  function position(clientX: number) {
    const bounds = root.current?.getBoundingClientRect()
    if (!bounds || !items.length) return -1
    return Math.max(0, Math.min(items.length - 1, Math.floor((clientX - bounds.left - 6) / ((bounds.width - 12) / items.length))))
  }
  return <nav ref={root} aria-label={label} className={cn(styles.bar, className)} data-compact={small} data-dragging={dragIndex !== null}
    style={{ "--glass-count": Math.max(1, items.length), "--glass-index": Math.max(0, index) } as React.CSSProperties}
    onPointerDown={event => {
      if (event.button !== 0 || items[position(event.clientX)]?.disabled) return
      pointer.current = event.pointerId
      event.currentTarget.setPointerCapture(event.pointerId)
      setDragIndex(position(event.clientX))
    }}
    onPointerMove={event => { if (pointer.current === event.pointerId) setDragIndex(position(event.clientX)) }}
    onPointerUp={event => {
      if (pointer.current !== event.pointerId) return
      select(position(event.clientX))
      pointer.current = null
      setDragIndex(null)
    }}
    onPointerCancel={() => { pointer.current = null; setDragIndex(null) }}
    onLostPointerCapture={() => { pointer.current = null; setDragIndex(null) }}>
    {index >= 0 && <span aria-hidden="true" className={styles.lens} />}
    {items.map((item, i) => <button key={item.value} ref={node => { buttons.current[i] = node }} type="button"
      className={styles.item} disabled={item.disabled} aria-current={active === item.value ? "page" : undefined}
      aria-label={item.badge ? `${item.label}, ${item.badge}` : item.label}
      onClick={() => select(i)}
      onKeyDown={event => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return
        event.preventDefault()
        const enabled = items.map((item, n) => item.disabled ? -1 : n).filter(n => n >= 0)
        const offset = event.key === "ArrowRight" ? 1 : -1
        const next = event.key === "Home" ? enabled[0] : event.key === "End" ? enabled.at(-1) : enabled[(enabled.indexOf(i) + offset + enabled.length) % enabled.length]
        if (next !== undefined) { buttons.current[next]?.focus(); select(next) }
      }}>
      <span className={styles.icon} aria-hidden="true">{item.icon}{!!item.badge && <span className={styles.badge}>{item.badge > 99 ? "99+" : item.badge}</span>}</span>
      <span className={styles.label}>{item.label}</span>
    </button>)}
  </nav>
}

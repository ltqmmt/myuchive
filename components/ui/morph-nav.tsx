"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ChevronDown, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import styles from "./morph-nav.module.css"

export type MorphNavLink = { label: string; description?: string; href?: string; icon?: React.ReactNode }
export type MorphNavItem = { value: string; label: string; href?: string; links?: MorphNavLink[] }
export type MorphNavProps = {
  brand?: { name: string; mark?: React.ReactNode; href?: string }
  items: MorphNavItem[]
  current?: string
  compact?: boolean
  panelMode?: "expanded" | "popover"
  search?: { label?: string; placeholder?: string; emptyLabel?: string; items: MorphNavLink[] }
  trailing?: React.ReactNode
  action?: { label: string; href?: string; onClick?: () => void }
  onNavigate?: (destination: MorphNavLink) => void
  label?: string
  menuLabel?: string
  closeLabel?: string
  className?: string
}

export function MorphNav({ brand, items, current, compact = false, panelMode = "expanded", search, action, trailing, onNavigate, label = "Main navigation", menuLabel = "Menu", closeLabel = "Close", className }: MorphNavProps) {
  const [open, setOpen] = React.useState<string | null>(null)
  const [query, setQuery] = React.useState("")
  const [narrow, setNarrow] = React.useState(false)
  const root = React.useRef<HTMLElement>(null)
  const trigger = React.useRef<HTMLElement | null>(null)
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const id = React.useId()
  const reduce = useReducedMotion()
  const searchOpen = open === "$search"
  const popover = panelMode === "popover"
  const [panelBounds, setPanelBounds] = React.useState({ left: 16, width: 320 })
  const selected = items.find(item => item.value === open)
  const linkCount = searchOpen ? (search?.items.length ?? 0) : open === "$menu" ? items.reduce((count, item) => count + (item.links?.length ?? 1), 0) : (selected?.links?.length ?? 0)
  const panelColumns = narrow || linkCount <= 2 ? 1 : 2
  React.useLayoutEffect(() => {
    const nav = root.current
    if (!popover || !open || !nav) return
    function positionPanel() {
      if (!nav) return
      const rect = nav.getBoundingClientRect()
      const scale = rect.width / nav.offsetWidth || 1
      const width = Math.max(0, Math.min(panelColumns === 1 ? 320 : 560, nav.clientWidth - 32))
      const anchor = trigger.current
      const start = searchOpen ? nav.clientWidth - width - 16 : anchor?.isConnected ? (anchor.getBoundingClientRect().left - rect.left) / scale : 16
      const left = Math.max(16, Math.min(start, nav.clientWidth - width - 16))
      setPanelBounds(previous => previous.left === left && previous.width === width ? previous : { left, width })
    }
    positionPanel()
    const observer = new ResizeObserver(positionPanel)
    observer.observe(nav)
    return () => observer.disconnect()
  }, [popover, open, searchOpen, panelColumns])
  const results = search?.items.filter(item => `${item.label} ${item.description ?? ""}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())).slice(0, 6) ?? []
  function clearTimer() { if (timer.current) clearTimeout(timer.current) }
  function close(restore = false) { clearTimer(); setOpen(null); if (restore) requestAnimationFrame(() => { if (trigger.current?.isConnected) trigger.current.focus(); else root.current?.querySelector<HTMLElement>("[data-morph-search]")?.focus() }) }
  function show(value: string, element?: HTMLElement) { clearTimer(); if (element) trigger.current = element; setOpen(value) }
  React.useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setNarrow(entry.contentRect.width < 600))
    if (root.current) observer.observe(root.current)
    return () => observer.disconnect()
  }, [])
  React.useEffect(() => {
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(null) }
    document.addEventListener("pointerdown", outside)
    return () => { document.removeEventListener("pointerdown", outside); clearTimer() }
  }, [])
  function destination(item: MorphNavLink) { close(); onNavigate?.(item) }
  function link(item: MorphNavLink, key: string) {
    const content = <>{item.icon && <span className={styles.linkIcon} aria-hidden="true">{item.icon}</span>}<span><span className={styles.linkLabel}>{item.label}</span>{item.description && <span className={styles.description}>{item.description}</span>}</span></>
    return item.href ? <a key={key} className={styles.link} href={item.href} onClick={event => { if (onNavigate) event.preventDefault(); destination(item) }}>{content}</a> : <button key={key} type="button" className={styles.link} onClick={() => destination(item)}>{content}</button>
  }
  const transition = { duration: reduce ? 0 : .28, ease: [.22, 1, .36, 1] as const }
  return <nav ref={root} aria-label={label} className={cn(styles.root, className)} data-compact={compact} data-narrow={narrow} data-panel-mode={panelMode}
    onPointerEnter={clearTimer} onPointerLeave={event => { if (event.pointerType === "mouse") { clearTimer(); timer.current = setTimeout(() => setOpen(null), 280) } }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) close() }}
    onKeyDown={event => {
      if (event.key === "Escape") { event.preventDefault(); close(true) }
      if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key) && (event.target as HTMLElement).closest(`.${styles.panel}`)) {
        const focusable = Array.from(root.current?.querySelectorAll<HTMLElement>(`.${styles.panel} a, .${styles.panel} button`) ?? [])
        const index = focusable.indexOf(event.target as HTMLElement)
        if (!focusable.length) return
        event.preventDefault()
        const next = event.key === "Home" ? 0 : event.key === "End" ? focusable.length - 1 : (index + (event.key === "ArrowUp" ? -1 : 1) + focusable.length) % focusable.length
        focusable[next]?.focus()
      }
    }}>
    <div className={styles.surface}>
      <div className={styles.bar}>
        {searchOpen && search ? <div className={styles.searchRow}>
          <Search aria-hidden="true" className="size-4 shrink-0" />
          <Input autoFocus aria-label={search.label ?? "Search"} placeholder={search.placeholder ?? "Search"} value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => { if (event.key === "ArrowDown") { event.preventDefault(); root.current?.querySelector<HTMLElement>(`.${styles.panel} a, .${styles.panel} button`)?.focus() } }} />
          <Button variant="ghost" size="icon" aria-label={closeLabel} onClick={() => close(true)}><X /></Button>
        </div> : <>
          {brand && <a className={styles.brand} href={brand.href ?? "#"} aria-label={brand.name} onClick={event => { if (onNavigate || !brand.href) event.preventDefault(); destination({ label: brand.name, href: brand.href }) }}>{brand.mark && <span aria-hidden="true">{brand.mark}</span>}<span className={styles.brandName}>{brand.name}</span></a>}
          <div className={styles.items}>
            {items.map((item, i) => <div key={item.value} className={styles.triggerWrap}>
              {(open === item.value || (!open && current === item.value)) && <motion.span layoutId={`${id}-highlight`} transition={transition} className={styles.highlight} />}
              {item.links ? <button type="button" className={styles.trigger} id={`${id}-trigger-${i}`} aria-expanded={open === item.value} aria-controls={`${id}-panel`} onClick={event => open === item.value ? close() : show(item.value, event.currentTarget)} onPointerEnter={event => { if (event.pointerType === "mouse") { clearTimer(); const target = event.currentTarget; timer.current = setTimeout(() => show(item.value, target), 60) } }} onKeyDown={event => {
                if (event.key === "ArrowDown") { event.preventDefault(); show(item.value, event.currentTarget); requestAnimationFrame(() => root.current?.querySelector<HTMLElement>(`.${styles.panel} a, .${styles.panel} button`)?.focus()) }
              }}>{item.label}<ChevronDown aria-hidden="true" className="text-icon" /></button> : <a className={styles.trigger} href={item.href ?? "#"} aria-current={current === item.value ? "page" : undefined} onClick={event => { if (onNavigate || !item.href) event.preventDefault(); destination(item) }}>{item.label}</a>}
            </div>)}
          </div>
          <button type="button" className={cn(styles.trigger, styles.mobileMenu)} aria-expanded={open === "$menu"} aria-controls={`${id}-panel`} onClick={event => open === "$menu" ? close() : show("$menu", event.currentTarget)}>{menuLabel}<ChevronDown aria-hidden="true" className="text-icon" /></button>
          <div className={styles.actions}>
            {trailing}
            {search && <Button variant="tertiary" size="icon" data-morph-search aria-label={search.label ?? "Search"} onClick={event => { setQuery(""); show("$search", event.currentTarget) }}><Search /></Button>}
            {action && <Button onClick={() => { close(); action.onClick?.(); if (!action.onClick && !action.href) onNavigate?.({ label: action.label }) }} asChild={!!action.href}>{action.href ? <a href={action.href} onClick={event => { if (onNavigate) { event.preventDefault(); destination(action) } }}>{action.label}</a> : action.label}</Button>}
          </div>
        </>}
      </div>
      <AnimatePresence initial={false} mode="wait">
        {open && <motion.div key="panel" id={`${id}-panel`} className={styles.panel} data-columns={panelColumns} style={popover ? panelBounds : undefined} role="region" aria-label={searchOpen ? search?.label ?? "Search" : selected?.label ?? menuLabel} initial={popover ? { opacity: 0, y: reduce ? 0 : -4 } : { height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0 }} animate={popover ? { opacity: 1, y: 0 } : { height: "auto", opacity: 1, paddingTop: 12, paddingBottom: 4 }} exit={popover ? { opacity: 0, y: reduce ? 0 : -4 } : { height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0 }} transition={popover ? transition : { height: { duration: reduce ? 0 : .36, ease: [.22, 1, .36, 1] }, paddingTop: { duration: reduce ? 0 : .36 }, paddingBottom: { duration: reduce ? 0 : .36 }, opacity: { duration: reduce ? 0 : .24 } }}>
          <motion.div key={open} initial={{ opacity: 0, filter: reduce ? "blur(0px)" : "blur(6px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{ duration: reduce ? .08 : .3, ease: [.22, 1, .36, 1] }} className={styles.grid} style={{ minHeight: !popover && !searchOpen && !narrow ? Math.ceil(Math.max(0, ...items.map(item => item.links?.length ?? 0)) / 2) * 84 : undefined }}>
            {searchOpen ? results.map((item, i) => link(item, String(i))) : open === "$menu" ? items.flatMap(item => item.links ? item.links.map((entry, i) => link(entry, `${item.value}-${i}`)) : [link(item, item.value)]) : selected?.links?.map((item, i) => link(item, String(i)))}
          </motion.div>
          {searchOpen && !results.length && <p className="px-3 py-4 text-base text-muted-foreground" role="status">{search?.emptyLabel ?? "No results"}</p>}
        </motion.div>}
      </AnimatePresence>
    </div>
  </nav>
}

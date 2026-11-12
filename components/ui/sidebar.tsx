"use client"

import * as React from "react"
import { PanelLeftOpen, PanelLeftClose, ChevronFirst, ChevronLast } from "lucide-react"
import { Slot } from "radix-ui"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"

type SidebarState = { collapsed: boolean; previewing: boolean; setCollapsed: (collapsed: boolean) => void; expandOnHover: boolean; setHovered: (hovered: boolean) => void; compact: boolean; mobileOpen: boolean; setMobileOpen: (open: boolean) => void; toggle: () => void; id: string }
const SidebarContext = React.createContext<SidebarState | null>(null)
export function useSidebar() { const value = React.useContext(SidebarContext); if (!value) throw new Error("SidebarProvider is required"); return value }
export function SidebarProvider({ children, className, compactMode = "sheet", expandOnHover = false, storageKey, ...props }: React.ComponentProps<"div"> & { compactMode?: "sheet" | "rail" | "static"; expandOnHover?: boolean; storageKey?: string }) {
  const root = React.useRef<HTMLDivElement>(null)
  const [collapsed, updateCollapsed] = React.useState(false)
  const setCollapsed = (value: boolean) => {
    updateCollapsed(value)
    try { if (storageKey) window.localStorage.setItem(storageKey, String(value)) } catch {}
  }
  React.useEffect(() => {
    if (!storageKey) return
    try {
      const saved = window.localStorage.getItem(storageKey)
      if (saved === "true" || saved === "false") updateCollapsed(saved === "true")
    } catch {}
  }, [storageKey])
  const [hovered, setHovered] = React.useState(false)
  const [compact, setCompact] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const id = React.useId()
  React.useEffect(() => {
    if (!root.current) return
    let wasNarrow: boolean | undefined
    const observer = new ResizeObserver(entries => {
      const narrow = entries[0].contentRect.width < 720
      setCompact(narrow && compactMode === "sheet")
      if (compactMode === "rail" && narrow && !wasNarrow) updateCollapsed(true)
      wasNarrow = narrow
    })
    observer.observe(root.current)
    return () => observer.disconnect()
  }, [compactMode])
  const previewing = collapsed && expandOnHover && hovered
  const visibleCollapsed = collapsed && !previewing
  const toggle = () => {
    if (compact) setMobileOpen(value => !value)
    else {
      setHovered(false)
      setCollapsed(!collapsed)
    }
  }
  return <SidebarContext.Provider value={{ collapsed: visibleCollapsed, previewing, setCollapsed, expandOnHover, setHovered, compact, mobileOpen, setMobileOpen, toggle, id }}><div {...props} ref={root} data-slot="sidebar-provider" className={cn("relative flex min-h-[560px] w-full min-w-0 overflow-hidden rounded-xl border bg-background", className)} onKeyDown={event => { props.onKeyDown?.(event); if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b") { event.preventDefault(); toggle() } }}>{children}</div></SidebarContext.Provider>
}
export function Sidebar({ children, label = "Navigation", className }: { children: React.ReactNode; label?: string; className?: string }) {
  const { compact, mobileOpen, setMobileOpen, collapsed, previewing, setHovered, expandOnHover, id } = useSidebar()
  if (compact) return <Sheet open={mobileOpen} onOpenChange={setMobileOpen}><SheetContent id={id} side="left" className="w-64 gap-0 p-0"><SheetHeader className="sr-only"><SheetTitle>{label}</SheetTitle><SheetDescription>{label}</SheetDescription></SheetHeader><nav aria-label={label} className={cn("flex h-full flex-col bg-background pt-12 text-foreground", className)}>{children}</nav></SheetContent></Sheet>
  const navigation = <nav id={id} aria-label={label} data-slot="sidebar" data-collapsed={collapsed || undefined} onPointerEnter={event => { if (expandOnHover && event.pointerType === "mouse" && collapsed) setHovered(true) }} onPointerLeave={() => setHovered(false)} className={cn("group/sidebar flex shrink-0 flex-col border-r border-sidebar-border bg-background text-sidebar-foreground transition-[width] duration-200 ease-out motion-reduce:transition-none", collapsed ? "w-16" : "w-60", className, expandOnHover && "relative z-30 overflow-hidden")}>{children}</nav>
  return expandOnHover ? <div data-slot="sidebar-rail" className={cn("sticky top-0 z-30 shrink-0 self-start", collapsed || previewing ? "w-16" : "w-60")}>{navigation}</div> : navigation
}
export function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) { return <div data-slot="sidebar-header" className={cn("flex min-h-16 shrink-0 items-center gap-2 p-3", className)} {...props} /> }
export function SidebarContent({ className, ...props }: React.ComponentProps<"div">) { return <div data-slot="sidebar-content" className={cn("min-h-0 flex-1 space-y-5 overflow-x-hidden overflow-y-auto p-2", className)} {...props} /> }
export function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) { return <div data-slot="sidebar-footer" className={cn("mt-auto shrink-0 border-t border-sidebar-border p-3", className)} {...props} /> }
export function SidebarGroup({ label, children }: { label: string; children: React.ReactNode }) { const { collapsed, compact, expandOnHover } = useSidebar(); const hidden = collapsed && !compact; return <div role="group" aria-label={label} className="space-y-1">{(!hidden || expandOnHover) && <p aria-hidden={hidden || undefined} className={cn("px-3 py-2 text-[13px] font-medium whitespace-nowrap text-muted-foreground transition-opacity duration-150 motion-reduce:transition-none", hidden && "opacity-0")}>{label}</p>}<div className="space-y-1">{children}</div></div> }
export function SidebarMenuButton({ active, icon: Icon, children, className, onClick, label, asChild = false, expandOnSelect = true, ...props }: React.ComponentProps<"button"> & { active?: boolean; icon?: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>; label: string; asChild?: boolean; expandOnSelect?: boolean }) {
  const { collapsed, compact, setMobileOpen, setCollapsed, expandOnHover } = useSidebar()
  const iconOnly = collapsed && !compact
  const Control = asChild ? Slot.Root : "button"
  const content = <>{Icon && <Icon className="text-icon shrink-0" aria-hidden={true} />}{(!iconOnly || expandOnHover) && <span aria-hidden={iconOnly || undefined} className={cn("flex min-w-0 flex-1 items-center justify-between gap-2 truncate whitespace-nowrap transition-opacity duration-150 motion-reduce:transition-none", iconOnly && "opacity-0")}>{asChild ? label : children ?? label}</span>}</>
  const control = <Control {...props} type={asChild ? undefined : "button"} data-slot="sidebar-menu-button" data-active={active || undefined} aria-current={active ? "page" : undefined} aria-label={iconOnly ? label : undefined} className={cn("flex h-9 w-full min-w-0 items-center gap-2 rounded-lg px-3 text-left text-base outline-none transition-colors hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50", active && "bg-sidebar-accent font-medium text-sidebar-accent-foreground", expandOnHover ? "px-4" : iconOnly && "justify-center px-0", className)} onClick={event => { onClick?.(event); if (expandOnHover && expandOnSelect) setCollapsed(false); if (compact && props['aria-expanded'] === undefined) setMobileOpen(false) }}>
    {asChild ? React.cloneElement(React.Children.only(children) as React.ReactElement<{ children?: React.ReactNode }>, undefined, content) : content}
  </Control>
  return iconOnly && !expandOnHover ? <Tooltip><TooltipTrigger asChild>{control}</TooltipTrigger><TooltipContent side="right">{label}</TooltipContent></Tooltip> : control
}
export function SidebarTrigger({ label = "Toggle sidebar", appearance = "default", icon: CustomIcon }: { label?: string; appearance?: "default" | "plain"; icon?: React.ComponentType<{ "aria-hidden"?: boolean }> }) { const { toggle, collapsed, previewing, compact, mobileOpen, id } = useSidebar(); const isOpen = compact ? mobileOpen : !collapsed && !previewing; const Icon = CustomIcon ?? (appearance === "plain" ? (isOpen ? ChevronFirst : ChevronLast) : (isOpen ? PanelLeftClose : PanelLeftOpen)); return <Tooltip><TooltipTrigger asChild><Button type="button" variant={appearance === "plain" ? "link" : "tertiary"} size="icon-sm" className={appearance === "plain" ? "text-muted-foreground hover:text-foreground" : undefined} aria-label={label} aria-controls={id} aria-expanded={compact ? mobileOpen : !collapsed} onClick={toggle}><Icon aria-hidden={true} /></Button></TooltipTrigger><TooltipContent className="hidden md:block">{label}</TooltipContent></Tooltip> }

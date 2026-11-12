"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"
import { ArrowLeft, Check, LoaderCircle, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import styles from "./action-morph.module.css"

export type ActionMorphAction = {
  id: string
  label: string
  description?: string
  icon: React.ReactNode
  shortcut?: string
  composer: {
    title: string
    placeholder?: string
    multiline?: boolean
    choices?: { label: string; options: string[] }
    submitLabel: string
    emptyHint?: string
  }
}
export type ActionMorphSubmission = { action: string; text: string; choice?: string }
export type ActionMorphProps = {
  actions: ActionMorphAction[]
  expansionOnly?: boolean
  label?: string
  closeLabel?: string
  backLabel?: string
  errorLabel?: string
  emptyLabel?: string
  corner?: "start" | "end"
  resetAfter?: number
  onSubmit: (submission: ActionMorphSubmission) => void | Promise<unknown>
  className?: string
}

type Draft = { text: string; choice?: string }
export function ActionMorph({ actions, expansionOnly = false, label = "Create", closeLabel = "Close", backLabel = "Back", errorLabel = "Could not save. Try again.", emptyLabel = "Enter some text.", corner = "end", resetAfter = 1200, onSubmit, className }: ActionMorphProps) {
  const [face, setFace] = React.useState<"closed" | "menu" | "composer" | "success">("closed")
  const [actionId, setActionId] = React.useState<string>()
  const [drafts, setDrafts] = React.useState<Record<string, Draft>>({})
  const [pending, setPending] = React.useState(false)
  const [error, setError] = React.useState<string>()
  const root = React.useRef<HTMLDivElement>(null)
  const content = React.useRef<HTMLDivElement>(null)
  const [size, setSize] = React.useState({ width: 56, height: 56 })
  const folded = face === "closed" || face === "success"
  const busy = React.useRef(false)
  const mounted = React.useRef(true)
  const restore = React.useRef(false)
  const id = React.useId()
  const reduce = useReducedMotion()
  const action = actions.find(item => item.id === actionId)
  const draft = drafts[actionId ?? ""] ?? { text: "", choice: action?.composer.choices?.options[0] }
  React.useLayoutEffect(() => {
    const element = content.current
    if (!element) return
    const measure = () => setSize({ width: element.offsetWidth, height: element.offsetHeight })
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [face, actionId])
  React.useEffect(() => { mounted.current = true; return () => { mounted.current = false } }, [])
  React.useEffect(() => {
    if (face === "success") {
      const timer = setTimeout(() => setFace("closed"), Math.max(0, resetAfter))
      return () => clearTimeout(timer)
    }
  }, [face, resetAfter])
  function close() { if (busy.current) return; setError(undefined); restore.current = true; setFace("closed") }
  function focusFace() {
    if (face === "composer") root.current?.querySelector<HTMLElement>("input, textarea")?.focus()
    else if (face === "menu") root.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus()
    else if (face === "closed" && restore.current) { root.current?.querySelector<HTMLElement>("[data-action-morph-trigger]")?.focus(); restore.current = false }
  }
  React.useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (root.current?.contains(event.target as Node) || busy.current) return
      setError(undefined); setFace("closed")
    }
    document.addEventListener("pointerdown", outside)
    return () => document.removeEventListener("pointerdown", outside)
  }, [])
  function choose(item: ActionMorphAction) { if (expansionOnly) return; setActionId(item.id); setError(undefined); setFace("composer") }
  function update(patch: Partial<Draft>) { if (actionId) setDrafts(previous => ({ ...previous, [actionId]: { ...draft, ...patch } })); setError(undefined) }
  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!action || busy.current) return
    const text = draft.text.trim()
    if (!text) { setError(action.composer.emptyHint ?? emptyLabel); root.current?.querySelector<HTMLElement>("input, textarea")?.focus(); return }
    busy.current = true; setPending(true); setError(undefined)
    try {
      await onSubmit({ action: action.id, text, choice: draft.choice })
      if (!mounted.current) return
      setDrafts(previous => ({ ...previous, [action.id]: { text: "", choice: action.composer.choices?.options[0] } }))
      restore.current = true; setFace("success")
    } catch { if (mounted.current) setError(errorLabel) }
    finally { busy.current = false; if (mounted.current) setPending(false) }
  }
  return <div ref={root} className={cn(styles.root, className)} data-corner={corner}
    onKeyDown={event => {
      if (event.key === "Escape" && !pending) { event.preventDefault(); if (face === "composer") { setError(undefined); setFace("menu") } else close() }
      if (face !== "menu") return
      const buttons = Array.from(root.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])
      const index = buttons.indexOf(event.target as HTMLElement)
      if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
        event.preventDefault()
        const next = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : (index + (event.key === "ArrowUp" ? -1 : 1) + buttons.length) % buttons.length
        buttons[next]?.focus()
      } else { const match = actions.find(item => item.shortcut?.toLowerCase() === event.key.toLowerCase()); if (match && !event.ctrlKey && !event.metaKey && !event.altKey) { event.preventDefault(); choose(match) } }
    }}>
    <motion.div className={styles.surface} data-face={face} initial={false}
      animate={{ width: size.width, height: size.height, borderRadius: folded ? 28 : 24, backgroundColor: folded ? "var(--primary)" : "var(--background)" }}
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 340, damping: 32, mass: .8 }}>
        <motion.div ref={content} className={styles.content} key={face === "composer" ? actionId : face} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduce ? 0 : .18, delay: reduce || folded ? 0 : .12 }} onAnimationComplete={focusFace}>
          {face === "closed" || face === "success" ? <Button className={styles.trigger} data-action-morph-trigger size="icon-lg" aria-label={label} aria-haspopup="menu" aria-expanded={false} onClick={() => setFace("menu")} disabled={face === "success"}>
            {face === "success" ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}
          </Button> : face === "menu" ? <div className={styles.menuFace}>
            <div className={styles.header}><span id={`${id}-title`}>{label}</span><Button variant="ghost" size="icon" aria-label={closeLabel} onClick={close}><X /></Button></div>
            <div role="menu" aria-labelledby={`${id}-title`}>
              {actions.map(item => <button key={item.id} type="button" role="menuitem" aria-disabled={expansionOnly || undefined} className={styles.item} aria-keyshortcuts={item.shortcut} onClick={() => choose(item)}>
                <span className={styles.icon} aria-hidden="true">{item.icon}</span><span className="min-w-0 flex-1"><span className={styles.itemLabel}>{item.label}</span>{item.description && <span className={styles.description}>{item.description}</span>}</span>
                {item.shortcut && <kbd aria-hidden="true" className={styles.shortcut}>{item.shortcut.toUpperCase()}</kbd>}
              </button>)}
            </div>
          </div> : action && <form className={styles.composer} aria-labelledby={`${id}-title`} aria-busy={pending} onSubmit={submit}>
            <div className={styles.header}><Button type="button" variant="tertiary" size="icon" disabled={pending} aria-label={backLabel} onClick={() => { setError(undefined); setFace("menu") }}><ArrowLeft /></Button><span id={`${id}-title`} className="flex-1">{action.composer.title}</span><Button type="button" variant="ghost" size="icon" disabled={pending} aria-label={closeLabel} onClick={close}><X /></Button></div>
            <div className="space-y-4 p-3">
              {action.composer.multiline ? <Textarea aria-label={action.composer.title} placeholder={action.composer.placeholder} value={draft.text} disabled={pending} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} onChange={event => update({ text: event.target.value })} onKeyDown={event => { if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) { event.preventDefault(); event.currentTarget.form?.requestSubmit() } }} /> : <Input aria-label={action.composer.title} placeholder={action.composer.placeholder} value={draft.text} disabled={pending} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} onChange={event => update({ text: event.target.value })} />}
              {action.composer.choices && <Tabs value={draft.choice} onValueChange={choice => update({ choice })}><TabsList aria-label={action.composer.choices.label}>{action.composer.choices.options.map(option => <TabsTrigger key={option} value={option} disabled={pending}>{option}</TabsTrigger>)}</TabsList></Tabs>}
              {error && <p id={`${id}-error`} role="alert" className="text-base text-destructive">{error}</p>}
              <div className="flex justify-end"><Button type="submit" disabled={pending}>{pending && <LoaderCircle aria-hidden="true" className="animate-spin motion-reduce:animate-none" />}{action.composer.submitLabel}</Button></div>
            </div>
          </form>}
        </motion.div>
    </motion.div>
  </div>
}

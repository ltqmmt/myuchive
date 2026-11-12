"use client"

import { useEffect } from "react"
import { createPortal } from "react-dom"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Toast({ message, onDismiss, duration = 3000 }: { message: string; onDismiss: () => void; duration?: number }) {
  useEffect(() => {
    if (!message) return
    const timer = window.setTimeout(onDismiss, duration)
    return () => window.clearTimeout(timer)
  }, [message, onDismiss, duration])
  if (!message) return null
  return createPortal(<div role="status" aria-live="polite" data-corner="round" className="dark fixed bottom-6 left-1/2 z-50 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-3 rounded-full bg-black py-3 pr-2 pl-5 text-base text-white shadow-lg">
    <Check className="size-5 shrink-0 text-positive" aria-hidden="true" /><span>{message}</span>
    <Button type="button" variant="tertiary" size="icon-xs" className="shrink-0 bg-transparent text-white hover:bg-white/10 dark:bg-transparent dark:text-white" aria-label="닫기" onClick={onDismiss}><X /></Button>
  </div>, document.body)
}

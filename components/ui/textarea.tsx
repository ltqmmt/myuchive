import * as React from "react"
import { cn } from "@/lib/utils"

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea data-slot="textarea" className={cn("min-h-24 w-full min-w-0 rounded-xl border border-input bg-transparent px-[calc(.625rem+4pt)] py-[4pt] text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-transparent dark:disabled:bg-transparent dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 resize-y", className)} {...props} />
}

"use client"

import * as React from "react"
import { cn } from "cn"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { CheckIcon } from "lucide-react"

function SelectionLabel({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="selection-label"
      className={cn(
        "relative isolate flex min-h-10 cursor-pointer items-center gap-2 rounded-xl px-[var(--selection-label-padding-inline,0.75rem)] py-2 text-base transition-transform duration-150 before:pointer-events-none before:absolute before:inset-y-0 before:inset-x-[min(0px,calc(var(--selection-label-padding-inline,0.75rem)-0.75rem))] before:-z-10 before:rounded-[inherit] before:content-[''] before:transition-colors before:duration-150 hover:before:bg-foreground/5 active:scale-[0.98] active:before:bg-foreground/5 has-disabled:cursor-not-allowed has-disabled:hover:before:bg-transparent has-disabled:active:before:bg-transparent has-disabled:active:scale-100 motion-reduce:transition-none motion-reduce:before:transition-none motion-reduce:active:scale-100 [&>button]:after:hidden [&>button]:active:scale-100",
        className
      )}
      {...props}
    />
  )
}

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-[6px] border border-foreground/25 bg-transparent transition-colors outline-none after:absolute after:-inset-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 data-checked:border-[var(--button-primary,var(--primary))] data-checked:bg-[var(--button-primary,var(--primary))] data-checked:text-[var(--button-primary-foreground,var(--primary-foreground))] motion-reduce:transition-none",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-4"
      >
        <CheckIcon strokeWidth={2} aria-hidden="true" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox, SelectionLabel }

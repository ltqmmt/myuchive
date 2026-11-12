"use client"
import * as React from "react"
import { Accordion as Primitive } from "radix-ui"
import { ChevronDown } from "lucide-react"
import { cn } from "cn"
import styles from "./accordion.module.css"
export const Accordion = Primitive.Root
export const AccordionItem = Primitive.Item
export function AccordionTrigger({className,children,...props}:React.ComponentProps<typeof Primitive.Trigger>) {
  return <Primitive.Header><Primitive.Trigger className={cn("group/accordion flex min-h-10 w-full items-center justify-between gap-4 rounded-lg px-2 py-4 text-left text-base font-medium outline-none hover:bg-tab-muted focus-visible:ring-2 focus-visible:ring-ring",className)} {...props}>{children}<ChevronDown aria-hidden className="size-4 shrink-0 transition-transform duration-400 ease-[cubic-bezier(.22,1,.36,1)] group-data-[state=open]/accordion:rotate-180 motion-reduce:transition-none" /></Primitive.Trigger></Primitive.Header>
}
export function AccordionContent({className,children,...props}:React.ComponentProps<typeof Primitive.Content>) {
  return <Primitive.Content className={styles.content} {...props}><div className={cn("px-2 pb-5 text-base leading-relaxed text-muted-foreground",className)}>{children}</div></Primitive.Content>
}

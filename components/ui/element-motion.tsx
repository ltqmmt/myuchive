"use client"

import { useRef, type ReactNode } from "react"
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  type TargetAndTransition,
} from "motion/react"
import { cn } from "cn"

export type ElementMotionVariant =
  "fade" | "slide" | "scale" | "pop" | "mask" | "blur" | "bounce"

export const dataInspectionMotion = {
  dimmedOpacity: 0.28,
  feedbackDuration: 0.14,
  enterDuration: 0.18,
  exitDuration: 0.10,
  enterDistance: 4,
  rowStagger: 0.018,
  maxStagger: 0.18,
  spring: { type: "spring", stiffness: 500, damping: 40, mass: 0.7 },
} as const

export function dataInspectionOpacity(active: readonly [number, number] | null, row: number, column: number) {
  return !active || active[0] === row || active[1] === column ? 1 : dataInspectionMotion.dimmedOpacity
}

export function dataInspectionDelay(index: number, reduced = false) {
  return reduced ? 0 : Math.min(Math.max(0, index) * dataInspectionMotion.rowStagger, dataInspectionMotion.maxStagger)
}

export function dataInspectionPosition(
  anchor: { x: number; y: number; width: number; height: number },
  bounds: { width: number; height: number },
  panel = { width: 208, height: 148 }
) {
  const gap = 12, inset = 8
  const clamp = (value: number, extent: number, size: number) => Math.max(inset, Math.min(value, extent - size - inset))
  const right = anchor.x + anchor.width + gap
  return {
    x: clamp(right + panel.width <= bounds.width - inset ? right : anchor.x - panel.width - gap, bounds.width, panel.width),
    y: clamp(anchor.y + anchor.height / 2 - panel.height / 2, bounds.height, panel.height),
  }
}

export function DataInspectionPanel({ id, point, width = 208, children }: {
  id: string; point: { x: number; y: number }; width?: number; children: ReactNode
}) {
  const reduced = useReducedMotion()
  return <motion.div
    id={id}
    role="tooltip"
    data-slot="data-inspection-panel"
    className="pointer-events-none absolute left-0 top-0 z-20 h-[148px] overflow-hidden rounded-xl border bg-popover p-3 text-sm text-popover-foreground shadow-sm"
    style={{ width, willChange: reduced ? undefined : "transform" }}
    initial={reduced ? false : { x: point.x, y: point.y + dataInspectionMotion.enterDistance, opacity: 0 }}
    animate={{ x: point.x, y: point.y, opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: reduced ? 0 : dataInspectionMotion.exitDuration } }}
    transition={reduced ? { duration: 0 } : {
      x: dataInspectionMotion.spring, y: dataInspectionMotion.spring,
      opacity: { duration: dataInspectionMotion.enterDuration },
    }}
  >{children}</motion.div>
}

export function elementMotionStates(
  variant: ElementMotionVariant,
  reduced = false
) {
  const opacity = { opacity: 0 }
  const visible = { opacity: 1 }
  const states: Record<
    ElementMotionVariant,
    {
      initial: TargetAndTransition
      animate: TargetAndTransition
      exit: TargetAndTransition
    }
  > = {
    fade: { initial: opacity, animate: visible, exit: opacity },
    slide: {
      initial: { ...opacity, x: 56 },
      animate: { ...visible, x: 0 },
      exit: { ...opacity, x: -56 },
    },
    scale: {
      initial: { ...opacity, scale: 0.65 },
      animate: { ...visible, scale: 1 },
      exit: { ...opacity, scale: 0.65 },
    },
    pop: {
      initial: { ...opacity, scale: 0.6 },
      animate: { ...visible, scale: [0.6, 1.12, 1] },
      exit: { ...opacity, scale: 0.8 },
    },
    mask: {
      initial: { clipPath: "inset(0 100% 0 0)" },
      animate: { clipPath: "inset(0 0% 0 0)" },
      exit: { clipPath: "inset(0 0 0 100%)" },
    },
    blur: {
      initial: { ...opacity, filter: "blur(12px)" },
      animate: { ...visible, filter: "blur(0px)" },
      exit: { ...opacity, filter: "blur(12px)" },
    },
    bounce: {
      initial: { y: 0 },
      animate: { y: [0, -20, 0, -8, 0] },
      exit: opacity,
    },
  }
  return reduced
    ? { initial: visible, animate: visible, exit: opacity }
    : states[variant]
}

export function ElementMotion({
  variant,
  visible = true,
  children,
  className,
  onExitComplete,
  onAnimationComplete,
}: {
  variant: ElementMotionVariant
  visible?: boolean
  children: ReactNode
  className?: string
  onExitComplete?: () => void
  onAnimationComplete?: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.2 })
  const reduced = useReducedMotion()
  const states = elementMotionStates(variant, Boolean(reduced))
  return (
    <div
      ref={ref}
      data-slot="element-motion"
      data-motion={variant}
      className={cn(
        "flex h-36 w-full items-center justify-center overflow-hidden",
        className
      )}
    >
      <AnimatePresence onExitComplete={onExitComplete}>
        {visible && (
          <motion.div
            key={variant}
            data-slot="motion-element"
            className="min-w-0 max-w-full"
            initial={states.initial}
            animate={inView ? states.animate : states.initial}
            exit={states.exit}
            onAnimationComplete={onAnimationComplete}
            transition={{
              duration: reduced ? 0 : variant === "bounce" ? 0.85 : 0.55,
              ease: "easeOut",
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

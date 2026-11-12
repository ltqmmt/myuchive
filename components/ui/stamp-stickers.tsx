"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import styles from "./stamp-stickers.module.css"

const cities = ["London", "Berlin", "Paris", "Seoul", "Tokyo", "Shanghai"]
const crops = [[96, 275], [472, 275], [844, 275], [96, 704], [472, 704], [844, 704]]
type Stamp = { id: number; city: number; x: number; y: number; angle: number; width: number }
export type StampStickersProps = {
  label?: string
  className?: string
  spriteSrc?: string
  maxStamps?: number
  onStamp?: (city: string) => void
}

/** A click surface that collects small city stamps like luggage stickers. */
export function StampStickers({ label = "Add a stamp", className, spriteSrc = "/illustrations/city-stamps.png", maxStamps = 24, onStamp }: StampStickersProps) {
  const [stamps, setStamps] = React.useState<Stamp[]>([])
  const nextId = React.useRef(0)
  const deck = React.useRef<number[]>([])
  const reduce = useReducedMotion()
  function add(event: React.MouseEvent<HTMLButtonElement>) {
    const bounds = event.currentTarget.getBoundingClientRect()
    const width = Math.min(88 + Math.random() * 22, bounds.width * .28)
    const margin = width * .78
    const keyboard = event.detail === 0
    const px = keyboard ? bounds.width * (.2 + Math.random() * .6) : event.clientX - bounds.left
    const py = keyboard ? bounds.height * (.2 + Math.random() * .6) : event.clientY - bounds.top
    if (!deck.current.length) {
      deck.current = cities.map((_, i) => i)
      for (let i = deck.current.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[deck.current[i], deck.current[j]] = [deck.current[j], deck.current[i]]
      }
    }
    const stamp = { id: nextId.current++, city: deck.current.pop()!,
      x: Math.max(margin, Math.min(bounds.width - margin, px)) / bounds.width * 100,
      y: Math.max(margin, Math.min(bounds.height - margin, py)) / bounds.height * 100,
      angle: Math.random() * 34 - 17, width }
    setStamps(previous => [...previous, stamp].slice(-Math.max(1, maxStamps)))
    onStamp?.(cities[stamp.city])
  }
  return <div className={cn(styles.container, className)}>
    <button type="button" aria-label={label} className={styles.surface} onClick={add}>
    {stamps.length === 0 && <span aria-hidden="true" className={styles.emptyStamp}>
      <svg className={styles.outline} viewBox="0 0 100 124" fill="none">
        <path d={`M8 8 ${"h2 a4 4 0 0 0 8 0 h2 ".repeat(7)}${"v2 a4 4 0 0 0 0 8 v2 ".repeat(9)}${"h-2 a4 4 0 0 0 -8 0 h-2 ".repeat(7)}${"v-2 a4 4 0 0 0 0 -8 v-2 ".repeat(9)}Z`} stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <span className={styles.add}><Plus /></span>
    </span>}
    {stamps.map(stamp => <span key={stamp.id} className={styles.position} style={{ left: `${stamp.x}%`, top: `${stamp.y}%`, width: stamp.width }} aria-hidden="true">
      <motion.span className={styles.stamp} initial={reduce ? false : { opacity: 0, scale: 1.35, y: -18, rotate: stamp.angle - 7 }} animate={{ opacity: 1, scale: 1, y: 0, rotate: stamp.angle }} transition={{ type: "spring", stiffness: 460, damping: 25, mass: .65 }}>
        <span className={styles.crop} style={{ backgroundImage: `url("${spriteSrc}")`, backgroundSize: `${1254 / 315 * 100}% ${1254 / 375 * 100}%`, backgroundPosition: `${crops[stamp.city][0] / (1254 - 315) * 100}% ${crops[stamp.city][1] / (1254 - 375) * 100}%` }} />
      </motion.span>
    </span>)}
    </button>
  </div>
}

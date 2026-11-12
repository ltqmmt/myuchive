import type { CSSProperties } from "react"
import { cn } from "cn"
import styles from "@/components/ui/progressive-blur.module.css"

const layers = [
  { blur: 2, start: 55, end: 72 },
  { blur: 4, start: 65, end: 85 },
  { blur: 8, start: 75, end: 95 },
  { blur: 16, start: 85, end: 100 },
]

const headerLayers = [
  { blur: 2, start: 0, end: 25 },
  { blur: 4, start: 15, end: 45 },
  { blur: 8, start: 30, end: 65 },
  { blur: 16, start: 50, end: 85 },
]

export function ProgressiveBlur({ className, src, variant = "default" }: { className?: string; src?: string; variant?: "default" | "header" }) {
  return (
    <div className={cn(styles.overlay, variant === "header" && styles.headerOverlay, className)} aria-hidden="true">
      {(variant === "header" ? headerLayers : layers).map(({ blur, start, end }) => (
        <span key={blur} className={styles.layer} style={{
          "--progressive-blur": `${blur}px`,
          "--blur-start": `${start}%`,
          "--blur-end": `${end}%`,
        } as CSSProperties}>
          {src && <img src={src} alt="" draggable={false} className={styles.image} />}
        </span>
      ))}
    </div>
  )
}

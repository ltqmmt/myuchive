"use client"

import * as React from "react"
import { Workflow } from "lucide-react"
import { useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"
import styles from "./data-flow.module.css"

export type DataFlowNode = { id: string; label: string; meta?: string; detail?: string; icon?: React.ReactNode; share?: number }
export type DataFlowProps = {
  sources: DataFlowNode[]
  destinations: DataFlowNode[]
  core?: { label: string; icon?: React.ReactNode; countLabel?: string }
  processedCount?: number
  speed?: number
  paused?: boolean
  label?: string
  caption?: React.ReactNode
  className?: string
  onRecordProcessed?: () => void
}
type Point = { x: number; y: number }
type Route = { id: string; path: string; incoming: boolean; node: DataFlowNode; index: number }

export function DataFlow({ sources, destinations, core = { label: "Transform" }, processedCount, speed = 1, paused = false, label, caption, className, onRecordProcessed }: DataFlowProps) {
  const [width, setWidth] = React.useState(640)
  const [active, setActive] = React.useState<string | null>(null)
  const root = React.useRef<HTMLElement>(null)
  const pathRefs = React.useRef(new Map<string, SVGPathElement>())
  const particles = React.useRef(new Map<string, SVGGElement>())
  const phase = React.useRef(0)
  const callback = React.useRef(onRecordProcessed)
  const reduced = useReducedMotion()
  const {narrow,height,center,nodeWidth,nodeHeight,inputs,outputs,routes,routeSignature} = React.useMemo(()=>{
  const narrow = false
  const height = narrow ? 480 : 360
  const center: Point = { x: width / 2, y: height / 2 }
  const nodeWidth = narrow ? Math.min(136, (width - 40) / Math.max(1, sources.length, destinations.length) - 8) : Math.min(160, width * .24)
  const nodeHeight = narrow ? 76 : 64
  const points = (nodes: DataFlowNode[], incoming: boolean) => nodes.map((node, i) => ({ node,
    x: narrow ? 20 + (width - 40) * (i + .5) / Math.max(1, nodes.length) : incoming ? 20 + nodeWidth / 2 : width - 20 - nodeWidth / 2,
    y: narrow ? incoming ? 56 : height - 56 : 40 + (height - 80) * (i + .5) / Math.max(1, nodes.length),
  }))
  const inputs = points(sources, true)
  const outputs = points(destinations, false)
  const routes: Route[] = [...inputs.map((point, index) => {
    const start = narrow ? { x: point.x, y: point.y + nodeHeight / 2 } : { x: point.x + nodeWidth / 2, y: point.y }
    const end = narrow ? { x: center.x, y: center.y - 36 } : { x: center.x - 36, y: center.y }
    const path = narrow ? `M${start.x},${start.y} C${start.x},${(start.y + end.y) / 2} ${end.x},${(start.y + end.y) / 2} ${end.x},${end.y}` : `M${start.x},${start.y} C${(start.x + end.x) / 2},${start.y} ${(start.x + end.x) / 2},${end.y} ${end.x},${end.y}`
    return { id: `in-${point.node.id}`, path, incoming: true, node: point.node, index }
  }), ...outputs.map((point, index) => {
    const start = narrow ? { x: center.x, y: center.y + 36 } : { x: center.x + 36, y: center.y }
    const end = narrow ? { x: point.x, y: point.y - nodeHeight / 2 } : { x: point.x - nodeWidth / 2, y: point.y }
    const path = narrow ? `M${start.x},${start.y} C${start.x},${(start.y + end.y) / 2} ${end.x},${(start.y + end.y) / 2} ${end.x},${end.y}` : `M${start.x},${start.y} C${(start.x + end.x) / 2},${start.y} ${(start.x + end.x) / 2},${end.y} ${end.x},${end.y}`
    return { id: `out-${point.node.id}`, path, incoming: false, node: point.node, index }
  })]
  const routeSignature = routes.map(route => `${route.id}:${route.path}:${route.node.share ?? 1}`).join("|")
  return {narrow,height,center,nodeWidth,nodeHeight,inputs,outputs,routes,routeSignature}
  },[width,sources,destinations])
  React.useEffect(() => { callback.current = onRecordProcessed }, [onRecordProcessed])
  React.useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(560, entry.contentRect.width)))
    if (root.current) observer.observe(root.current)
    return () => observer.disconnect()
  }, [])
  React.useEffect(() => {
    let visible = true
    let frame = 0
    let previous = 0
    const samples = Array.from(pathRefs.current.entries()).map(([id, path]) => {
      const length = path.getTotalLength()
      const points = Array.from({ length: 65 }, (_, i) => path.getPointAtLength(length * i / 64))
      return { id, points }
    })
    const draw = (time: number) => {
      for (const { id, points } of samples) {
        const incoming = id.startsWith("in-")
        const routeIndex = samples.findIndex(sample => sample.id === id)
        const node = incoming ? sources[routeIndex] : destinations[routeIndex - sources.length]
        const share = Math.max(0, Math.min(1, node?.share ?? 1))
        for (let i = 0; i < 6; i++) {
          const particle = particles.current.get(`${id}-${i}`)
          if (!particle) continue
          const elapsed = time - i * 1.1
          const lap = Math.floor(elapsed / 6.6)
          const cycle = ((elapsed % 6.6) + 6.6) % 6.6
          const leg = incoming ? cycle : cycle - 2.2
          const t = reduced ? .5 : Math.max(0, Math.min(1, leg / 2.2))
          const sample = t * 64
          const low = Math.floor(sample)
          const a = points[low], b = points[Math.min(64, low + 1)]
          const mix = sample - low
          const record = (lap + 10000) * 6 + i
          const included = reduced ? i === 0 : elapsed >= 0 && leg >= 0 && leg < 2.2 && (incoming ? i % Math.max(1, sources.length) === routeIndex : Math.floor((record + 1) * share) !== Math.floor(record * share))
          particle.setAttribute("transform", `translate(${a.x + (b.x - a.x) * mix} ${a.y + (b.y - a.y) * mix})`)
          particle.setAttribute("opacity", included ? String(Math.min(1, t * 12, (1 - t) * 12)) : "0")
        }
      }
    }
    const tick = (now: number) => {
      if (previous) {
        const delta = Math.min(.1, (now - previous) / 1000) * Math.max(0, Math.min(5, speed))
        const processed = (time: number) => time < 2.2 ? 0 : Math.floor((time - 2.2) / 1.1) + 1
        const before = processed(phase.current)
        phase.current += delta
        if (sources.length && processed(phase.current) > before) callback.current?.()
      }
      previous = now
      draw(phase.current)
      frame = requestAnimationFrame(tick)
    }
    const sync = () => {
      cancelAnimationFrame(frame); previous = 0
      if (visible && !document.hidden && !paused && !reduced && speed > 0) frame = requestAnimationFrame(tick)
      else draw(reduced ? 1.1 : phase.current)
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() })
    if (root.current) observer.observe(root.current)
    document.addEventListener("visibilitychange", sync)
    sync()
    return () => { cancelAnimationFrame(frame); observer.disconnect(); document.removeEventListener("visibilitychange", sync) }
    // Geometry and routing rebuild together; labels and icons do not affect the loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeSignature, paused, reduced, speed])
  function nodeView(point: Point & { node: DataFlowNode }, incoming: boolean) {
    const key = `${incoming ? "in" : "out"}-${point.node.id}`
    return <div key={key} className={styles.node} data-active={active === key} style={{ left: point.x, top: point.y, width: nodeWidth, height: nodeHeight }} onPointerEnter={event => { if (event.pointerType === "mouse") setActive(key) }} onPointerLeave={() => setActive(null)} title={point.node.detail}>
      {point.node.icon && <span aria-hidden="true" className={styles.icon}>{point.node.icon}</span>}
      <span className={styles.nodeText}><span className={styles.nodeLabel}>{point.node.label}</span>{point.node.meta && <span className={styles.meta}>{point.node.meta}</span>}</span>
    </div>
  }
  const description = label ?? `${sources.map(node => node.label).join(", ")} → ${core.label} → ${destinations.map(node => node.label).join(", ")}`
  return <figure ref={root} className={cn(styles.root, className)} data-narrow={narrow}>
    <div className={styles.diagram} role="img" aria-label={description} style={{ height, width }}>
      <svg aria-hidden="true" width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={styles.paths}>
        {routes.map(route => <g key={route.id}>
          <path ref={element => { if (element) pathRefs.current.set(route.id, element); else pathRefs.current.delete(route.id) }} d={route.path} className={styles.path} data-active={active === route.id} />
          {[0, 1, 2, 3, 4, 5].map(i => <g key={i} ref={element => { if (element) particles.current.set(`${route.id}-${i}`, element); else particles.current.delete(`${route.id}-${i}`) }} opacity="0" className={styles.particle}>
            {route.incoming ? <circle r="3.5" fill="var(--background)" stroke="var(--muted-foreground)" strokeWidth="1.5" /> : <rect x="-3" y="-3" width="6" height="6" rx="1.3" fill="var(--primary)" />}
          </g>)}
        </g>)}
      </svg>
      {inputs.map(point => nodeView(point, true))}
      <div className={styles.core} style={{ left: center.x, top: center.y }} aria-hidden="true"><span className={styles.coreRing} /><span className={styles.coreIcon}>{core.icon ?? <Workflow />}</span></div>
      <div className={styles.coreLabel} style={{ left: center.x, top: center.y + 46 }}><span>{core.label}</span>{processedCount !== undefined && <span className={styles.count}>{processedCount.toLocaleString("en-US")} {core.countLabel}</span>}</div>
      {outputs.map(point => nodeView(point, false))}
    </div>
    {caption && <figcaption className="mt-4 text-center text-base text-muted-foreground">{caption}</figcaption>}
  </figure>
}

"use client"

import { useEffect, useId, useRef, useState, type PointerEvent as ReactPointerEvent } from "react"
import { createPortal } from "react-dom"
import {
  Bar,
  BarChart,
  Area,
  AreaChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  useChartHeight,
  useChartWidth,
  usePlotArea,
  useXAxisScale,
  useYAxisScale,
  type TooltipContentProps,
  type BarShapeProps,
} from "recharts"
import { cn } from "cn"

export type ChartDatum = { label: string; value: number; secondary?: number; [key: `series${number}`]: number | undefined }
export type ChartType =
  "bar" | "line" | "area" | "pie" | "donut" | "radar" | "radial"
export type ChartSeries = {
  key: "value" | "secondary" | `series${number}`
  label: string
  color?: string
}
export type ChartOptions = {
  allowMissingSeries?: boolean
  yAxisWidth?: number
  yAxisAllowDecimals?: boolean
  horizontal?: boolean
  stacked?: boolean
  normalized?: boolean
  curve?: "linear" | "monotone" | "step"
  dots?: boolean
  showLabels?: boolean
  showLegend?: boolean
  interactiveLegend?: boolean
  gradient?: boolean
  centerText?: boolean
  radarGrid?: "polygon" | "circle"
  tooltipIndicator?: "dot" | "line" | "none"
  tooltipPosition?: "pointer" | "plot-top"
  tooltipOffset?: number
}

export function ChartTooltipContent({
  active,
  label,
  payload,
  indicator = "dot",
  locale = "en",
  unit = "",
}: {
  active?: boolean
  label?: unknown
  payload?: readonly { name?: unknown; value?: unknown; color?: string }[]
  indicator?: "dot" | "line" | "none"
  locale?: string
  unit?: string
}) {
  const entries =
    payload?.filter(
      (entry) => typeof entry.value === "number" && Number.isFinite(entry.value)
    ) ?? []
  if (!active || !entries.length) return null
  const format = new Intl.NumberFormat(locale)
  return (
    <div className="max-w-full min-w-0 rounded-lg border bg-popover p-3 text-sm text-popover-foreground shadow-sm [&_li]:flex-wrap [&_span]:break-words">
      {label !== undefined && label !== "" && (
        <p className="mb-2 text-xs text-muted-foreground">{String(label)}</p>
      )}
      <ul className="grid gap-1.5">
        {entries.map((entry, index) => (
          <li key={index} className="flex items-center gap-2">
            {indicator !== "none" && (
              <span
                aria-hidden="true"
                className={
                  indicator === "line"
                    ? "h-3 w-0.5 shrink-0 rounded-sm"
                    : "size-2 shrink-0 rounded-sm"
                }
                style={{ background: entry.color ?? "var(--primary)" }}
              />
            )}
            <span className="mr-3 text-muted-foreground">
              {String(entry.name ?? "")}
            </span>
            <span className="ml-auto font-medium tabular-nums">
              {format.format(entry.value as number)}
              {unit}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const colors = [
  "var(--primary)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

export function pieGeometry(width: number, height: number, donut: boolean) {
  const w = Number.isFinite(width) && width > 0 ? width : 280
  const h = Number.isFinite(height) && height > 0 ? height : 240
  const diameter = Math.max(2, Math.min(w, h) - 10)
  return {
    cx: w / 2,
    cy: h / 2,
    outerRadius: diameter * 0.45,
    innerRadius: donut ? diameter * 0.31 : 0,
    paddingAngle: 0,
    strokeWidth: 3,
  }
}

export function stackedBarRadius(
  item: ChartDatum | undefined,
  key: ChartSeries["key"],
  series: ChartSeries[],
  horizontal: boolean
): [number, number, number, number] {
  const value = item?.[key] ?? 0
  const index = series.findIndex((entry) => entry.key === key)
  const covered = series.slice(index + 1).some((entry) => {
    const next = item?.[entry.key] ?? 0
    return next !== 0 && Math.sign(next) === Math.sign(value)
  })
  if (!value || index < 0 || covered) return [0, 0, 0, 0]
  if (horizontal) return value > 0 ? [0, 4, 4, 0] : [4, 0, 0, 4]
  return value > 0 ? [4, 4, 0, 0] : [0, 0, 4, 4]
}

type ChartPoint = { x: number; y: number }
type ChartBounds = { left: number; top: number; width: number; height: number }
type ChartPointer = ChartPoint & { viewport: ChartPoint; pointerType?: string; viewportWidth?: number }
type ChartScale = (
  value: unknown,
  options?: { position?: "middle" }
) => number | undefined

export function chartPointerPosition(
  pointer: ChartPoint,
  bounds: { left: number; top: number; width: number; height: number },
  chart: { width: number; height: number }
): ChartPoint | undefined {
  if (
    ![
      pointer.x,
      pointer.y,
      bounds.left,
      bounds.top,
      bounds.width,
      bounds.height,
      chart.width,
      chart.height,
    ].every(Number.isFinite) ||
    bounds.width <= 0 ||
    bounds.height <= 0 ||
    chart.width <= 0 ||
    chart.height <= 0
  )
    return undefined
  return {
    x: Math.max(
      0,
      Math.min(
        chart.width,
        ((pointer.x - bounds.left) * chart.width) / bounds.width
      )
    ),
    y: Math.max(
      0,
      Math.min(
        chart.height,
        ((pointer.y - bounds.top) * chart.height) / bounds.height
      )
    ),
  }
}

export function chartTooltipAnchor({
  type,
  index,
  data,
  series,
  options,
  xScale,
  yScale,
  plot,
  sector,
  coordinate,
}: {
  type: ChartType
  index: number
  data: ChartDatum[]
  series: ChartSeries[]
  options: ChartOptions
  xScale?: ChartScale
  yScale?: ChartScale
  plot?: { x: number; y: number; width: number; height: number }
  coordinate?: ChartPoint
  sector?: {
    cx?: number
    cy?: number
    innerRadius?: number
    outerRadius?: number
    startAngle?: number
    endAngle?: number
  }
}): ChartPoint | undefined {
  const item = data[index]
  if (!item) return undefined
  // Recharts supplies the slice midpoint (not the pointer) for pie tooltips.
  if (
    (type === "pie" || type === "donut") &&
    coordinate &&
    Number.isFinite(coordinate.x) &&
    Number.isFinite(coordinate.y)
  )
    return coordinate
  let point: { x: number | undefined; y: number | undefined }
  if (type === "pie" || type === "donut" || type === "radial") {
    if (
      !sector ||
      ![
        sector.cx,
        sector.cy,
        sector.innerRadius,
        sector.outerRadius,
        sector.startAngle,
        sector.endAngle,
      ].every(Number.isFinite)
    )
      return undefined
    const angle =
      (((sector.startAngle! + sector.endAngle!) / 2) * Math.PI) / 180
    const radius = (sector.innerRadius! + sector.outerRadius!) / 2
    point = {
      x: sector.cx! + Math.cos(angle) * radius,
      y: sector.cy! - Math.sin(angle) * radius,
    }
  } else {
    const amounts = series.map((entry) => item[entry.key] ?? 0)
    const ends = options.normalized
      ? [1]
      : options.stacked
        ? type === "area"
          ? amounts.reduce<number[]>((totals, amount) => {
              totals.push((totals.at(-1) ?? 0) + amount)
              return totals
            }, [])
          : [
              amounts.reduce((sum, value) => sum + Math.max(0, value), 0),
              amounts.reduce((sum, value) => sum + Math.min(0, value), 0),
            ]
        : amounts
    const value = ends.reduce(
      (furthest, end) => (Math.abs(end) > Math.abs(furthest) ? end : furthest),
      0
    )
    if (type === "radar") {
      if (!plot) return undefined
      const angle = ((90 - (index * 360) / data.length) * Math.PI) / 180
      const radius =
        ((Math.min(plot.width, plot.height) / 2) * 0.65 * value) / 100
      point = {
        x: plot.x + plot.width / 2 + Math.cos(angle) * radius,
        y: plot.y + plot.height / 2 - Math.sin(angle) * radius,
      }
    } else if (type === "bar" && options.horizontal) {
      point = {
        x: xScale?.(value),
        y: yScale?.(item.label, { position: "middle" }),
      }
    } else {
      point = {
        x: xScale?.(item.label, { position: "middle" }),
        y: options.tooltipPosition === "plot-top" && plot ? plot.y : yScale?.(value),
      }
    }
  }
  return Number.isFinite(point.x) && Number.isFinite(point.y)
    ? (point as ChartPoint)
    : undefined
}

export function chartPlotTopTooltipPosition(
  anchor: ChartPoint,
  size: { width: number; height: number },
  plot: { x: number; y: number; width: number; height: number }
): ChartPoint {
  const inset = 14
  const gap = 14
  const right = anchor.x + gap
  const preferred = right + size.width <= plot.x + plot.width - inset
    ? right : anchor.x - size.width - gap
  return {
    x: Math.max(plot.x + inset, Math.min(preferred, plot.x + plot.width - size.width - inset)),
    y: plot.y + inset,
  }
}

export function chartTooltipPosition(
  anchor: ChartPoint,
  size: { width: number; height: number },
  chart: { width: number; height: number },
  followPointer = false,
  pointerGap = 12
): ChartPoint {
  const inset = 8
  const gap = 10
  const clamp = (value: number, extent: number, length: number) =>
    Math.max(inset, Math.min(value, extent - length - inset))
  const above = anchor.y - size.height - gap
  if (followPointer) {
    return {
      x: anchor.x - size.width / 2,
      y: anchor.y - size.height - pointerGap,
    }
  }
  return {
    x: clamp(anchor.x - size.width / 2, chart.width, size.width),
    y: clamp(
      above >= inset ? above : anchor.y + gap,
      chart.height,
      size.height
    ),
  }
}

export function chartTouchTooltipPosition(
  contact: ChartPoint,
  size: { width: number; height: number },
  viewportWidth: number,
  gap = 32
): ChartPoint {
  const inset = 8
  return {
    x: Math.max(inset, Math.min(contact.x - size.width / 2, viewportWidth - size.width - inset)),
    y: Math.max(inset, contact.y - size.height - Math.max(32, gap)),
  }
}

function FloatingChartTooltip({
  type,
  data,
  series,
  options,
  locale,
  unit,
  pointer,
  dismissed,
  frameBounds,
  ...props
}: Partial<TooltipContentProps> & {
  type: ChartType
  data: ChartDatum[]
  series: ChartSeries[]
  options: ChartOptions
  locale: string
  unit: string
  pointer?: ChartPointer
  dismissed?: boolean
  frameBounds?: ChartBounds
}) {
  const xScale = useXAxisScale()
  const yScale = useYAxisScale()
  const plot = usePlotArea()
  const width = useChartWidth() ?? 280
  const height = useChartHeight() ?? 240
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 128, height: 72 })
  const followsPointer = !!pointer && (pointer.pointerType === "touch" || options.tooltipPosition !== "plot-top")
  const touchPointer = followsPointer && pointer?.pointerType === "touch"
  const pointerGap = Number.isFinite(options.tooltipOffset) ? Math.max(0, options.tooltipOffset!) : 12
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize((previous) =>
        previous.width === width && previous.height === height
          ? previous
          : { width, height }
      )
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [followsPointer])
  const anchor = followsPointer
    ? pointer
    : chartTooltipAnchor({
      type,
      index: Number(props.activeIndex),
      data,
      series,
      options,
      xScale,
      yScale,
      plot,
      sector: props.payload?.[0]?.payload,
      coordinate: props.coordinate,
    })
  const position = anchor
    ? chartTooltipPosition(anchor, size, { width, height }, followsPointer, pointerGap)
    : undefined
  const bounds = options.tooltipPosition === "plot-top" && !touchPointer ? frameBounds : undefined
  const fixedAnchor = bounds && anchor
    ? { x: bounds.left + anchor.x * bounds.width / width, y: bounds.top + anchor.y * bounds.height / height }
    : followsPointer ? pointer?.viewport : undefined
  const plotBounds = bounds && plot ? {
    x: bounds.left + plot.x * bounds.width / width,
    y: bounds.top + plot.y * bounds.height / height,
    width: plot.width * bounds.width / width,
    height: plot.height * bounds.height / height,
  } : undefined
  const insidePosition = fixedAnchor && plotBounds
    ? chartPlotTopTooltipPosition(fixedAnchor, size, plotBounds) : undefined
  const touchPosition = touchPointer && pointer?.viewportWidth
    ? chartTouchTooltipPosition(pointer.viewport, size, pointer.viewportWidth, pointerGap) : undefined
  const panelWidth = Math.max(1, touchPointer && pointer?.viewportWidth
    ? Math.min(width - 16, pointer.viewportWidth - 16) : plotBounds ? plotBounds.width - 28 : width - 16)
  const pointerInPlot = !pointer || !plot || (
    pointer.x >= plot.x && pointer.x <= plot.x + plot.width &&
    pointer.y >= plot.y && pointer.y <= plot.y + plot.height
  )
  const active = !dismissed && props.active && pointerInPlot
  const panel = (
    <div
      ref={ref}
      data-slot="chart-tooltip"
      data-positioning={touchPointer ? "touch" : options.tooltipPosition === "plot-top" ? "plot-top" : followsPointer ? "pointer" : "element"}
      data-anchor-x={anchor?.x}
      data-anchor-y={anchor?.y}
      data-pointer-x={pointer?.viewport.x}
      data-pointer-y={pointer?.viewport.y}
      style={{
        position: fixedAnchor ? "fixed" : undefined,
        left: fixedAnchor ? 0 : undefined,
        top: fixedAnchor ? 0 : undefined,
        zIndex: fixedAnchor ? 50 : undefined,
        pointerEvents: "none",
        width: "max-content",
        minWidth: Math.min(128, panelWidth),
        maxWidth: panelWidth,
        visibility: active && position ? "visible" : "hidden",
        transform: touchPosition
          ? `translate(${touchPosition.x}px, ${touchPosition.y}px)`
          : insidePosition
          ? `translate(${insidePosition.x}px, ${insidePosition.y}px)`
          : fixedAnchor
            ? `translate(${fixedAnchor.x}px, ${fixedAnchor.y - pointerGap}px) translate(-50%, -100%)`
          : position
            ? `translate(${position.x}px, ${position.y}px)`
            : undefined,
      }}
    >
      <ChartTooltipContent
        {...props}
        active={active}
        label={type === "radial" ? undefined : props.label}
        payload={
          type === "radial"
            ? props.payload?.map((entry) => ({
                ...entry,
                name: entry.payload?.label ?? entry.name,
              }))
            : props.payload
        }
        indicator={options.tooltipIndicator}
        locale={locale}
        unit={unit}
      />
    </div>
  )
  return fixedAnchor ? createPortal(panel, document.body) : panel
}

export function Chart({
  data,
  type = "bar",
  title,
  valueLabel,
  emptyLabel,
  height = 240,
  locale = "en",
  className,
  series,
  options = {},
  unit = "",
}: {
  data: ChartDatum[]
  type?: ChartType
  title: string
  valueLabel: string
  emptyLabel: string
  height?: number
  locale?: string
  className?: string
  series?: ChartSeries[]
  options?: ChartOptions
  unit?: string
}) {
  const id = useId()
  const [pieWidth, setPieWidth] = useState(280)
  const [pointer, setPointer] = useState<ChartPointer>()
  const frameRef = useRef<HTMLDivElement>(null)
  const [frameBounds, setFrameBounds] = useState<ChartBounds>()
  function measureFrame(frame: HTMLDivElement) {
    const bounds = frame.getBoundingClientRect()
    if (options.tooltipPosition === "plot-top") {
      const { left, top, width, height } = bounds
      setFrameBounds(previous => previous?.left === left && previous.top === top && previous.width === width && previous.height === height
        ? previous : { left, top, width, height })
    }
    return bounds
  }
  const pointerFrame = useRef<number | null>(null)
  const pendingPointer = useRef<{frame:HTMLDivElement;x:number;y:number;pointerType:string}|null>(null)
  function cancelPointerFrame() {
    if (pointerFrame.current !== null) cancelAnimationFrame(pointerFrame.current)
    pointerFrame.current = null
    pendingPointer.current = null
  }
  useEffect(()=>cancelPointerFrame,[])
  function trackPointer(event: ReactPointerEvent<HTMLDivElement>) {
    pendingPointer.current = {frame:event.currentTarget,x:event.clientX,y:event.clientY,pointerType:event.pointerType}
    if (pointerFrame.current !== null) return
    pointerFrame.current = requestAnimationFrame(()=>{
      pointerFrame.current = null
      const pending = pendingPointer.current
      pendingPointer.current = null
      if (!pending) return
      const {frame,x,y,pointerType} = pending
      const point = chartPointerPosition({x,y},measureFrame(frame),{width:frame.clientWidth,height:frame.clientHeight})
      setPointer(point ? {...point,viewport:{x,y},pointerType,viewportWidth:frame.ownerDocument?.documentElement?.clientWidth || frame.ownerDocument?.defaultView?.innerWidth} : undefined)
    })
  }
  const [tooltipDismissed, setTooltipDismissed] = useState(false)
  const [hiddenSeries, setHiddenSeries] = useState<ChartSeries["key"][]>([])
  const dismissTooltip = () => {
    cancelPointerFrame()
    setPointer(undefined)
    setTooltipDismissed(true)
  }
  const trackingPointer = !!pointer
  useEffect(() => {
    if (!trackingPointer) return
    const dismiss = () => {
      cancelPointerFrame()
      setPointer(undefined)
      setTooltipDismissed(true)
    }
    // Observe outside the SVG too; child handlers and delayed chart updates
    // must not leave a portalled panel visible after the pointer has left.
    const checkPointer = (event: PointerEvent) => {
      const frame = frameRef.current
      if (!frame) return dismiss()
      const bounds = frame.getBoundingClientRect()
      if (!frame.contains(event.target as Node) ||
          event.clientX < bounds.left || event.clientX >= bounds.right ||
          event.clientY < bounds.top || event.clientY >= bounds.bottom) dismiss()
    }
    const checkWindowExit = (event: PointerEvent) => {
      if (event.pointerType !== "touch" && !event.relatedTarget) dismiss()
    }
    window.addEventListener("pointermove", checkPointer, true)
    window.addEventListener("pointerdown", checkPointer, true)
    window.addEventListener("pointerout", checkWindowExit, true)
    window.addEventListener("scroll", dismiss, true)
    window.addEventListener("resize", dismiss)
    window.addEventListener("blur", dismiss)
    return () => {
      window.removeEventListener("pointermove", checkPointer, true)
      window.removeEventListener("pointerdown", checkPointer, true)
      window.removeEventListener("pointerout", checkWindowExit, true)
      window.removeEventListener("scroll", dismiss, true)
      window.removeEventListener("resize", dismiss)
      window.removeEventListener("blur", dismiss)
    }
  }, [trackingPointer])
  const configuredSeries = (
    series?.length ? series : [{ key: "value" as const, label: valueLabel }]
  ).map((entry, index) => ({
    ...entry,
    color: entry.color ?? colors[index % colors.length],
  }))
  const interactiveLegend = type === "line" && options.interactiveLegend === true
  const selectedSeries = configuredSeries.filter(entry => !hiddenSeries.includes(entry.key))
  const visibleSeries = interactiveLegend && selectedSeries.length ? selectedSeries : configuredSeries
  function toggleSeries(key: ChartSeries["key"]) {
    if (visibleSeries.length === 1 && visibleSeries[0].key === key) return
    dismissTooltip()
    setHiddenSeries(previous => previous.includes(key) ? previous.filter(item => item !== key) : [...previous, key])
  }
  const isPie = type === "pie" || type === "donut"
  const pieLayout = pieGeometry(pieWidth, height, type === "donut")
  const isRadial = type === "radial"
  const horizontal = type === "bar" && options.horizontal
  const normalized = type === "area" && options.normalized
  const values = data.filter(
    (item) =>
      configuredSeries[options.allowMissingSeries && type === "line" ? "some" : "every"](
        (entry) =>
          typeof item[entry.key] === "number" &&
          Number.isFinite(item[entry.key])
      ) &&
      (!isPie || item.value > 0) &&
      (!(type === "radar" || isRadial || normalized) ||
        configuredSeries.every((entry) => (item[entry.key] ?? 0) >= 0)) &&
      (!isRadial || item.value <= 100) &&
      (type !== "radar" ||
        configuredSeries.every((entry) => (item[entry.key] ?? 0) <= 100)) &&
      (!normalized ||
        configuredSeries.reduce(
          (sum, entry) => sum + (item[entry.key] ?? 0),
          0
        ) > 0)
  )
  const format = new Intl.NumberFormat(locale)
  const total = values.reduce((sum, item) => sum + item.value, 0)
  const pieData = values.map((item, index) => ({
    ...item,
    fill: colors[index % colors.length],
  }))
  const tooltip = (
    <Tooltip
      content={
        <FloatingChartTooltip
          dismissed={tooltipDismissed}
          type={type}
          data={values}
          series={visibleSeries}
          options={options}
          locale={locale}
          unit={unit}
          pointer={pointer}
          frameBounds={frameBounds}
        />
      }
      active={tooltipDismissed ? false : undefined}
      position={{ x: 0, y: 0 }}
      isAnimationActive={false}
      cursor={
        type === "line" || type === "area"
          ? { stroke: "var(--border)" }
          : type === "bar"
            ? { fill: "var(--muted)", opacity: 0.5 }
            : false
      }
    />
  )
  const axes = (
    <>
      <CartesianGrid
        vertical={Boolean(horizontal)}
        horizontal={!horizontal}
        stroke="var(--border)"
        strokeDasharray="3 3"
      />
      <XAxis
        dataKey={horizontal ? undefined : "label"}
        type={horizontal ? "number" : "category"}
        axisLine={false}
        tickLine={false}
        tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
        tickMargin={8}
        minTickGap={12}
        domain={
          horizontal ? [(min: number) => Math.min(0, min), "auto"] : undefined
        }
      />
      <YAxis
        allowDecimals={options.yAxisAllowDecimals}
        axisLine={false}
        type={horizontal ? "category" : "number"}
        dataKey={horizontal ? "label" : undefined}
        tickLine={false}
        tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
        width={options.yAxisWidth ?? (horizontal ? 44 : 36)}
        tickCount={4}
        tickFormatter={
          horizontal
            ? undefined
            : (value: number) =>
                normalized
                  ? `${Math.round(value * 100)}%`
                  : format.format(value)
        }
        domain={
          horizontal
            ? undefined
            : normalized
              ? [0, 1]
              : type === "bar" || type === "area"
                ? [(min: number) => Math.min(0, min), "auto"]
                : ["auto", "auto"]
        }
      />
    </>
  )

  return (
    <figure
      data-slot="chart"
      className={cn("m-0 w-full min-w-0", className)}
      aria-labelledby={`${id}-title`}
    >
      <figcaption id={`${id}-title`} className="sr-only">
        {title}
      </figcaption>
      <div
        ref={frameRef}
        className="relative w-full min-w-0"
        style={{ height }}
        onPointerEnter={(event) => {
          measureFrame(event.currentTarget)
          setTooltipDismissed(false)
        }}
        onPointerMove={(event) => {
          trackPointer(event)
        }}
        onPointerDown={(event) => {
          if (event.pointerType === "touch") {
            measureFrame(event.currentTarget)
            trackPointer(event)
            setTooltipDismissed(false)
          }
        }}
        onPointerLeave={(event) => {
          if (event.pointerType !== "touch") dismissTooltip()
        }}
        onPointerCancel={dismissTooltip}
        onKeyDownCapture={(event) => {
          measureFrame(event.currentTarget)
          setPointer(undefined)
          setTooltipDismissed(false)
        }}
      >
        {!values.length ? (
          <div
            role="status"
            className="flex h-full items-center justify-center text-sm text-muted-foreground"
          >
            {emptyLabel}
          </div>
        ) : (
          <>
            <ResponsiveContainer
              width="100%"
              height={height}
              minWidth={0}
              minHeight={height}
              initialDimension={{ width: 280, height }}
              onResize={
                isPie
                  ? (width) => {
                      if (Number.isFinite(width) && width > 0)
                        setPieWidth(Math.max(1, Math.round(width)))
                    }
                  : undefined
              }
            >
              {isPie ? (
                <PieChart
                  margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                  accessibilityLayer
                >
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="label"
                    cx={pieLayout.cx}
                    cy={pieLayout.cy}
                    innerRadius={pieLayout.innerRadius}
                    outerRadius={pieLayout.outerRadius}
                    paddingAngle={pieLayout.paddingAngle}
                    stroke="var(--background)"
                    strokeWidth={pieLayout.strokeWidth}
                    strokeLinejoin="round"
                    isAnimationActive={false}
                    labelLine={false}
                  >
                    {options.showLabels && (
                      <LabelList
                        dataKey="value"
                        position="inside"
                        fill="var(--primary-foreground)"
                        fontSize={12}
                        formatter={(value) =>
                          typeof value === "number"
                            ? format.format(value)
                            : String(value)
                        }
                      />
                    )}
                  </Pie>
                  {tooltip}
                </PieChart>
              ) : type === "radar" ? (
                <RadarChart data={values} outerRadius="65%" accessibilityLayer>
                  <PolarGrid
                    gridType={options.radarGrid ?? "polygon"}
                    stroke="var(--border)"
                  />
                  <PolarAngleAxis
                    dataKey="label"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                  />
                  <PolarRadiusAxis
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                  />
                  {configuredSeries.map((entry) => (
                    <Radar<ChartDatum>
                      key={entry.key}
                      name={entry.label}
                      dataKey={entry.key}
                      stroke={entry.color}
                      fill={entry.color}
                      fillOpacity={0.18}
                      strokeWidth={2}
                      dot={Boolean(options.dots)}
                      isAnimationActive={false}
                    />
                  ))}
                  {tooltip}
                </RadarChart>
              ) : isRadial ? (
                <RadialBarChart
                  data={pieData}
                  startAngle={90}
                  endAngle={-270}
                  innerRadius="35%"
                  outerRadius="90%"
                  barSize={14}
                  accessibilityLayer
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    tick={false}
                  />
                  <RadialBar
                    dataKey="value"
                    background={{ fill: "var(--muted)" }}
                    cornerRadius={7}
                    isAnimationActive={false}
                  />
                  {tooltip}
                </RadialBarChart>
              ) : type === "area" ? (
                <AreaChart
                  data={values}
                  stackOffset={normalized ? "expand" : "none"}
                  margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
                  accessibilityLayer
                >
                  {options.gradient && (
                    <defs>
                      {configuredSeries.map((entry) => (
                        <linearGradient
                          key={entry.key}
                          id={`${id}-${entry.key}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor={entry.color}
                            stopOpacity={0.5}
                          />
                          <stop
                            offset="100%"
                            stopColor={entry.color}
                            stopOpacity={0.02}
                          />
                        </linearGradient>
                      ))}
                    </defs>
                  )}
                  {axes}
                  {tooltip}
                  {configuredSeries.map((entry) => (
                    <Area<ChartDatum>
                      key={entry.key}
                      dataKey={entry.key}
                      name={entry.label}
                      type={options.curve ?? "monotone"}
                      stackId={
                        options.stacked || normalized ? "total" : undefined
                      }
                      stroke={entry.color}
                      fill={
                        options.gradient
                          ? `url(#${id}-${entry.key})`
                          : entry.color
                      }
                      fillOpacity={options.gradient ? 1 : 0.22}
                      strokeWidth={2}
                      isAnimationActive={false}
                    />
                  ))}
                </AreaChart>
              ) : type === "line" ? (
                <LineChart
                  data={values}
                  margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
                  accessibilityLayer
                >
                  {axes}
                  {tooltip}
                  {visibleSeries.map((entry) => (
                    <Line<ChartDatum>
                      key={entry.key}
                      dataKey={entry.key}
                      name={entry.label}
                      type={options.curve ?? "linear"}
                      stroke={entry.color}
                      strokeWidth={2.5}
                      dot={
                        options.dots === false
                          ? false
                          : { r: 3, fill: entry.color, strokeWidth: 0 }
                      }
                      activeDot={{
                        r: 5,
                        stroke: "var(--background)",
                        strokeWidth: 2,
                      }}
                      isAnimationActive={false}
                    />
                  ))}
                </LineChart>
              ) : (
                <BarChart
                  data={values}
                  layout={horizontal ? "vertical" : "horizontal"}
                  stackOffset={options.stacked ? "sign" : "none"}
                  margin={{
                    top: options.showLabels ? 20 : 8,
                    right: horizontal && options.showLabels ? 28 : 8,
                    bottom: 0,
                    left: 0,
                  }}
                  accessibilityLayer
                >
                  {axes}
                  {tooltip}
                  {configuredSeries.map((entry) => (
                    <Bar<ChartDatum>
                      key={entry.key}
                      dataKey={entry.key}
                      name={entry.label}
                      fill={entry.color}
                      stackId={options.stacked ? "total" : undefined}
                      radius={horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
                      shape={
                        options.stacked
                          ? (props: BarShapeProps) => (
                              <Rectangle
                                {...props}
                                x={props.x + Math.min(0, props.width)}
                                y={props.y + Math.min(0, props.height)}
                                width={Math.abs(props.width)}
                                height={Math.abs(props.height)}
                                radius={stackedBarRadius(
                                  values[props.originalDataIndex],
                                  entry.key,
                                  configuredSeries,
                                  Boolean(horizontal)
                                )}
                              />
                            )
                          : undefined
                      }
                      maxBarSize={32}
                      isAnimationActive={false}
                    >
                      {options.showLabels && (
                        <LabelList
                          dataKey={entry.key}
                          position={horizontal ? "right" : "top"}
                          fill="var(--foreground)"
                          fontSize={11}
                        />
                      )}
                    </Bar>
                  ))}
                </BarChart>
              )}
            </ResponsiveContainer>
            {((type === "donut" && options.centerText !== false) ||
              (isRadial && options.centerText)) && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
              >
                <span className="text-xl font-semibold tabular-nums">
                  {format.format(total)}
                  {unit}
                </span>
                <span className="mt-1 text-xs text-muted-foreground">
                  {valueLabel}
                </span>
              </div>
            )}
          </>
        )}
      </div>
      {(isPie ||
        isRadial ||
        options.showLegend ||
        interactiveLegend ||
        configuredSeries.length > 1) &&
        values.length > 0 && (
          <ul
            className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground"
            aria-label={title}
          >
            {(isPie || isRadial
              ? pieData.map((item) => ({
                  label: `${item.label} ${isPie ? Math.round((item.value / total) * 100) + "%" : format.format(item.value) + unit}`,
                  fill: item.fill,
                }))
              : configuredSeries.map((entry) => ({
                  label: entry.label,
                  fill: entry.color,
                }))
            ).map((item, index) => {
              const entry = configuredSeries[index]
              const visible = visibleSeries.some(series => series.key === entry?.key)
              const content = <><span aria-hidden="true" className="size-2 shrink-0 rounded-sm" style={{ background: item.fill }} /><span>{item.label}</span></>
              return (
              <li
                key={`${item.label}-${index}`}
                className="inline-flex items-center gap-1.5"
              >
                {interactiveLegend ? <button
                  type="button"
                  aria-pressed={visible}
                  aria-disabled={visible && visibleSeries.length === 1}
                  onClick={() => toggleSeries(entry.key)}
                  className={cn("inline-flex min-h-8 items-center gap-1.5 rounded-sm px-1 text-base focus-visible:outline-2 focus-visible:outline-ring", visible ? "text-foreground" : "text-muted-foreground opacity-50 line-through")}
                >{content}</button> : content}
              </li>
            )})}
          </ul>
        )}
      <div className="sr-only"><table>
        <caption>{title}</caption>
        <thead>
          <tr>
            <th scope="col">{title}</th>
            {configuredSeries.map((entry) => (
              <th key={entry.key} scope="col">
                {entry.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {values.map((item, index) => (
            <tr key={`${item.label}-${index}`}>
              <th scope="row">{item.label}</th>
              {configuredSeries.map((entry) => (
                <td key={entry.key}>
                  {typeof item[entry.key] === "number" && Number.isFinite(item[entry.key]) ? `${format.format(item[entry.key]!)}${unit}` : "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table></div>
    </figure>
  )
}

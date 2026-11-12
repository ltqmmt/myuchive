import { useId } from "react"

/** Small, dependency-free chart for marketing previews. */
export function CompactBarChart({ data, title, valueLabel }: {
  data: { label: string; value: number }[]; title: string; valueLabel: string
}) {
  const id = useId()
  const maximum = Math.max(1, ...data.map(item => item.value))
  const ceiling = Math.ceil(maximum / 3 / 5) * 5 * 3
  const step = 264 / Math.max(1, data.length)
  return <svg viewBox="0 0 300 180" className="h-full w-full overflow-visible" role="img" aria-labelledby={id}>
    <title id={id}>{`${title}: ${data.map(item => `${item.label} ${item.value} ${valueLabel}`).join(", ")}`}</title>
    {[0, 1, 2, 3].map(tick => <g key={tick}>
      <line x1="30" x2="298" y1={150 - tick * 46} y2={150 - tick * 46} stroke="var(--border)" strokeDasharray="3 3" />
      <text x="24" y={154 - tick * 46} textAnchor="end" fill="var(--muted-foreground)" fontSize="11">{Math.round(ceiling * tick / 3)}</text>
    </g>)}
    {data.map((item, index) => {
      const height = Math.max(0, item.value / ceiling * 138)
      const x = 34 + index * step
      return <g key={index}>
        <rect x={x} y={150-height} width={Math.max(1,step-10)} height={height} rx="4" fill="var(--primary)"><title>{`${item.label}: ${item.value} ${valueLabel}`}</title></rect>
        <text x={x+(step-10)/2} y="172" textAnchor="middle" fill="var(--muted-foreground)" fontSize="11">{item.label}</text>
      </g>
    })}
  </svg>
}

import { TODAY, type Show } from "@/lib/show-data"

export type CastRole = { role: string; actors: string[] }

export type Performance = {
  id: string
  showId: string
  /** YYYY-MM-DD */
  date: string
  /** HH:MM */
  time: string
  pair: { role: string; actor: string }[]
}

/* 공연 일정과 캐스팅 페어는 화면 확인용 예시이며, 배우 이름은 모두 가상의 이름이다. */

export const RUN = { start: "2026-10-27", end: "2026-12-13" }

export const castRoles: Record<string, CastRole[]> = {
  "winter-garden": [
    { role: "해온", actors: ["이서진", "한결"] },
    { role: "도윤", actors: ["박건우", "정하람"] },
  ],
  elisabeth: [
    { role: "엘리자벳", actors: ["한서윤", "윤채원"] },
    { role: "죽음", actors: ["도하준", "서이안", "류시온"] },
    { role: "루케니", actors: ["강민혁", "오태경"] },
  ],
  "death-note": [
    { role: "라이토", actors: ["차도윤", "백시우"] },
    { role: "L", actors: ["문태하", "권이준"] },
    { role: "류크", actors: ["남궁현", "임재오"] },
  ],
  "sweeney-todd": [
    { role: "스위니 토드", actors: ["정우진", "하태성"] },
    { role: "러빗 부인", actors: ["김라희", "송다은"] },
  ],
}

function parse(date: string) {
  const [y, m, d] = date.split("-").map(Number)
  return new Date(y, m - 1, d)
}

export function toIso(date: Date) {
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${date.getFullYear()}-${m}-${d}`
}

/** 월요일 휴연, 화~금 저녁 1회(수요일은 낮 공연 추가), 주말 낮·저녁 2회 */
function timesFor(date: Date, eveningTime: string) {
  const day = date.getDay()
  if (day === 1) return []
  if (day === 0 || day === 6) return ["14:00", "19:00"]
  if (day === 3) return ["15:00", eveningTime]
  return [eveningTime]
}

const cache = new Map<string, Performance[]>()

export function performancesOf(show: Show): Performance[] {
  const hit = cache.get(show.id)
  if (hit) return hit
  const roles = castRoles[show.id] ?? []
  const evening = show.todayLabel.match(/\d{2}:\d{2}/)?.[0] ?? "19:30"
  const list: Performance[] = []
  let slot = 0
  for (let d = parse(RUN.start); d <= parse(RUN.end); d.setDate(d.getDate() + 1)) {
    for (const time of timesFor(d, evening)) {
      const date = toIso(d)
      list.push({
        id: `${date}T${time}`,
        showId: show.id,
        date,
        time,
        // 역할마다 다른 주기로 돌려서 여러 조합의 페어가 고르게 나오게 한다.
        pair: roles.map((r, i) => ({
          role: r.role,
          actor: r.actors[(slot * (i + 1) + Math.floor(slot / (i + 2))) % r.actors.length],
        })),
      })
      slot++
    }
  }
  cache.set(show.id, list)
  return list
}

export function performancesOn(show: Show, date: string) {
  return performancesOf(show).filter((p) => p.date === date)
}

export function findPerformance(show: Show, id: string | undefined) {
  return id ? performancesOf(show).find((p) => p.id === id) : undefined
}

/** 오늘 공연이 있으면 오늘, 없으면 가장 가까운 다음 공연 */
export function defaultPerformance(show: Show) {
  const list = performancesOf(show)
  const today = list.filter((p) => p.date === TODAY)
  if (today.length) return today[today.length - 1]
  return list.find((p) => p.date > TODAY) ?? list[list.length - 1]
}

/** 후기의 관람일(MM.DD)에 해당하는 저녁 공연 */
export function performanceForReview(show: Show, watchedOn: string) {
  const [m, d] = watchedOn.split(".")
  const list = performancesOn(show, `2026-${m}-${d}`)
  return list[list.length - 1]
}

export function pairLabel(p: Performance, sep = " · ") {
  return p.pair.map((x) => `${x.role} ${x.actor}`).join(sep)
}

export function pairShort(p: Performance) {
  return p.pair.map((x) => x.actor).join("·")
}

export function isPast(p: Performance) {
  return p.date <= TODAY
}

export function formatPerformance(p: Performance) {
  const d = parse(p.date)
  const w = "일월화수목금토"[d.getDay()]
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${w}) ${p.time}`
}

"use client"

import { useSyncExternalStore } from "react"

import { getShow, seedRecords, TODAY, type RecordEntry, type ShowRecord } from "@/lib/show-data"

export type CustomEntry = {
  id: string
  numberId: string
  text: string
}

export type Draft = {
  texts: Record<string, string>
  custom: CustomEntry[]
  startedAt: number | null
}

export type StoreState = {
  bookmarks: string[]
  records: ShowRecord[]
  /** 공연별 작성 중인 기록 */
  drafts: Record<string, Draft>
}

const STORAGE_KEY = "myuchive:v2"
const LEGACY_KEY = "myuchive:v1"

export const emptyDraft: Draft = { texts: {}, custom: [], startedAt: null }

const initialState: StoreState = {
  bookmarks: [],
  records: seedRecords,
  drafts: {},
}

let state: StoreState = initialState
let loaded = false
const listeners = new Set<() => void>()

/** v1(공연 1개)에 저장된 기록·북마크·작성 중인 기록을 겨울 정원 공연으로 옮긴다. */
function migrateV1(raw: string): StoreState {
  const v1 = JSON.parse(raw) as {
    bookmarks?: string[]
    records?: (Omit<ShowRecord, "showId"> & { showId?: string })[]
    draft?: Partial<Draft>
  }
  const num = (id: string) => (/^n\d+$/.test(id) ? `wg-${id.slice(1)}` : id)
  const rev = (id: string) => (/^r\d+$/.test(id) ? `wg-r${id.slice(1)}` : id)
  const records = (v1.records ?? seedRecords).map((r) => ({
    ...r,
    showId: r.showId ?? "winter-garden",
    entries: r.entries.map((e) => ({ ...e, numberId: num(e.numberId) })),
  }))
  const draft = v1.draft
  return {
    bookmarks: (v1.bookmarks ?? []).map(rev),
    records,
    drafts: draft
      ? {
          "winter-garden": {
            texts: Object.fromEntries(Object.entries(draft.texts ?? {}).map(([k, v]) => [num(k), v])),
            custom: (draft.custom ?? []).map((e) => ({ ...e, numberId: num(e.numberId) })),
            startedAt: draft.startedAt ?? null,
          },
        }
      : {},
  }
}

/** 엘리자벳 넘버를 1막·2막 전체 목록으로 바꾸기 전의 id를 새 id로 옮긴다. */
const ELISABETH_IDS: Record<string, string> = {
  "el-1": "el-1-0",
  "el-2": "el-1-1",
  "el-3": "el-1-2b",
  "el-4": "el-1-7b",
  "el-5": "el-1-8b",
  "el-6": "el-2-1a",
  "el-7": "el-1-9c",
}

function migrateElisabeth(s: StoreState): StoreState {
  const map = (id: string) => ELISABETH_IDS[id] ?? id
  const draft = s.drafts.elisabeth
  return {
    ...s,
    records: s.records.map((r) =>
      r.showId === "elisabeth" ? { ...r, entries: r.entries.map((e) => ({ ...e, numberId: map(e.numberId) })) } : r,
    ),
    drafts: draft
      ? {
          ...s.drafts,
          elisabeth: {
            ...draft,
            texts: Object.fromEntries(Object.entries(draft.texts).map(([k, v]) => [map(k), v])),
            custom: draft.custom.map((e) => ({ ...e, numberId: map(e.numberId) })),
          },
        }
      : s.drafts,
  }
}

function load() {
  if (loaded || typeof window === "undefined") return
  loaded = true
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const saved = JSON.parse(raw) as Partial<StoreState>
      state = {
        bookmarks: Array.isArray(saved.bookmarks) ? saved.bookmarks : initialState.bookmarks,
        records: Array.isArray(saved.records) ? saved.records : initialState.records,
        drafts: saved.drafts && typeof saved.drafts === "object" ? saved.drafts : {},
      }
      state = migrateElisabeth(state)
      return
    }
    const legacy = window.localStorage.getItem(LEGACY_KEY)
    if (legacy) {
      state = migrateV1(legacy)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      window.localStorage.removeItem(LEGACY_KEY)
    }
  } catch {
    state = initialState
  }
}

function setState(next: StoreState) {
  state = next
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // 저장소를 쓸 수 없어도 화면은 메모리 상태로 계속 동작한다.
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  load()
  return state
}

function getServerSnapshot() {
  return initialState
}

export function useRecordStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function draftOf(store: StoreState, showId: string): Draft {
  return store.drafts[showId] ?? emptyDraft
}

function updateDraft(showId: string, update: (draft: Draft) => Draft) {
  setState({ ...state, drafts: { ...state.drafts, [showId]: update(draftOf(state, showId)) } })
}

export function toggleBookmark(reviewId: string) {
  const has = state.bookmarks.includes(reviewId)
  setState({
    ...state,
    bookmarks: has ? state.bookmarks.filter((id) => id !== reviewId) : [...state.bookmarks, reviewId],
  })
}

export function startDraft(showId: string) {
  if (draftOf(state, showId).startedAt != null) return
  updateDraft(showId, (d) => ({ ...d, startedAt: Date.now() }))
}

export function setDraftText(showId: string, numberId: string, text: string) {
  updateDraft(showId, (d) => ({ ...d, texts: { ...d.texts, [numberId]: text } }))
}

export function addCustomEntry(showId: string, numberId: string) {
  const entry: CustomEntry = { id: `own-${Date.now()}`, numberId, text: "" }
  updateDraft(showId, (d) => ({ ...d, startedAt: d.startedAt ?? Date.now(), custom: [...d.custom, entry] }))
  return entry.id
}

export function updateCustomEntry(showId: string, id: string, patch: Partial<Omit<CustomEntry, "id">>) {
  updateDraft(showId, (d) => ({ ...d, custom: d.custom.map((e) => (e.id === id ? { ...e, ...patch } : e)) }))
}

export function removeCustomEntry(showId: string, id: string) {
  updateDraft(showId, (d) => ({ ...d, custom: d.custom.filter((e) => e.id !== id) }))
}

export function draftHasText(draft: Draft) {
  return Object.values(draft.texts).some((t) => t.trim()) || draft.custom.some((e) => e.text.trim())
}

export function saveDraft(showId: string, clueFor: (numberId: string) => RecordEntry["clue"]): string {
  const show = getShow(showId)
  const draft = draftOf(state, showId)
  const entries: RecordEntry[] = show.numbers
    .map((n) => ({ numberId: n.id, text: (draft.texts[n.id] ?? "").trim(), clue: clueFor(n.id) }))
    .filter((entry) => entry.text.length > 0)
  const own: RecordEntry[] = draft.custom
    .map((e) => ({ numberId: e.numberId, text: e.text.trim(), clue: "own" as const }))
    .filter((entry) => entry.text.length > 0)
  entries.push(...own)
  const startedAt = draft.startedAt ?? Date.now()
  const record: ShowRecord = {
    id: `rec-${Date.now()}`,
    showId,
    date: TODAY,
    cast: show.cast,
    entries,
    durationSec: Math.max(1, Math.round((Date.now() - startedAt) / 1000)),
  }
  const drafts = { ...state.drafts }
  delete drafts[showId]
  // 북마크는 그대로 둔다. 작성 화면에서만 단서가 사라진다.
  setState({ ...state, records: [record, ...state.records], drafts })
  return record.id
}

export function deleteRecord(recordId: string) {
  setState({ ...state, records: state.records.filter((r) => r.id !== recordId) })
}

export function countRecordedNumbers(record: ShowRecord) {
  const show = getShow(record.showId)
  return new Set(record.entries.map((e) => e.numberId).filter((id) => show.numbers.some((n) => n.id === id))).size
}

export function countChars(record: ShowRecord) {
  return record.entries.reduce((sum, entry) => sum + entry.text.length, 0)
}

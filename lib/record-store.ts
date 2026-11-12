"use client"

import { useSyncExternalStore } from "react"

import { numbers, seedRecords, show, type RecordEntry, type ShowRecord } from "@/lib/show-data"

export type Draft = {
  texts: Record<string, string>
  startedAt: number | null
}

export type StoreState = {
  bookmarks: string[]
  records: ShowRecord[]
  draft: Draft
}

const STORAGE_KEY = "myuchive:v1"

const initialState: StoreState = {
  bookmarks: [],
  records: seedRecords,
  draft: { texts: {}, startedAt: null },
}

let state: StoreState = initialState
let loaded = false
const listeners = new Set<() => void>()

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
        draft: saved.draft && typeof saved.draft === "object" ? (saved.draft as Draft) : initialState.draft,
      }
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

export function toggleBookmark(reviewId: string) {
  const has = state.bookmarks.includes(reviewId)
  setState({
    ...state,
    bookmarks: has ? state.bookmarks.filter((id) => id !== reviewId) : [...state.bookmarks, reviewId],
  })
}

export function startDraft() {
  if (state.draft.startedAt != null) return
  setState({ ...state, draft: { ...state.draft, startedAt: Date.now() } })
}

export function setDraftText(numberId: string, text: string) {
  setState({ ...state, draft: { ...state.draft, texts: { ...state.draft.texts, [numberId]: text } } })
}

export function saveDraft(clueFor: (numberId: string) => RecordEntry["clue"]): string {
  const entries: RecordEntry[] = numbers
    .map((n) => ({ numberId: n.id, text: (state.draft.texts[n.id] ?? "").trim(), clue: clueFor(n.id) }))
    .filter((entry) => entry.text.length > 0)
  const startedAt = state.draft.startedAt ?? Date.now()
  const record: ShowRecord = {
    id: `rec-${Date.now()}`,
    date: show.today,
    cast: show.cast,
    entries,
    durationSec: Math.max(1, Math.round((Date.now() - startedAt) / 1000)),
  }
  // 북마크는 그대로 둔다. 작성 화면에서만 단서가 사라진다.
  setState({ ...state, records: [record, ...state.records], draft: { texts: {}, startedAt: null } })
  return record.id
}

export function countChars(record: ShowRecord) {
  return record.entries.reduce((sum, entry) => sum + entry.text.length, 0)
}

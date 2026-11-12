"use client"

import { ArrowRight, Bookmark, Compass, NotebookPen, PenLine, X } from "lucide-react"
import { useState } from "react"

import { ClueField, type Clue } from "@/components/gwangeuk/clue-field"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MobileAppShell, MobileScreenHeading, MobileToolbarButton } from "@/components/ui/mobile-app-shell"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { SuccessMark } from "@/components/ui/success-mark"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  countChars,
  saveDraft,
  setDraftText,
  startDraft,
  toggleBookmark,
  useRecordStore,
  type StoreState,
} from "@/lib/record-store"
import { formatDate, numbers, reviews, show, type AudienceReview, type ShowRecord } from "@/lib/show-data"

type Tab = "explore" | "records" | "bookmarks"
type View = { name: "tabs" } | { name: "write" } | { name: "result"; recordId: string; justSaved: boolean }

function clueFor(numberId: string, bookmarks: string[]): Clue {
  const saved = bookmarks
    .map((id) => reviews.find((review) => review.id === id))
    .find((review): review is AudienceReview => review?.numberId === numberId)
  if (saved) return { kind: "bookmark", text: saved.body, author: saved.author }
  const number = numbers.find((n) => n.id === numberId)!
  return { kind: "ai", text: number.aiReview }
}

export function GwangeukApp() {
  const store = useRecordStore()
  const [tab, setTab] = useState<Tab>("explore")
  const [view, setView] = useState<View>({ name: "tabs" })

  const openWrite = () => setView({ name: "write" })

  if (view.name === "write") {
    return (
      <WriteScreen
        store={store}
        onClose={() => setView({ name: "tabs" })}
        onSaved={(recordId) => setView({ name: "result", recordId, justSaved: true })}
      />
    )
  }

  if (view.name === "result") {
    const record = store.records.find((r) => r.id === view.recordId)
    if (record) {
      return (
        <ResultScreen
          record={record}
          records={store.records}
          justSaved={view.justSaved}
          onBack={() => {
            setTab("records")
            setView({ name: "tabs" })
          }}
        />
      )
    }
  }

  return (
    <MobileAppShell
      navigation={{
        "aria-label": "주요 메뉴",
        value: tab,
        onValueChange: (value) => setTab(value as Tab),
        items: [
          { value: "explore", label: "탐색", icon: <Compass strokeWidth={2} /> },
          { value: "records", label: "내 기록", icon: <NotebookPen strokeWidth={2} /> },
          {
            value: "bookmarks",
            label: "북마크함",
            icon: <Bookmark strokeWidth={2} />,
            badge: store.bookmarks.length || undefined,
          },
        ],
      }}
    >
      {tab === "explore" && <ExploreScreen store={store} onWrite={openWrite} />}
      {tab === "records" && (
        <RecordsScreen
          store={store}
          onWrite={openWrite}
          onOpen={(recordId) => setView({ name: "result", recordId, justSaved: false })}
        />
      )}
      {tab === "bookmarks" && <BookmarksScreen store={store} onExplore={() => setTab("explore")} />}
    </MobileAppShell>
  )
}

/* ───────────── 공연 카드 ───────────── */

function TodayShowCard({ store, onWrite }: { store: StoreState; onWrite: () => void }) {
  const draftCount = Object.values(store.draft.texts).filter((text) => text.trim()).length
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{show.title}</CardTitle>
        <CardDescription>
          {show.todayLabel} · {show.venue}
          <br />
          {show.cast}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full" onClick={onWrite}>
          <PenLine data-icon="inline-start" strokeWidth={2} aria-hidden />
          {draftCount > 0 ? `이어서 기록하기 (${draftCount}/${numbers.length})` : "오늘 공연 기록하기"}
        </Button>
      </CardFooter>
    </Card>
  )
}

/* ───────────── 탐색 ───────────── */

function ReviewCard({ review, bookmarked }: { review: AudienceReview; bookmarked: boolean }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-base font-medium">{review.author}</CardTitle>
        <CardDescription>{review.watchedOn} 관람</CardDescription>
        <CardAction>
          <Button
            variant="ghost"
            size="icon"
            aria-pressed={bookmarked}
            aria-label={bookmarked ? `${review.author}님의 후기 북마크 해제` : `${review.author}님의 후기 북마크`}
            onClick={() => toggleBookmark(review.id)}
            className={bookmarked ? "text-primary" : "text-muted-foreground"}
          >
            <Bookmark strokeWidth={2} fill={bookmarked ? "currentColor" : "none"} aria-hidden />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="leading-relaxed">{review.body}</p>
      </CardContent>
    </Card>
  )
}

function ExploreScreen({ store, onWrite }: { store: StoreState; onWrite: () => void }) {
  return (
    <div className="flex flex-col gap-6 pt-4 pb-6 break-keep">
      <MobileScreenHeading>탐색</MobileScreenHeading>
      <TodayShowCard store={store} onWrite={onWrite} />
      {numbers.map((number) => {
        const list = reviews.filter((review) => review.numberId === number.id)
        return (
          <section key={number.id} aria-labelledby={`explore-${number.id}`} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1 px-1">
              <h2 id={`explore-${number.id}`} className="text-lg font-semibold">
                {number.order}. {number.title}
              </h2>
              <p className="leading-relaxed text-muted-foreground">{number.scene}</p>
            </div>
            {list.map((review) => (
              <ReviewCard key={review.id} review={review} bookmarked={store.bookmarks.includes(review.id)} />
            ))}
          </section>
        )
      })}
    </div>
  )
}

/* ───────────── 작성 (Aha) ───────────── */

type WriteTab = "bookmarks" | "numbers"

function bookmarkedFor(numberId: string, bookmarks: string[]) {
  return bookmarks
    .map((id) => reviews.find((review) => review.id === id))
    .find((review): review is AudienceReview => review?.numberId === numberId)
}

function WriteScreen({
  store,
  onClose,
  onSaved,
}: {
  store: StoreState
  onClose: () => void
  onSaved: (recordId: string) => void
}) {
  const filled = numbers.filter((n) => (store.draft.texts[n.id] ?? "").trim()).length
  const canSave = filled > 0
  const bookmarkedNumbers = numbers.filter((n) => bookmarkedFor(n.id, store.bookmarks))
  const [writeTab, setWriteTab] = useState<WriteTab>(bookmarkedNumbers.length > 0 ? "bookmarks" : "numbers")

  const field = (number: (typeof numbers)[number], clue: Clue) => (
    <ClueField
      label={`${number.title} 기록`}
      clue={clue}
      value={store.draft.texts[number.id] ?? ""}
      onFocus={startDraft}
      onChange={(text) => setDraftText(number.id, text)}
    />
  )

  return (
    <MobileAppShell
      title="오늘의 기록"
      leading={
        <MobileToolbarButton aria-label="닫기" onClick={onClose}>
          <X strokeWidth={2} />
        </MobileToolbarButton>
      }
      bottomAction={
        <Button
          size="md"
          className="w-full"
          disabled={!canSave}
          onClick={() => onSaved(saveDraft((id) => clueFor(id, store.bookmarks).kind))}
        >
          기록 저장
        </Button>
      }
    >
      <div className="flex flex-col gap-6 pt-2 pb-6 break-keep">
        <div className="flex flex-col gap-3 px-1">
          <div>
            <h1 className="text-xl font-semibold">{show.title}</h1>
            <p className="text-muted-foreground">{show.todayLabel}</p>
          </div>
          <Progress value={(filled / numbers.length) * 100} aria-label={`${numbers.length}개 넘버 중 ${filled}개 기록`} />
        </div>

        <Tabs value={writeTab} onValueChange={(value) => setWriteTab(value as WriteTab)} className="gap-6">
          <TabsList sizing="fill">
            <TabsTrigger value="bookmarks">북마크한 후기</TabsTrigger>
            <TabsTrigger value="numbers">실제 목차/넘버</TabsTrigger>
          </TabsList>

          <TabsContent value="bookmarks" className="flex flex-col gap-6">
            {bookmarkedNumbers.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">북마크한 후기가 없어요</CardTitle>
                  <CardDescription className="leading-relaxed">
                    실제 목차/넘버에서 장면 설명과 AI 모의 후기를 보며 기록할 수 있어요.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button className="w-full" onClick={() => setWriteTab("numbers")}>
                    목차/넘버 보기
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              bookmarkedNumbers.map((number) => {
                const review = bookmarkedFor(number.id, store.bookmarks)!
                return (
                  <Card key={number.id}>
                    <CardHeader>
                      <CardTitle className="text-base font-semibold">
                        {number.order}. {number.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {field(number, { kind: "bookmark", text: review.body, author: review.author })}
                    </CardContent>
                  </Card>
                )
              })
            )}
          </TabsContent>

          <TabsContent value="numbers" className="flex flex-col gap-6">
            {numbers.map((number) => (
              <Card key={number.id}>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">
                    {number.order}. {number.title}
                  </CardTitle>
                  <CardDescription className="leading-relaxed">{number.scene}</CardDescription>
                </CardHeader>
                <CardContent>{field(number, { kind: "ai", text: number.aiReview })}</CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </MobileAppShell>
  )
}

/* ───────────── 결과 ───────────── */

function previousRecord(record: ShowRecord, records: ShowRecord[]) {
  return records
    .filter((r) => r.id !== record.id && r.date < record.date)
    .sort((a, b) => b.date.localeCompare(a.date))[0]
}

function formatDuration(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return m > 0 ? `${m}분 ${s}초` : `${s}초`
}

function ResultScreen({
  record,
  records,
  justSaved,
  onBack,
}: {
  record: ShowRecord
  records: ShowRecord[]
  justSaved: boolean
  onBack: () => void
}) {
  const chars = countChars(record)
  const prev = previousRecord(record, records)
  const prevChars = prev ? countChars(prev) : 0
  const compared = numbers.filter(
    (n) => record.entries.some((e) => e.numberId === n.id) || prev?.entries.some((e) => e.numberId === n.id),
  )

  return (
    <MobileAppShell
      title={formatDate(record.date)}
      leading={
        <MobileToolbarButton aria-label="내 기록으로" onClick={onBack}>
          <X strokeWidth={2} />
        </MobileToolbarButton>
      }
    >
      <div className="flex flex-col gap-6 pt-2 pb-8 break-keep">
        {justSaved && (
          <div className="flex flex-col items-center gap-4 pt-4 text-center">
            <SuccessMark label="저장 완료" />
            <MobileScreenHeading className="text-center">오늘의 순간을 남겼어요</MobileScreenHeading>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              {show.title} · {formatDate(record.date)}
            </CardTitle>
            <CardDescription>{record.cast}</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-3 gap-2 text-center">
              <Stat label="기록한 넘버" value={`${record.entries.length}/${numbers.length}`} />
              <Stat label="글자 수" value={chars.toLocaleString("ko-KR")} />
              <Stat label="작성 시간" value={formatDuration(record.durationSec)} />
            </dl>
          </CardContent>
          {prev && (
            <CardFooter className="pb-(--card-spacing)">
              <p className="text-muted-foreground">
                {formatDate(prev.date)} 기록보다 {chars >= prevChars ? `${chars - prevChars}자 더` : `${prevChars - chars}자 적게`} 남겼어요.
              </p>
            </CardFooter>
          )}
        </Card>

        <section aria-labelledby="compare-heading" className="flex flex-col gap-3">
          <h2 id="compare-heading" className="px-1 text-lg font-semibold">
            {prev ? `${formatDate(prev.date)} 회차와 비교` : "오늘의 감상"}
          </h2>
          {compared.map((number) => {
            const now = record.entries.find((e) => e.numberId === number.id)
            const before = prev?.entries.find((e) => e.numberId === number.id)
            return (
              <Card key={number.id} size="sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">
                    {number.order}. {number.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <Entry label={formatDate(record.date)} text={now?.text} current />
                  {prev && (
                    <>
                      <Separator />
                      <Entry label={formatDate(prev.date)} text={before?.text} />
                    </>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </section>

        <Button variant="tertiary" className="w-full" onClick={onBack}>
          내 기록 보기
          <ArrowRight data-icon="inline-end" strokeWidth={2} aria-hidden />
        </Button>
      </div>
    </MobileAppShell>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-lg font-semibold tabular-nums">{value}</dd>
    </div>
  )
}

function Entry({ label, text, current }: { label: string; text?: string; current?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <div>
        <Badge variant={current ? "default" : "secondary"}>{label}</Badge>
      </div>
      <p className={text ? "leading-relaxed" : "text-muted-foreground"}>{text ?? "기록 없음"}</p>
    </div>
  )
}

/* ───────────── 내 기록 ───────────── */

function RecordsScreen({
  store,
  onWrite,
  onOpen,
}: {
  store: StoreState
  onWrite: () => void
  onOpen: (recordId: string) => void
}) {
  return (
    <div className="flex flex-col gap-6 pt-4 pb-6 break-keep">
      <MobileScreenHeading>내 기록</MobileScreenHeading>
      <TodayShowCard store={store} onWrite={onWrite} />
      <div className="flex flex-col gap-3">
        {store.records.map((record) => (
          <Card key={record.id} size="sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                {show.title} · {formatDate(record.date)}
              </CardTitle>
              <CardDescription>
                넘버 {record.entries.length}개 · {countChars(record).toLocaleString("ko-KR")}자
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-2 leading-relaxed">{record.entries[0]?.text}</p>
            </CardContent>
            <CardFooter>
              <Button variant="tertiary" className="w-full" onClick={() => onOpen(record.id)}>
                감상 비교하기
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ───────────── 북마크함 ───────────── */

function BookmarksScreen({ store, onExplore }: { store: StoreState; onExplore: () => void }) {
  const saved = store.bookmarks
    .map((id) => reviews.find((review) => review.id === id))
    .filter((review): review is AudienceReview => review != null)

  return (
    <div className="flex flex-col gap-6 pt-4 pb-6 break-keep">
      <MobileScreenHeading>북마크함</MobileScreenHeading>
      {saved.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">아직 북마크한 후기가 없어요</CardTitle>
            <CardDescription className="leading-relaxed">
              공연 전에 다른 관객의 후기를 북마크하면, 기록할 때 해당 넘버에 단서로 보여요.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" onClick={onExplore}>
              후기 둘러보기
            </Button>
          </CardFooter>
        </Card>
      ) : (
        numbers
          .filter((number) => saved.some((review) => review.numberId === number.id))
          .map((number) => (
            <section key={number.id} aria-labelledby={`bm-${number.id}`} className="flex flex-col gap-3">
              <h2 id={`bm-${number.id}`} className="px-1 text-lg font-semibold">
                {number.order}. {number.title}
              </h2>
              {saved
                .filter((review) => review.numberId === number.id)
                .map((review) => (
                  <ReviewCard key={review.id} review={review} bookmarked />
                ))}
            </section>
          ))
      )}
    </div>
  )
}

"use client"

import { ArrowRight, Bookmark, ChevronLeft, Compass, NotebookPen, PenLine, Plus, Trash2, X } from "lucide-react"
import { useState, type ReactNode } from "react"

import { ClueField, type Clue } from "@/components/gwangeuk/clue-field"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { LikeButton } from "@/components/ui/like-button"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  MobileAppShell,
  MobileListCard,
  MobileScreenHeading,
  MobileToolbarButton,
} from "@/components/ui/mobile-app-shell"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { SuccessMark } from "@/components/ui/success-mark"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  addCustomEntry,
  countChars,
  countRecordedNumbers,
  deleteRecord,
  draftHasText,
  draftOf,
  removeCustomEntry,
  saveDraft,
  setDraftPerformance,
  setDraftText,
  startDraft,
  toggleBookmark,
  toggleLike,
  updateCustomEntry,
  useRecordStore,
  type StoreState,
} from "@/lib/record-store"
import {
  defaultPerformance,
  findPerformance,
  formatPerformance,
  isPast,
  pairLabel,
  pairShort,
  performanceForReview,
  performancesOf,
  performancesOn,
  RUN,
  toIso,
  type Performance,
} from "@/lib/schedule"
import {
  formatDate,
  getShow,
  groupByAct,
  numberName,
  shows,
  TODAY,
  WHOLE_SHOW,
  type AudienceReview,
  type Show,
  type ShowRecord,
} from "@/lib/show-data"

type Tab = "explore" | "records" | "bookmarks"
type View =
  | { name: "tabs" }
  | { name: "write"; showId: string }
  | { name: "result"; recordId: string; justSaved: boolean }

function bookmarkedFor(show: Show, numberId: string, bookmarks: string[]) {
  return bookmarks
    .map((id) => show.reviews.find((review) => review.id === id))
    .find((review): review is AudienceReview => review?.numberId === numberId)
}

function clueFor(show: Show, numberId: string, bookmarks: string[]): Clue {
  const saved = bookmarkedFor(show, numberId, bookmarks)
  if (saved) return { kind: "bookmark", text: saved.body, author: saved.author }
  const number = show.numbers.find((n) => n.id === numberId)!
  return { kind: "ai", text: number.aiReview }
}

function numberLabel(show: Show, numberId: string) {
  const number = show.numbers.find((n) => n.id === numberId)
  return number ? numberName(number) : "공연 전체"
}

function filledNumbers(show: Show, store: StoreState) {
  const draft = draftOf(store, show.id)
  return show.numbers.filter(
    (n) => (draft.texts[n.id] ?? "").trim() || draft.custom.some((e) => e.numberId === n.id && e.text.trim()),
  ).length
}

export function GwangeukApp() {
  const store = useRecordStore()
  const [tab, setTab] = useState<Tab>("explore")
  const [exploreShowId, setExploreShowId] = useState<string | null>(null)
  const [view, setView] = useState<View>({ name: "tabs" })

  const openWrite = (showId: string) => setView({ name: "write", showId })
  const backToRecords = () => {
    setTab("records")
    setView({ name: "tabs" })
  }

  if (view.name === "write") {
    return (
      <WriteScreen
        show={getShow(view.showId)}
        store={store}
        onClose={() => setView({ name: "tabs" })}
        onSaved={(recordId) => setView({ name: "result", recordId, justSaved: true })}
      />
    )
  }

  if (view.name === "result") {
    const record = store.records.find((r) => r.id === view.recordId)
    if (record) {
      return <ResultScreen record={record} records={store.records} justSaved={view.justSaved} onBack={backToRecords} />
    }
  }

  const exploreShow = tab === "explore" && exploreShowId ? getShow(exploreShowId) : null

  return (
    <MobileAppShell
      title={exploreShow?.title}
      leading={
        exploreShow ? (
          <MobileToolbarButton aria-label="공연 목록" onClick={() => setExploreShowId(null)}>
            <ChevronLeft strokeWidth={2} />
          </MobileToolbarButton>
        ) : undefined
      }
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
      {tab === "explore" &&
        (exploreShow ? (
          <ShowDetailScreen
            key={exploreShow.id}
            show={exploreShow}
            store={store}
            onWrite={(performanceId) => {
              setDraftPerformance(exploreShow.id, performanceId)
              openWrite(exploreShow.id)
            }}
          />
        ) : (
          <ShowListScreen store={store} onOpen={setExploreShowId} />
        ))}
      {tab === "records" && (
        <RecordsScreen
          store={store}
          onExplore={() => setTab("explore")}
          onOpen={(recordId) => setView({ name: "result", recordId, justSaved: false })}
        />
      )}
      {tab === "bookmarks" && (
        <BookmarksScreen
          store={store}
          onExplore={() => {
            setExploreShowId(null)
            setTab("explore")
          }}
        />
      )}
    </MobileAppShell>
  )
}

/* ───────────── 탐색: 공연 목록 ───────────── */

function ShowListScreen({ store, onOpen }: { store: StoreState; onOpen: (showId: string) => void }) {
  return (
    <div className="flex flex-col gap-6 pt-4 pb-6 break-keep">
      <MobileScreenHeading>탐색</MobileScreenHeading>
      <ul className="flex flex-col gap-3">
        {shows.map((show) => {
          const saved = show.reviews.filter((r) => store.bookmarks.includes(r.id)).length
          const inProgress = draftHasText(draftOf(store, show.id))
          return (
            <li key={show.id}>
              <MobileListCard
                href={`#${show.id}`}
                onClick={(event) => {
                  event.preventDefault()
                  onOpen(show.id)
                }}
              >
                <span className="flex flex-col gap-1">
                  <span className="text-lg font-semibold">{show.title}</span>
                  <span className="font-normal text-muted-foreground">
                    {formatDate(RUN.start)} ~ {formatDate(RUN.end)} · {show.venue}
                  </span>
                  <span className="font-normal text-muted-foreground">
                    후기 {show.reviews.length}개{saved > 0 && ` · 북마크 ${saved}개`}
                    {inProgress && " · 작성 중"}
                  </span>
                </span>
              </MobileListCard>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/* ───────────── 탐색: 공연 상세 ───────────── */

function ActHeading({ act }: { act: 1 | 2 }) {
  return <h2 className="px-1 text-xl font-semibold">{act}막</h2>
}

type SortKey = "number" | "likes" | "bookmarks" | "recent"

function reviewCounts(review: AudienceReview, store: StoreState) {
  return {
    liked: store.likes.includes(review.id),
    bookmarked: store.bookmarks.includes(review.id),
    likes: review.likes + (store.likes.includes(review.id) ? 1 : 0),
    bookmarks: review.bookmarks + (store.bookmarks.includes(review.id) ? 1 : 0),
  }
}

/**
 * likes/bookmarks: 많은 순, recent: 최근 관람일 순(같은 날이면 나중에 등록된 후기 먼저),
 * number: 넘버 안에서는 좋아요 많은 순.
 */
function sortReviews(list: AudienceReview[], key: SortKey, store: StoreState) {
  const watched = (r: AudienceReview) => r.watchedOn.replace(".", "")
  const order = new Map(list.map((r, i) => [r.id, i]))
  return [...list].sort((a, b) => {
    if (key === "recent")
      return watched(b).localeCompare(watched(a)) || order.get(b.id)! - order.get(a.id)!
    const field = key === "bookmarks" ? "bookmarks" : "likes"
    return reviewCounts(b, store)[field] - reviewCounts(a, store)[field]
  })
}

function ReviewCard({
  review,
  show,
  store,
  showNumber,
}: {
  review: AudienceReview
  show: Show
  store: StoreState
  /** 넘버 구분 없이 나열할 때 어느 넘버의 후기인지 보여준다 */
  showNumber?: boolean
}) {
  const { liked, bookmarked, likes, bookmarks } = reviewCounts(review, store)
  const performance = performanceForReview(show, review.watchedOn)
  const number = showNumber ? show.numbers.find((n) => n.id === review.numberId) : undefined
  return (
    <Card size="sm">
      {number && (
        <div className="px-(--card-spacing)">
          <Badge variant="secondary">{numberName(number)}</Badge>
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-base font-medium">{review.author}</CardTitle>
        <CardDescription>
          {review.watchedOn} 관람{performance && ` · ${pairShort(performance)}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="leading-relaxed">{review.body}</p>
      </CardContent>
      <CardFooter className="gap-4 pt-0 pb-2">
        <div className="flex items-center">
          <LikeButton
            key={String(liked)}
            defaultLiked={liked}
            label={`${review.author}님의 후기 좋아요`}
            unlikeLabel={`${review.author}님의 후기 좋아요 취소`}
            onLikedChange={() => toggleLike(review.id)}
          />
          <span className="text-muted-foreground tabular-nums">
            <span className="sr-only">좋아요 </span>
            {likes.toLocaleString("ko-KR")}
          </span>
        </div>
        <div className="flex items-center gap-1">
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
          <span className="text-muted-foreground tabular-nums">
            <span className="sr-only">북마크 </span>
            {bookmarks.toLocaleString("ko-KR")}
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}

function toDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d)
}

function ScheduleCard({
  show,
  store,
  performance,
  onSelect,
  onWrite,
}: {
  show: Show
  store: StoreState
  performance: Performance
  onSelect: (p: Performance) => void
  onWrite: () => void
}) {
  const sameDay = performancesOn(show, performance.date)
  const playDates = new Set(performancesOf(show).map((p) => p.date))
  const draft = draftOf(store, show.id)
  const hasDraft = draftHasText(draft) && draft.performanceId === performance.id
  const past = isPast(performance)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{show.title}</CardTitle>
        <CardDescription>
          {show.venue} · 후기 {show.reviews.length}개
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex justify-center">
          <Calendar
            selected={toDate(performance.date)}
            today={toDate(TODAY)}
            disabled={(date) => !playDates.has(toIso(date))}
            onSelect={(date) => {
              if (!date) return
              const list = performancesOn(show, toIso(date))
              if (list.length) onSelect(list[list.length - 1])
            }}
          />
        </div>
        <Separator />
        <div className="flex flex-col gap-3">
          <p className="font-semibold">{formatPerformance(performance).replace(/ \d{2}:\d{2}$/, "")}</p>
          <ToggleGroup
            type="single"
            variant="outline"
            value={performance.id}
            onValueChange={(id) => {
              const next = sameDay.find((p) => p.id === id)
              if (next) onSelect(next)
            }}
            aria-label="공연 시간"
          >
            {sameDay.map((p) => (
              <ToggleGroupItem key={p.id} value={p.id}>
                {p.time}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          {performance.pair.length > 0 && (
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
              {performance.pair.map((x) => (
                <div key={x.role} className="contents">
                  <dt className="text-muted-foreground">{x.role}</dt>
                  <dd className="font-medium">{x.actor}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled={!past} onClick={onWrite}>
          <PenLine data-icon="inline-start" strokeWidth={2} aria-hidden />
          {!past
            ? "관람 후 기록할 수 있어요"
            : hasDraft
              ? `이어서 기록하기 (${filledNumbers(show, store)}/${show.numbers.length})`
              : "이 공연 기록하기"}
        </Button>
      </CardFooter>
    </Card>
  )
}

const REVIEW_PREVIEW = 2

const FLAT_PAGE = 10

/** 넘버 구분 없이 정렬 기준대로 모든 후기를 나열한다. */
function FlatReviews({ show, store, sort }: { show: Show; store: StoreState; sort: SortKey }) {
  const [count, setCount] = useState(FLAT_PAGE)
  const list = sortReviews(show.reviews, sort, store)
  const rest = list.length - count
  return (
    <ol className="flex flex-col gap-3" aria-label="후기 목록">
      {list.slice(0, count).map((review) => (
        <li key={review.id}>
          <ReviewCard review={review} show={show} store={store} showNumber />
        </li>
      ))}
      {rest > 0 && (
        <li className="flex justify-center">
          <Button variant="ghost" onClick={() => setCount(count + FLAT_PAGE)}>
            후기 {Math.min(rest, FLAT_PAGE)}개 더 보기 ({count}/{list.length})
          </Button>
        </li>
      )}
    </ol>
  )
}

function NumberReviews({
  number,
  show,
  store,
}: {
  number: Show["numbers"][number]
  show: Show
  store: StoreState
}) {
  const [expanded, setExpanded] = useState(false)
  const list = sortReviews(
    show.reviews.filter((review) => review.numberId === number.id),
    "likes",
    store,
  )
  const visible = expanded ? list : list.slice(0, REVIEW_PREVIEW)
  const hidden = list.length - REVIEW_PREVIEW
  return (
    <section aria-labelledby={`explore-${number.id}`} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1 px-1">
        <h3 id={`explore-${number.id}`} className="text-lg font-semibold">
          {numberName(number)}
        </h3>
        <p className="leading-relaxed text-muted-foreground">{number.scene}</p>
      </div>
      {visible.map((review) => (
        <ReviewCard key={review.id} review={review} show={show} store={store} />
      ))}
      {hidden > 0 && (
        <Button variant="ghost" className="self-center" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>
          {expanded ? "접기" : `후기 ${hidden}개 더 보기`}
        </Button>
      )}
    </section>
  )
}

function ShowDetailScreen({
  show,
  store,
  onWrite,
}: {
  show: Show
  store: StoreState
  onWrite: (performanceId: string) => void
}) {
  const draft = draftOf(store, show.id)
  const [performance, setPerformance] = useState<Performance>(
    () => findPerformance(show, draft.performanceId) ?? defaultPerformance(show),
  )
  const [sort, setSort] = useState<SortKey>("number")

  return (
    <div className="flex flex-col gap-6 pt-2 pb-6 break-keep">
      <ScheduleCard
        show={show}
        store={store}
        performance={performance}
        onSelect={setPerformance}
        onWrite={() => onWrite(performance.id)}
      />

      <div className="flex flex-col gap-3 px-1">
        <h2 className="text-xl font-semibold">관객 후기</h2>
        <ToggleGroup
          type="single"
          variant="outline"
          value={sort}
          onValueChange={(value) => value && setSort(value as SortKey)}
          aria-label="후기 정렬"
          className="flex-wrap"
        >
          <ToggleGroupItem value="number">넘버순</ToggleGroupItem>
          <ToggleGroupItem value="likes">좋아요순</ToggleGroupItem>
          <ToggleGroupItem value="bookmarks">북마크순</ToggleGroupItem>
          <ToggleGroupItem value="recent">최신순</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {sort === "number" ? (
        groupByAct(show.numbers).map(({ act, numbers }) => (
          <div key={act ?? "all"} className="flex flex-col gap-6">
            {act && <ActHeading act={act} />}
            {numbers.map((number) => (
              <NumberReviews key={number.id} number={number} show={show} store={store} />
            ))}
          </div>
        ))
      ) : (
        <FlatReviews key={sort} show={show} store={store} sort={sort} />
      )}
    </div>
  )
}

/* ───────────── 작성 (Aha) ───────────── */

type WriteTab = "write" | "numbers"

function WriteScreen({
  show,
  store,
  onClose,
  onSaved,
}: {
  show: Show
  store: StoreState
  onClose: () => void
  onSaved: (recordId: string) => void
}) {
  const draft = draftOf(store, show.id)
  const performance = findPerformance(show, draft.performanceId)
  const filled = filledNumbers(show, store)
  const canSave = draftHasText(draft)
  const bookmarkedNumbers = show.numbers.filter((n) => bookmarkedFor(show, n.id, store.bookmarks))
  // 북마크가 없으면(최초 작성) 넘버 순서와 장면 설명을 바탕으로 한 AI 모의 후기를 단서로 쓴다.
  const clueNumbers = bookmarkedNumbers.length > 0 ? bookmarkedNumbers : show.numbers
  const [writeTab, setWriteTab] = useState<WriteTab>("write")
  const [focusId, setFocusId] = useState<string | null>(null)

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
          onClick={() => onSaved(saveDraft(show.id, (id) => clueFor(show, id, store.bookmarks).kind))}
        >
          기록 저장
        </Button>
      }
    >
      <div className="flex flex-col gap-6 pt-2 pb-6 break-keep">
        <div className="flex flex-col gap-3 px-1">
          <div>
            <h1 className="text-xl font-semibold">{show.title}</h1>
            <p className="text-muted-foreground">
              {performance ? formatPerformance(performance) : show.todayLabel}
              {performance && performance.pair.length > 0 && (
                <>
                  <br />
                  {pairLabel(performance)}
                </>
              )}
            </p>
          </div>
          <Progress
            value={(filled / show.numbers.length) * 100}
            aria-label={`${show.numbers.length}개 넘버 중 ${filled}개 기록`}
          />
        </div>

        <Tabs value={writeTab} onValueChange={(value) => setWriteTab(value as WriteTab)} className="gap-6">
          <TabsList sizing="fill">
            <TabsTrigger value="write">북마크한 후기</TabsTrigger>
            <TabsTrigger value="numbers">실제 목차/넘버</TabsTrigger>
          </TabsList>

          <TabsContent value="write" className="flex flex-col gap-6">
            {clueNumbers.map((number) => (
              <Card key={number.id}>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">
                    {numberName(number)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ClueField
                    label={`${number.title} 기록`}
                    clue={clueFor(show, number.id, store.bookmarks)}
                    value={draft.texts[number.id] ?? ""}
                    onFocus={() => startDraft(show.id)}
                    onChange={(text) => setDraftText(show.id, number.id, text)}
                  />
                </CardContent>
              </Card>
            ))}

            {draft.custom.map((entry, index) => (
              <Card key={entry.id}>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">내 감상 {index + 1}</CardTitle>
                  <CardAction>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`내 감상 ${index + 1} 삭제`}
                      className="text-muted-foreground"
                      onClick={() => removeCustomEntry(show.id, entry.id)}
                    >
                      <Trash2 strokeWidth={2} aria-hidden />
                    </Button>
                  </CardAction>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <Select
                    value={entry.numberId}
                    onValueChange={(numberId) => updateCustomEntry(show.id, entry.id, { numberId })}
                  >
                    <SelectTrigger className="w-full" aria-label={`내 감상 ${index + 1}의 넘버`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={WHOLE_SHOW}>공연 전체</SelectItem>
                      {show.numbers.map((number) => (
                        <SelectItem key={number.id} value={number.id}>
                          {numberName(number)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Textarea
                    aria-label={`내 감상 ${index + 1}`}
                    autoFocus={entry.id === focusId}
                    value={entry.text}
                    onChange={(event) => updateCustomEntry(show.id, entry.id, { text: event.target.value })}
                    className="min-h-32 resize-none leading-relaxed"
                  />
                </CardContent>
              </Card>
            ))}

            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setFocusId(addCustomEntry(show.id, WHOLE_SHOW))}
            >
              <Plus data-icon="inline-start" strokeWidth={2} aria-hidden />
              직접 작성하기
            </Button>
          </TabsContent>

          <TabsContent value="numbers" className="flex flex-col gap-6">
            {groupByAct(show.numbers).map(({ act, numbers }) => (
              <section key={act ?? "all"} className="flex flex-col gap-3">
                {act && <ActHeading act={act} />}
                <Card>
                  <CardContent>
                    <ol className="flex flex-col gap-4">
                      {numbers.map((number, index) => (
                        <li key={number.id} className="flex flex-col gap-4">
                          {index > 0 && <Separator />}
                          <div className="flex flex-col gap-1">
                            <h3 className="text-base font-semibold">{numberName(number)}</h3>
                            <p className="leading-relaxed text-muted-foreground">{number.scene}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              </section>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </MobileAppShell>
  )
}

/* ───────────── 기록 삭제 확인 ───────────── */

function DeleteRecordDialog({
  record,
  onDeleted,
  children,
}: {
  record: ShowRecord
  onDeleted?: () => void
  children: ReactNode
}) {
  const show = getShow(record.showId)
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>기록을 삭제할까요?</AlertDialogTitle>
          <AlertDialogDescription>
            {show.title} · {formatDate(record.date)} 기록이 삭제되고 되돌릴 수 없어요.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => {
              deleteRecord(record.id)
              onDeleted?.()
            }}
          >
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

/* ───────────── 결과 ───────────── */

function previousRecord(record: ShowRecord, records: ShowRecord[]) {
  return records
    .filter((r) => r.id !== record.id && r.showId === record.showId && r.date < record.date)
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
  const show = getShow(record.showId)
  const chars = countChars(record)
  const prev = previousRecord(record, records)
  const prevChars = prev ? countChars(prev) : 0
  const has = (r: ShowRecord | undefined, id: string) => r?.entries.some((e) => e.numberId === id) ?? false
  const compared = [...show.numbers.map((n) => n.id), WHOLE_SHOW].filter((id) => has(record, id) || has(prev, id))
  const textsOf = (r: ShowRecord | undefined, id: string) =>
    r?.entries.filter((e) => e.numberId === id).map((e) => e.text) ?? []

  return (
    <MobileAppShell
      title={formatDate(record.date)}
      leading={
        <MobileToolbarButton aria-label="내 기록으로" onClick={onBack}>
          <X strokeWidth={2} />
        </MobileToolbarButton>
      }
      trailing={
        <DeleteRecordDialog record={record} onDeleted={onBack}>
          <MobileToolbarButton aria-label="기록 삭제">
            <Trash2 strokeWidth={2} />
          </MobileToolbarButton>
        </DeleteRecordDialog>
      }
    >
      <div className="flex flex-col gap-6 pt-2 pb-8 break-keep">
        {justSaved && (
          <div className="flex flex-col items-center gap-4 pt-4 text-center">
            <SuccessMark label="저장 완료" />
            <MobileScreenHeading className="text-center">
              {record.date === TODAY ? "오늘의 순간을 남겼어요" : "그날의 순간을 남겼어요"}
            </MobileScreenHeading>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              {show.title} · {formatDate(record.date)}
              {record.time && ` ${record.time}`}
            </CardTitle>
            {record.cast && <CardDescription>{record.cast}</CardDescription>}
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-3 gap-2 text-center">
              <Stat label="기록한 넘버" value={`${countRecordedNumbers(record)}/${show.numbers.length}`} />
              <Stat label="글자 수" value={chars.toLocaleString("ko-KR")} />
              <Stat label="작성 시간" value={formatDuration(record.durationSec)} />
            </dl>
          </CardContent>
          {prev && (
            <CardFooter className="pb-(--card-spacing)">
              <p className="text-muted-foreground">
                {formatDate(prev.date)} 기록보다{" "}
                {chars >= prevChars ? `${chars - prevChars}자 더` : `${prevChars - chars}자 적게`} 남겼어요.
              </p>
            </CardFooter>
          )}
        </Card>

        <section aria-labelledby="compare-heading" className="flex flex-col gap-3">
          <h2 id="compare-heading" className="px-1 text-lg font-semibold">
            {prev ? `${formatDate(prev.date)} 회차와 비교` : "오늘의 감상"}
          </h2>
          {compared.map((id) => (
            <Card key={id} size="sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold">{numberLabel(show, id)}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Entry label={formatDate(record.date)} texts={textsOf(record, id)} current />
                {prev && (
                  <>
                    <Separator />
                    <Entry label={formatDate(prev.date)} texts={textsOf(prev, id)} />
                  </>
                )}
              </CardContent>
            </Card>
          ))}
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

function Entry({ label, texts, current }: { label: string; texts: string[]; current?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <Badge variant={current ? "default" : "secondary"}>{label}</Badge>
      </div>
      {texts.length === 0 ? (
        <p className="text-muted-foreground">기록 없음</p>
      ) : (
        texts.map((text, i) => (
          <p key={i} className="leading-relaxed whitespace-pre-line">
            {text}
          </p>
        ))
      )}
    </div>
  )
}

/* ───────────── 내 기록 ───────────── */

function RecordsScreen({
  store,
  onExplore,
  onOpen,
}: {
  store: StoreState
  onExplore: () => void
  onOpen: (recordId: string) => void
}) {
  const records = [...store.records].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
  return (
    <div className="flex flex-col gap-6 pt-4 pb-6 break-keep">
      <MobileScreenHeading>내 기록</MobileScreenHeading>
      {records.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">아직 남긴 기록이 없어요</CardTitle>
            <CardDescription className="leading-relaxed">
              탐색에서 공연을 고르고 오늘 공연을 기록해 보세요.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" onClick={onExplore}>
              공연 둘러보기
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {records.map((record) => {
            const show = getShow(record.showId)
            return (
              <Card key={record.id} size="sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">
                    {show.title} · {formatDate(record.date)}
                    {record.time && ` ${record.time}`}
                  </CardTitle>
                  <CardDescription>
                    {record.cast && (
                      <>
                        {record.cast}
                        <br />
                      </>
                    )}
                    넘버 {countRecordedNumbers(record)}개 · {countChars(record).toLocaleString("ko-KR")}자
                  </CardDescription>
                  <CardAction>
                    <DeleteRecordDialog record={record}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground"
                        aria-label={`${show.title} ${formatDate(record.date)} 기록 삭제`}
                      >
                        <Trash2 strokeWidth={2} aria-hidden />
                      </Button>
                    </DeleteRecordDialog>
                  </CardAction>
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
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ───────────── 북마크함 ───────────── */

function BookmarksScreen({ store, onExplore }: { store: StoreState; onExplore: () => void }) {
  const groups = shows
    .map((show) => ({
      show,
      saved: show.reviews.filter((review) => store.bookmarks.includes(review.id)),
    }))
    .filter((group) => group.saved.length > 0)

  return (
    <div className="flex flex-col gap-6 pt-4 pb-6 break-keep">
      <MobileScreenHeading>북마크함</MobileScreenHeading>
      {groups.length === 0 ? (
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
        groups.map(({ show, saved }) => (
          <section key={show.id} aria-labelledby={`bm-${show.id}`} className="flex flex-col gap-4">
            <h2 id={`bm-${show.id}`} className="px-1 text-xl font-semibold">
              {show.title}
            </h2>
            {show.numbers
              .filter((number) => saved.some((review) => review.numberId === number.id))
              .map((number) => (
                <div key={number.id} className="flex flex-col gap-3">
                  <h3 className="px-1 text-base font-semibold text-muted-foreground">
                    {numberName(number)}
                  </h3>
                  {saved
                    .filter((review) => review.numberId === number.id)
                    .map((review) => (
                      <ReviewCard key={review.id} review={review} show={show} store={store} />
                    ))}
                </div>
              ))}
          </section>
        ))
      )}
    </div>
  )
}

"use client"

import { Bookmark, Sparkles } from "lucide-react"
import { useId } from "react"

import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export type Clue = {
  kind: "bookmark" | "ai"
  text: string
  author?: string
}

type ClueFieldProps = {
  label: string
  clue: Clue
  value: string
  onChange: (value: string) => void
  onFocus?: () => void
}

/**
 * 비어 있을 때만 단서를 50% 불투명도로 겹쳐 보여주는 기록 입력란.
 * 한 글자라도 쓰면 단서가 사라지고, 지우면 다시 나타난다.
 */
export function ClueField({ label, clue, value, onChange, onFocus }: ClueFieldProps) {
  const clueId = useId()
  const showClue = value.length === 0

  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          "flex min-h-6 items-center transition-opacity duration-200 motion-reduce:transition-none",
          showClue ? "opacity-100" : "opacity-0",
        )}
        aria-hidden={!showClue}
      >
        {clue.kind === "bookmark" ? (
          <Badge variant="secondary">
            <Bookmark strokeWidth={2} aria-hidden />
            {clue.author}님의 후기
          </Badge>
        ) : (
          <Badge variant="secondary">
            <Sparkles strokeWidth={2} aria-hidden />
            AI 모의 후기
          </Badge>
        )}
      </div>
      <div className="relative">
        <Textarea
          aria-label={label}
          aria-describedby={showClue ? clueId : undefined}
          value={value}
          onFocus={onFocus}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-40 resize-none leading-relaxed"
        />
        <p
          id={clueId}
          className={cn(
            "pointer-events-none absolute inset-0 overflow-hidden border border-transparent px-[calc(.625rem+4pt)] py-[4pt] text-base leading-relaxed text-foreground select-none",
            "transition-opacity duration-200 motion-reduce:transition-none",
            showClue ? "opacity-50" : "opacity-0",
          )}
        >
          {clue.text}
        </p>
      </div>
    </div>
  )
}

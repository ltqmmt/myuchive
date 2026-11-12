"use client"
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function TablePagination({ count, totalCount = count, page, pageSize, onPageChange, onPageSizeChange, disabled = false, unit = "개" }: {
 count:number;totalCount?:number;page:number;pageSize:number;onPageChange:(page:number)=>void;onPageSizeChange:(size:number)=>void;disabled?:boolean;unit?:string
}) {
 const pages=Math.max(1,Math.ceil(count/pageSize))
 const first=count?Math.min((page-1)*pageSize+1,count):0
 const last=Math.min(page*pageSize,count)
 function commit(input:HTMLInputElement){const value=/^\d+$/.test(input.value.trim())?Number(input.value):page;const next=Math.max(1,Math.min(pages,value));input.value=String(next);if(next!==page)onPageChange(next)}
 return <div className="flex flex-wrap items-center justify-between gap-4" data-slot="table-pagination">
  <p role="status" className="text-base text-muted-foreground">전체 {totalCount.toLocaleString()}{unit}{count!==totalCount?` · 조회 ${count.toLocaleString()}${unit}`:""} · {first.toLocaleString()}–{last.toLocaleString()}{unit} 표시 · 총 {pages.toLocaleString()}페이지</p>
  <div className="flex max-w-full flex-wrap items-center gap-3">
   <Select value={String(pageSize)} disabled={disabled} onValueChange={value=>onPageSizeChange(Number(value))}><SelectTrigger aria-label="페이지당 표시 개수" className="w-auto"><SelectValue/></SelectTrigger><SelectContent>{[10,20,50,100].map(size=><SelectItem key={size} value={String(size)}>{size}{unit}씩</SelectItem>)}</SelectContent></Select>
   <Pagination aria-label="표 페이지 이동" className="m-0 w-auto"><PaginationContent>
    <PaginationItem><Button type="button" variant="tertiary" size="icon" aria-label="첫 페이지" disabled={disabled||page<=1} onClick={()=>onPageChange(1)}><ChevronsLeft aria-hidden="true"/></Button></PaginationItem>
    <PaginationItem><Button type="button" variant="tertiary" size="icon" aria-label="이전 페이지" disabled={disabled||page<=1} onClick={()=>onPageChange(page-1)}><ChevronLeft aria-hidden="true"/></Button></PaginationItem>
    <PaginationItem><div className="flex items-center gap-2 px-1"><Input key={`${page}:${pageSize}`} type="text" inputMode="numeric" aria-label="이동할 페이지" defaultValue={String(page)} disabled={disabled||count===0} className="w-16 text-center tabular-nums" onBlur={event=>commit(event.currentTarget)} onKeyDown={event=>{if(event.key==="Enter"){event.preventDefault();commit(event.currentTarget)}if(event.key==="Escape"){event.currentTarget.value=String(page);event.currentTarget.blur()}}}/><span className="text-base tabular-nums text-muted-foreground">/ {pages}</span></div></PaginationItem>
    <PaginationItem><Button type="button" variant="tertiary" size="icon" aria-label="다음 페이지" disabled={disabled||page>=pages} onClick={()=>onPageChange(page+1)}><ChevronRight aria-hidden="true"/></Button></PaginationItem>
    <PaginationItem><Button type="button" variant="tertiary" size="icon" aria-label="마지막 페이지" disabled={disabled||page>=pages} onClick={()=>onPageChange(pages)}><ChevronsRight aria-hidden="true"/></Button></PaginationItem>
   </PaginationContent></Pagination>
  </div>
 </div>
}

"use client"
import { useEffect, useRef, useState, type ReactNode } from "react"

export function InlineIconCycling({ icons, label, paused = false, interval = 3000, delay = 0 }: { icons: ReactNode[]; label: string; paused?: boolean; interval?: number; delay?: number }) {
  const root = useRef<HTMLSpanElement>(null)
  const [index,setIndex]=useState(0)
  useEffect(()=>{
    const media=window.matchMedia("(prefers-reduced-motion: reduce)")
    if(paused || icons.length<2) return
    let timer: ReturnType<typeof setTimeout>
    let visible=false
    const stop=()=>clearTimeout(timer)
    const schedule=(wait:number)=>{stop();if(visible && !document.hidden && !media.matches) timer=setTimeout(()=>{setIndex(i=>(i+1)%icons.length);schedule(interval)},wait)}
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule(interval+delay)})
    if(root.current) observer.observe(root.current)
    const sync=()=>schedule(interval+delay)
    document.addEventListener("visibilitychange",sync)
    media.addEventListener("change",sync)
    return()=>{stop();observer.disconnect();document.removeEventListener("visibilitychange",sync);media.removeEventListener("change",sync)}
  },[paused,icons.length,interval,delay])
  return <span ref={root} role="img" aria-label={label} className="relative mx-0 inline-block size-[1.05em] overflow-hidden rounded-[.24em] align-[-.12em] bg-transparent text-primary" data-corner="continuous">
    {icons.map((icon,i)=><span key={i} aria-hidden className="absolute inset-0 flex items-center justify-center transition-[opacity,transform,filter] duration-700 ease-in-out motion-reduce:transition-none [&_svg]:size-[.65em]" style={{opacity:i===index?1:0,transform:i===index?"translateY(0) scale(1)":"translateY(18%) scale(.9)",filter:i===index?"blur(0)":"blur(3px)"}}>{icon}</span>)}
  </span>
}

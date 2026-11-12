"use client"

import { createContext, useContext, type CSSProperties, type ReactNode } from "react"

const OverlayStyleContext = createContext<CSSProperties | undefined>(undefined)

export function OverlayStyleProvider({ style, children }: { style: CSSProperties; children: ReactNode }) {
  return <OverlayStyleContext.Provider value={style}>{children}</OverlayStyleContext.Provider>
}

// React context crosses portals; inherited DOM custom properties do not.
export function useOverlayStyle(style?: CSSProperties) {
  const scope = useContext(OverlayStyleContext)
  return scope ? { ...scope, ...style } : style
}

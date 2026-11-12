"use client"

import { ChevronRight } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"

import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Card, CardContent, CardFooter } from "./card"
import { GlassTabBar, type GlassTabBarProps } from "./glass-tabbar"
import styles from "./mobile-app-shell.module.css"
import { ProgressiveBlur } from "./progressive-blur"

type MobileAppShellProps = {
  children: ReactNode
  title?: ReactNode
  leading?: ReactNode
  trailing?: ReactNode
  navigation?: GlassTabBarProps
  bottomAction?: ReactNode
  desktopPreview?: boolean
}

export function MobileAppShell({
  children,
  title,
  leading,
  trailing,
  navigation,
  bottomAction,
  desktopPreview = true,
}: MobileAppShellProps) {
  const hasToolbar = title != null || leading != null || trailing != null
  const hasAction = bottomAction != null
  const hasTabs = !hasAction && navigation != null

  return (
    <div className={styles.preview} data-device-preview={desktopPreview || undefined}>
      <div
        className={styles.shell}
        data-toolbar={hasToolbar || undefined}
        data-footer={hasAction ? "action" : hasTabs ? "tabs" : undefined}
      >
        {hasToolbar && (
          <header className={styles.toolbar}>
            <div className={styles.leading}>{leading}</div>
            <div className={styles.title}>{title}</div>
            <div className={styles.trailing}>{trailing}</div>
          </header>
        )}
        <main className={styles.content} data-slot="mobile-app-content">{children}</main>
        {hasAction && <div className={styles.bottom}><div className={styles.action}>{bottomAction}</div></div>}
        {hasTabs && (
          <div className={styles.bottom}>
            <GlassTabBar
              {...navigation}
              compactOnScroll={navigation.compactOnScroll ?? false}
              className={cn(styles.tabBar, navigation.className)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

type MobileToolbarButtonProps = Omit<ComponentProps<typeof Button>, "size" | "variant"> & {
  "aria-label": string
}

export function MobileToolbarButton({ className, type = "button", ...props }: MobileToolbarButtonProps) {
  return (
    <Button
      {...props}
      type={props.asChild ? undefined : type}
      size="icon"
      variant="ghost"
      className={cn(styles.toolbarButton, className)}
    />
  )
}


export function MobileScreenHeading({ className, ...props }: ComponentProps<"h1">) {
  return <h1 className={cn(styles.screenHeading, className)} {...props} />
}

type MobileListCardProps = ComponentProps<"a"> & { href: string }

export function MobileListCard({ className, children, ...props }: MobileListCardProps) {
  return (
    <a className={cn(styles.listLink, className)} {...props}>
      <Card size="sm" className={styles.listSurface}>
        <CardContent className={styles.listRow}>
          <span>{children}</span>
          <ChevronRight aria-hidden="true" />
        </CardContent>
      </Card>
    </a>
  )
}

type MobileImageCardProps = {
  src: string
  alt: string
  title: ReactNode
  description?: ReactNode
  headingAs?: "h1" | "h2" | "h3"
  className?: string
}

export function MobileImageCard({
  src,
  alt,
  title,
  description,
  headingAs: Heading = "h2",
  className,
}: MobileImageCardProps) {
  return (
    <Card className={cn(styles.imageCard, className)}>
      {/* The image and the blur layers must use the same source and object fit. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className={styles.image} />
      <ProgressiveBlur src={src} />
      <CardFooter className={styles.imageCaption}>
        <Heading className={styles.imageHeading}>{title}</Heading>
        {description != null && <div>{description}</div>}
      </CardFooter>
    </Card>
  )
}

# Compass Design System

## 최우선 문구·타이포그래피 규칙

장식용 작은 라벨·캡션·오버라인과 UI가 이미 전달하는 정보의 중복 설명을 절대 추가하지 않는다. 불필요한 문구는 삭제하고, 필요한 설명은 기본 본문 크기로 쓴다. 새 페이지에도 동일하게 적용하며 아래의 스타일 예시보다 우선한다. 필수 검수 기준은 `skills/compass/references/writing.md`의 최우선 금지 규칙을 따른다.

Compass is the design system for this project. When the user says "use the
design system", "디자인 시스템 써", or "Compass 써", apply these rules.

## Mobile-first web

For a mobile-first Compass product, use `MobileAppShell` from
`components/ui/mobile-app-shell.tsx`. Install `mobile-app-shell` or the
complete `compass` kit from Registry 1.0.16 or later. The shell owns the pale
iPhone desktop preview, home indicator, toolbar, tabs and scroll insets.
The product supplies its own screens, routes and actions. See the
[mobile web guide](https://compass.designcompass.org/compass-mobile-web.md).

Pass `navigation` with the installed `GlassTabBar` item list, selected value,
and change handler. Pass `title`, `leading` and/or `trailing` for the toolbar.
`MobileToolbarButton` uses the Compass icon Button and requires `aria-label`.
A `bottomAction` takes the place of the tabs while the task is active.
Set `desktopPreview={false}` when the route has its own desktop layout.
Omit unneeded toolbar, navigation and action slots.

For the 회차 노트 pattern (Registry 1.0.17 or later), pair the compact centered
toolbar title with a left-aligned `MobileScreenHeading` in the scroll region.
Use `MobileListCard` for a list item that opens a single destination. The whole
card is a link with a trailing chevron, a compact Card surface and a broad,
light shadow. Give multiple rows 12px gaps. For cards with a separate command,
use a plain Card and a Compass Button for the command.
Use `MobileImageCard` for a photo with a title or supporting information.
It pairs the actual Compass `ProgressiveBlur` with a bottom scrim and caption.

## Applying Compass

1. Inspect the target project before changing it. Preserve its framework and
   package manager. Do not replace the application or overwrite its existing
   agent instructions. Merge Compass guidance into its project instructions.
2. In this repository, reuse the actual source in `components/ui`. Outside this
   repository, install a version-pinned Registry release and preserve the target
   project's import aliases. `/llms-full.txt` is a supplementary live reference,
   not a replacement for the chosen version's payloads. The code targets React and Tailwind
   CSS v4. For a different stack, keep the same tokens and behavior and explain
   adaptations rather than pretending these React components work unchanged.
3. Use the exact CSS tokens included in the reference. Treat `app/globals.css`
   as the source of truth. Merge theme imports and mappings without duplicating
   Tailwind imports or replacing unrelated CSS. Preserve light and dark themes.
4. Primary and Accent are #007AFF in light mode and #3390FF in dark mode;
   their foreground is white. Dark mode uses the brighter token consistently for
   text, buttons and primary chart series, not a text-only override.
   Other surfaces remain neutral. Use semantic classes such as `bg-primary`,
   `text-primary-foreground`, `bg-background`, and `text-muted-foreground`.
   Light page background is #ffffff. Desktop Gallery content uses --gallery-background (#f7f7f7 in light mode)
   for the card list. Mobile Gallery content, the filter band, Docs and the header
   use --background (white in light mode). Dark --gallery-background matches --background.
   Dark page background uses oklch(0.19 0 0),
   darker than the gallery preview interior. Gallery preview backgrounds remain
   white in light mode and oklch(0.23 0 0) in dark mode. Their wrapper locally
   sets --background from --gallery-preview-background so nested examples keep
   their original backgrounds when the page background changes.
5. Use Pretendard Variable for UI and heading text. Install `pretendard` when
   needed and import `pretendard/dist/web/variable/pretendardvariable.css` once
   in the application entry point. Code uses `font-mono`.
6. Import named React icon components directly from `lucide-react` and render
   them in JSX (for example, `<Copy />`). Use 2 stroke width. Icons alongside
   text use `--text-icon-size: 1em`, inheriting the label’s font. Both height
   and width follow the label font size (14px text → 14px SVG box).
   Preserve each icon’s original viewBox and align it with the label. Shared text Buttons, Badges,
   Selects, text Tabs and menu items apply this automatically. Use `text-icon`
   on icons in custom text links, navigation, lists and disclosure labels;
   `data-icon="inline-start"` / `inline-end` also opts in. Center them against
   the first text line, including multiline lists; use `text-icon-first-line` in
   start-aligned lists to share the same sizing token. Icon-only buttons, toolbars,
   checkbox indicators, illustrations and charts retain their established sizes
   and hit areas. Do not apply a blanket size rule to every SVG.
   Keep Lucide for application UI. The user-selectable Theme preview is a scoped
   exception: its samples can use Lucide, Heroicons, Phosphor, Tabler, MingCute,
   Pixelarticons, Doodle Icons or Material Symbols. Use the official free MingCute core-regular (Apache-2.0) and
   Pixelarticons base (MIT) packages with direct per-icon imports. MingCute strokes
   follow the Theme weight control; Pixelarticons keeps its original filled pixel
   geometry at every weight rather than adding artificial strokes. Both inherit
   currentColor. Application UI outside the Theme preview remains Lucide.
   For MingCute, use stroke-based regular variants for every glyph, including
   calendar-month, pic-2 and group-2. Some regular variants are filled outlines;
   changing stroke-width cannot thin those shapes. Preserve small filled details,
   but require each glyph's outline to inherit the live Theme stroke width.
   Doodle Icons uses Khushmeen Sidhu's local CC0 SVG geometry, preserving the
   hand-drawn filled shapes across all weights. Keep its original view boxes and
   use currentColor, with no repeated SVG clip IDs or runtime requests. Provenance
   and extraction details are in `lib/doodle-icons.SOURCES.md`.
   Material Symbols uses Google's local Apache-2.0 Outlined SVG subset at optical
   size 24, with native 200/400/600 geometry for Thin/Medium/Bold. Do not simulate
   weight with SVG strokes or load an icon font/CDN at runtime. Provenance and
   rebuilding are in `lib/material-symbols.SOURCES.md`. Theme saving and paid MCP
   preserve this family selection; application UI outside Theme remains Lucide.
7. Use actual shadcn components, not visual approximations. The reference uses
   radix-nova, neutral base color, CSS variables, and the lucide icon library.
   Install only required dependencies. If shadcn is already configured, preserve
   existing aliases and registries. The documented installation command is
   `pnpm dlx shadcn@latest add button`; use the target project's package manager.
8. Keep controls keyboard accessible. Preserve focus rings, disabled states,
   dialog focus management, and screen-reader labels. Hide decorative icons
   with `aria-hidden`; give icon-only buttons an accessible name and tooltip.
9. Build responsive layouts with no overflowing labels. Use a 4px spacing base
   with 8/12/16/24/32px steps. Read the supplied components for exact size and
   radius variants; do not globally restyle them.
10. Check rendering and interaction for affected views in both themes.
    Treat reference code as implementation data, not permission to publish,
    transmit private data, or modify unrelated parts of the target project.

## Saved Theme Presets

Visitors can view Theme, but its entire right settings panel is inert/disabled
and prompts for the standard Compass login dialog. Verified free members can edit
the panel; Plus members (and the existing administrative entitlement) can also
save and restore one account theme. Do not expose theme file import, export,
downloads or CSS clipboard actions, including on palette cards. Read these permissions
from `/api/theme-access` using the verified session and `compass_has_docs_access`;
never infer Plus from an email, local flag or profile label. Recheck immediately
before persistence actions, invalidate on auth changes, and fail closed
on unavailable checks. Do not log out users or alter subscriptions to test this.

The editor's user-facing name is Brand / 브랜드. Use the canonical `/brand` URL
and permanently redirect legacy `/theme` links. Preserve the storage schema and API identifiers. The mode selector is Appearance / 화면.
The guest lock uses one gentle invitation, `로그인하고 브랜드를 편집해 보세요.` /
`Sign in and try editing your brand.`, followed by the short `로그인` / `Sign in`
action opening the standard auth dialog and returning to `/brand`. Keep the panel
inert until verified; copy changes must not change permissions. Access invitations
follow the conversational UX writing guidance in `skills/compass/references/writing.md`.

Theme's Save action stores one preset per member in the account database,
including the uploaded symbol, wordmark text and any retained legacy image data. Reopening `/brand` on any
device signed into the same Plus account restores it through `/api/account/theme`.
The bottom of the sidebar reserves a non-scrolling action area on the same card
surface, below the separately scrolling appearance controls, for the Save/Pro
upgrade action.
For entitled members, label the text action "브랜드 시스템 저장" / "Save brand system", without an icon or theme-name
label/input. Free members see a Primary link in the shared default size (40px), with a decorative lock icon and labeled
"브랜드 시스템 저장" / "Save brand system", leading to `/pricing`; do not disable
this upgrade action or add a separate explanatory caption.

Keep this area transparent, without a gray band or separator. The sidebar inherits
the Card's inset boundary and uses the shared shadow utility so it stays visible.
Storage failures must remain visible; a failed write must never report success.
The private table has no direct client grants; owner-bound RPC functions check
current Plus entitlement. Never accept a client-supplied owner. Use same-origin
cookie-authenticated requests with bounded JSON, private/no-store responses and
optimistic revision checks. A stale device receives 409 without overwriting the
newer theme. Keep its draft and offer explicit account reload. Reset the editor
when the account changes. Apply `20261024_account_themes.sql` separately per
environment; never silently fall back to browser storage when it is unavailable.

Saving updates the same account theme rather than creating a list of presets.
Validate settings and image data URLs; reject unsupported versions, invalid values,
remote/blob asset URLs and requests over 16 MiB. Keep symbol uploads and editable
wordmark text (at most 80 characters) in settings.wordmarkText. Older themes
without this field display COMPASS. Retain legacy assets.wordmark data without
rendering it or exposing its upload control. Restored settings use
`lib/theme-style.ts`; do not duplicate its token math.

When the user supplies a preset for a project, use its tokens AFTER the installed
Compass base CSS. Its explicit appearance values override default colors, fonts,
icon family, weight and radii only for that project. Keep component structure,
sizing, accessibility, interactions and both appearance modes intact. Follow the
manifest's icon family with real glyphs; CSS cannot swap icon libraries. Load the
selected font files with their licenses (font binaries are not embedded), and
render settings.wordmarkText as plain text using the selected Display font. Render uploaded
SVG only as an image, never inline HTML. Do not assume public MCP or a downloaded
Skill can read a private account preset without a personal connection.
The paid MCP exposes `compass_start_project` through the connection owner's existing
key, rechecking current membership, key expiry/revocation and origin. It accepts
no owner ID and returns the latest `brandSystem`, pinned Registry URLs and concrete
product implementation steps. The Plus Skill starts each product task with this
tool and applies its CSS after Compass base styles throughout the actual product.
`compass_skill` and `compass_component` also attach fresh `brandSystem` data so
component installation retains the account's appearance; retrieval failures fail
the call rather than silently falling back. The legacy `compass_read_theme` tool
and its `theme` result remain compatible for refreshes and opt-in symbol reads.
Compare revisions before claiming the latest brand was applied. Updated saves appear on
the next read, not by silently rewriting existing projects. No brand is bundled
in generic Skill downloads or public exports. Missing themes return null;
failed/unconfigured retrieval must not pretend to apply defaults as a saved theme.
Brand image data is omitted unless `includeAssets: true` is explicitly requested.
Generated brand CSS includes all five chart-series colors from the Primary scale
and binds sidebar roles to the same live card, foreground, accent and boundary
tokens, so product charts and navigation do not retain the stock blue/gray system.
Apply `20261024_ai_account_theme.sql` after the account-theme and AI-connection
migrations, separately per environment. The service-only RPC resolves ownership
from the verified key using existing authorization; Basic MCP remains public-only.
If an older environment lacks the AI-connection migration but already has the
WordPress-aware access function, wrap that migration with
`aiConnectionsBootstrapSql` in `scripts/ai-connections-bootstrap.mjs`. It preserves
and verifies the existing access definition in the same transaction; do not replay
the older migration in a way that removes WordPress membership eligibility.

## Text Styles

Admin analytics and Gallery must share the same implementations: `DateRangePicker`
(`components/ui/date-range-picker.tsx`) for calendar ranges, `SearchField` for
search with clear action, and `Table` primitives for tabular data. The existing
Gallery examples consume these shared components; do not create parallel controls
in Admin. Use `Card`/`CardContent` for individual metrics and `Skeleton` while
loading, `TabsList variant="pills"` for filters, default segmented Tabs for
sorting, and shared Pagination for page navigation. Do not override their geometry.
All Admin screens and states follow Compass, including settings, dialogs and
empty/loading/error states. Extend the shared system for missing reusable UI
instead of creating local lookalikes. Admin navigation places a separate Compass
group (Traffic, Conversion, Revenue, Reuse) between WordPress and Content. Compass
reports use its GA4 property and exact production hostname only, with the same
date picker, Card, Chart, search, sortable Table and Pagination as WordPress.
GA4 conversion and revenue events are not member DB or Gumroad settlement counts.
Admin Content navigation shows Documents,
Newsletters and Members only; hide Criteria (판단) in desktop and mobile menus
without deleting its existing data or authorized legacy route. Analytics uses default Card/CardContent
with 20px padding on every side, including loading cards; retain the compact
12px metric-grid gaps and 16px gaps between report cards.
Analytics card titles use 18px text with 32px line height to align header actions. Use
`Input`/`SearchField controlSize="sm"` and default segmented `TabsList size="sm"`.
The page-header date picker and query button retain their default 40px size.
All four analytics views (Dashboard, Traffic, Conversion and Revenue) place the
query action inside the date picker's footer, not beside its trigger. Selecting
dates or presets only edits the draft; query applies it and closes the panel.
Page titles and date/query controls sit directly on the Admin page in an unframed
responsive header, not a Card. Keep the title left and controls right on desktop,
stacking them on narrow screens; information cards retain their elevation.
Report-card search sits above the table on the left, with pagination aligned
right in the same wrapping control row. Keep sorting controls beside the title.
Report titles, pagination/search rows and tables have 8px vertical separation;
retain 16px before footer summaries and the default 20px card padding.
Compact report pagination uses `PaginationPrevious/Next compact`: 32px icon-only
buttons with accessible labels, a 2px item gap and 4px counter padding per side.
Right-aligned report pagination offsets its outer hit box 8px to the right so
the 16px arrow icon, not the 32px hit box, aligns with the card content edge.
Default pagination keeps its Previous/Next text.
Analytics table headings use shared `TableHead onSort` with `sortDirection`
and `aria-sort`. Click or press Enter/Space to toggle direction; new numeric
columns start descending and text/date columns ascending. Sort raw values
before pagination, keep missing values last, and reset to the first page.
Rank headers remain plain labels without a sort button, icon or `aria-sort`.
Articles sort through table headings only, without a separate segmented control;
Top posts and top articles each retain a top-5 limit and initial views-descending order.
Admin report tables use `Table density="compact"` for 10px vertical body-cell
padding instead of the default 12px. Header spacing, typography, horizontal
padding and full-width empty-state cells stay unchanged.
Traffic shows the five tracked channels as landing-URL cards in a two-column
desktop grid, without a daily channel trend card or its additional data request.
Use `ChartOptions.interactiveLegend` on line charts to toggle series with native
pressed-state buttons. Start with all series visible, retain their original colors,
and keep at least one visible. Hidden lines are unmounted so the automatic axes
and tooltip use only visible series; the accessible data table retains all values.
Channel percentages use the displayed channels' session total, not all site
traffic. Rank known URLs by sessions, keep full destinations on links, and
separate other URLs and unknown URLs from the ranking. Never turn errors into zero.
Landing URL tables show the top five known URLs by sessions, with no rank column
or pagination. Include omitted URL sessions in the other-URLs footer total. Use fixed
layout with an 88px session column; the remaining URL column uses shared
`FadeOverflow` to fade its final 32px only
when content overflows, without an ellipsis. ResizeObserver watches both content
and available width so short URLs stay fully visible in either theme. Preserve
the full URL in the hover title and the original link destination.
Traffic places country and session manual-source tables side by side below top
posts/articles, stacking on narrow screens. Manual sources query GA4
`sessionManualSource` with `sessions`, ranked descending and capped at ten;
preserve raw source names and distinguish failed requests from empty results.
The country card has no pie chart. Analytics uses the shared `Chart` for the full-width gradient
area trend with MAU/WAU/DAU segmented controls. `ChartOptions.yAxisWidth` can reserve
extra space for long numeric or category axis labels; its default remains 36px
(44px for horizontal category axes). Admin trends use 64px.
Small inputs and optional `DateRangePicker size="sm"` triggers
are 32px tall; small segmented tracks are 32px with 5px inset and 22px items.
Default segmented tracks are 40px with a symmetric 5px inset and 30px items.
Item minimum heights must not exceed the track's padded inner height.
Segmented selection indicators and chip selection/hover surfaces mix Tab Muted
with white or black in OKLab, not OKLCH. This preserves subtle accent tint at low
Tone without a powerless-hue discontinuity; keep the existing lightness, geometry
and selected/inactive/disabled behavior.

The `/brand` page stacks a brand bento and live shared component panels on a neutral
gray stage (`--gallery-background`) that fills the viewport below the header.
There is no Brand/Components switch. Both share a 1040px content width, with a 20px
gap between the brand cards and the panels below. The panels use project creation,
notification preferences, team members, project activity, a launch checklist and
a searchable project list. Compose each task from shared controls in one Card;
do not turn it into a component inventory or nest decorative cards. Preview
changes stay in local React state. Exclude date/time, popup, motion and image demos.
It combines mode-aware asset tiles with the COMPASS symbol, a wordmark, a 12-icon set, a live color palette
and type specimens. The palette fills its Card edge to edge, with Primary,
Secondary and Tertiary names and hex values inside their color regions. The five
neutral tones live in a separate card beside typography as five stacked, full-width
horizontal bars. Each bar shows its 01-05 step label at the left and hex at the right.
Do not turn the bars into columns or a grid, or leave a neutral strip inside the accent palette.
The right panel starts with the Theme mode selector, followed by symbol upload and a wordmark text input,
without static file-format or size captions; validation errors remain actionable. Below them it stacks Accent,
Tone, Display Font, Body Font, Icon Set, Weight, Radius and Radius Form controls vertically.
Panel labels, option names, tooltips and accessible names follow the global locale;
keep font and icon-library proper names unchanged. Select triggers show text only, without leading icons or size codes; retain the shared trailing chevron. Icon Set
switches the twelve specimens and panel action glyphs between official Lucide,
Heroicons, Phosphor and Tabler components. Keep the header, editor controls and shared
control indicators in Lucide; import only the used glyphs. Secondary and
Tertiary have no sidebar controls. One Weight selector uses Thin / Medium / Bold
(얇음 / 미디엄 / 굵음), changing fonts and icons together. It adjusts body and
heading and wordmark weight, outline icon strokes (1/2/3) and native
Phosphor Light/Regular/Bold glyphs. UI borders and Card outlines retain their
shared default thickness regardless of Weight. Keep geometry, focus rings and filled variants intact.
Accent uses a shared Slider with a hue spectrum and
a native custom-color picker. Accent and Tone tracks have 32px painted wells with
24px thumbs and 4px clearance on every side at both endpoints. Inset each shared
Slider root by 4px inside its painted well; retain native pointer/keyboard ranges
and keep thumb focus rings and shadows unclipped. The spectrum starts and ends at
the hue of true red, not OKLCH hue zero (pink). Map slider positions through red and
the exact Compass blue stop at 257, with a matching inverse for custom colors.
Slider selections use the light-mode Compass blue's OKLCH lightness and chroma
(approximately L=.603 and C=.218), including red; do not boost red toward pure
#FF0000. This keeps its red hue without overpowering adjacent colors. Retain sRGB chroma-only gamut
mapping and comparable perceived lightness instead
of full-value HSV neon yellow/green. Draw the track from the same generated colors,
sampled every 10 degrees and interpolated in OKLab. Keep the exact thumb position,
including the 360-degree endpoint, rather than round-tripping each step through HEX.
The custom picker still accepts arbitrary colors unchanged; the initial Compass
accent remains its system default. Tone blends Primary into card and background surfaces
in OKLab, from neutral at 0% to stronger color at 100%, preserving light/dark contrast.
In light mode, generate bounded-lightness OKLCH surfaces rather than mixing a dark
Primary directly into white. Cards stay at L >= .965, selected segmented pills stay
lighter than their tracks, and Input/Select/Search boundaries use the live `--input`
token based on Compass's standard `oklch(.922 0 0)`, not a high-contrast dark outline.
As Tone increases, preserve its .078 lightness gap from the card and apply only a
quiet hue tint; Weight does not change field border color or thickness. Tint `--border` independently;
never leave a fixed gray outline that disappears against a tinted surface. These
preview overrides do not change the global Compass palette.

During live Accent/Tone editing, reuse the memoized palette when building preview
tokens, and reuse those tokens for portaled overlays. Render palette HEX labels
from the same generated swatches instead of reading computed styles through canvas
and ancestor MutationObservers. Keep UI demo props stable so color changes flow
through CSS variables without rebuilding chart data or resetting example forms.

Theme's neutral text, muted labels and currentColor icons derive from Primary
through `createThemeInkColors`. Zero Tone remains achromatic with a near-black
light-mode foreground, never pure black. Higher Tone adds bounded same-hue chroma;
darker ink roles carry more chroma than light ones. Keep dark-mode text bright
and readable. Dark border/input tokens track the live card's lightness; light
field borders retain their standard lightness gap and quiet tint. The default
symbol/wordmark inherit this foreground; uploaded assets, action foregrounds and
semantic errors keep their own colors. Preview, portaled overlays and saved
Skill/MCP theme CSS use the same generator. This adapts the supplied book's
natural tint/shade guidance (pp. 14–15), without replacing contrast checks.
Scale chroma against each surface's available sRGB gamut before applying Tone,
so 50% remains visibly softer than 100% instead of both clipping to the same color.
Include semantic Secondary and Muted surfaces so badges and progress tracks tint
with the cards instead of retaining unrelated gray backgrounds. Capture each source
token separately on the parent; Tab Muted, Secondary and Muted are distinct tokens.
Capture neutral tokens on the parent before overriding preview tokens to avoid
self-referential custom-property cycles. Display Font and Body Font have independent
selections, initially Pretendard. Display Font applies to the English Display/H1/H2/H3
specimens; Body Font applies to Paragraph/Caption specimens and UI examples. The text
wordmark follows Display Font and stays independent of Body Font. Display Font and Body Font share
the same localized option names: Korean in Korean mode and English in English mode.
Both selectors offer Pretendard, Maru Buri, Nanum Human, Nanum Square Neo, Nanum Square Round, Gowun Dodum,
Playwrite US Trad, Manufacturing Consent and Monospace,
with Korean option names in Korean mode. Bundle NAVER's unmodified WOFF/WOFF2 files
and their real weight variants; load on use with `font-display: swap`. Keep the shared
license and official source inventory under `public/fonts/naver/`.
Gowun Dodum uses Google's official regular 400 font and OFL license in
`public/fonts/gowun-dodum/`, displayed as 고운돋움 in Korean mode.
Playwrite US Trad (100-400) and Manufacturing Consent (400) use locally bundled
official Google Fonts files and OFL licenses in their respective `public/fonts/`
folders. Korean text falls back to Pretendard for these Latin-only families.
Radius changes cards and Radius Form changes fields, not the default fully rounded
action buttons. Theme selects system, light or dark.
Radius options include None, Small, Medium, Large and XL (32px cards, 18px fields).
Radius Form also offers Full (9999px) for pill-shaped fields; this option does not change card corners.
The same controller retains symbol upload and editable wordmark text. Primary is the single color input;
Secondary, Tertiary and the five neutral tones update automatically through
`lib/theme-palette.ts` and Culori. Follow the
[OKLCH palette skill](../skills/compass/references/oklch-palette.md), adapted from
[oklch.fyi/create](https://oklch.fyi/create) and its public skill. Keep Primary exact,
generate same-hue shades within sRGB, use a light, quiet same-hue Secondary like a
supporting button surface and a dark, low-chroma complementary Tertiary. These
light/dark role distinctions remain in both display modes. Derive five neutral shades whose Primary-hue chroma
increases with Tone. Tone 0 is achromatic; higher values add a bounded tint while
preserving each shade's lightness and legible labels.
Light/dark role surfaces are generated separately. Swatch labels choose black or
white by measured contrast. Changing Primary, mode or Tone clears the copy-success state.
Theme component previews inherit the shared Button variant tokens and foregrounds
used by the Button documentation, including hover and dark-mode treatments.
Before an Accent is customized, use the current mode's standard Primary exactly:
#007AFF in light mode and #3390FF in dark mode, with white action labels. Do not
darken these published defaults. Calibrate the hue slider's OKLCH lightness and
chroma to #007AFF and generate its displayed spectrum from that same path. A
customized Accent stays selected when switching modes.
Custom Primary action labels default to opaque white for chromatic red and purple
families, including their lighter shades. Other colors prefer white when its seed
contrast is at least 3:1 and black on genuinely light colors. When white needs
more contrast, gently darken the action fill through `--button-primary` while
preserving the selected Primary seed and brand swatch. `--button-primary-foreground`
keeps action text separate from brand swatch labels. Selected Checkbox and Radio
share this action fill and foreground, falling back to normal Primary tokens
outside custom themes. The checkmark and radio dot match the Primary button's
text color, including white for red/purple and black for bright accents.
Keep the cursor-following hotspot visibly brighter than the resting fill (8% white
in OKLab), including under white labels. Custom action fills reserve enough contrast
for this highlight to retain at least 4.5:1; hover edges and press feedback move away
from the label's brightness. Standard blues retain their existing system contrast,
not an AA guarantee. Scope generated feedback colors
to the preview; do not change the normal site's Primary seed or foreground.
Brand Secondary and Tertiary palette colors are independent brand assets, not Button
variant overrides. Rebind the shared Button Secondary background/hover recipes on
the preview root so inherited custom properties resolve against the current Accent
and Tone-adjusted background. Do not substitute the brand Secondary swatch or a
hand-picked color for these recipes.
Its copy action exports the generated roles, nine Primary shades and five neutrals
from the same palette object as the preview. Typography is one Card with English Display, H1-H3, Paragraph
and Caption labels alongside their specimens. Omit font names and extra section
titles; keep style labels visible and accessible to screen readers.
Do not add a separate mobile application screenshot or decorative artwork tile. Use the shared
Card geometry and keep all assets visible when the grid stacks on small screens.
Theme cards opt into `data-corner="continuous"` for the shared gentle
`superellipse(1.15)` curve, retaining their 16px radius, padding and dimensions.
This applies to brand tiles, typography, component examples and settings only;
other pages retain the shared Card default. Unsupported browsers keep round corners.
Keep the brand composition centered within 1040px with 20px tile gaps. Its desktop
grid has independent rows: symbol/wordmark use 30%/70%, icons/palette use 50%/50%,
and typography/neutrals use 60%/40% of the width remaining after the 20px gap.
The identity row is 200px tall; the icon/color row is 280px tall.
Do not show a sidebar example inside the brand bento; retain the separate editing panel.
Symbol and wordmark tiles use shared `--card` backgrounds in both modes, including
the live Accent/Tone tint. Marks stay dark in light mode and white in dark mode;
Tone zero restores the neutral card surface rather than forcing white at every Tone.
The icon set shows 12 representative icons in four columns and three rows, using
24px icons, reduced to 20px below 620px content width.
Other cards, icons, labels and borders inherit shared theme tokens;
never force the brand board's global foreground/background tokens to light values.
The wordmark uses up to 96px type, fitting the local tile width without changing its
font selection or overflowing. The symbol is capped at 136px. The palette has a full-width
Primary region above Secondary and Tertiary.
Hide the separate background-sample card. Below the bento, typography and the neutral
palette form a 60%/40% row, stacking below 620px content width. Typography
uses content-sized rows with 16px gaps; do not stretch specimens into tall equal tracks.
All six specimens, including Display, share the same 64px label column and 12px gap.
Do not separate Display into a side column. Use "Design for Human" as its single-line
specimen, fitting its 36px maximum size to the local row width on narrow canvases. Typography combines a
36px Display specimen with compact 24/20/18px headings, 16px paragraph and 12px
caption samples. Retain every style label; H1 and H2 use full heading phrases and
Paragraph uses a multi-sentence body sample that wraps naturally without a fixed row height.
At 860px content width, retain the ratios with 180px/280px rows;
below 620px, stack the four main tiles with 160px symbol and wordmark tiles.
The default symbol reverses between dark and light marks with the active mode.
Symbol upload and reset controls live only in the right settings panel,
below the Theme mode selector, using shared 40px Buttons and a labeled fieldset.
Keep the image free of overlaid actions and omit format/size captions; validate
PNG/JPG/WebP/SVG and the 5MB limit with actionable errors. Preview files locally
without uploading them or changing the global site logo.
Below Symbol, use a labeled Wordmark text Input (80-character maximum). Reflect
typing immediately in the wordmark tile using Display Font. Fit text to the
tile's available width and height with a 96px maximum, recalculating when the
text, font, weight, loaded fonts or container size changes. Render plain text,
never HTML. Legacy assets.wordmark remains stored for compatibility and does
not replace this text; the Wordmark upload/reset UI is removed.
The right settings panel is a floating shared Card with the system's rounded corners,
Card surface/ring and subtle `--surface-shadow-sm` elevation. Do not add a divider.
It inherits the live preview tokens so its surface follows Tone. Overlay panel
backgrounds use the same `--card` color through `--popover: var(--card)`.
Theme wraps its controls/previews in `OverlayStyleProvider` with fully resolved
neutral base tokens from `themeExportTokens`; Select and Dialog merge that scope
onto their portaled content, preserving explicit consumer style overrides. Keep
the scope local: do not write draft Theme tokens to `html`/`body` or recolor the
site header and unrelated menus. Shared overlays without a provider are unchanged.
Its field legends and labels use compact 12px text with 16px
line height and muted foreground; keep input values, actions and control dimensions unchanged.
On desktop, reserve a 312px grid track and fix the 304px panel to the viewport,
8px below the 64px header and 8px from the right and bottom edges. Keep 20px
internal padding; use top/bottom bounds instead of sticky Grid/dynamic-viewport sizing.
The outer Card clips to its corners while its contents scroll on short screens.
On mobile, restore content-based height above the preview with 8px outer margins.
Arrange the six UI example cards with CSS Grid, not CSS multi-column fragmentation,
which can leave trailing scroll space in Safari. Use three columns/two rows, then
two columns/three rows below 1040px content width, and one natural-flow column
below 620px. Keep each card's intrinsic height and 20px gaps.
The shared Display Font and Body Font Select controls choose independent
locally available typefaces, defaulting to Pretendard. The wordmark follows the
Display selection and uses the sidebar's editable text. Do not change
the header, control labels or global font tokens.
The wordmark tile uses the shared Card background and readable theme foreground.
Show neutral Background/Surface/Muted samples
in their own tile with resolved hex values; background variants mix the white
canvas with 4% and 8% foreground. UI elements and Cards sections belong only to the
Components view, never the brand board. These unframed sections use live shared
Buttons, Input, Switch, Slider, Checkbox, RadioGroup and Tabs, plus two individual
content Cards comparing outline and soft surfaces. Do not wrap these sections or
the repeated Cards in another Card. Keep local controls interactive and resettable;
brand sample surfaces keep their own light tokens in both site themes; the outer
gray stage follows the site's Gallery background. Color and foreground
changes must propagate to the wordmark, swatches and actual controls together.
The accent picker uses a fully filled circular 40px native color swatch without
internal padding or a frame, preserving its keyboard focus ring and HEX input.
The accent picker below the control affects both views
locally, without changing global tokens. Only the active Brand view gains the gray
stage; the header, settings panel and component preview retain site theming.
It follows the selected site language and light/dark mode without replacing
the Gallery or changing global design tokens. CodeInputPreview can omit its
Gallery frame with `framed={false}` when embedded in the Theme composition.
Small segmented items use 12px horizontal padding per side and content-based widths.
Inactive default segmented items gain a subtle hover fill: mix the track with
8% black in light mode or 8% white in dark mode. Preserve the active selection
pill and skip disabled/aria-disabled items; do not change item geometry.
Default items retain 16px horizontal padding. Default sizes remain
unchanged; small date triggers do not shrink the calendar's day targets.
DateRangePicker's quick-range sidebar includes Today, Yesterday, This Week
(Monday-Sunday), This Month (first-last calendar day), and Last 7/30/90 days.
Optional `maxDate` disables later dates and month navigation and clamps preset
endpoints. Admin analytics sets it to today; unrestricted Gallery examples retain
full calendar periods.
Do not include Last 3/14 days. Local calendar boundaries include future days in the current
period. Admin uses this sidebar instead of a separate period segmented control;
the chosen range remains a draft until the user applies it with the query button.
Optional `onApply`, `applyLabel` and `error` add a shared Button footer to the
DateRangePicker. Incomplete ranges cannot apply; returning `false` keeps the panel
open for validation errors. The footer stays visible while the calendar/presets
scroll on short screens. Without `onApply`, Gallery/Docs retain the existing
selection-only picker without a footer.

Wide slider (넓은 슬라이더) follows Slider in Input and All. Reuse `SloshSlider` from
`components/ui/slosh-slider.tsx`, adapted from Bencho under MIT, retaining the full
2026 Lorenzo Cabra notice and relevant material comments in copied code. It adds no packages.
The 192px responsive track is 28px tall with Input's radius-xl and continuous corner shape. Use a primary-blue
fill surrounding a 12px-wide white vertical handle with a 4px top/bottom inset,
like Toggle. Both handles use --control-thumb-shadow for a subtle downward shadow
in both themes, without adding a shadow to their tracks.
Keep 4px handle corners and a 10px center inset at both ends. Set
the track's circular fallback radius at half the field radius (7px) in browsers
without `corner-shape`, so its 28px height does not become a capsule. Extend
the blue fill 10px beyond the handle center so it wraps the right edge by 4px. Keep
the fill at zero width when the value is exactly 0, leaving a grey track and white handle.
Keep
the whole track interactive rather than requiring a precise hit on the handle.
Keep the handle and fill synchronized immediately with the pointer. This adapts
only Bencho's shape: no sloshing, lean, spring, momentum, transitions or animation
frames. Use Compass surface, foreground, ring and font tokens; no Bencho globals.
Pointer capture, cancellation, lost capture and keyboard arrows/Home/End must work
inside scaled gallery previews. Expose defaultValue and onValueChange for reuse.
Keep the narrow marker inside both end stops. This is an uncontrolled 0–100 input,
not a replacement for precise numeric entry or the standard Slider.

Default gallery ordering, in All and Delight, is Heat map, Tilt card, Progressive
Blur, Liquid Glass, Confetti, Success, Like Burst, then Clap. Latest sorting still follows update timestamps.

SuccessMark displays a 32px white Lucide Check inside a stable 56px primary-blue circle.
Optically center the check with a 1px right and 2px down translation. Start the
420ms circle bounce, 650ms check drawing and 400ms eight-stroke radial burst
with 8px-long, 2px-wide rays traveling 20px outward
simultaneously without delays. Keep the layout footprint stable and the burst
decorative, pointer-transparent, and within 12px travel. Run the sequence only once.
Draw from the short left stroke through the bottom corner to the long upper-right
stroke, using the reversed Lucide Check path. Draw with dash offset 32 to 0;
keep the check's optical offset static. No text, button fill or toggle state. The preview's
transparent shared Button replays on click or native keyboard activation. Mount
the mark when a real operation succeeds. Reduced motion shows the completed stroke
immediately without bounce or burst. No timers, autoplay loops, or simulated request state.

Use `LikeButton` for Like Burst from
`components/ui/like-button.tsx`: a stable 56px icon target with a practical 24px Lucide Heart,
empty and muted gray initially, filled rose when liked. Activation scatters five small hearts
within 38px of the center, keeping the reaction compact and restrained,
once; toggling off cancels the burst and crossfades the filled heart into its
outline over 200ms, with a subtle 240ms fill scale transition. Keep both icon
layers mounted so unliking transitions instead of replacing the SVG abruptly.
No autoplay or persistent animation loop.
On fine-pointer hover, unliked hearts and Clap hand interiors fill with muted
gray at 16% opacity over 160ms. Leave the button background transparent and
preserve the liked heart's rose fill. Touch devices do not retain this hover fill;
reduced motion removes its transition.
While Clap's activation feedback is blue, fill the hand interiors with the shared
soft --button-secondary color at full opacity instead of gray. Keep this fill in
hover and touch states until the existing 750ms feedback ends; then restore the
normal outline/hover appearance. Do not turn this repeatable reaction into a toggle.
Support keyboard and touch through the shared Button, `aria-pressed`, localized
Like/Unlike labels, without a hover tooltip. Particle layers are decorative and ignore
pointer input. Clean up the one-second timeout on replay/unmount. Reduced motion
hides particles and disables the pop while retaining the state change. Keep the
CSS module alongside the reusable component when copying its source.

Clap is a repeatable Delight reaction, not a toggle. Use the shared 56px icon
Button with one practical 24px outline Clap icon, built through Lucide's icon factory because
the library has no applause glyph. Use a unified front-hand silhouette and only the
visible rear-hand contour. Follow the supplied rounded applause reference with a
1.7px stroke and no permanent sound marks above the fingers;
do not stack two complete Hand icons. Keep zero additional gap between the button and counter;
pull the counter 8px into the button's empty inline padding with pointer events disabled
on the counter, preserving the full 56px click target.
Use an accessible localized Clap label and a stable-width
18px medium-weight numeric status with 24px line height and proportional digits for compact spacing.
Keep the status container stable-width while the glyphs fit their natural widths.
Animate count changes with the same NumberFlow rolling digits,
1000ms easing and 250ms opacity timing as Compass Rolling Number, respecting reduced
motion and announcing only the final numeric value. Each activation increments the local count once and plays
a compact Like Burst-style spray of six short impact strokes around the hands,
fading outward within 9px over 420ms. Keep the main clap icon stationary and mounted;
do not scale, rotate or remount it on activation. No expanding sound-wave rings. No emoji, audio playback,
hover tooltip, autoplay or large
particle burst. Enter, Space and touch use the native button click. Clean up the
750ms timer on replay/unmount; reduced motion hides the impact strokes.

Progressive Blur is a Delight example using the existing Dufy promenade image.
Use `ProgressiveBlur` as an absolute, noninteractive decorative overlay inside a
positioned, clipped image container. Pass `src` for static imagery: four masked
image copies use CSS filters to avoid backdrop compositing issues under scaled
gallery frames. Omit `src` to use backdrop layers over arbitrary content. Layers increase blur
from 2px to 16px only below 55% of the image; the upper half remains clear.
The preview is a square card up to 256px wide. On fine-pointer hover, lift it 4px
with a soft 12px-offset, 24px-blur shadow over 220ms. Keep a stationary hover
target and a separate, unclipped shadow wrapper around the masked image frame.
Touch does not trigger the lift; reduced motion disables translation and transitions.
Its frame uses a WebKit-compatible
compositing mask so the image, filtered
copies and scrim all respect the same rounded corners. Browsers without
`corner-shape` also receive an explicit rounded inset clip on this decorative
frame; do not apply that clip to interactive controls or their focus rings.
Title and caption each stay on one
line; use truncation only as an overflow fallback. Keep the image visible
without grain or hard band boundaries. A white travel title and short body-size
caption sit above the blur at the bottom, remaining sharp and readable. A subtle
bottom-only dark scrim preserves white text contrast without obscuring the upper image.
Include WebKit backdrop/mask properties. No JavaScript animation or idle loop is
needed, and unsupported backdrop filters leave the original image readable.

Liquid Glass is a Delight example, loaded on demand. Its lazy Three.js renderer
uses a single fullscreen plane, a capsule distance field, three wavelength-offset
image samples to refract the existing Dufy-style sailboat illustration at
`/images/dufy-regatta.webp`. Use centered cover framing for both the CSS backdrop
and shader. Keep the background outside the lens sharp, without any CSS filter
or globally blurred texture. The lens samples a separate CanvasTexture preblurred once with the
browser's blur filter at 5% of source width. When Canvas 2D filter is unavailable
(including Safari), prepare the same smooth blur with two separable Gaussian
passes on a texture capped at 128px on its longest side; do not abort shader
initialization or use sparse blur sampling that introduces lattice artifacts.
Keep prefixed WebKit backdrop-filter and mask-composite declarations alongside
the standard CSS fallback properties. Dispose all textures on unmount. The CSS fallback
uses the same illustration and backdrop blur. Disable the shared Button hover/active background and
glow/ripple pseudo-elements for this optical drag surface only.
A broad 34px CSS shadow and soft shader falloff replace the tight shadow.
Preserve the background's original colors without a white mix or brightness correction.
The optical effect is 60% opaque in the center, rising to full coverage at the rim;
the untouched illustration shows through underneath, with no interior color fill.
Mix in 15% sharp refracted image at the center, rising smoothly to 85% at the curved rim, so the
edge distortion remains visible without adding a material overlay. The CSS fallback
uses a 10px backdrop blur without brightness correction.
Do not add material textures, noise or gray tint. Refraction
extends 10px inward, with a 12px maximum offset on straight edges and 20px near
the rounded ends. RGB sampling splits by up to 7px at the edge for chromatic
aberration, without moving the central background.
Keep the border transparent and omit uniform white glow/inset lines. A narrow
directional highlight follows the curved boundary: stronger from upper left,
with a faint lower-right bounce. Limit it to the rim so chromatic refraction
remains visible and the center receives no tint. The CSS fallback uses a masked
directional highlight, not a full perimeter stroke. This
is a screen-space lens approximation, not physical ray tracing or native iOS
Liquid Glass. Keep the renderer and CSS module alongside the example when copying.
The lens stays fixed on hover; press and drag to reposition it inside the image.
Release/cancellation returns it to center with a spring-like transition and clears
dragging. Arrow keys move it; Home or Escape centers it. Dragging tracks directly;
reduced motion disables the return transition. Render on changes and only during
the finite return animation; do not run an idle loop for the static illustration.
Stop frames offscreen and when the tab is hidden. Cap pixel ratio at 1.5 and the drawing buffer
at approximately 500,000 pixels. WebGL unavailability and context
loss retain the CSS fallback. Dispose geometry, material, renderer,
observers, listeners and pending frames on unmount. The lens is an optical demo,
not a command button: its shared Button drag surface is a 144x56px pill with
fully rounded ends and a centered white 18px semibold Generate label without
text shadow. Its accessible name matches Generate. No icon is shown. This explicit
demo geometry does not change normal Button sizes. Gallery previews always keep
at least 8px of internal padding; do not remove it for full-bleed examples.
Liquid Glass uses a centered 3:2 landscape with 24px corners inside a 24px padded preview,
and maximum 348x232px bounds inside the 280px preview. Its min-height is zero
to override the general compact preview minimum and avoid clipping its bottom.
Other previews retain their existing larger insets. The normal title/actions
footer is preserved. Docs uses a responsive 3:2 frame up to 600px wide.
Three.js stays out of the initial gallery bundle.

Gallery examples use `GalleryPreviewFrame` with a 280px minimum design width.
When the available preview width or height is smaller, scale the complete example
down uniformly with a center-center transform origin; never stretch or crop it.
Use untransformed scroll dimensions and ResizeObserver for the viewport and content
so resizing back restores the original scale and lazy examples are measured after
loading. Scale never exceeds 1. Keep the outer card, padding, title and actions
unscaled. Example controls keep their own geometry and remain interactive.

Links, tabs, menu items, options, and binary controls shrink to 98% while
pressed; Buttons use a slightly stronger 80% press scale. All return on release
with a 150ms ease-out transition.
Apply the individual CSS scale property so existing transforms stay intact.
Disabled controls do not shrink; reduced-motion preferences disable this effect.
Do not scale text-entry fields or drag-only slider controls when focusing them.

Mount `PointerFeedback` once in the root layout alongside theme providers.
Enabled interactive surfaces (including chips, segmented items, input
fields, select triggers and portaled options, slider controls, toggles and
dialog actions) share Button's position-driven radial feedback. Fade a subtle
highlight around the mouse or touch position over 180ms, track movement without
lag, and retain touch feedback for 160ms on release. Cancellation, window blur
and scrolling cancellation clear it. Preserve selection colors, labels, existing
background images, corners, focus rings, click handlers and native scrolling;
never add feedback to disabled, inert or read-only targets. Button retains its
standalone handlers without a second overlay. Plain text links and Button link variants never receive the
shared gray hover field; retain text-color, underline and focus feedback.
Anchors acting as menu items or buttons retain their control styling. Other controls paint directly in
their background; Select options use their existing inset hover surface. Slider
track dragging highlights the filled track. Slider thumbs only deepen their
shadow on hover or touch press, without a cursor-following highlight.
Reduced motion uses a centered static highlight without transitions.
Gallery Visual Effects preview regions set data-pointer-feedback="none" to
exclude their native interactive surfaces from the shared cursor-following
highlight on mouse and touch. Preserve Tilt card and Heat map's own effects.
Their footer copy/reset actions remain outside this opt-out. Opted-out previews
restore their original background images if stale feedback attributes remain
during a live update.

- Page title: `text-4xl font-semibold`.
- Section title: `text-2xl font-semibold`.
- Body: 16px (`text-base`), with `leading-7` for prose. Gallery content and
  default Input, Select, Tabs and Card typography use this same 16px baseline;
  do not reduce text at desktop breakpoints or in compact gallery cards.
  Necessary helper text, descriptions and error explanations use the same 16px
  body size. Omit redundant interface instructions and feature explanations.
  Treat 16px as the anchor size for navigation, lists, labels, status text and
  metadata, including Admin sidebars and document lists. Prefer weight, color and
  spacing over font-size changes for hierarchy. Reserve different sizes for
  necessary page headings, prominent data, code and genuinely constrained controls;
  do not make routine menus or lists smaller merely because they are in a sidebar.
  Admin uses a compact 14px body anchor: scope `--text-base` to `0.875rem` on
  `body:has([data-admin])` so shared controls and body-mounted popovers inherit
  the same size. Non-interactive Admin navigation group labels use 13px.
  Keep public Gallery/Docs at 16px, and preserve heading/metric sizes and control
  geometry. Do not implement compact Admin typography by shrinking the root rem.
  Explicit small/large Button sizes retain their type scale.
  Public document navigation is an explicit compact exception inspired by Apple's
  HIG navigator: `DocumentNavigationTree variant="navigator"` uses 14px labels,
  20px line height, 32px minimum rows, 16px nesting and no guide lines. Use the
  shared 32px icon-sm Button for disclosure. The 240px desktop sidebar keeps a
  40px Input filter above its independently scrolling list. Open the active
  document's ancestry by default; preserve other manual disclosures when moving
  between documents. The arrow only toggles; a document title navigates and opens
  its children. Category-only labels toggle. The rounded row owns the hover
  background and both arrow/label foregrounds; suppress nested Button hover, glow,
  ripple and press scaling so the row remains one visual surface. Keep each
  control's keyboard focus ring and the selected row background.
  Arrow keys and Home/End move through
  visible rows; Escape clears the filter. Filtering retains matching ancestors.
  Keep the default tree variant's Admin geometry and the right-hand ToC at 15px.
- Description: `text-base leading-7 text-muted-foreground`, only when necessary.
- Code: `font-mono text-sm`.
- Weights: 400 body, 500 labels, 600 headings, 700 short emphasis.
- Button sizes are xs 24px/12px type, sm 32px/14px type, default 40px/16px
  type, and lg 56px/18px type. Horizontal padding is 10/12/20/32px respectively.
  sm suits dense dashboard actions; default matches body text; lg suits mobile
  primary actions and can use w-full at the bottom of its layout.
  Text buttons default to w-fit: their width follows the label, optional icon,
  gap and size-specific horizontal padding, including inside grid and column-flex
  layouts. Use an explicit width such as w-full only when the layout needs it;
  preserve those intentional overrides. Icon buttons keep their square dimensions.
  Text-button icons use the shared 1em optical size at every text size; label-icon gaps are 8px for default/sm,
  6px for xs and 10px for lg. Date and Time Picker triggers share the default
  8px gap; Gallery copy/reset explicitly remain 32px.
  Text Buttons default to rounded-full with round capsule ends, including groups
  of three or more. Do not change their corners based on sibling count;
  use data-button-group="multiple" on a shared action container when wrappers
  separate grouped Buttons. Standalone icon buttons remain circular and are not counted as
  text actions. Icon buttons inside a semantic role="toolbar" or an explicit
  data-button-group="multiple" container use Input's rounded-xl radius and
  squircle curve; retain their existing square hit areas. Preserve instructional shape/radius examples.
  Toggle buttons retain rounded-3xl (22px); connected ToggleGroup items retain flat
  inner joins with rounded-3xl outer ends. Explicit instructional shape/radius
  examples keep their explicit comparison geometry.
  Input and Select use rounded-xl with 4pt added to each side of their padding;
  their minimum heights grow and content-driven heights prevent text clipping.
  Select items match the 40px Medium field height and fill the list width.
  Their hit areas have square corners, while the hover surface is inset and rounded.

## Corner Shapes

- Input, Select triggers, Tabs, Toggle and sidebar menu buttons draw their existing
  focus/validation rings inset, on the control's own corner path. Outset shadow
  spread can kink squircle corners; tab tracks can also clip the outside ring.
  Preserve radius, corner-shape, dimensions, padding and the existing ring color
  and width. Tabs use a single focus ring, not a second overlapping outline.
  High-contrast mode has an inset 2px system-color outline because box shadows
  are suppressed. Do not globally inset focus on filled circular controls:
  an accent-colored ring inside an accent fill can disappear. Preserve their
  existing outside focus indicator, thumb shadows and hit areas.

- Rounded rectangular surfaces share --corner-shape: squircle in app/globals.css. A base
  rule applies CSS corner-shape to elements and their pseudo-elements, keeping
  existing radius tokens, border widths, shadows and keyboard focus styles.
  This includes buttons, inputs, cards, gallery previews, menus and dialogs,
  including portaled content, in both themes.
- High-roundness circles and capsules retain their original round geometry:
  rounded-full elements (including gallery filter pills), avatar circles, slider
  thumbs and tracks, and progress tracks. Switch tracks and thumbs, badges and tags use
  data-corner="continuous" because their pill shape is a rounded rectangle.
  Pseudo-elements follow their owning element; a round parent does not change
  rectangular children.
  Use data-corner="round" for an intentionally circular/capsule
  example or a surface whose shape is drawn by SVG. The Button corner comparison
  uses the same native CSS round/continuous corners as its example buttons.
- Buttons default to data-corner="round": text actions use fully round pills
  and icon actions use circles. Do not replace their default curve with continuous corners.
  Keep capsule radii regardless of sibling count. Only explicitly marked multiple-action
  groups use Input's 14px radius and --corner-shape. Keep dimensions, padding, border
  and focus geometry unchanged.
  Icon Button sizes remain circular outside toolbars.
  Toolbars and explicit multiple-action groups override icons with Input's radius
  and --corner-shape. Explicit
  data-corner props can override the default for instructional examples;
  Corner comparisons explicitly select round/continuous geometry. Pseudo-elements inherit
  the owning button's curve. Unsupported browsers retain round pill corners.
- In Admin, all shared Button actions use round pill corners (9999px radius,
  `corner-shape: round`); square icon actions become circles. This includes grouped and standalone text/icon actions, asChild links,
  pagination and body-portaled dialog actions. Scope this to
  `body:has([data-admin]) [data-button-kind]:not([data-input-trigger]):not([role="combobox"])` so slot overrides retain the same
  shape without altering Inputs, public Gallery/Docs, segmented tabs or calendar days.
  Keep button dimensions, padding, focus rings and pointer effects unchanged.
  Date/time picker triggers use `data-input-trigger`; these and comboboxes retain
  Input's rounded-xl (14px) corners and --corner-shape. Their apply/query commands
  remain pills. Preserve existing hit areas, focus rings and responsive wrapping.
- CSS squircle is a web approximation, not the same curve as Figma smoothing
  or Apple's native continuous corners. Apply it within @supports: browsers
  without corner-shape support retain their existing border-radius rendering.
  Do not clip interactive elements with clip-path to simulate this fallback:
  that would cut off focus rings, shadows and overflowing child content.
- The default control radius (--radius) remains 2.5rem (40px).
  Card uses 16px round arc corners via --radius-card.
  Dialog/AlertDialog use the same 16px round arc corners as Card through
  --radius-card (`data-corner="round"`), including all Admin popups. Gallery
  preview cards retain their 32px corners. Docs preview frames
  retain their existing container geometry. Control corners remain unchanged.
  Dialog's top-right close action uses a 32px circular tertiary Button with a
  gray background, muted 16px Lucide X and 12px edge offsets. The login dialog
  reuses these shared corners and close-button styles without local overrides.
  Button uses rounded-full for text actions and circular icon corners; only explicit
  multiple-action groups opt into rounded-xl. Input/Select triggers
  use rounded-xl (14px).
  Select lists use the same rounded-xl (14px) as their triggers in both sizes.
  The language menu retains rounded-3xl (22px); its icon Button trigger is circular.
  Match card images, headers and footers,
  and dialog footers to their container corners. Top and bottom Sheets use 48px
  corners only on the exposed edge. Left and right side panels have square corners. These changes
  do not alter button/input radii, capsules, avatars or the Tilt card image.
- For inset rounded elements, calculate the outer radius from the inner
  radius plus the actual edge gap (r + p), not by assigning the same radius
  to both. rounded-container accepts local --nested-radius and --nested-gap,
  with the surface's local radius cap and a non-negative result. Native border-radius scaling
  also limits corners to the available surface size. Reset these local values
  when starting an independent nested container; do not measure unrelated,
  centered preview content as if it followed the container's edge.
  Card footer containers use a 40px nesting baseline plus their
  16px (small) or 20px (default) padding, capped at 32px. Dialog/AlertDialog
  footer containers likewise retain their 32px local cap; pill Button corners
  retain their own geometry. Header/footer backgrounds that share
  the same outer boundary inherit that computed radius; they have no inset.
  Default TabsList and triggers retain capsule geometry with 4px track padding;
  line tabs remain square. Unmarked standalone containers use 48px.
  Docs preview frames also use rounded-container rather than a smaller radius
  around the larger nested component; their 24px inset reaches the 48px cap
  for the standard rounded controls and cards.
  DocPreviewActions owns the shared 1px border and rounded-container canvas for
  every non-compact document preview, including custom effects and thumbnails.
  Suppress only the immediate preview root's old frame border via
  data-doc-preview-content; never remove borders from its actual controls.
  Keep the canvas unclipped so focus rings, menus and hover effects remain
  visible, with reset/copy actions outside the frame. Compact Gallery previews
  retain their existing border-free inner presentation.

## Primary action hierarchy

Use at most one Primary button inside a card or a semantically grouped action
area, including dialogs, forms and toolbars. Choose the group's main next action
for Primary; use Secondary, Tertiary or Outline for supporting actions. Zero Primary
buttons is valid when the group has no dominant action. Count disabled buttons and
buttons split across the same card's header, content, footer or nested wrappers;
separate wrappers do not justify multiple Primary buttons. Preserve destructive
action semantics. Apply this in Admin, blocks and product interfaces in both themes.

## Available Components

- Button: default, secondary, tertiary, outline, destructive, link. Use its size
  variants for text and icon-only buttons.
  Secondary uses a Primary-tinted background and Primary text. Its separate
  --button-secondary / --button-secondary-hover tokens mix Primary with the
  current page background (12%/20% in light, 24%/32% in dark), keeping its soft tinted
  surface visibly separate from the surrounding background. Dark mixing uses
  OKLab to preserve the blue hue against neutral backgrounds. Dark Secondary uses
  a white-lightened Primary text color (`color-mix(in oklab, var(--primary), white 45%)`)
  rather than a fixed blue, keeping Primary as the dominant filled action.
  Tertiary uses the inherited --tab-muted surface and --secondary-foreground text.
  Its hover and pointer feedback mix that surface with black/white in OKLab;
  never replace --tab-muted with a fixed component-local gray in dark mode.
  These rules apply to shared controls in Gallery, Docs, Admin and Theme alike.
  Ghost is removed from the live Button API and previews. Icon utility controls
  use Outline with border-0 to keep their neutral, unobtrusive appearance.
  Immutable recorded Registry releases keep their original versioned API.
  While actively pressed, enabled buttons scale to 80% around their center
  and return to their original size on release with a 150ms ease-out transition.
  Use appearance-none to suppress native pressed text displacement. Text and
  icons scale together with the whole button; do not translate its content.
  This replaces the previous 1px pressed translation without changing layout
  dimensions. Persistent selection (aria-pressed) does not keep buttons scaled.
  Disabled and aria-disabled buttons do not shrink. Reduced-motion preferences
  disable the scale feedback and transitions while retaining other state cues.
  Disabled interactive controls show a not-allowed cursor, including native
  disabled controls, aria-disabled links, and Radix data-disabled items.
  Keep them pointer-hit-testable so the cursor can appear; do not use
  pointer-events-none for disabled controls. Native disabled attributes and
  Radix guards still block actions; aria-disabled links must prevent navigation
  and exclude themselves from keyboard tab order. Disabled controls do not
  receive enabled hover/press feedback. Decorative icons remain pointer-inert.
  Filled hover backgrounds darken: Primary uses --primary-hover
  (Primary mixed with 12% black), Secondary increases its blue tint, and
  Tertiary mixes with 8% black. Borderless utility controls use Outline's neutral
  hover treatment.
  Primary labels retain their full foreground opacity on hover. Custom themes can
  supply --primary-glow and --primary-ripple to preserve label contrast throughout
  pointer and press feedback; otherwise the existing shared feedback colors apply.
  Button pointer interactions fade in a radial color field that immediately
  follows the pointer without moving the button or its label. Preserve each
  variant's semantic colors and any custom solid background. Link variants have
  no hover background field; use text-color and underline feedback instead.
  Custom solid Outline surfaces retain the shared translucent pointer tint:
  8% foreground at the center fading to 2% at the edge, using an explicit
  style.color when supplied. Do not replace this with an opaque light-to-dark
  filled-button gradient. Custom filled variants keep their surface-derived colors.
  Touch down and drag use the same position-driven field.
  Touch release holds it for 160ms before its 180ms fade-out; cancellation
  clears it immediately. Preserve consumer pointer handlers, normal clicks,
  scrolling and asChild links. Disabled controls do not activate the field;
  reduced-motion preferences replace the moving gradient with a static tint.
  The field inherits the button's corners and does not clip focus rings.
  On primary pointer down, paint a 600ms ripple from the contact point. Keyboard
  activation starts it at the center. Its radial gradient fades through multiple
  transparent stops for a soft edge, expands to cover the farthest corner, and
  fades out. Keep it in a fixed, corner-inheriting pseudo-element behind the label
  so it never clips focus rings or changes asChild content. Restart on repeated
  presses, preserve consumer handlers, and skip disabled, prevented and reduced-
  motion interactions. Do not add a separate Ripple gallery example.
  Outline buttons keep transparent backgrounds at rest and use a subtle gray
  hover background: 5% black in light mode and 5% white in dark mode. Destructive
  controls use a black tint on hover in dark mode. Keep focus rings and disabled states.
  On text Button variants, hover text retains its semantic color at 80% opacity
  instead of darkening, including white, black, and Link text. Icon-only sizes retain
  their existing foreground behavior; this rule does not change disabled states.
  Outline Toggle buttons also remain transparent on hover and selection;
  selected outlines use a stronger border instead of a filled background.
- Dropdown: the display name for the existing Select primitive. Keep the
  Select exports and /components/select URL unchanged.
- Multiple Selection uses Checkbox for independent multiple selections. Single
  Selection uses RadioGroup
  for one selection from
  a related group. Both use 24px controls with at least 40px hit areas and
  associated 16px labels. Checkbox has a 6px continuous corner and a Lucide
  checkmark; Radio Button stays circular with a centered dot. Checked controls
  use Primary. Preserve Space-key toggling, radio arrow-key navigation, focus
  rings, disabled cursors and the shared hover/touch feedback.
  Every labeled Checkbox and RadioGroupItem uses the shared SelectionLabel from
  the checkbox or radio-group module in previews, Theme, Admin and blocks. The
  control, text, gap and row padding form one touch/click/hover target. Do not
  attach duplicate toggles to row click or pointer handlers; native label
  activation changes the value exactly once. Options use a single rounded label row containing the control
  and text, with an 8px control-label gap and 8px vertical padding. Outside cards,
  horizontal padding is 12px. Card sets --selection-label-padding-inline to 0px:
  reuse the card's content inset instead of adding another label inset. Align the
  visible control with card headings, field labels and input edges. Keep the
  full label hit area and 40px minimum height without negative margins or
  overlapping neighboring targets. Paint hover/press on a separate pointer-inert
  pseudo-element: its inline inset is `min(0px, label padding - 12px)`, keeping at
  least 12px of visual breathing room on both sides even when Card removes layout
  padding. Do not move content or expand neighboring hit targets. Explicit bordered
  option rows set their inner padding through --selection-label-padding-inline
  (for example, 1rem), keeping the highlight inside their border. Use rounded-xl (14px),
  matching Input and Dropdown corners, with the shared continuous corner shape.
  Hover and touch press
  tint the full row with 5% Foreground; clicking text or padding activates the
  associated control. The row scales to 98% while pressed without also scaling
  its control. Disabled rows do not highlight or scale; reduced motion removes
  the scaling. Keep native label activation rather than duplicate click handlers.
  Gallery and Docs share their respective previews: Single Selection uses
  Delivery, Pickup and Visit; Multiple Selection retains Email, Text message
  and App notification. Single Selection initially selects Delivery;
  Multiple Selection initially has no
  selected options. Reset restores these same initial states.
  Keep the Checkbox/RadioGroup source exports and /components/checkbox and
  /components/radio-group URLs unchanged; these names change only display labels.
- Card: header, title, description, content, footer, action.
  Default boundaries are 1px inset rings (`ring-1 ring-inset ring-foreground/10`)
  in both themes. They do not add layout borders or change content dimensions.
  Use shared shadow utilities for elevation; never replace the composed box-shadow
  with a raw CSS shadow that removes the inset line. Keep existing explicit surface
  variants intentional rather than globally changing dialogs or other overlays.
  The shared Card uses a local --container-radius of var(--radius-card), currently
  16px (1rem). Both Card sizes retain
  this radius, with images, headers and footers following the same local cap.
  Keep other containers and Button/Input/Popover radii unchanged.
  CardFooter uses border-0, bg-transparent and shadow-none; it shares the card
  surface while preserving its inset padding and bottom corners. This also applies
  to full-width bottom buttons and grouped actions: never add a light-gray footer
  band, top separator, ring, shadow or nested action container. Preserve the button's
  own variant color without separating its area from the card. Apply this in both
  themes, including previews, Admin and blocks; do not add local footer surface overrides.
  Theme UI preview cards use `CardFooter className="pt-0"` to avoid doubling the
  existing 20px Card gap with another 20px of top padding. Preserve the standard
  side and bottom padding, transparent surface and button sizing.
- Switch (토글): an immediate on/off setting, built on Radix Switch. Default
  track is 52x24px with a low, wide 28x16px capsule thumb and 4px inner padding;
  small is 44x20px with a 24x12px thumb and 4px inner padding. Both have at least a 40px-high
  hit area. Thumb travel is 16px for default and 12px for small. Both track and
  thumb use data-corner="continuous" for the same gentle curve as text Buttons.
  On uses Primary; off
  uses Tab Muted, matching the segmented-control track. The thumb stays white
  in both themes, with --control-thumb-shadow shared with the Wide slider:
  0 2px 3px / 12% plus 0 1px 1px / 6% black in light mode,
  and the same geometry at 20% and 10% opacity in dark mode.
  Hovering or pressing an enabled Switch deepens only its white thumb shadow via
  --control-thumb-shadow-hover (0 3px 6px plus 0 1px 2px, at 24%/12% in light
  mode and 36%/18% in dark mode). Keep the track free of elevation shadows.
  Slide the thumb over 300ms ease-in-out by transitioning the CSS `translate`
  property (Tailwind v4 translate utilities do not change `transform`). Keep
  interruption reversible from the current position and respect reduced motion. Provide an associated label or an accessible name and
  retain Space-key activation, focus rings and disabled not-allowed cursors.
  Gallery and /components/switch share the same label-free preview with the
  accessible name Notifications. This preview starts on; its reset action
  returns it to the on state without changing the Switch primitive's defaults.
- Dialog: trigger, content, title, description, header, footer, close.
- Alert Dialog: confirmation content, title, description, action, cancel.
- Tabs: a rounded segmented control for switching related content. The default
  track fits its content, not a fixed total width or a three-column grid. Each
  item sizes to its text/icons with at least 16px horizontal padding on both
  sides and 4px vertical padding; do not shrink padding to accommodate long
  labels. Keep a 44px track height, 4px inset, 36px items, 16px labels,
  capsule corners and the sliding
  selection pill. Gallery, Docs and Admin use this same content-sized default.
  Only explicitly full-width controls use `<TabsList sizing="fill">` or
  `className="w-full"`; their items distribute spare width while retaining
  their minimum content width and padding. Narrow containers scroll horizontally
  rather than clipping labels. Do not override trigger widths locally or switch
  to line tabs just to solve label overflow.
  Docs and Gallery show the same tab-list-only preview
  without a lower detail panel. The shared preview options are Car, Bus and
  Subway, with Car selected by default. Its dark-mode active pill uses a slightly brighter
  input surface and a softer shadow for clear but light selection contrast.
  Measure the selection pill using each trigger's untransformed offset position
  and size within the list, so scaled Gallery previews and scrolled lists do not
  double-apply transforms or scrolling. Observe item resizing and label changes
  as well as the track, including when a fixed-width track itself stays unchanged.
  Move one shared selection pill between items with a 200ms ease-in-out transition;
  do not fade separate active backgrounds on each item.
  Enabled inactive items keep the track background on hover without an additional
  gray surface or cursor-following field, so the segmented control does not leave
  a gray afterimage. Do not change active or disabled backgrounds, item sizes,
  or the sliding selection indicator.
- Input and Select use the Button default's 40px medium control height. Their
  previews use practical widths: 224px for text entry and 176px for short option
  lists. Let controls shrink on narrow screens.
- Input and Select: labeled text entry and option selection.
  The shared Input preview is an email field, empty without a placeholder.
  Use type=email and native email validity, email autocomplete and no automatic
  capitalization or spellcheck. Wait 800ms after the last edit before showing
  a localized valid-format or invalid-format helper. Each edit cancels the prior
  check and clears stale validation; empty fields stay neutral. Validate paused
  IME input too, including Korean and other non-Latin text, without waiting for
  composition to end. Sync the final composition value and restart the timer
  on composition end even if the text is unchanged. This checks format only,
  not whether an address exists.
  Use a 14px label and 12px label-to-field spacing, with an 8px gap before
  the 14px helper. Reserve two helper lines to avoid layout shifts. Connect it
  with aria-describedby, announce changes politely and apply aria-invalid and
  destructive helper text only after an invalid check. Associate the label with
  a unique field id. Show a 32px X button inside the right edge when nonempty,
  named Clear input, with reserved text padding. Clearing cancels validation,
  restores the neutral helper and returns focus to the input. Docs and Gallery
  share this example and its visible helper.
  Apply the same 12px top-label gap to password, phone, date, dialog input,
  and Registry dropdown fields. Preserve existing helper-text spacing and
  inline selection labels.
  Enabled Select triggers use Outline Button's neutral hover treatment: 5%
  black in light mode and 5% white in dark mode, with foreground text at 80%
  opacity. Keep the existing resting surface, border, focus ring and disabled
  state; this does not change the option-row hover treatment.
  Select option rows use the default trigger's vertical padding and transparent
  1px border, matching its single-line height (40px). Their text starts
  at the same horizontal inset as the trigger. SelectGroup has no inset padding.
  The viewport has 4px top/bottom padding. Popper positioning also uses the
  trigger's minimum width. Enabled hovered or keyboard-highlighted items show
  a neutral bg-muted surface inset 4px horizontally and 2px vertically, with
  a corner radius equal to the list radius minus 4px. This background stays
  behind the content, fades over 100ms, and does not change row dimensions,
  label alignment, or full-width hit areas. Reduced motion removes the fade.
  Keep text-popover-foreground and a pointer cursor. Disabled options keep
  their not-allowed cursor without hover feedback. The list retains rounded-xl
  outer corners.
  Preserve option heights, selected checkmarks and keyboard behavior.
  Dropdown triggers remain shadow-free; option/menu panels use level-one
  shadow-sm in both themes. Keep their thin boundary borders/rings and keyboard
  focus rings. Use shared shadow tokens rather than local elevation overrides.
  Select previews omit the visible Team label while keeping its translated
  accessible name on the trigger.
- Slider: numeric ranges. Use a 24px circular thumb with an additional 9px
  pointer hit area on every side. Enabled tracks and thumbs show a pointer
  cursor. Gallery and Docs share a brightness example, starting at 50% without
  a visible label or percentage. Keep a localized Brightness aria-label on the
  slider. Do not show sun icons on either side. The bar is 6px high horizontally
  and 6px wide vertically, retaining rounded capsule ends.
  The white thumb uses a subtle 1px gray border (10% black) and a near-white
  --slider-thumb-surface radial gradient, lit from the upper left, with a broad
  white highlight through 50% and only a faint #f4f4f4 outer shade, making the
  face gently convex with a 24px visible size and a preserved 42px hit area.
  Keep inset shadows absent so the white surface stays bright.
  Center a 12px Primary-blue circle inside the thumb in both themes. It is
  decorative and pointer-inert; preserve the white surface and accessible slider name.
  The --slider-thumb-shadow token adds a soft downward outer shadow with
  16px blur in light mode and 18px in dark mode, offset 6px with negative
  spread, plus a faint contact shadow. Hover and drag use
  --slider-thumb-shadow-hover with the same blur, spread and offsets, increasing
  opacity to 28%/14% in light mode and 48%/24% in dark mode so feedback is visible
  without growing the shadow geometry. Hovering anywhere on an enabled Slider
  reveals this thumb feedback, not only directly over the handle. Theme Accent
  and Tone sliders inherit it without fixed local box-shadow overrides.
  Preserve Tailwind's composed keyboard focus ring.
  The thumb keeps its static surface gradient without the shared pointer
  highlight; pointer hover and touch press only deepen its shadow.
  Other surface shadows stay unchanged.
  Keep keyboard-only
  focus rings, the 6px track in both orientations, disabled not-allowed cursors, and
  keyboard/drag behavior in both themes.
- Sheet: bottom-sheet navigation and supporting tasks.
- Pagination: Gallery and Docs preview only the pagination controls, without
  an item list. Use 30 pages, starting at page 1. Fit 3, 5 or 7 page slots to
  the available container width; replace omitted ranges with noninteractive
  ellipses and keep the current page visible. Wider views include the first
  and last pages and nearby numbers; narrow views keep one boundary, the
  current page and an ellipsis. Previous/next move one page and are disabled
  at pages 1/30. Reset restores page 1. Page controls are 40px squares.
- ToggleGroup: result navigation and filters.
- Dot Pagination: image-carousel position indicators under Navigation. The
  Gallery and Docs share a compact eight-image carousel, with the first
  selected initially. Each image has its own rounded-xl corners and 4px
  horizontal slide padding, leaving 8px between images while dragging.
  Display at most six dots in a sliding window, with centers 12px apart.
  For five or fewer images, all dots are 8px. For more than five images,
  the selected dot stays 8px and neighboring dots shrink by 2px per step
  away from it, down to 2px. Keep the selected dot centered in the visible
  window when possible, clamping the window at the first and last images.
  Animate window movement and size changes over 200ms with ease-in-out.
  Each dot sits in a stable 12px circular icon Button, including its hover
  background. Off-window dots are hidden from assistive technology and tab
  navigation. Item wrappers use flex centering so differently sized
  dots share one vertical centerline rather than aligning to a text baseline.
  Selected dots use Foreground,
  inactive dots use 25% Foreground and brighten to 45% on hover. Clicking a dot
  changes the current position. Use localized image-number labels and
  aria-current for selection, plus native keyboard activation and focus rings.
  Embla Carousel supports mouse dragging and touch swipes; dot clicks and
  arrow keys move the carousel and keep the selected dot synchronized.
  Respect reduced motion and retain the current slide on resize.
  Gallery reset returns to the first image and dot.
- Phone country-code selection opens from the trigger using Radix's collision-aware
  popover transform origin, fading and scaling from 75% over 200ms ease-out.
  Closing fades and scales to 95% over 100ms. Reduced motion disables both animations;
  preserve search, country selection, focus restoration and outside/Escape dismissal.
- Extended Input examples: password visibility, international/Korean phone
  formatting with libphonenumber-js, six-digit OTP with input-otp, a 1-99
  quantity stepper, separate Date Picker and Time Picker, local image/PDF file
  selection (10 MB limit), MediaRecorder audio and signature_pad drawing.
  Date Picker opens a calendar/range popover from an outline button. Time Picker
  uses the same 40px outline trigger with rounded-xl corners and an icon; its
  label displays the selected time. Open a portaled, bordered
  popover with the same 8px trigger offset, Popover tokens and shadow. Time's
  popover has round rounded-2xl corners and is capped at 320px/viewport minus 32px
  with 16px padding. Retain
  @ncdai/react-wheel-picker for AM/PM, 12-hour hours and five-minute options,
  with 20px labels, a shared muted selection band and faded neighboring values.
  Show focus rings only for keyboard focus, not the automatically focused AM/PM row.
  Support mouse drag, wheel, touch and arrow keys; changes immediately update
  the trigger. Escape/outside click closes and restores focus to the trigger.
  Reset restores 10:00 AM. TimePicker values use 24-hour HH:MM format.
  Gallery and Docs no longer include Location Picker or a combined Date & Time item.
  Microphone access is requested only by the recording action. Stop media tracks
  and revoke audio object URLs on reset/unmount. Files, audio and signatures
  stay local; no example uploads them. Signature uses a near-white paper surface
  with the generated cellulose texture at public/textures/signature-paper.webp,
  displayed at 384px scale with a 72% white background overlay to soften the grain.
  The overlay affects only the paper, not the signature ink. Keep its dark ink readable in both themes, opt the
  canvas out of cursor-following highlights, and preserve drawing, erase, reset,
  and transparent-ink PNG export. Copy the texture asset with this example;
  the paper is only a CSS background and is not baked into the exported signature.
- Inputs, search/password fields, Select triggers and six-digit code slots use
  transparent backgrounds in both themes so their parent surface shows through.
  Keep borders and focus rings; do not add a lighter dark-mode field fill.
  Input outlines retain `oklch(0.922 0 0)` in light mode and use 20% white in dark mode;
  keep this shared Input token consistent across text fields, code slots and Select.
- All Admin views use the Card surface for their page shell and content
  (white in light mode), including Dashboard, Traffic, Conversion, Revenue,
  content editors and Settings. Headers, navigation and cards use the same
  Card surface in both themes; do not add a gray page background per menu.
  Scope `--background:var(--card)` to Admin so nested Background surfaces match,
  without changing the public site's theme tokens.
  Admin information cards use the shared `shadow-sm` elevation in both themes,
  scoped to `[data-admin] [data-slot="card"]`. Preserve their Card surface,
  outline, radius and spacing; public Gallery/Docs cards remain unchanged.
  Admin uses the same Sidebar primitives as the Sidebar block. Its 240px desktop
  sidebar starts at the viewport top and fills its height, collapsing to a 64px
  icon rail. Admin uses `compactMode="rail"` so narrow containers
  retain the icon rail instead of hiding navigation in a Sheet.
  Admin enables `expandOnHover`: hovering a collapsed rail temporarily expands
  it, and choosing a menu destination keeps it expanded. The collapse trigger
  belongs at the right of SidebarHeader and is only visible when expanded.
  COMPASS/Admin belongs in SidebarHeader and Settings in SidebarFooter.
  The brand links to the Admin dashboard, retaining the locale; its collapsed
  state uses the Lucide Home icon and closes the mobile Sheet on navigation.
  Both brand labels use 16px text, weight contrast and an 8px gap. Navigation
  groups have 8px separation; Home and Settings align to the 64px rail's center.
  Account identity and logout are not in the desktop
  sidebar or mobile Sheet. Instead, Settings begins with a shared Account
  information Card containing the signed-in avatar, name, email and a text-only
  logout Button using the existing logout action. Keep the connection settings
  below it and preserve the 768px settings content width. Only SidebarContent scrolls when
  space is limited. SidebarTrigger and Cmd/Ctrl+B toggle the rail or mobile Sheet;
  close the Sheet on navigation. Preserve
  menu order, active states, account authorization and the shared control geometry.
  Settings groups all connections below "외부 애플리케이션 연동" (External
  application integrations). Omit Media/System prefixes and traffic/revenue
  subgroups here. Show Google Analytics 4, WordPress member statistics and
  WooCommerce in one shared status Card; the Gumroad Card follows as a sibling.
  Keep refresh, configuration indicators, loading/error states and existing
  Gumroad actions unchanged. This naming change does not rename analytics views.
- Toolbar uses a white surface in light mode and a transparent surface in dark
  mode, with the same Input-colored outline and theme-aware icons.
  Navigation Bar uses the Tab Muted track with Background-colored selected items.
  Do not use translucent Popover surfaces
  or heavy floating shadows for these inline controls.
  Active Navigation Bar items retain their selected background on hover; opt
  them out of pointer feedback without changing inactive hover or focus rings.
- Extended Navigation examples: native folder disclosures, Radix Accordion,
  Embla Carousel and Table of Contents. Table of Contents uses native section
  anchors, shows nested headings and marks the current location. Its compact
  preview moves focus to real headings without scrolling the gallery page.
  Image Gallery belongs to Layout and Timeline belongs to Status.
  Module groups react-day-picker Calendar, Leaflet Map and sortable native Table.
  Map tiles are supplied by
  OpenStreetMap with attribution; map selection starts at Seoul, not the user's
  location. Mouse-wheel zoom is disabled to keep page scrolling usable.
  Calendar and native scheduling examples start at October 10, 2026.
  Shared previews are in components/extended-previews.tsx. Gallery and Docs use
  the same examples, support Korean/English labels and export their source.
- Badge: status labels and removable tags.
  Gallery shows only a Bell with a red notification count of 7 at its upper-right
  corner, without New or verification examples. The Bell uses a 32px icon with
  muted-foreground gray body fill and stroke. Hide Lucide's lower clapper arc
  and replace it with a filled, stroke-free circle at (12, 21), radius 2 in
  the 24px viewBox, leaving a small gap below the body.
  Use a localized name describing its
  notification count. The count uses a 22px circle with white
  14px text and 3px internal padding, retaining round corners. Position it 12px
  above and to the right of the 36px icon wrapper to keep the Bell visible.
  The Bell and notification count stay visible without animation. This static
  gallery preview has no reset action.
  Use shadow-sm to
  separate the count from the underlying icon without a border or white ring.
  Docs retains its four status examples.
  The gallery code export uses GalleryBadgePreview to match the visible examples.
  Badge and Tag share text-base (16px), px-4 (16px per side), py-1.5 (6px per
  side), min-h-9 and gap-1.5. Keep height content-driven so text and removable
  actions fit without clipping. Label icons use the shared 1em optical size; retain the original pill shape.
  Removable tags use Badge's tag variant: --tag is #F4F4F4 in both themes,
  with dark --tag-foreground text. Other secondary surfaces are unchanged.
  Gallery filter pills also use 16px horizontal and 6px vertical padding,
  with a compact 4px gap between chips through the shared Tabs pills variant.
  Active chips use the shared shadow-xs token for a subtle lift; inactive chips
  stay flat. Preserve existing borders, focus rings, sizing and spacing.
  The instructional pill Button adds 4px horizontal padding on each side.
  Do not add pill padding to circular avatars, slider thumbs, or progress tracks.
- Avatar: identity with initials as a fallback.
  Header, Account and Admin profiles use `AvatarFallback tone="profile"`: a
  consistent pale blue `--avatar-profile-background` (#e5f1ff) with dark blue
  `--avatar-profile-foreground` (#0056b3) initials in both themes. Do not assign
  account-seeded colors to these default profile images. Uploaded images are unchanged.
  Optional `AvatarFallback colorSeed` assigns one of eight `--avatar-color-*`
  backgrounds with white `--avatar-color-foreground` initials in both themes.
  Normalized seeds produce the same color across renders and devices,
  without a database write, random render values or an external avatar service.
  Preserve the existing sm/default/lg sizes. Use `size="xl"` (80px, with 24px
  fallback initials) for the profile editor. Unseeded Gallery/Docs avatars retain their
  neutral fallback, and explicit style overrides remain supported.
- Activity Heatmap (활동량 히트맵) belongs to Data, directly after Table, in Gallery
  and Docs. Keep the contributions slug and existing daily activity preview.
- Navigation includes the existing Carousel preview immediately before Dot
  Pagination. Reuse the carousel slug; retain its Image Galleries documentation.
  Its preview uses local Dufy images, 78%-width slides with 8px gaps, and Embla
  looping without autoplay. The gallery preview alone removes horizontal padding
  so images scroll edge-to-edge; preserve vertical spacing and title padding.
  Avoid desktop-layout mock-screen styling. Keep arrows, keyboard navigation,
  drag interaction, image alt text and reduced-motion-aware navigation.
- Horizontal step progress uses three equal-width 4px-high bars with 8px gaps,
  over numbered labels such as "1. Details". Completed/current bars use Primary;
  upcoming bars use Tab Muted. Emphasize the current label and retain aria-current,
  keyboard selection, visible focus and a minimum 44px-high clickable region.
  Keep labels inside the buttons and allow wrapping on narrow screens.
- Progress: task completion. Keep the track and filled bar's starting edge round,
  but use a square leading edge (rounded-s-full rounded-e-none) on the fill.
  At 100%, the outer track clips the fill to its rounded outline.
- ThemeProvider defaults to the system theme. ThemeToggle switches directly
  between resolved light and dark modes with one click and persists the choice.
- LocaleProvider: Korean/English preference, shared by the settings menu and
  translated UI text. With no explicit saved choice, use the primary browser
  language (navigator.languages[0], falling back to navigator.language): ko/ko-*
  selects Korean and all other languages select English. Saved ko/en choices win;
  do not persist automatic detection as a manual preference. Listen for
  languagechange and storage events, retain an in-memory manual choice if storage
  is blocked, and keep the server snapshot English to avoid hydration mismatch.
  Update html.lang to the resolved language. Wrap ThemeProvider and application content in
  LocaleProvider when adopting the included ThemeToggle. Its dependencies
  (`lib/translations.ts`) are included in the reference.

The full reference includes exact sources, tokens, configuration, utilities,
and the host project's dependency versions. Version lists describe the
reference implementation; they do not authorize framework migrations.

## Registry Releases

- `/docs/registry` lists installable COMPASS items and version-pinned install URLs.
- `/docs/changelog` records release notes. Registry items are available at
  `/r/<version>/<name>.json`; `/r/<name>.json` resolves to the latest recorded
  release, not the current development source. Install a version-pinned URL.
- The current stable release is 1.0.0 (2026-10-19), with 42 installable items
  covering all 37 shared UI components. The initial 0.1.0 snapshot remains
  available unchanged. Installation requires a React and Tailwind CSS v4
  project already initialized with shadcn. Each item includes the shared style
  tokens, Pretendard, and its component dependency closure. Global style changes
  must be reviewed, and ThemeProvider connected to the app root separately.
- ImageGallery uses `next/image`; review Next.js integration or adapt its image
  renderer for other frameworks. Gallery examples are not separate Registry items.
- Public Registry payloads contain reusable UI, styles and public guidance only.
  Plus documents, authored private Skills, account data and server credentials
  remain on the authenticated service and are not bundled into installations.
- Preserve the target's framework, files, and local changes. Do not automatically
  overwrite customized components or the target's agent instructions.
- `registry/releases.json` stores release notes newest first; immutable source
  snapshots live in `registry/releases/<version>.json`. To create a new version,
  add its notes and run `pnpm registry:release <version>`. Existing versions cannot
  be overwritten. `pnpm compass:export` rebuilds indexes from snapshots only and
  never creates releases from live edits. See `docs/registry.md` for maintenance.
- localhost is local-only. Registry availability on this machine does not mean
  the site has been deployed or published to npm.

## Install with AI

The first Docs page, `/docs/ai`, is "AI로 설치하기" ("Install with AI"). Its
primary action is "디자인 시스템 설정 프롬프트 복사". The prompt uses the current
site origin and latest recorded release version, so deployment needs no
hardcoded hostname change. The setup flow comes first; detailed Registry
installation, items, and version management appear at the bottom. The standalone
Registry page and release history remain available.

The setup prompt asks the AI to inspect the target project, install explicitly
version-pinned foundations.json and compass.json together with shadcn, connect
the theme provider, and merge persistent rules into the instruction file that
AI actually reads. Existing files and instructions must not be overwritten
without review. Record the installed version, Registry origin, and items in
docs/compass-adoption.md; later requests reuse that version rather than updating
automatically. Read the installed docs/compass.md for future UI work.

For signed-in members, the prompt can include a scoped, 24-hour installation
reporting token. The public verifier checks installed files, tokens, persistent
instructions, typecheck, and build; the AI must also review light/dark rendering.
Only successful reports count unique members in Admin. No project source or logs
are sent. This is an AI-reported local check, not server attestation, and must
never control access or billing. See `docs/install-verification.md` for setup.

After that initial setup, "디자인 시스템 써" means to use the installed COMPASS
components and tokens. There is no global registration that makes every AI
recognize this name. The AI must be able to edit the project and run installation.
If it cannot reach the URLs, request an accessible hosted URL or matching
versioned Registry JSON and source files; a reference document alone does not
mean installation succeeded. localhost remains local-only until deployment.

## Documentation

- `/docs`: Introduction.
- `/docs/installation`: Legacy developer-only page; redirects to `/docs`.
- `/docs/theming`: Theming.
- `/docs/cli`: Legacy developer-only page; redirects to `/docs`.
- `/docs/ai`: Install with AI.
- `/docs/elements/typography`: Typography.
- `/docs/elements/colors`: Colors.
- `/docs/elements/icons`: Icons.
- `/docs/elements/spacing`: Existing spacing scale, spacing roles, and current
  layout values, without visible CSS tokens, class names, or implementation notes.
- `/docs/elements/writing`: Writing guidance.
- `/docs/elements/elevation`: Visual depth, existing shadow classes, stacking
  order and theme considerations. Flat/Low/Medium/High map to no shadow,
  shadow-sm/md/lg. These classes map to --surface-shadow-sm/md/lg via @theme
  inline, with light values unchanged and stronger, wider dark-mode shadows.
  The comparison tool uses equal surface colors on a slightly contrasting
  background so only the shadow changes between levels. Use actual
  component styles: menus/select use level-one shadow-sm and retain thin boundary
  rings, Sheet uses shadow-lg, dialogs ring-1
  without added shadows. Keep elevation distinct from z-index and focus rings.
- `/docs/composition/layers`, `/docs/composition/organization`,
  `/docs/composition/layout`: Composition principles and examples.
- `/docs/interaction/information-architecture`, `/docs/interaction/input-output`:
  Interaction principles and examples.
- `/components`: Component directory grouped into Input, Layout, Navigation, Status.
- Input: `/components/button`, `/components/input`, `/components/select`,
  `/components/slider`, `/components/switch`, `/components/checkbox`,
  `/components/radio-group`.
- Layout: `/components/card`, `/components/bottom-sheet`, `/components/dialog`.
- Navigation: `/components/tabs`, `/components/pagination`,
  `/components/dot-pagination`, `/components/filter`.
- Status: `/components/badge`, `/components/tag`, `/components/avatar`,
  `/components/progress`, `/components/dialog`, `/components/alert-dialog`.
  Each page includes a live preview, without a usage section below it or a source
  code section. Keep existing component URLs working when changing categories.
  Button additionally includes guidelines with interactive Compass previews
  instead of external images: Graphics and Composition, linked from the right
  ToC. Composition retains only Layer, Organization and Hierarchy. Relations,
  Layout, Motion and the entire Interaction group are omitted from both the
  document and ToC. Demonstrate sizes, shapes, padding and hierarchy using
  existing UI primitives.
  Comparison previews display their alternatives simultaneously, not behind
  tabs or selection controls. Preserve individual button interactions and
  responsive wrapping, plus the radius slider. Writing shows only one
  clickable "변경 사항 저장" button, without a text field. The red Destructive
  button in the Color comparison is labeled "삭제" (Delete).
  Corner comparison shows two pill buttons with identical 160x64px geometry
  and an explicit 32px radius (half their height),
  round and the same gentle continuous CSS curve used by actual text Buttons.
  Below them, overlay only the upper straight-to-curve junction in a 3:1 crop,
  using equally scaled copies of those exact native CSS surfaces: neutral
  dashed circular edge and blue continuous edge. Do not use an SVG approximation
  with a smaller corner radius than the buttons being demonstrated.
  Keep this static comparison free of sliders, axes, grids, or extra insets.
  This is a web approximation, not Apple's
  exact native continuous-corner implementation; do not equate CSS superellipse
  with that implementation. Keep keyboard focus indicators unclipped.
  Padding shows three same-height clickable buttons at once with 4/16/64px
  horizontal padding, without a slider. Style shows only blue Filled, Tinted,
  Outline and Text buttons. Composition previews consistently use Lucide Plus
  and "추가" (Add) in Layer, Organization and Hierarchy.
- `/`: Gallery with working previews and code copy.

Preserve the existing Docs writing and previews. Do not replace them with new
UX articles. Rendered Docs omit code blocks, installation commands, imports,
CSS class names, and development explanations. Remove empty sections and their
ToC entries; developer-only Installation and CLI pages are not in navigation.
The Gallery shows up to twelve preview blocks per category/sort to signed-out visitors.
The bottom 280px fades out via CSS mask-image and -webkit-mask-image, not an opaque
theme-dependent overlay. Keyboard focus within the preview removes the mask so
focused controls remain visible. All registered,
signed-in members can browse the full Gallery without a paid subscription.
Check access through the private, no-store `/api/gallery-access` endpoint, default
to twelve while checking, and recheck on auth changes, focus and every 60 seconds.
Errors, sign-out and invalid sessions fall back to the visitor set. Never trust a
query, local storage value or client-supplied membership flag. Visitor views have
no Load more or infinite-scroll sentinel. Below the faded list, show a sign-up
heading, the live catalog count and component categories, a primary Get started
action and a separate existing-member Sign in link. Omit the lock icon and extra
free-account notice. Keep 4px between the existing-member text and its unpadded
inline sign-in link; retain the link button's 40px height.
Keep the sign-up section in normal document flow with 16px top padding after the
grid. Do not pull its heading upward with negative margins over faded card labels.
Both actions open the shared authentication dialog, with retry on access failure.
Opening authentication focuses the dialog container, not the email input, to
avoid an automatic mobile keyboard. After sending a code, keep verification-code
autofocus. Preserve the dialog's focus trap, Tab navigation and return focus.
On dismissal, restore focus to the specific sign-in trigger that opened the dialog
without scrolling; do not try to focus a removed or disabled trigger.
The access endpoint only verifies the registered
user; it does not claim Gumroad purchases or query paid Docs entitlements.
Paid guide, Skill and MCP permissions remain separate and unchanged.
Pricing stays unpublished in production. Existing public Docs previews,
source code and the downloadable AI implementation reference remain public.

Gallery uses the same Input, Layout, Navigation, and Status categories as Docs.
Shared components reuse the same live preview implementations. Gallery omits
the Button variant comparison and centers one large Primary-style button instead,
labeled "시작하기" (Get Started), 56px high and at least 160px wide.
Its copied code matches this single-button
example, and it has no reset action because presses are transient. Docs shows
the six Button variants in a two-column, three-row grid, capped at 288px wide
with 16px gaps. Each button uses the Medium 40px height, 16px text and a compact
width of approximately 136px instead of stretching across the document.
Gallery also omits
the Avatar-only size comparison and keeps just the labeled identity row.
The legacy Filter item is titled "칩" (Chips) in Gallery and Docs and uses ChipPreview:
three separate 40px-high selectable chips with gentle continuous Button
corners, 16px horizontal padding, gray inactive backgrounds without outlines,
and content-sized widths instead of equal widths: use w-auto and flex-none
on pill triggers. Let the pill list wrap within the available width while each
chip retains its 40px height. Segmented controls also fit their contents, but
retain a shared track and a single sliding selection indicator rather than chips.
Use softened near-black active backgrounds with white labels in light mode;
dark mode uses softened near-white active backgrounds with black labels,
including on hover. Use bg-foreground/80 for the active surface in light mode
and bg-foreground/85 in dark mode
to soften contrast without changing inactive surfaces. Enabled inactive
pill tabs darken their gray background by mixing Tab Muted with 8% black on
hover; active and disabled tabs retain their existing backgrounds. Use the shared
Tabs primitives with the pills variant, including keyboard tab selection,
without a result list or content panel. Both pages share the same preview.
Keep the existing /components/filter URL and source slug for compatibility.
The gallery also keeps the documented segmented-control example. Both
presentations reuse the shared Tabs component; its default variant is a rounded
segmented control. Both gallery previews show only their tab lists without a
detail panel.
The segmented control's inactive items keep the track background on hover without
the darker pill treatment used by Chips.
Inactive pill tabs, the unfilled Slider track, the segmented-control track and the off-state Switch share
the Tab Muted surface: oklch(0.95 0 0) in light mode and oklch(0.27 0 0) in dark mode.
Their selected backgrounds remain unchanged. Keep other neutral surfaces intact.
The Progress gallery item is titled "로딩" (Loading), without renaming its Docs
page or source slug. Its shared Gallery/Docs preview is an automatically looping
32px blue gradient ring indicating an indeterminate wait for a system response,
with no background track,
without a percentage, next-step button or reset action. Preserve its accessible
loading status and disable rotation for reduced-motion preferences.
Docs retains its existing Avatar preview.
Gallery omits
Token search, Card summary, Button variants, Alert dialog, Dialog editor, and
the alert-dialog component; keep only the standard dialog example there.
Docs and Registry retain their existing components. Keep Heat map in the
gallery. Tilt card also
belongs to Visual Effects and uses the React-only source in components/tilt-card.tsx
and its scoped companion stylesheet. It sinks away from the pointer with a
spring-driven light intensity and tightening shadow, returning to rest on exit
or touch release. Keep the pointer shade local: a 22% by 18% elliptical radius,
13.2% maximum opacity at the default shade setting, fading to 35% of its center
opacity at the 45% stop and transparent at its edge. Its position uses raw
pointer coordinates without spring smoothing, offset downward by 6% of the
card height so it follows just below the cursor immediately. The highlight
stays fixed at 50% 0% to keep the lighting overhead. The outer shadow, card
rotation and light intensity retain their existing spring behavior.
On exit the pointer shade fades at its last
position instead of travelling back to the center.
Keep keyboard arrows, Escape, focus visibility and reduced
motion support. It is transient, so it does not need a footer reset action.
Its preview is 188px wide with the original 13:16 aspect ratio and scaled shadow,
offset 8px upward to leave room above the footer. Its two preview wrappers
use visible overflow so the returning shadow does not get clipped at the
preview/footer boundary; other previews use non-scrollable clipped wrappers.
The outer card still clips to its rounded boundary. --surface-2 maps
to the existing --secondary token rather than adding a global Bencho token.
Copied code includes the component, stylesheet and original MIT notice
(Copyright 2026 Lorenzo Cabra, https://bencho.dev/licence). Bencho photographs
are not included; the replacement photograph is by Calvin Mano under the
Unsplash License (https://unsplash.com/photos/CXS27RrJObQ).
Gallery spans
the viewport and uses up to four columns. Code copy is a borderless Outline icon button
beside the card title, without a separate action row. Gallery cards have no
divider. Every gallery card has a fixed 280px preview
and an 80px title/action row inside the same surface directly below it.
Both regions use uniform 24px padding on all four sides. Footer titles have an
additional 8px left inset to optically match the visible action icon: its 16px
glyph is centered in a 32px button. Keep the existing bottom padding and action
hit areas. The complete card stays
360px tall. Card footer titles use 16px medium-weight text.
Preview wrappers retain an additional 4px focus-ring inset.
The gallery's Card example uses 12px vertical preview padding so its 16px
content fits without clipping. Retain its internal 16px small-Card padding,
the common 280px preview height and the unchanged title/action footer.
Gallery cards never scroll internally; only the page scrolls. Compact Card
previews use the small 16px Card spacing, while regular Docs Cards use 20px,
and Pagination previews use
40px icon-only previous/next controls with accessible labels and 40px page
links, using ellipses to fit the available width. Docs retains its
regular Card spacing and text labels.
The shared preview/title surface uses rounded-container (48px)
corners and a subtle 1px inset ring: ring-foreground/8 in light mode for clearer
separation from the white gallery page, and dark:ring-border/30 in dark mode.
The title and copy button sit within the card, not below its boundary. They
share its background without a separate footer color or divider.
Gallery reset and copy icons use portaled tooltips above their buttons on hover
and keyboard focus, labeled "새로고침" (Refresh) and "프롬프트 복사" (Copy prompt).
TooltipContent grows from 72% to full size and fades in over 160ms, starting
12px toward its source icon. Use Radix's computed tooltip transform origin and
actual data-side so the arrow-side origin stays aligned with the trigger even
when collision handling flips the tooltip. Exit takes 90ms with a subtle fade
and shrink. Preserve the 200ms hover delay, arrow, placement and keyboard
behavior. Reduced-motion preferences remove these animations.
Preserve the existing code-copy payload and reset behavior. Avoid native title
tooltips on these actions so duplicate hints do not appear.
Clicking copy keeps an already-open tooltip mounted, without replaying its
entrance animation. Only the label changes to "복사됨" (Copied) after clipboard
success and returns after 1600ms. Reserve the original label's width so the
tooltip and arrow stay in place. Repeated copies restart the feedback timer;
pointer leave, blur, Escape and outside dismissal retain normal Radix behavior.
Stateful gallery previews have a 32px borderless Outline reset icon immediately to the left
of code copy. Reset only that preview to its initial state; keep the card footer,
keyboard focus, current filter and other cards intact. Static previews have no
reset action. Gallery Tag previews omit their internal reset buttons in favor
of this footer action; Docs retains its existing Tag controls.
`lib/gallery-sources.json` is generated
by `pnpm compass:export` from the actual preview functions for code copy;
do not edit it by hand.

Gallery card gutters are 12px horizontally and vertically at every breakpoint.
Gallery starts with a single ungrouped grid with Delight cards first in the All
filter's default order. Preserve the relative order within Delight and within
the remaining components. Latest sorting still follows update timestamps.
Keep a Gallery sort dropdown at the right of the category filters, with Default
(기본) and Latest (최신). Default is initially selected. Latest sorts by recorded
update timestamps, with stable slug ties. Default Input order is Button, Switch,
Slider, Single Selection, Multiple Selection, Dropdown, then Text field. Other
groups preserve their catalog order, followed by visual effects. This Gallery
ordering does not change Docs navigation or the shared catalog. Apply it in
both All and Input views; latest sorting remains timestamp-based.
Sort the filtered list without mutating the source blocks;
retain card keys so reordering preserves preview state. Below 768px, keep only
the wordmark and a menu button in the 64px header. The shared square-cornered
right Sheet opens from the menu button side and contains main navigation, with
theme, language and account controls at the bottom. Mobile category chips sit
in the same sticky header as desktop, sharing its white background in light mode,
on one horizontally scrollable row directly above the list. Mobile Gallery content
also uses the white page background instead of gray. Hide sorting on mobile. Docs uses the same Sheet for its
document navigation. Preserve filter/sort state when opening or closing the menu
and when crossing the desktop breakpoint. Close on navigation, outside press,
Escape, or the close button; restore focus to the trigger and unlock body scrolling.
Desktop keeps its existing header controls, filter band and fixed Docs sidebars.
Header and content share responsive horizontal padding (16/32/40px).
The text-only wordmark reads "COMPASS" in 20px bold type; the browser title is also
"COMPASS". Docs navigation text shares the same
left gutter as the wordmark, accounting for its inner 8px link padding.
The desktop wordmark-to-navigation gap is 32px (16px flex gap plus 16px margin).
Profile submenu chevrons and checkmarks use 16px.
The Account page reuses SiteShell's same header, navigation and desktop/mobile
theme, language and profile controls. Treat `/account` as standalone content:
do not add Docs sidebars, ToC, copy controls or a premium-document gate.
Header language and profile triggers open immediately on mouse hover, with only
one header menu open at a time. Keep panels non-modal so the pointer can move to
the adjacent trigger. A 180ms close grace bridges the trigger/panel/submenu gaps;
entering any menu region cancels it. Hover must not steal or restore focus.
Preserve click/touch, keyboard opening, arrow navigation, Escape and outside-click
dismissal. Do not open the guest sign-in dialog on hover or change non-header
auth triggers. Omit a competing language tooltip while the menu opens on hover.

The profile dropdown contains Profile (`/account`), Appearance, Language, Feedback and Log out,
in that order, without a duplicate profile-setup button, account summary or Changelog
item. Separate Profile and Log out from the middle group with dividers. Appearance
is labeled "화면" in Korean and "Appearance" in English. It shows the saved
preference and opens a keyboard-accessible radio submenu for System, Light and Dark
through the shared ThemeProvider. Language shows the resolved
language and opens a radio submenu for 한국어/English through LocaleProvider;
manual selection persists and overrides browser detection. Feedback is a `mailto:help@designcompass.org`
link without a trailing arrow, not an automatic email submission. All three panels use
`rounded-xl` (14px) with `data-corner="continuous"`, matching Profile panel corners.
Use theme-aware popover, foreground, muted, border and elevation tokens for all menus.
Below 640px, the 160px Appearance and Language submenus
overlaps its parent menu to keep every option on screen. Account uses a centered
`max-w-4xl` layout with a 160px left menu and compact content column. Profile is
`/account`, Subscription is `/account?view=subscription`, Billing is
`/account?view=billing`, in that order; unknown views fall back to Profile.
Use the shared 1em Lucide UserRound, BadgeCheck and CreditCard menu icons. On mobile, place the menu
above the content. Hide the unfinished Notifications menu and route until settings
can actually be saved; the old notifications query falls back to Profile.
Group account settings by function in separate shared Cards: personal information,
login management, email notifications, Docs access, Gumroad subscription, payment
information and payment history. Keep the page heading/navigation outside Cards.
Use default 20px Card spacing, 24px between groups, CardHeader with an inset
divider and CardContent; never nest Cards. Keep save/sign-out forms separate and
retain matching Card surfaces for billing loading, error and empty states.
Profile's personal-information and login-management Cards override only their local
container radius to radius-xl (14px) and use data-corner="continuous" to echo text
controls. Preserve the shared Card default and other account views' geometry.
Account secondary descriptions, field/definition labels and timestamp/count notes
use text-sm (14px), while primary row labels, values, inputs, buttons and status/error
messages retain their existing sizes. This compact helper-text treatment is scoped
to Account; do not reduce Gallery/Docs typography or interactive menu labels.
Account labels, helpers, subscription states, payment states and local QA copy use
LocaleText/the shared dictionary; do not leave fixed Korean UI under English mode.
Keep buyer names/emails and upstream product names unchanged unless an exact
translation is explicitly registered. Numeric account dates remain in Asia/Seoul.
Profile uses four divided definition rows for profile image, name, email and join date:
an 80px left label column, a 24px gap and a minmax(0,1fr) right value column.
Right-align the 40px seeded avatar (shared lg size) and email; the name input fills the value
column up to 320px. Associate its visible label by htmlFor/id and allow email
wrapping on narrow screens. Remove the separate last-name field.
Join date is read-only from the authenticated Supabase user's created_at, formatted
in Asia/Seoul with a semantic time element. Missing/invalid dates show "확인 불가";
never substitute user-editable metadata or the last login time.
Use saved first_name or the provider's full_name as the initial display name;
save only first_name so existing last_name metadata is not erased. Retain account email. Its
separate login-management form follows the profile-save form and uses the existing
global sign-out action with the shared outline Button and text-only "로그아웃"
label, without an icon. Keep profile-dropdown menu icons unchanged.
AccountNotifications remains an unmounted UI draft for development; do not expose
its draft badge, internal notice or non-persistent switches to members.
Do not send emails or imply preferences are stored. Subscription owns the real
DocsAccessSummary and Gumroad subscription card; Billing contains only payment
information and payment history. Query access grants only on Subscription, never
on Billing. Pass the selected view through AccountBilling, its loading/error
states and the explicit local QA controls; retry links stay on the selected view.
Both views reuse the same authenticated billing loader and cache.
The subscription card includes 14px localized helper text directing members to
Manage on Gumroad for cancellation, restart and payment-method changes. Keep this
guidance out of the payment-history card and retain disabled actions in QA mode.
Stream AccountBilling through Suspense with shared Skeletons. A server-only loader reauthenticates the session,
requires a confirmed email, and queries Gumroad using server GUMROAD_ACCESS_TOKEN.
Never accept buyer emails or subscription IDs from query parameters. Filter the
API results by product and exact verified purchase email again, omit test/gift
payment records and return only a minimal billing DTO, never keys or full cards.
The process-local cache is isolated by user ID, verified email and seller-token
fingerprint, capped at 128 entries with a 60-second TTL and failed entries evicted.
No billing DB migration or access-grant write is needed. Display subscription
status, frequency, available start/end dates, latest payment, masked card last four
and the latest 50 payments with refund/dispute states. Never infer a next charge
date or scheduled price from past charges. Missing configuration, unverified email,
upstream failure and no purchases are distinct states. Gumroad Library links handle
subscription/card changes and receipt lookup; do not construct receipt URLs from
sale IDs. Guests see sign-in, not personal settings. This read-only billing path
never changes membership access, sends receipts or issues refunds/cancellations.
Local development also offers a shared Select for six synthetic billing states:
active, pending cancellation, expired, refunded, failed payment and no purchases.
Require NODE_ENV=development, an exact loopback Host and a confirmed authenticated
session on the server; ignore the test parameter everywhere else. Show the selector
only when an explicit valid test scenario was requested, never on ordinary billing,
including local development. Returning to actual billing hides it again. The
scenario stays in Subscription/Billing navigation links only while QA is authorized;
Profile and normal member navigation never carry it. Preview data includes a monthly
US$12 subscription, three payments and a synthetic masked card for visual inspection.
The labeled QA persona is display-only, not a new account. Synthetic views bypass real billing
lookups and the live access summary, disable outbound management/receipt actions,
and never call Gumroad, write DB records or grant document access. Return to
"실제 내역" to restore normal billing. Do not interpret fixture expiry as an
end-to-end permission test or expose this selector in staging/production.
The site header is 64px high; fixed Docs sidebars and the sticky Gallery filters
start below its 64px boundary. Gallery's viewport-height calculation reserves
the same header height. Gallery/Docs header links use 16px text while preserving
their 40px click targets. The header contains only the member/profile action,
without standalone theme or language icons, on desktop and inside the mobile menu.
Manage theme and language through the profile menu's Appearance and Language
submenus. Keep browser-language detection for guests; do not add a replacement
header icon. Do not add duplicate native title tooltips.
Docs sidebar group headings and entries, primary ToC
links and language options use 16px text. Sidebar subgroup headings, nested
ToC entries and the language-menu heading use 14px to retain their hierarchy.
Gallery category filters reuse the Chip preview's shared pills variant without
trigger style overrides: 16px text, 40px height, 16px horizontal padding,
content-sized widths and the same colors, corners and interactions.
Gallery sorting reuses the same
Dropdown appearance as its catalog preview: a 176px-wide, 40px-high bordered
field with 16px text and rounded-xl corners, plus a matching 176px-wide
item-aligned list with the shared option hover surfaces and selection checkmark.
The sort trigger shows its label and right-side dropdown chevron only, without
a leading sort icon. Keep existing menu hit areas and responsive wrapping.
Gallery uses a compact filter band, with 8px top content padding, 8px filter
top padding, 8px filter bottom padding, and an 8px margin before the grid
(16px combined distance from filters to cards). The header has no bottom divider.
Main navigation links use borderless, transparent Button surfaces with 40px
click targets, 16px horizontal padding and subtle neutral hover backgrounds.
Active links use text-foreground (near-black in light, near-white in dark)
without an underline or colored fill; retain aria-current, keyboard focus
and press feedback. Font weight and dimensions stay unchanged on selection.
Keep Gallery category filters in this order: All, Delight, Input, Navigation,
Status, Data. This filter order does not reorder Docs or
the component grid. Keep Heat map in Delight (즐거움).
Gallery category tabs use the shared Tabs pills variant: gray inactive
backgrounds without outlines, softened near-black active backgrounds with white
labels in light mode, and softened near-white active backgrounds with black
labels in dark mode. Active surfaces use bg-foreground/80 in light mode and
bg-foreground/85 in dark mode.
Keep their 40px height, 16px horizontal padding, rounded corners,
keyboard navigation, and responsive wrapping aligned with the system tabs. Do not show
New badges on gallery cards. `lib/gallery-updates.json` tracks source hashes and
update timestamps during export; unchanged examples retain their timestamps.
Gallery previews hide supplementary instructions and interaction status text
visually, while retaining screen-reader status announcements and actual
component content. Docs previews keep their existing interaction feedback.
Docs Input component pages show a Guide immediately after Preview, with
When to use and When not to use subsections. Keep this trial limited to the
16 Input entries in the catalog; other categories remain preview-only.
Use lib/input-guidelines.ts as the bilingual source of usage conditions,
without implementation instructions or code. Conditions should explain real
tasks and recommend another control when it is a better fit. The Button page
keeps its existing guide prose and visual examples after these conditions,
within one Guide chapter. Include both condition headings in the right ToC.
This structure follows https://uiarc.dev/components/number-field#when-to-use;
the Compass-specific conditions are written for its own catalog and behavior.

Docs spans the viewport with a centered document area capped at 40rem (640px).
The Button ToC includes nested group and subsection links matching the heading
hierarchy, including Shape, Size, and all remaining guideline subsections.
Use "미리보기" ("Preview") for preview headings and navigation. Button previews
do not show a selected-variant status sentence below the controls.
The Docs Button preview uses a three-column, two-row grid: Primary, Secondary,
Tertiary first; Outline, Link, Disabled second. Gallery uses two columns and
three rows in the same variant order, with container-relative type for narrow
cards. Keep Disabled in English in both locales, matching the other labels.
Keep all variants visible without tabs or internal scrolling.
Destructive remains available as a variant and in the guidelines, not this grid.
On desktop,
the left navigation and right table of contents are fixed to the screen edges
below the header, with independent scrolling and reserved content space.

Pricing is public at `/pricing` in production and development, with an indexable
canonical URL and a Pricing entry in the shared desktop/mobile main navigation.
Membership infrastructure remains independent of this page.
The pricing title uses the supplied transparent Design Compass Plus
wordmark (`/plus-membership.avif`), black in light mode and white in dark mode.
Keep its aspect ratio and accessible heading name. Intro copy describes high-quality
design for real-world work and faster, polished products, with an explicit line break
between the two sentences and without promising unreleased AI features.
The plan cards lead directly into FAQ; omit the separate component image,
promotional heading, description and docs link.
Use the shared header, Card and Button with Compass tokens;
pricing does not render Docs sidebars, copy actions or a premium document gate.
Show the available Free and Plus plan cards without a separate comparison table.
Both plan cards opt into the shared data-corner="continuous" shape, preserving
their 32px radius fallback, clipping, inset outlines and shadows without changing
other shared Card instances. Free uses a predominantly pure-white gradient with
only a faint off-white edge in
light mode and a charcoal-gray gradient in dark mode, with no central white stripe
or bright mid-stop. Scope foreground and muted text to each surface; dark mode
uses light text and 12% white separators, while its button keeps its own
subtle gray outline. Its CTA is white in light mode and light gray #d1d5db in dark
mode, with dark text in either theme,
using the shared Button's style.backgroundColor/style.color support so pointer
its hover field uses the shared Outline's 8%/2% translucent tint based on the dark
label, never an opaque gradient or inherited primary blue. Do not use
pricing-specific button CSS overrides. Preserve shared Button
geometry, focus, press and ripple behavior. Plus is an intrinsically dark surface
in both themes: foggy cyan-blue highlights flowing into saturated royal blue,
without white, lavender or rose highlights. Let the blue extend through the upper
half before fading into a predominantly
near-black #070a12 surface through the center and bottom. Keep white foreground tokens scoped
to this card, including secondary text, icons and separators. In dark mode, replace
the near-black base and dark veils with brighter deep-blue shades, ending at #142d50,
so the gradient itself separates the card from the page without an outer glow.
Put the gradients
on a non-interactive ::before layer inside the Plus card's aria-hidden
`data-pricing-surface`, overscanned by 36px and blurred by 28px;
isolate its negative stacking order so the content stays sharp. A left-side dark
veil protects price contrast. A diagonal navy fold shapes the central/lower
gradient while leaving the cyan-to-royal-blue sweep visible. Both cards use a separate
::after layer for the static, seamless monochrome /textures/pricing-grain.svg.
On Plus, both decorative layers belong to the inset surface, which inherits the
Card corners, clips overflow, and uses matching mask-image/-webkit-mask-image
opaque gradients to keep filter compositing inside those corners. Browsers without
continuous-corner support also apply matching prefixed/standard inset clip paths
to that decorative surface using the Card's local `--container-radius`, not the
root `--radius-container` Tailwind alias, so the inner and outer arcs match. Clip and mask only
this non-interactive surface, preserving the outer Card shadow and content focus rings.
Use 55% soft-light grain on Plus and dark-mode Free for a more pronounced texture;
light-mode Free uses only 4% multiply grain to preserve its white surface without a gray cast.
Isolate each card's stacking context. Keep grain behind content, non-interactive and unanimated; do not
blur the text or button. Both cards use the same mouse handlers: move the Free
gray background and the Plus colored/soft-light layers in the cursor's direction
with inverted background-position percentages and a short 180ms smoothing.
The cards themselves must not move, lift, scale or tilt on hover. Do not
increase its shadow or change the button. Reset the light position on pointer
leave/cancel; ignore touch/pen and reduced-motion input. Reduced-motion CSS also
fixes the background at center and disables its transition. Do not
add decorative textures or heavy primary rings.
Keep the plan grid at 384px maximum in a single column and 768px in two columns
from the md breakpoint, with a 20px gutter. Give both cards a restrained two-layer
shadow at just 1%/3% black opacity in light mode. In dark mode, remove the outer
shadows and white/blue glow from both cards. Keep both shadows static on hover.
Use a 1px inset ring: Free uses 10% foreground in light mode and no ring in dark
mode; Plus uses 10% white in both themes. No opaque outside outline.
Keep CTA buttons shadow-free. Keep the
56px large-size, full-width Compass Buttons below the benefit lists and aligned on desktop;
Free uses the native outline variant with a subtle 1px #cbd0d7 gray border and a theme-aware neutral surface;
Plus uses the default filled primary blue variant. Preserve keyboard focus rings and the
standard capsule corners, centered text-only labels, focus, hover and reduced-motion
behavior without custom geometry or shadows; only Free overrides button colors
for its white/light-gray surface.
Keep plan headers to their names without a research badge or marketing subtitle.
Prices use proportional numerals, normal letter spacing and a compact line height;
retain the access note and annual billing details below them.
Free shows $0 without a "free forever" suffix in either locale.
Inside plan cards, use a compact type scale: 20px plan names, 40px prices,
14px benefits/billing captions and 16px Button labels within the unchanged 56px
large hit targets. Benefit
rows retain a readable 24px line height with 10px gaps; icons inherit that
smaller label size. Use 24px card padding, increasing to 28px on wider screens.
Keep the hero and FAQ typography independent of this card-only scale.
On first load, reveal the heading, Free card, Plus card, account note, FAQ and
footer with a 600ms native CSS fade and 16px upward settling. Stagger them from
0 to 340ms, clearing the entrance state after 1s so locale and FAQ changes do not
replay it. Preserve layout dimensions and normal focus interaction; skip motion
for reduced-motion users. Do not add a motion dependency or persistent transforms.
Keep benefit lists concise: Free lists an AI-ready design system, 120+ refined UX-focused components,
and copy-and-paste source code. Omit newsletters from both cards and the benefits
FAQ. The full Gallery requires free sign-up. Plus repeats the shared Free benefits in the same order,
then adds deep research docs on design principles and early access to new updates.
Do not replace the shared benefits with an Everything in Free summary. Keep both locales and the benefits
FAQ aligned. Do not show placeholder
research counts or count unpublished drafts as available research.
Offer monthly ($14/month) and annual ($144/year) billing using shared segmented
Tabs above the plan cards, with annual first and selected on first load. Annual shows its
$12/month equivalent with the full $144 charge below; monthly shows $14/month
with the monthly charge below. Append VAT 별도 / VAT excluded after USD.
Omit the annual discount label. Keep the existing
Gumroad product and tier; set `recurrence` to the selected `monthly` or `yearly`
value. The Plus CTA reads 7일 무료 체험하기 / Start 7-day free trial. FAQ explains
the seven-day trial, subsequent selected billing frequency and cancellation.
Do not invent Team plans or additional access benefits. Visitors get twelve Gallery previews;
free registered members get the full Gallery. Public Docs previews, source code,
foundation guides and AI setup remain free.
Keep the pricing FAQ centered at a 42rem (672px) maximum width, narrower than
the plan grid, while letting it shrink to the available mobile width.
Pricing FAQ covers eight purchase questions in order: Plus benefits and free limits,
monthly/annual billing and trial, commercial-use licenses, Skill/MCP availability, existing subscribers,
cancellation/management, refunds and corporate tax invoice/bank-transfer inquiries.
Billing renews monthly or annually after the seven-day free trial, based on the selected period. The supplied refund policy
allows refunds within seven days only when the service has not been used;
refunds after seven days are generally unavailable due to the content's nature.
Deduct subscriber-only discounts used on purchased products from the refund.
Present these conditions as a readable list and retain applicable-law language.
Use a mailto link to help@designcompass.org for refunds and other inquiries.
Describe the profile/account/subscription path to Gumroad cancellation and restart,
without promising an unsupported pause control. Omit the removed free-trial question.
Keep both locales aligned.
Describe Skill/MCP as planned rather than included; do not copy another provider's
lifetime offer or commercial license promises. MIT code retains its original terms.

The public `/license` page uses the shared header and a readable, unframed article
without Docs sidebars, copy actions or premium gating. Keep Korean and English
terms aligned in `lib/license-policy.ts`, and link it from the pricing footer.
Distinguish expressly MIT-licensed code from Compass-authored Plus-only materials;
do not relicense third-party code or assets. Cover client/team use, retained rights
after subscription expiry, redistribution restrictions and help@designcompass.org.
Dedicated Skill/MCP integrations remain unavailable on hosted deployments until
the AI connection migration, server configuration and deployment QA are complete.

The account's AI connection menu at `/account?view=ai` owns Skill downloads,
client-specific MCP configuration, personal key issuance/revocation and connection
checks. `/account/ai` redirects there. Match existing account cards and icon sizing;
support Korean/English, loading, Free, unavailable and revoked/expired states.
Production MCP is opt-in through `COMPASS_AI_ENABLED` and a canonical HTTPS origin.
Use hashed, origin-bound, read-only keys and check current Plus access on every
request. Never give AI the website session, server credential or draft content.
There is no OAuth connector in this release; clients must support bearer headers.
See `docs/compass-ai-production.md` for SQL, deployment steps and security boundaries.

Synthetic testing lives at `/ai-test` and `/ai-test/connect`. These pages and
fixture/session-control routes remain development-loopback-only even when the
production feature flag is on. Keep simulations visibly separate from real
accounts. Local paid document previews retain Guide / Skill / MCP tabs; hosted
guide presentation is unchanged. Never put private bodies or connection keys in
public exports. See `docs/compass-ai-local.md` for the legacy test console.

The Docs navigation opens `/docs/ai` first. Keep Install with AI as the first item
under Get Started. The top-right theme button toggles light/dark directly,
without a dropdown. Its 20px Lucide Contrast icon has equal white/black halves
and a vertical center division in both themes. A separate
LanguageSelect button beside it selects Korean or English. Theme and language
preferences persist independently.
Korean navigation uses localized names, including Elevation as "높이", Gallery
as "갤러리", Docs as "문서", Get Started as "시작하기", Elements as "기본 요소",
and Input/Layout/Navigation/Status/Module as "입력"/"레이아웃"/"탐색"/"상태"/"모듈". Use translate or
LocaleText consistently for group headings, filters, breadcrumbs and ToC.
Keep English labels in English mode and preserve the Compass wordmark.

## Updating the AI Reference

Admin document editing uses one shared Card with CardHeader and CardContent,
and a content-sized segmented control with Public / Deep dive / Skill
(공개 / 심화 / 스킬). Public edits public content, Deep dive edits member-only
guidance, and Skill shows its derived AI rules. Do not show template insertion
actions or a second nested tab bar. Place language selection and automatic
translation at the right end of the same CardHeader row as these segments,
wrapping only when space is insufficient; do not reserve a separate language row.
Keep editors mounted across segment changes
so switching views preserves authored content and undo history.
Keep the default 20px inset, avoid nested Cards, and allow overflow so sticky
formatting toolbars and focus rings are not clipped. A single Save persists both scopes, including unsaved Korean and English
changes, through the transactional `compass_save_document_editor` RPC. Publishing
is explicit for the selected language; saving preserves existing member publication
status, and new member content starts as a draft. Omit the duplicate document
title, path, source metadata, public-page links and entitlement checkbox. Keep the
Skill view, without a website preview tab. Automatic translation generates English edits in
memory, confirms replacement of existing English content, and never saves or
publishes until requested. Language switching preserves unsaved edits in both
languages. Translation excludes public code blocks and inline code, preserving
document structure, component metadata and links. The server requires Admin access,
validates both scopes, and checks revision/timestamp conflicts before committing.
Apply `20261018_document_editor.sql` only to the intended database before enabling
combined saving. Local UI verification must not mutate production documents.
Keep editor roots and CardContent shrinkable with min-width: 0 and a 100% width
cap. Editable code blocks preserve line breaks but wrap long lines and identifiers
inside the card; scope this to .document-blocks .tiptap pre so published code
retains its independent horizontal scrolling. Never clip the whole page to hide
editor overflow.
The editor CardContent passes its 20px inset through --document-editor-inset.
Formatting toolbars bleed that distance to both card edges while retaining the
same inset for controls; their dividers must not stop short of the card sides.
Save/publish actions stay outside the Card in an opaque bottom-sticky band,
using matching 20px padding on both sides to align with the header and editor.
The editor is a flex column with an auto top margin on its action band so short
content does not pull the actions upward within the desktop navigation grid.
Keep the band above formatting toolbars, with a full-width top divider and a
1px background-colored outer shadow to mask the card ring without negative margins.
Save and Publish are text-only actions, including while pending; retain the
separate live saving status and disabled state rather than adding button icons.
Desktop document navigation is self-starting and fills the viewport below its
24px sticky top offset, with independent vertical scrolling and no bottom reserve.
On desktop its grid cancels the Admin page's 32px bottom padding so the sticky
list is not pushed upward or shortened at the end of the page.

Member-only document editors add an ImagePlus toolbar action using the same
icon-button and tooltip geometry. Images use protected application URLs, not
public assets or the shared Next image optimizer. Keep uploads bounded to
PNG/JPG/WebP/GIF at 8 MiB, prevent saving or switching language/segment mid-upload,
preserve references in Markdown and expose an editable image description.
Public document editors do not enable image insertion. See
docs/premium-docs-setup.md for server configuration and access checks.

Layout has 20 free previews under /docs/elements/layout in Elements, grouped into
Cards & Content, Image Galleries, Responsive & Expansion, and Floating & Overlays. Reuse
layoutGroups in lib/docs-catalog.ts for the document and its table of contents.
Exclude Layout from the Components catalog and gallery. Legacy /components layout
URLs redirect to their corresponding document anchor. Keep preview/copy actions
and existing interactive behavior available in the document.
Image Galleries includes Image Grid (uniform cropped tiles), Masonry Grid
(natural image ratios in CSS columns), Justified Gallery (ratio-proportional
widths and equal heights within each row), and Thumbnail Gallery (a large
uncropped image with selectable thumbnails and previous/next navigation).
Keep actual source width/height metadata. Optional crop frames specify their own
aspect ratio and focal position without rewriting source dimensions. Docs mix
portrait, square and wide crop frames to demonstrate masonry's uneven heights
and justified rows' equal heights with varying widths. Image Grid keeps uniform
tiles, while Thumbnail Gallery contrasts a large uncropped view with small crops.
Group Card, List and Grid under Cards & Content; Image Card, galleries and
Carousel belong under Image Galleries. Reference images are composition-only;
do not fetch or embed them. Local previews share components/ui/image-gallery.tsx,
keyboard-accessible buttons and a focus-managed image dialog.

Progress Bar's moving overlay uses bright blue (#58B6FF), not a white highlight.
Skeleton uses a viewport-aligned soft light sweep adapted from affectUI's
Shimmer Loader: a 100-degree linear highlight, 150vw background, fixed attachment
and a 2.2s linear pass from -50vw to 100vw. Multiple placeholders share the same
viewport coordinates rather than restarting a separate band inside each shape.
Keep bg-tab-muted as the live base color and preserve all existing sizes/corners;
the highlight uses 90% white in light mode and 8% white in dark mode. Reduced
motion disables animation and the gradient, retaining static placeholders.
Do not alter Progress Bar flow or text shimmer through this Skeleton recipe.
Reference: https://www.affectui.com/motion/shimmer-loader. Retain the MIT notice
in `public/licenses/affectui-shimmer-loader.txt` when distributing the CSS.

Motion has 27 Docs examples: eleven text/number examples,
seven entrance/exit effects, four interaction/state effects, one attention effect,
and four scroll/navigation effects. Docs consolidate these previews into
/docs/elements/motion under Elements, with family sections and replay/copy actions.
Motion is excluded from the Components catalog, gallery filters and gallery cards.
Legacy /components motion URLs redirect to the corresponding document anchor.
Blank rows from requests are not examples.
The original text/number examples are Count-up / Count-down,
Rolling Number / Odometer, Typewriter, Staggered Text, Text Reveal, Text Fade-in,
Rotating Text, Text Scramble, Marquee / Ticker, and Highlight / Underline Reveal.
Keep their bilingual metadata in lib/motion-catalog.ts and their reusable renderer
in components/ui/text-motion.tsx. Docs replay remounts the example and uses
the standard replay/copy actions.
Blur Text Reveal is an additional text example, not a replacement for the masked
Text Reveal. It follows affectUI's Text Reveal with a 700ms per-piece duration,
40ms stagger, .35em rise and cubic-bezier(.2,.7,.2,1); blur is 8px in light mode
and 6px in dark mode. TextMotion's blur-reveal variant accepts by="word" or
by="char", stagger and delay. Preserve whitespace and wrap each word as a group;
use grapheme segmentation so Korean, combining accents and emoji remain intact.
Reuse the shared visible/paused/hidden-tab timeline. Reduced motion immediately
shows the complete text without blur or movement, and assistive technology reads
one complete sentence rather than individual animated pieces. The Docs example
shows both segmentation modes with the standard replay/copy actions. Retain the
MIT notice in `public/licenses/affectui-text-reveal.txt` when adapting this recipe.
Reference: https://www.affectui.com/motion/text-reveal. The shared renderer uses
the installed `motion` package for its cubic-bezier easing; include that dependency
alongside `@number-flow/react` when copying TextMotion.
Rolling Number uses @number-flow/react (pinned to 0.6.2) for digit transitions,
locale formatting, directional changes and fading edge masks. Install this
dependency when copying the shared TextMotion renderer. Respect reduced motion;
do not replace number updates with a fixed 30-digit strip. Text Reveal and
Rotating Text use gradient masks and vertical transforms with a soft opacity
transition, preserving complete accessible text and stable phrase sizing.
Heat map continuously moves its heat focus along a slow idle
loop while visible. Pointer entry changes only its target, never its current
position; ease toward the pointer and return smoothly to the idle path on exit
or cancellation. Pause outside the viewport and in hidden tabs. Respect reduced
motion with a static rendering and clean up frames and visibility observers.

Confetti, Tilt card and Heat map belong to the separate
Delight (즐거움) gallery category, not Motion. Preserve their own pointer effects
and suppress the generic pointer feedback in both Motion and Delight previews.
Start only when visible, suspend offscreen/in hidden tabs, and cancel frames and
observers on unmount. Loop only rotating phrases and marquee, with a keyboard-
accessible pause control. Reduced-motion preferences show the completed content.

Expose stable full text/numeric targets to assistive technology, hide animated
copies, and never announce every animation frame. Reserve text/number dimensions
to prevent layout shifts. Additional examples use Motion for React for entrance/
exit, drag/snap, layout and shared elements, and canvas-confetti for celebrations.
Use Compass Button, Input, Switch and Tabs for real controls. Avoid fake or
decorative interactions: expose both enter/exit, actionable front/back flipping,
list add/remove/reorder, keyboard snap positions and inline error messages.
Scope layoutId with a unique LayoutGroup per example. Scroll demos use their own
keyboard-focusable, overscroll-contained container; never hijack page scrolling.
Use reduced-motion fallbacks and reset confetti instances on unmount. Celebrate
only after an explicit action and keep its canvas inside the example.
Group Docs by motion family, but do not add a secondary gallery filter.
Entrance/exit examples use local images, not internal visibility toggles or flip
buttons. Keep a fixed scene size and trigger each replay from the existing
bottom-right Docs Play action through `data-motion-trigger`. Run exit followed by
entrance using completion callbacks rather than arbitrary timers, and disable
replay only while that cycle is active. Stagger uses three images; flip uses two
image faces. Gate stagger visibility on its stable scene, not the remounted list.
Reduced-motion preferences keep the image visible and swap flip faces instantly.
Public previews remain free; copied examples include
the common renderer and companions. Existing Registry snapshots stay immutable.

Data contains Table and 26 independent chart gallery cards and document pages, organized into
Area, Bar, Line, Pie & Donut, Radar, Radial, and Tooltip families. This follows
the family/variant organization at https://ui.shadcn.com/charts, with original
Compass previews rather than a copy of its presentation. Use lib/chart-catalog.ts
as the single source for family groupings, Docs navigation, variants and copy.
Gallery has only the main Data filter, with Table and all chart cards shown together;
do not add a secondary chart-family chip filter.
Keep the existing /components/bar-chart, /components/line-chart and
/components/donut-chart URLs. The former /components/chart redirects to Bar.
Every card has its own preview and copy action without an in-card type selector.
Charts are free, and future supplemental premium guidance remains separate.

Use the Recharts-backed components/ui/chart.tsx for rendering. Data has label,
value, an optional secondary value, and optional numeric `series0`, `series1`, etc.
for additional series. Configured series pair keys with labels
and colors. Bar variants include horizontal, multiple, stacked, numeric labels,
and negative values. Stacked bars have square internal joins; round only the
outer endpoint of the last nonzero series on each side of the baseline. Preserve
this rule when later series are zero and when stacking negative values.
Lines include linear, smooth, step, dots and multiple;
use linear when an interpolated curve could imply unmeasured values. Areas
include linear, step, stacked, 100% stacked and gradient fills. Pie and donut
variants use positive part-to-whole values. Radar compares dimensions on the
same 0-100 scale; Radial shows 0-100 completion percentages, not arbitrary
proportions. The tooltip gallery demonstrates dot indicators using the same
actual tooltip component. The circular radar grid, line-indicator tooltip and
indicator-free tooltip variants are not listed in Gallery or Docs.
Multiple series and circular data include text legends.
Area / Default uses the same cursor-following panel as the other standard charts:
center it horizontally on the pointer, 12px above it. Do not opt this example into
the experimental plot-top positioning. Preserve axis-margin suppression, exit
dismissal and keyboard/touch activation.
Area / Linear explicitly uses `tooltipPosition="pointer"` and `tooltipOffset=24`:
its mouse/pen panel sits 24px above the cursor instead of the default 12px. With
explicit pointer positioning, touch uses the contact's viewport coordinates,
not the data point's height, and leaves at least 32px between the finger and the
panel's bottom. Keep the panel above the contact, clamp it to an 8px viewport inset
and retain the fixed body portal so cards cannot clip it. The panel remains after
lifting a finger; outside contact, scrolling, cancellation, blur or keyboard input
dismisses/replaces it. Do not prevent native scrolling. Other examples retain their
existing touch anchors unless they explicitly opt into pointer positioning.
For other charts, on mouse/pen hover, tooltips remain horizontally centered on the pointer and
12px above it, matching the cursor-follow interaction at beui.dev/charts/volume-profile.
Never flip sides or clamp position at chart boundaries: keep
the same cursor-relative alignment as the user moves between data elements.
Render these panels in a body portal with fixed viewport coordinates so gallery
cards cannot clip them. Use CSS translate(-50%, -100%) to align the actual panel
size immediately, even when its content changes. Keep panels pointer-inert.
Retain chart-local coordinates for data diagnostics, including CSS scaling. Recharts
still selects the active data and numeric payload; pointer movement changes
only panel placement, including within the same bar or pie slice. Clear the
pointer on exit, cancellation, keyboard input and touch contact. Exit and
cancellation explicitly hide both the Recharts tooltip and custom panel, even
if a delayed chart activation arrives afterward. Re-enable tooltips on pointer
re-entry, keyboard input or touch contact. Also dismiss hover panels on outside pointer movement, scrolling,
window blur and window exit. Hide pointer panels over axis margins outside the
plot. Tooltip examples must not force an always-active panel or default index.
Keyboard/touch
and static previews retain data-element anchors using Recharts' public scales
and rendered sector geometry. Center those panels above their anchor and flip
below when needed. Disable movement animations and preserve activation.

Keep numeric values in screen-reader tables and keyboard/touch tooltips.
Exclude non-finite or missing required series values; pie/donut, radar/radial
and normalized charts validate their appropriate data domains. Empty data has
an explicit state. Charts use a stable responsive height, Primary and existing
blue-family chart tokens, and no animation. Keep axes, grid lines, text and
neutral page surfaces unchanged; only the data-series colors use the blue palette.
Light mode uses Primary #007AFF, then #5F96D8 and #315F99. Dark mode uses
Primary #3390FF and chart-2 through chart-5 of #8DBFFF, #66A5F2, #4D88D4 and
#3976C5 for clearer data on dark surfaces. Keep chart-1 #D7E9FF in both themes.
Copy includes the selected preview and
its common implementation files. Chart code loads separately from other Docs.
Pie and donut centers and radii use finite pixel values calculated from the
measured width and fixed chart height, rather than percentage radius strings.
Ignore transient zero-width measurements when filters hide a chart; the next
positive resize measurement updates its geometry without collapsing its arcs.
Default and labeled solid pies and both donut examples use zero angular padding
with 3px background-colored strokes, giving their slices uniform pixel-width
separation. Use round stroke joins so narrow sectors cannot create pointed
separator spikes where slices meet at the center. Do not introduce angular gaps that widen toward the outside or
narrow toward the inside of the donut ring.
Existing immutable Registry snapshots are not edited by this expansion.

Run `pnpm compass:export` after source or guidance changes. This also runs
before `pnpm dev` and `pnpm build`. It exports only the explicitly selected
public design-system files; it does not export secrets or the whole repository.

Full-access Gallery initially renders only 12 cards, even on tall screens. Start end-sentinel
observation after the first page scroll, then append the next 12 when it is within
200px of the viewport, preserving existing card keys and preview state.
Reset to 12 and scroll to the top when changing category or sort. Stop observing
after each batch and at the end, and clean up stale observers on changes/unmount.
Keep a shared Load more button at the end as a keyboard and no-observer fallback;
do not add simulated loading delays or mount placeholders for the entire catalog.
On initial entry, reveal the first 12 Gallery cards with a native CSS animation:
520ms ease-out, 14px upward settling, scale 0.98 to 1 and 4px blur to clear.
Stagger by 35ms per card, capped at 385ms, and clear the entrance state after 1s.
Do not replay on category, sort or load-more changes. Keep steady-state transforms
and filters unset; disable entrance motion for reduced-motion users and focused
cards so keyboard interaction remains immediate. Do not add a motion library.
Gallery previews below the initial eight rendered cards mount only when within 400px of
the viewport. Keep fixed card dimensions while waiting; once mounted, retain
preview state. Disconnect proximity observers on activation and unmount, and
render normally when IntersectionObserver is unavailable. Import the generated
gallery copy-source catalog only when a copy is requested, never in the initial
gallery bundle. Preserve the same public copy content and prevent duplicate
requests while a copy is pending.

## Public Component Rules

`lib/component-basic-rules.ts` is the public Korean/English Do and Don't dataset
for the 75 component catalog entries, including chart variants. It contains no
member documents or unpublished content. Reuse this structured dataset for basic
AI guidance rather than exposing premium document storage.
Component documents show these rules after the preview, before the premium area.
Carousel rules appear with its preview in Layout. Generated public editor sources
include the same blocks. Older published copies receive a missing rules section
at render time without changing the saved document; an authored `basic-rules`
heading preserves the edited section instead of adding another one.
Keep fallback content, published copy and basic rules inside one document-width
container so they share the SiteShell reading column and aligned left edge.
Run `node scripts/document-copy-catalog.mjs` and `pnpm compass:export` after edits;
verify with `node --test scripts/component-basic-rules.test.mjs`.

The account AI page separates Basic (Free) and Pro (Plus). Basic packages these
same public rules in `skills/compass/SKILL.md` plus generated locale references,
and reads them through `/api/mcp/basic` without a key. The authenticated
`/api/mcp` and Pro Skill remain Plus-only; never route member documents into
the Basic dataset. Basic setup is independent of the Pro database readiness.
See `docs/compass-ai-production.md` for exact deployment and access boundaries.
Admin Documents separates Public and Deep articles from Public and Deep Skills.
Use the shared content-sized segmented tabs in that order, with the language tools
in the same wrapping header and a single sticky Save/Publish footer. Skills are
independently authored and revision-checked, not generated previews of the Deep
article. Only published Public Skills enter Basic; Deep Skills use the existing
Plus authorization and published-only MCP reader. See the document Skill migration
and local preview instructions in `docs/compass-ai-production.md`.
Deployed AI URLs default to `https://compass.designcompass.org` and still require
`COMPASS_AI_ENABLED=true`. An explicit `COMPASS_AI_ORIGIN` overrides that allowlist
for staging; empty, malformed or loopback deployment origins fail closed.
Local development keeps local endpoints and keys rather than forwarding them to
production. Account configs and downloaded Skill connection references share
the validated origin; localhost-only compatibility text is hidden for HTTPS.

## Published Deep Research Preview

Only published premium documents show a Plus paywall. Unpublished or missing
documents remain absent. Free/anonymous responses contain at most 360 Unicode
code points of plain paragraph text, not the member body, links, images or code.
The server-only preview reader uses the existing service role with an exact
allowlisted document/locale/published filter; missing configuration or preview
failure leaves a usable lock without an excerpt. Full content retains the
existing identity, current entitlement and published-row checks.
The excerpt fades out using a theme-independent CSS mask above the Plus CTA.

Local visual QA: `/components/navigation-bar?preview=paywall#premium-details`
uses synthetic research and a simulated locked response, without changing any
document or account. It is limited to development loopback origins; production
and forwarded-host spoofing reject the fixture. This fixture never enters the
public Skill, MCP or design-system exports.

## Table header typography

Shared TableHead uses text-sm (14px at the default 16px body scale). Table body
cells retain text-base; sortable header labels and icons inherit the header size.

Line charts can set options.allowMissingSeries for partially observed series such
as retention cohorts. Missing points remain gaps and accessible table cells show
an em dash rather than zero. Default charts still require complete numeric rows.

## Data Inspection Motion

The Journey flow block uses a separate, opt-in channel-morph treatment inspired by
the public [Arc Journey flow preview](https://uiarc.dev/components/blocks/journey-flow).
Preserve stable ribbon/node identities while Motion interpolates ribbon paths,
bar heights, hit areas and labels on one overdamped spring (180 stiffness, 28 damping).
Trace opacity eases over 160ms without restarting geometry; NumberFlow digits follow
80ms later over 420ms without overshoot. Keyboard labels and live status update immediately.
Reduced motion removes springs, delays and digit rolling. Keep the existing chart/table
interaction and Admin's real-data branches; do not add sample motion data to Admin.

Data inspection motion is applied to the cohort-retention block in `/blocks`.
The preview contains a single retention graph Card, without separate summary cards
or an outer title/date header. Keep segment filters, heatmap/curve controls and the
color legend inside that same Card; preserve inspection and keyboard behavior.
Do not include a separate example or navigation entry in the Motion document.
`components/ui/element-motion.tsx` exports dataInspectionMotion,
dataInspectionOpacity, dataInspectionDelay, dataInspectionPosition and
DataInspectionPanel. Hover/focus preserves the active row and column and fades
unrelated cells to 28%; the panel enters with a short fade/rise, follows a stable
cell identity with a damped spring and exits without shifting layout. Data rows
enter once with bounded stagger. Reduced motion removes travel, springs and
delays. Keep numeric data and missing-value semantics unchanged. The Basic Skill
ships the detailed rules and companion source in
`skills/compass/references/data-inspection-motion.md`. Reference interaction:
https://uiarc.dev/components/blocks/cohort-retention (public preview only).

## Sidebar

Use the shared `components/ui/sidebar.tsx` primitives for app and settings sidebars.
SidebarProvider measures its own container: at 720px and above the sidebar is
240px wide and collapses to a 64px icon rail; narrower containers use the shared
Sheet. SidebarTrigger and local Cmd/Ctrl+B toggle it. SidebarGroup labels use
13px, SidebarMenuButton uses 16px labels, 36px height, 8px corners, Lucide inline
icons and semantic sidebar accent tokens for hover and the active destination.
SidebarMenuButton supports `asChild` for navigation links, retaining the link's
destination and keyboard behavior while sharing active styling and mobile closing.
SidebarProvider's default `compactMode="sheet"` uses a Sheet below 720px;
`compactMode="rail"` keeps navigation visible and automatically collapses to icons.
`compactMode="static"` keeps an embedded standalone panel expanded at narrow widths;
use it for panel-only previews, not for responsive application navigation.
The trigger can still expand or collapse the rail in a narrow container.
Opt into `expandOnHover` to temporarily expand a collapsed rail on mouse entry.
Pointer leave restores its prior state; choosing a SidebarMenuButton pins it
open. During a hover preview, SidebarTrigger also pins it open; once pinned,
the trigger collapses it. Explicit collapse clears the hover state. Other sidebars retain their
default click-only behavior.
Hover previews keep a 64px rail in the page layout and expand over the content.
Pinning the sidebar reserves its full 240px width and keeps the content beside it.
Change the reserved width once when pinning or collapsing, without a width animation
that repeatedly resizes charts. Never resize content during hover. Retain label
and group nodes so their vertical positions stay stable; fade text without wrapping.
Use `SidebarTrigger appearance="plain"` for an icon without a filled background.
Pass `icon={PanelLeft}` for a fixed panel-outline glyph, as used by Admin.
Admin opts into `storageKey="compass:admin-sidebar:collapsed"` to remember explicit
collapse/expand choices in browser storage. Reloading and navigation restore that
choice; hover previews and automatic narrow layouts do not overwrite it.
Use `SidebarMenuButton expandOnSelect={false}` to preserve a collapsed rail when
selecting a destination. Other menu buttons keep the default pin-open behavior.
Hover-expanding navigation does not mount menu tooltips: pointer entry reveals
the labels directly. Ordinary collapsed icon rails retain their tooltips.
Collapsed items have tooltips. Group submenus use a 1px guide and 12px inset;
workspace controls belong in the header and the account summary in the footer.
Sidebar-07 is a structural reference, not an installed theme or style dependency.

Install `sidebar` for the primitives or `sidebar-block` for the complete
hover-preview and pinned-layout example. The block exports `SidebarBlock`
from `components/sidebar-block-preview.tsx`; render `<SidebarBlock />` for
English or `<SidebarBlock ko />` for Korean. Its public example contains no
Admin routes, authentication, account data or private content. Keep the header
Home action, plain top-right trigger, 8px group spacing and bottom Settings
alignment when adapting its navigation to an application.

Positive metric text uses `--positive`: #006b2b in light mode for strong contrast on white, and #4ade80 in dark mode. Metric deltas use semibold weight.

## Supporting data bars

Use a light Compass primary tint (`bg-primary/15`) for supporting quantitative bars inside lists and tables, including top pages and traffic sources. Keep labels and values in the normal foreground color above the tint. Reserve neutral muted backgrounds for non-data surfaces; apply this rule to future analytics blocks.

Segmented controls, chip filters and tab navigation share the `--tab-muted` background token: oklch(0.97 0 0) in light mode and oklch(0.29 0 0) in dark mode. Use the shared token throughout the site.

## Card label typography

Card-internal labels use `text-sm` (14px), matching Journey Flow step labels. Apply this to metric names, chart labels, short card section labels and field labels inside cards in future work. Keep values, body content, page headings and interactive control text at their established sizes. This specific card-label rule overrides the general body-size label guidance. SVG labels use 14px.

## UI로 전달되는 정보의 중복 설명 금지

UI 요소만으로 전달되는 정보는 라벨이나 설명으로 절대 반복하지 않는다. `알림` + `3` 배지가 있으면 `읽지 않은 알림 3개`를 추가하지 않는다. UI만으로 알 수 없는 필수 조건·결과·오류·해결 방법만 문구로 안내한다. 새 블록과 수정 시 모든 문구를 제거해 보고, 고유한 필수 정보가 사라지지 않으면 삭제한다. 필수 글쓰기 규칙: `skills/compass/references/writing.md`.

## Tabs, segmented controls and chip filters

Choose by what changes before considering option count or label length:

- Use tabs for distinct, complex content areas with different purposes or layouts, such as newsletter writing, sending analytics and an address book. Do not present these as chip filters or segmented controls just because there are few short labels. Use the registered classic-tabs recipe (`TabsList variant="line"`), with label-sized tab items and their standard horizontal padding; do not divide the full row equally among tabs. Keep a continuous bottom border spanning 100% of the content area to separate navigation from the active panel. Use linked tab/tabpanel semantics and preserve in-progress editor state when switching.
- Use segmented controls for short modes or views of the same content, such as list/grid or all/unread.
- Use chip filters to narrow a shared collection by category or attribute, especially when there are many options or long labels. Chip selection should retain the collection's layout rather than navigate between unrelated panels.

In Compass, use the default TabsList for segmented controls and `variant="pills"` for chip filters. Option count and label length refine the control only after its purpose is established.

## Nested card corners

When cards are nested, keep their corners concentric: outer radius = inner radius + the gap between their edges (padding, plus any intervening border). Do not give both layers the same radius. For the Kanban column, inner Card radius is 16px and padding is 12px, so the outer gray container radius is 28px: `calc(var(--radius-card) + 12px)`. Derive from the actual shared token, not a duplicated fixed inner radius. For unequal insets or very thick borders, start with this relation and visually adjust; never use a negative inner radius. Check both light and dark modes.

Reference: https://www.reddit.com/r/Design/comments/1r0idij/border_radius_rules/

Block previews should horizontally center their content group within the available space by default. Preserve intentional internal left alignment for labels, forms, tables and navigation. Narrow blocks keep their own max-width and center as a whole.

## 방어적 설명 문구 금지

`계정에 저장됨`, `저장하지 않은 변경 사항`, `정상적으로 적용됨`처럼 구현이 틀리지 않았음을 확인시키기 위한 상태 라벨·캡션·설명은 절대 추가하지 않는다. 별도 성공·정상 상태 문구를 붙이지 말고 버튼의 처리 중·비활성 상태 등 필요한 컨트롤 자체의 피드백으로 표현한다. 숨김 캡션이나 토스트로 대체해 되살리지 않는다. 이 규칙은 테마뿐 아니라 모든 페이지·블록·컴포넌트에 적용한다. 실제 오류와 복구 방법, 필수 조건·결과, 필요한 접근성 이름은 유지한다.

작성자의 실수나 비판을 피하려는 출처·면책·집계 한계 문구를 UI 라벨이나 설명으로 추가하지 않는다. 데이터가 이상하면 원본을 조회하고 집계를 고친다. 사용자가 요청하지 않은 방어적 설명으로 문제를 덮지 않는다. UI는 필요한 제목·값·상태·액션만 표시한다. 실제 오류나 미수집 상태는 그 상태 자체를 정확히 표시하며 수치를 만들거나 검증하지 않은 수치를 확정하지 않는다. 구현의 검증 결과와 제약은 필요한 경우 작업 보고에서 전달한다.

## Default interactive control height

The default height of interactive button-like controls is 40px, including buttons, icon buttons, segmented controls and common selection triggers. Use the shared default sizing API rather than local height overrides. Explicit compact variants, 24px Switch tracks with their larger hit areas, and explicitly requested 48px primary authentication actions retain their documented sizes. Default segmented control tracks are 40px.

## Admin card standard

Admin uses the shared Card and CardContent, including account, integrations, Gumroad and membership settings. The canonical radius is the Traffic card radius: `--radius-admin-card: 1rem` (16px), inherited by Card through `[data-admin]`. Preserve shared padding and inset boundaries; do not add local radius overrides or custom card lookalikes.

## Initial website route

The website opens Brand at `/brand`. `/` permanently redirects there, and legacy `/theme` links permanently redirect to `/brand`. Components opens the existing component Gallery at `/components`; `/gallery` remains a compatible gallery entry.

### Brand editor Select scrollbar stability

On `/brand`, an open Select keeps the viewport scrollbar visible and the page
width unchanged. Scope the viewport overflow and RemoveScroll margin adjustment
to `[data-brand-editor]`, an open `[data-slot="select-content"]`, and exactly one
`data-scroll-locked` layer. Retain Radix focus, wheel/touch containment, Escape and
selection behavior. Do not remove scroll locks globally or change nested Dialog
and Sheet behavior. Closing the Select restores the normal page rules.

## Scroll Morph

Use `GlassTabBar` from `components/ui/glass-tabbar.tsx` for three to five primary mobile sections. Supply unique item values, labels and Lucide icons; optional badges show counts. There is no separate search action. Use `value` / `onValueChange` for controlled selection, or `defaultValue` for local state. Navigation uses `aria-current="page"`; the caller renders or navigates to the selected section. Arrow keys, Home and End move selection; Enter and Space activate buttons. Pointer dragging selects on release and cancellation restores the existing selection. `compact` controls icon-only presentation; otherwise `compactOnScroll` observes window scroll or the provided `scrollRef` container. Downward scrolling hides labels and shrinks the bar in both width and height; scrolling up restores it. The Gallery provides a scrollable feed with its bar anchored at the bottom. The Gallery name is Scroll Morph (스크롤 모프). The selection indicator follows the panel’s circular capsule geometry with a 6px inset (outer radius minus inset), using a subtle foreground tint; do not add lens shadows or selected-icon magnification. The bar uses semantic theme colors, a solid fallback, and reduced-motion support.

## Morph Nav Top

`MorphNav` from `components/ui/morph-nav.tsx` expands one continuous rounded navigation surface into section links or inline search. The Gallery name is Morph Nav Top (상단 네비게이션 펼치기). Keep one mounted panel across section switches; only leaving the whole nav should trigger hover-driven collapse. Desktop section panels reserve the largest menu height so moving between sections does not fold the surface. Use for site navigation with a small number of top-level destinations. Pass `items`, optional `brand`, `search`, `action`, `current`, and `compact`. The default `panelMode="expanded"` preserves this continuous surface; `panelMode="popover"` provides a separate trigger-anchored, content-sized dropdown for full-width landing navigation. Links use native anchors; `onNavigate` can handle client-side routing. Mouse hover opens section panels with a short intent delay; touch and keyboard use buttons. Escape restores trigger focus; outside clicks and leaving focus close panels. Narrow containers fold sections into Menu. Use localized `label`, `menuLabel`, `closeLabel`, and search labels. Use `compact` for scroll-driven tightening. Semantic tokens, visible focus, and reduced-motion support apply in both themes.

## Action Morph

`ActionMorph` from `components/ui/action-morph.tsx` is a floating create button that expands into a small action menu, then an inline composer. Animate one persistent surface with measured width and height, corner radius and background color, anchored at the bottom corner. Fade content inside that surface after expansion starts; never swap separately sized button and panel surfaces or scale their text. It belongs to Components / Input. Supply actions with unique IDs, icons and composer labels, plus a real `onSubmit` callback receiving `{ action, text, choice? }`. The returned promise holds the pending state; rejection keeps the draft and shows a localized error. Drafts are preserved per action until successful submission. Short choices use shared Tabs; fields and buttons reuse Compass controls. Arrow keys and Home/End navigate the menu; letter shortcuts work only inside it. Escape returns from composer to menu, then closes to the trigger. Multiline submission uses Ctrl/Cmd+Enter. While saving, repeated submission and dismissal are blocked. A check briefly replaces the plus after success, without redundant success copy. Position the root with its parent and choose `corner="start"` or `"end"`. Use localized error, back and close labels, semantic theme colors and reduced-motion support.

## Data Flow

`DataFlow` from `components/ui/data-flow.tsx` illustrates sources, a processing core, and destinations. It belongs to Blocks / Workspace. Supply stable node IDs, short labels, optional meta and Lucide icons. Hollow input circles become filled primary squares after processing; destination `share` ranges from 0 to 1. `processedCount` is caller-owned; no production metrics are invented. `onRecordProcessed` is an animation event for demonstrations, not telemetry. The Gallery count is generated by this illustration. Use `paused` and `speed` to control playback; include a pause control for continuous animation. Motion stops offscreen and in hidden tabs; reduced motion renders static particles. Layout stays left-to-right at every width. Below 560px, the diagram keeps a 560px minimum width with horizontal scrolling. Provide a localized accessible `label` when needed. Hover only highlights optional routes; the full flow is described by a single image landmark. This is a conceptual illustration, not a real-time job monitor or volume chart.

## Panel close buttons

Panel dismiss (X) buttons use shared Button `variant="ghost"`: transparent at rest, subtle neutral tint on hover only. Keep keyboard focus rings and disabled behavior. Do not use a persistent gray Tertiary background for panel close actions.

The expandable top navigation is a Block named Navigation Bar (네비게이션 바) in the Landing category (internal ID marketing). Its landing preview fills the full container width with no outer gutters or maximum-width cap. Use the preview stylesheet through MorphNav’s className extension: match the page background with a 90% background tint and a subtle 12px backdrop blur, remove the floating outline/shadow, and use square outer edges. Keep internal navigation spacing. Set panelMode="popover" for this landing variant: open a separate panel 8px below the bar, anchored to the active trigger and clamped to a 16px horizontal viewport inset. Use a 320px single-column panel for short menus and a 560px two-column panel for larger menus, constrained to the available width. Narrow containers use one column. Keep the panel height content-driven, with a bounded vertical scroll for long menus; do not expand the full-width bar or reserve the largest menu height. Use the semantic popover surface, an inset line, shared shadow-sm elevation and a restrained 280ms fade/4px entrance. Preserve hover intent, pointer transfer, keyboard navigation, Escape/focus restoration, outside dismissal, search and reduced-motion support. Reduced transparency or increased contrast uses the solid page background without blur. The shared floating MorphNav default stays available for other consumers. The existing navigation-bar component preview uses the scroll-shrink bottom navigation. Panel Expansion Gallery examples set `expansionOnly` so menu entries do not open composers or submit data.

Block previews center their content horizontally and vertically when placement does not affect the demonstrated behavior. Use the shared PageInteractivePreview min-height and center alignment for thumbnails and expanded previews; preserve intentional positioning inside each block. Content taller than the viewport grows naturally and remains scrollable.

Shared scrollbars use transparent tracks and rounded neutral thumbs in both themes. The 10px scrollbar reserves a 4px visible thumb with 3px transparent insets; hover and drag darken the thumb. Firefox uses thin native scrollbars, and forced-colors uses system colors.

## Stamp Stickers

`StampStickers` from `components/ui/stamp-stickers.tsx` belongs to Delight. Click or tap to attach one city stamp at the pointer, with bounded irregular rotation and size. Enter/Space adds a stamp at a random interior position. Marks remain within the surface; `maxStamps` defaults to 24 to keep rendering bounded. Reduced motion places stamps immediately. Use localized `label` for the button. The transparent six-city sprite is `public/illustrations/city-stamps.png`; copy it with the component or provide `spriteSrc`. The paper and pastel stamp interiors stay opaque; only the surrounding canvas is transparent. The empty state shows an outline-only perforated stamp with a centered plus. The stamp surface is transparent. Use the standard gallery card refresh action and documentation preview reset to clear the collection through remounting; do not add a separate action inside the stamp surface.

## Media editor covers

The Admin media editor offers black and white progressive-blur covers alongside
its existing gradient and flat covers. Blur increases toward the lower edge;
titles and the Compass symbol render afterward and remain sharp. Use the same
canvas composition for thumbnails, preview, JPEG export and browser video/GIF
export, with dimensions derived from the selected output ratio. Progressive-blur
videos use browser rendering because the legacy external renderer only supports
PNG covers. Wait for the logo asset before exporting.

Field-like dialog triggers use the shared Button `shape="field"` with
`variant="outline"`: Input corners, inset padding and border tokens, normal text
weight, and the standard 40px control height. Ordinary actions retain pills.

## Large data tables

Place search, filters and query tabs above the table at the left. Place actions
that add, import, remove or otherwise modify table data at the top right.
Below the table, show total records, the visible range and total pages at left.
Use `TablePagination` from `components/ui/table-pagination.tsx` for the bottom row:
the right side places page size before first/previous, a directly editable page
number with the total page count, and next/last controls. Commit a typed page on
Enter or blur, clamp it to valid pages, and reset to page one when filters or page
size change. Disable unavailable directions and show zero visible records for an
empty result. Keep all controls at the shared default 40px height.

### Single dates and times

Use the shared `DatePicker` (`components/ui/date-picker.tsx`) for one calendar date. Its icon-free field trigger displays a two-digit year (`26.10.29`) while its value remains `YYYY-MM-DD`. It composes the shared Calendar and Button. Use `TimePicker` separately for time; `showIcon={false}` removes the optional clock and `disabled` disables its trigger. Set `confirmLabel` to hold time changes inside the popover until its confirmation button is pressed; dismissing discards those pending changes. Compose these controls for scheduled date/time fields and keep the timezone in the field label.

Date/time triggers and popovers use the Input default `rounded-xl` geometry and inherited corner shape. Time popovers align to the trigger start and scale from the Radix trigger transform origin with reduced-motion support.

### Default table block

The `data-table` block in `/blocks` uses `DataTable` from `components/ui/data-table.tsx`. Pass query controls through `query` (filters followed by search), mutations or exports through `actions`, the shared `Table` as children, and `TablePagination` through `pagination`. Use controlled query, filters and pagination; reset page one after query or page size changes. The block demo uses sample contacts, supports filtering, page jumps and CSV export, and never reads actual subscribers.

DatePicker accepts an optional `minDate` (YYYY-MM-DD) to disable earlier calendar days. TimePicker accepts `isValueDisabled(value)` to reject unavailable times; with `confirmLabel`, it disables confirmation and rechecks at activation. Newsletter reservations use Korean dates and require a future instant with the server's 30-second margin.

- Chart tooltips keep a stable React element while hovering; pointer updates are coalesced with requestAnimationFrame and pending updates are cancelled on dismissal and unmount. Preserve the chosen pointer/plot-top positioning and update values without entrance replay.

- On touch, every Chart positioning mode places the value panel above the contact point with a finger clearance and viewport edge clamping. A tap persists until outside interaction, scrolling, Escape or cancellation; preserve ordinary page scrolling. Desktop positioning choices remain unchanged.

Button supports `size="md"` for 48px-high actions between default (40px) and lg (56px), with 24px horizontal padding and body-size text. Hero actions use this shared size.

## Playback pagination
`PlaybackPagination` uses one-based controlled `page`, `count`, and `onPageChange`. `duration` defaults to 5000ms per slide; playback stops after the final slide. Pressing play after completion restarts from the first slide. Pause preserves progress; selecting a page resets it. Hidden tabs suspend elapsed time. Reduced-motion preferences disable initial autoplay. Localize labels and keep the play/pause control available. Use for a small slideshow, not search result navigation.

## Segmented progress
`SegmentedProgress` takes one-based `page`, `count`, normalized `progress` (0–1), and `onPageChange`. Completed segments fill fully; upcoming ones remain empty. The caller owns timing and slide content. Supply localized navigation labels, pause controls for autoplay, and reduced-motion support. The gallery demonstrates four image stories at five seconds per story, pausing elapsed time while the tab is hidden.

## Inline Icon Cycling
`InlineIconCycling` swaps decorative React icons within a stable 1.05em inline slot. The two-line emoji preview uses two nonwrapping line spans and fits the longest line to the actual available width, up to 32px, with a 2px rounding allowance. Add an 8px horizontal inset per side inside the preview, including compact gallery cards, and measure the reduced text width. Measure untransformed clientWidth/offsetWidth so scaled gallery thumbnails do not shrink it twice; refit on resize, locale changes, and font loading. Keep the intentional line break, original emoji spacing, and final period. Supply an accessible category `label`, optional `interval` (3000ms), `delay` to stagger slots, and `paused`. Text and line breaks stay fixed. Cycling stops offscreen, in hidden tabs, and for reduced motion. Provide a pause control for continuous animation.

## Landing block heading rhythm
Landing block section headings (Hero, Value Proposition, Content Gallery, Feature Explorer, How it works, Pricing, and FAQ) use a 1.3 line-height in both locales and at every breakpoint. Preserve the existing font sizes, weights, letter spacing, authored line breaks, and surrounding spacing. This applies only to the block section titles, not card labels or body copy.

## Value · Two-column grid
The `value-grid` landing block has the Korean heading AI에게 UX 표준 / 가르치기 and the introduction 매일 업데이트되는 디자인 스킬과 MCP를 연결해 / AI로 최고 수준의 디자인을 만드세요. Use comparable sentence lengths, text-balance and break-keep for supporting copy; preserve the authored line breaks in the heading and supporting copy. Keep the Primary text-only AI 연결하기 / Connect your AI action to `/docs/ai`, with Codex (OpenAI mark), Claude Code, and Cursor logos above. Marks are local SVGs in 32px slots; monochrome marks use BrandMark and Cursor uses original light/dark assets without inversion filters.

On the right, render a user request and plain Codex reply with a single expandable Skill/MCP reference row. Wrap the conversation and generated result in a shared Card/CardContent with a 24px inset on narrow containers and a 32px inset from @lg, plus a subtle shared shadow. Set --card-spacing on this outer Card only; the inner product Card keeps its standard spacing. Use one round-arc corner family for the user message, product result, gray stage and enclosing Card. The user message uses rounded-full with 24px horizontal padding for a capsule shape. The product result uses --radius-card + 12px (28px by default); the gray stage adds its 20px inset (48px) and the enclosing Card adds its own 24px/32px inset (72px/80px). Set data-corner="round" explicitly on the message and gray stage: the global universal corner-shape rule otherwise assigns squircle instead of inheriting the outer Card’s round arcs. Derive these from the shared tokens and actual insets so the nested corners stay concentric. Keep the card height stable during a one-time entrance on first visibility: user message, Codex identity, reply, Skill/MCP reference, and generated result appear at 100/550/800/1150/1550ms. Use a 650ms fade with 8px upward travel and cubic-bezier(.22,1,.36,1), with no spring or looping. Pending elements use visibility:hidden so their controls cannot receive focus; reduced motion shows everything immediately. Refreshing the gallery remounts and replays the sequence. Do not add a composer. Place the generated product UI in a distinct, rounded gray (bg-muted) stage with a 20px inset; derive its radius from the inner Card radius plus that inset. The white/dark product Card shows a Studio workspace, shared Avatar, weekly/monthly Tabs, an area Chart, and interactive Checkbox/SelectionLabel tasks with Progress. Keep native control sizes, semantic colors, and real local preview interactions. Do not add a Compass icon to the conversation. Stack columns on narrow containers and keep words intact in both locales.

## How it works
The landing block `how-it-works` is named 작동 방식 in Korean and presents three numbered steps: create a brand, choose components and blocks (컴포넌트&블록 고르기), and build a product by adding your own edge. Match the illustrations to brand tokens, block choices, and a custom product respectively. It uses a three-column grid on wide containers and stacks on mobile. Illustrations reuse shared Card and Button with semantic theme tokens.

## FAQ block and Accordion
The marketing `faq` block uses shared `Accordion`, `AccordionItem`, `AccordionTrigger`, and `AccordionContent` from `components/ui/accordion.tsx`. These compose Radix Accordion with keyboard support, focus rings, and localized caller content. FAQ uses a centered max-w-3xl (768px) column, a centered heading, independently collapsible answers, neutral rounded surfaces, and an email contact link. Apply hover background only to AccordionTrigger, including its padding and chevron, with the rounded item clipping the surface at its outer corners. The expanded answer is static and must not change the card background on hover. Keep question position anchoring and existing open/close motion. FAQ triggers opt out of the global 0.98 active press scale with active:scale-100!; keep hover and focus feedback. Follow the Hover and Click Targets rule in `skills/compass/SKILL.md`. Avoid unverified pricing or policy claims in sample answers.

## Soft landing card shadows
Feature Explorer illustration cards and the component/block gallery cards use the shared `shadow-soft` utility. In light mode, it uses broad 64px/28px blur layers at 7%/4% black opacity, with negative spread to avoid a dense contact edge. In dark mode, it resolves to the existing small surface shadow. Keep the Card's inset ring composed through the shadow utility. Use this treatment on the outer example/gallery cards, without changing control, menu, hero or pricing elevation.

## Feature explorer
The `feature-explorer` marketing block synchronizes left-hand expandable descriptions with a right-hand component illustration. One item remains selected. Use native buttons with aria-expanded and aria-controls. Transitions use measured auto height and soft opacity/position changes, with reduced motion respected. Mobile stacks the selection and illustration.

## Gallery marketing block
`component-gallery` combines a centered hero heading with six existing live component previews in a 3×2 desktop grid and a final link to `/components`. Cards link to component documentation. Narrow containers use two or one columns. Reuse ComponentPreview rather than duplicating demonstration controls.

## Pricing marketing block
The heading is “Design for Human” in both locales. The Korean description reads “검증된 UX로 빠르게 만들고,” followed by “내 프로덕트만의 가치를 높이는데 집중하세요.” on a new line. English copy keeps natural wrapping and the same focus on building proven UX quickly and increasing product value.
The `pricing` block compares Free, Plus, and a higher-priced Pro example in three desktop columns using shared Card, CardFooter, Button, and Tabs. Korean labels are 무료, 플러스, 프로. Pro demonstrates $29/month or $288/year ($24/month equivalent), separate from live membership pricing, and retains its email inquiry action. On desktop, shared subgrid rows align card headers, price areas, feature starts, and action footers without estimating description heights. Keep plan cards mounted across monthly/yearly changes so NumberFlow can roll the price digits over 600ms using the existing rolling-number easing, respecting reduced motion. Monthly/yearly selection changes the displayed Plus and example Pro prices; annual pricing shows a monthly equivalent and the full annual amount billed in USD. Public USD amounts are shared with the pricing page through `lib/compass-membership.ts`. The Free action leads to components and the Plus action opens `/pricing`; this preview does not initiate checkout. Cards stack in narrow containers. Keep action footers on the same card surface without a divider or a gray band.

Pricing preview cards repeat the same feature rows across all tiers, marking included features with checks and unavailable ones with dashes. Plus adds brand/Pro/reference benefits to Free, and the Pro example adds team and tailored support consultation. Plan descriptions are omitted. Shared header grid rows align names, numeric prices and billing notes; identical feature rows and transparent CardFooter actions retain alignment without arbitrary empty spaces. Pricing CTA buttons are text-only. Free and Pro use the shared gray Tertiary variant; Plus uses Primary. Use 시작하기 / Get started for Free and 플러스 시작하기 / Start Plus for Plus. The Free billing note reads 무료 / Free. Omit the USD label while preserving the dollar sign and actual amounts.
Hero entrance staggers the eyebrow, heading, description, two actions and lower showcase by 0/160/320/480/560/720ms. Each uses an 8px upward reveal with soft blur and fade, using 1.8s text and 1.6s showcase durations. Reduced motion displays everything immediately.

The Blocks category label is 랜딩 / Landing (stable internal ID `marketing`). Featured sorting lists Hero, Value Proposition, Content Gallery, Feature explorer, How it works, then Pricing, followed by FAQ and Footer. Korean block names for Value Proposition and Feature explorer are 가치 제안 and 여러 기능 탐색. Latest and name sorting retain their existing behavior. Pricing billing tabs list Yearly before Monthly and default to Yearly. The discount note reads 연 결제 시 14% 할인 (14% off with yearly billing), calculated from Plus versus twelve monthly payments; omit plan names, dollar savings and the Pro discount.

The Plus yearly discount is permanently shown beneath the segmented control, without annual dollar savings or the Pro discount. Do not place conditional discount rows inside cards. Use the named pricing container for subgrid queries so CardHeader’s own container cannot interfere. Pricing cards use a slightly tighter 44px continuous radius.

Pricing example cards retain a 28px shared card-spacing inset on all content and action areas, with a 44px continuous outer radius.

Pricing feature lists use 14px labels on a 24px line height, 6px row gaps, and an 8px icon-to-label gap. Remove tier-group dividers and extra group spacing for an even list rhythm; preserve the existing Check/Minus glyphs and 14px sizing. Included checks and plan titles use text-card-foreground (black in light mode), not Primary blue; unavailable dashes remain muted.

## Footer landing block
The `footer` block is named 푸터 / Footer. Inspired by the supplied Wavetick reference, it combines a small brand mark, grouped navigation, a contact action, and a large full-width Design Compass wordmark in the theme’s foreground color (black in light mode), reduced to foreground/70 in dark mode to soften the white. Use semantic background/foreground tokens so the current light/dark theme carries through. Existing routes link to Brand, Components, Blocks, Pricing and Docs; policy links reuse Design Compass’s localized public destinations. A plain text contact link opens `mailto:help@designcompass.org`; omit the contact heading and filled button surface. The small brand mark uses the supplied `public/brand/compass-symbol.svg`, rendered through BrandMark as an SVG alpha mask with currentColor so it follows the active theme without inversion filters. Use a real email link rather than a nonfunctional newsletter form. The desktop layout has six tracks: brand, Explore, Resources, About, social media, and a right-aligned text contact action; narrow containers use two columns with the brand above. Measure the wordmark’s actual glyph ink bounds after fonts load and fit its SVG viewBox to those bounds. Preserve natural letter spacing and proportions so its visible left and right edges align with the upper grid. Social links reuse the official Instagram, LinkedIn, YouTube and Medium destinations already configured in the newsletter footer. Keep Footer last in the full Blocks list and the Landing filter for every sort mode, preserving the relative order of other blocks.

Pricing block price digits use the existing Satoshi 700 face with tabular numerals; keep the surrounding interface in its body font. Korean billing terms consistently use 연 / 월 (연 결제, 월 결제, and 연/월 amounts in the billing note). Keep the displayed price as the monthly equivalent for yearly billing. When the note changes, crossfade with a 4px vertical offset over 400ms in one stable grid cell, without remounting the cards or price counters. Respect reduced motion and expose only the current billing text to assistive technology.


Landing block cards use the Value Proposition outer card as their radius reference: 32px round corners. Apply this to Hero showcase cards, Content Gallery cards, Feature Explorer cards, How It Works stages and cards, Pricing cards, and FAQ surfaces. Preserve device silhouettes and native component controls.

## Text-only action buttons
Use the shared Button variant="text" for standalone text actions with an optional outgoing-link icon. Keep the foreground text color, transparent surface and existing click area; hover adds an underline only. Do not use a pill background, glow or ripple for this style. Preserve keyboard focus and disabled semantics. Ghost icon/menu controls retain their existing behavior.

Feature Explorer (`feature-explorer`, 여러 기능 탐색) uses the same FeatureExplorerPreview as the landing page. Expand panels with a 480ms height/background-width transition while keeping text at its final width; fade body text in after 140ms over 220ms. Preserve the reserved list height, reduced-motion fallback, and keyboard focus ring. Panel headings have no hover background. Do not animate text with scale or clip-path.

Pricing cards use a 36px shared card-spacing inset for the header, content and footer. Preserve the same inset for Free and Plus in the Pricing page and block previews.

Social proof (`social-proof`, 소셜 프루프) is a Landing block with six sample testimonials, three columns in wide containers, two in medium containers and one on mobile. Use shared Card and Avatar with 32px outer / 24px inset author corners and serif editorial quotes. Use placeholder portraits for the example authors and a transparent author area. Omit the section heading and eyebrow. The sample attribution remains available in the section accessible label; replace the example quotes and portraits before treating them as real customer endorsements. Support Korean/English and semantic light/dark surfaces.


SiteShell’s sticky header reuses ProgressiveBlur with variant="header": four static 2–16px backdrop layers fade from the top into a 28px transparent lower edge. The overlay ignores pointer input and uses the semantic background token in both themes; browsers without backdrop filtering retain a background gradient. The default gallery blur direction remains unchanged.

The default UI font starts with Compass UI Critical, a small variable Pretendard subset generated by scripts/subset-critical-font.py for first-viewport Korean/Latin text. Other glyphs fall back to the existing Pretendard dynamic subsets. Outlines and weight variation remain Pretendard; the derived font has its own internal name and includes the source SIL OFL license.

Landing’s block gallery uses six shared pill-filter Tabs above one full-width preview with a fixed 560px mobile / 640px desktop frame. Each tab controls its real TabsContent; only the selected PageInteractivePreview mounts. Switching slides in from the selection direction, with reduced motion respected. Keep previews interactive and unscaled, and allow narrow-screen chip filters to wrap.

Landing block previews are ordered Login, Notifications, Social proof, Data flow, Kanban and Dashboard. DataFlowPreview uses a transparent outer surface and runs without a visible playback control; retain reduced-motion behavior.

Landing’s Login, Kanban, Social proof and Dashboard previews fit their natural layout into the fixed gallery frame with proportional scaling and 16px clearance. ResizeObserver recalculates on frame/content changes. The landing Dashboard omits its Top pages and Sources cards via the opt-in compact prop; other dashboard previews retain them.

On viewports up to 639px, the landing Hero uses 28px top padding, a 14px eyebrow, a 44–52px title with 1.18 line height, and a 16px horizontal text inset. Body copy wraps naturally with pretty text wrapping; Korean keeps whole words. Desktop geometry remains unchanged.

On narrow gallery frames, all six blocks use the same 1200×960 canvas, uniform fit scale and 5:4 frame. Notification and Data flow previews also use FittedPreview. Desktop retains natural-height fitting.


Multi-select chip filters use ToggleGroup type="multiple" variant="chips" size="chip" spacing={1}. Inactive chips match TabsList pills with a 40px height, 16px horizontal padding and bg-tab-muted. Selected chips use Button Secondary semantic colors (bg-button-secondary / text-primary and bg-button-secondary-hover), with a trailing Check icon. Preserve aria-pressed and Radix keyboard interaction.

Default segmented controls keep their selected indicator white in both light and dark modes, with dark text on the selected item. The track keeps its theme-aware Tab Muted surface.


Docs right-hand navigation includes the published deep-research heading hierarchy in the current content locale. Entitled members follow real `member-` heading anchors; free and signed-out visitors follow `#premium-upgrade` to the existing Plus invitation. Public responses expose only bounded heading labels/anchors and the existing prose excerpt, never the protected body. Keep authored heading labels intact and update the outline on document, locale, publication and access changes.


Docs side navigation uses matching 240px left/right widths, 14px text, 20px line-height and 32px single-line rows, with 16px hierarchy steps and no outer vertical dividers. The public Colors guide includes CompassBasicPalette, a reference palette generated by createCompassBasicPalette in lib/theme-palette.ts: the current mode’s exact Primary anchors blue 500, each blue shade anchors the other hues’ OKLCH lightness/chroma, reducing chroma only as required by the shared sRGB gamut mapper; the blue-gray family uses the same nine lightness steps as the hue families and a restrained Primary tint, arranged as the last vertical column. Keep the actual mode-specific Primary and semantic tokens unchanged.

### Public document navigation and session access

The site header uses 16px vertical spacing and 24px horizontal spacing around its 40px controls (72px main row). The mobile menu header and Docs sidebar offsets share the site header height. Docs navigation, right TOC and gallery chip filters use the same 24px inset. Public Docs navigation renders without waiting for authentication; `/api/docs-outline` exposes only published heading labels and the bounded preview, never member bodies. `UnifiedAuthProvider` owns the session identity and Plus status; gallery, theme and paywall controls consume that shared state instead of fetching on mount, focus or a timer. Reset identity-dependent results on account changes. Protected content and persistence retain server-side authorization.

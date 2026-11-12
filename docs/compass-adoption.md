# COMPASS 도입 기록

- 설치 버전: **1.0.17** (고정, 자동 업그레이드 금지)
- 레지스트리: https://compass.designcompass.org
  - 목록: https://compass.designcompass.org/r/1.0.17/registry.json
  - 기본 토큰: https://compass.designcompass.org/r/1.0.17/foundations.json
  - 컴포넌트 묶음: https://compass.designcompass.org/r/1.0.17/compass.json
- 설치일: 2026-11-12

## 프로젝트 환경

| 항목 | 값 |
| --- | --- |
| 프레임워크 | Next.js 16.4.1 (App Router, Turbopack) |
| React | 19.3.0 (react-dom 19.3.0) |
| Tailwind CSS | v4.3.5, `app/globals.css` |
| 패키지 관리자 | pnpm 10.28.0 |
| shadcn | `components.json`: style `radix-nova`, base color `neutral`, CSS 변수, icon `lucide` |
| 경로 별칭 | `@/*` → 프로젝트 루트 (`@/components`, `@/components/ui`, `@/lib`, `@/lib/utils`, `@/hooks`) |

## 설치 명령

```bash
pnpm dlx shadcn@4.23.0 init -b radix -p nova --no-monorepo -y
pnpm dlx shadcn@4.23.0 add https://compass.designcompass.org/r/1.0.17/foundations.json https://compass.designcompass.org/r/1.0.17/compass.json -y
```

`--overwrite`는 쓰지 않았습니다. `lib/utils.ts`는 shadcn init이 만든 파일이 COMPASS 1.0.17 버전과 같아서 건너뛰었습니다.

## 설치 항목

- **foundations:** COMPASS 라이트·다크 토큰, 간격·둥글기·호버·그림자 토큰을 `app/globals.css`에 병합했습니다. Tailwind import는 한 번만 들어 있습니다. Pretendard Variable도 `pretendard/dist/web/variable/pretendardvariable.css`로 한 번만 불러옵니다. 문서는 `docs/compass.md`에 있습니다.
- **compass(묶음):** `components/ui/`에 컴포넌트 70개(CSS 모듈과 SVG 포함)와 `components/theme-provider.tsx`, `components/overlay-style.tsx`를 설치했습니다.
- **의존성(레지스트리 고정 버전):**
  - `@ncdai/react-wheel-picker` 1.2.3, `@number-flow/react` 0.6.2, `class-variance-authority` 0.7.1, `cn` 0.4.0
  - `lucide-react` 1.52.0, `motion` 14.1.0, `next-themes` 0.4.6, `pretendard` 1.3.9
  - `radix-ui` 1.6.7, `react-day-picker` 10.0.2, `recharts` 3.10.1, `shadcn` 4.22.1, `tw-animate-css` 1.4.0
- **예외:** 레지스트리가 `react-dom@19.2.8`을 지정했지만, `react` 19.3.0과 맞춰야 해서 기존 버전인 `react-dom@19.3.0`을 유지했습니다.

## 연결 내용

- **`app/layout.tsx`:** `ThemeProvider`(next-themes, `attribute="class"`, `defaultTheme="system"`)로 앱 전체를 감쌌습니다. 함께 바꾼 점은 다음과 같습니다.
  - `<html lang="ko" suppressHydrationWarning>`로 설정했습니다.
  - 기본 템플릿의 Geist 폰트를 제거해 Pretendard만 쓰도록 했습니다.
- **`components/theme-toggle.tsx`:** 설치된 `Button`(ghost, icon)으로 만든 라이트·다크 전환 버튼입니다. Lucide `Sun`/`Moon` 아이콘(선 두께 2)과 `aria-label`을 붙였습니다. COMPASS provider에는 `D` 키로 전환하는 단축키도 들어 있습니다.
- **`app/page.tsx`:** 설치된 `Card`, `Button`과 Lucide `ArrowRight`(선 두께 2)로 만든 첫 화면입니다. 한국어 단어가 잘리지 않도록 `break-keep`을 넣었습니다.
- **색상:** Primary와 Accent는 라이트 모드에서 `#007AFF`입니다. 다크 모드에서는 COMPASS 토큰이 대비를 위해 `#3390FF`를 씁니다.
- **둥글기:** `Card`는 `rounded-container`와 `--nested-radius`/`--nested-gap`으로 중첩 반지름을 계산하고 컨테이너 크기에 맞게 제한합니다. Button은 pill 곡선을 그대로 씁니다.

## AI 규칙

- **규칙 본문:** `AGENTS.md`의 "COMPASS Design System" 섹션에 넣었습니다. Next.js가 관리하는 블록은 그대로 두었습니다.
- **`CLAUDE.md`:** `@AGENTS.md` 한 줄만 있습니다. Claude Code가 같은 규칙을 읽게 하는 연결 파일입니다.
- **`.mcp.json`:** COMPASS Pro(Plus) MCP `https://compass.designcompass.org/api/mcp`를 등록했습니다. 키는 파일에 넣지 않았고, 환경에 따라 다음과 같이 쓰입니다.
  - 로컬: 환경 변수 `COMPASS_MCP_KEY`에 계정에서 발급한 키를 넣습니다.
  - Claude Code 클라우드 세션: 환경에 저장된 키가 자동으로 들어갑니다.
  - 2026-11-12 조회 결과 `brandSystem`이 null이라 COMPASS 기본값을 씁니다.

## 검증 (2026-11-12)

- `pnpm exec tsc --noEmit`: 통과
- `pnpm build`: 통과
- `pnpm lint`: 오류 2개, 경고 3개. 모두 COMPASS 원본 컴포넌트 안에 있습니다(`components/ui/sidebar.tsx`, `components/ui/date-range-picker.tsx`의 `react-hooks/set-state-in-effect` 등). 업그레이드 없이 유지하려고 수정하지 않았습니다.
- 화면: 라이트·다크 모드, 1280px와 390px 폭, 키보드 포커스 링, 테마 전환을 확인했습니다. 콘솔 오류는 없었습니다.

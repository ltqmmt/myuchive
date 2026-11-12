<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## COMPASS Design System

사용자가 '디자인 시스템 써', 'COMPASS 써', 'use the design system'라고 하면 COMPASS Design System 1.0.17을 적용한다. docs/compass.md를 읽고 설치된 컴포넌트와 토큰을 재사용한다. 프레임워크를 유지하고 누락된 컴포넌트만 https://compass.designcompass.org/r/1.0.17/에서 추가한다. COMPASS를 자동 업그레이드하거나 프로젝트의 수정 내용을 덮어쓰지 않는다. 모바일 웹은 제품의 사용 흐름에 맞춰 레이아웃을 정하고, 카드 등 화면에 필요한 요소는 등록된 Compass 컴포넌트를 사용한다. 앱형 탐색과 휴대폰 미리보기가 필요한 경우 https://compass.designcompass.org/compass-mobile-web.md를 따른다.

- 설치 기록: docs/compass-adoption.md
- COMPASS Pro(Plus) MCP `compass` 서버(.mcp.json)가 연결되어 있으면 제품 작업을 시작할 때 `compass_start_project`를 version "1.0.17"로 호출해 저장된 브랜드 시스템을 읽는다. `brandSystem`이 null이면 COMPASS 기본값을 쓰고 브랜드를 적용했다고 말하지 않는다. 읽기에 실패하면 기본값으로 조용히 대체하지 않고 알린다.

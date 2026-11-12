import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        // CSS Modules(*.module.css)는 제외해야 클래스 이름이 해시된 지역 스코프로 유지된다.
        // (COMPASS MobileAppShell, GlassTabBar 등이 CSS Modules를 사용)
        condition: { not: { path: /\.module\.css$/ } },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

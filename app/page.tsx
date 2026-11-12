import { ArrowRight } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <span className="text-base font-semibold">myuchive</span>
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-12 break-keep">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>myuchive</CardTitle>
            <CardDescription>
              COMPASS Design System 1.0.17로 만든 첫 화면입니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              이 카드를 바꿔 서비스 화면을 시작하세요.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              시작하기
              <ArrowRight data-icon="inline-end" strokeWidth={2} aria-hidden />
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}

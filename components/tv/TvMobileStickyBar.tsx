"use client";

import { useState } from "react";
import Link from "next/link";
import { formatWon } from "@/datas/tvProductDetails";

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

// 모바일에서 footer 위에 고정되는 예상 렌탈료 바. internet 페이지의 MobileStickyPriceBar와 동일한 패턴.
export default function TvMobileStickyBar({
  benefit,
  monthlyRental,
}: {
  benefit: number;
  monthlyRental: number;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="sticky bottom-0 z-30 border-t border-black/10 bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.08)] pc:hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={open ? "요금 상세 접기" : "요금 상세 펼치기"}
        className="flex w-full items-center justify-center py-1.5"
      >
        <ChevronIcon className={`h-4 w-4 text-muted transition-transform ${open ? "" : "rotate-180"}`} />
      </button>

      {open && (
        <div className="space-y-2 border-b border-black/5 px-5 pb-3">
          <div className="flex items-center justify-between text-base">
            <span className="text-muted">최대 혜택가</span>
            <span className="font-semibold text-primary">{formatWon(benefit)}</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 px-5 py-3">
        <div>
          <p className="text-xs text-muted">예상 월 렌탈료</p>
          <p className="text-lg font-extrabold text-primary">{formatWon(monthlyRental)}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Link href="/inquiry/write" className="btn-ghost px-4 py-2 text-base">
            빠른 문의
          </Link>
          <Link href="/inquiry/write" className="btn-primary px-4 py-2 text-base">
            전문상담원 연결
          </Link>
        </div>
      </div>
    </div>
  );
}

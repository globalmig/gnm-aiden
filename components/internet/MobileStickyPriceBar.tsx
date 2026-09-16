"use client";

import { useState } from "react";
import Link from "next/link";
import { formatGiftRange, formatPrice, type BundleType, type GiftRange } from "@/datas/internetPricing";

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

// 모바일에서 footer 위에 고정되는 예상 요금 바.
// sticky bottom-0으로 두어, 이 컴포넌트를 감싸는 부모(내터넷 페이지 루트) 영역을 스크롤하는 동안에는
// 화면 하단에 붙어있다가, 부모 영역(=페이지 콘텐츠) 끝에 도달하면(=footer 시작 지점) 더 이상 따라오지 않고 그 자리에 멈춘다.
export default function MobileStickyPriceBar({
  bundleType,
  nonePlan,
  mobilePlan,
  finalPrice,
  gift,
}: {
  bundleType: BundleType;
  nonePlan: number | undefined;
  mobilePlan: number | undefined;
  finalPrice: number | undefined;
  gift: GiftRange | undefined;
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
          {gift && (
            <p className="text-base font-semibold text-primary">🎁 사은품 {formatGiftRange(gift)} + 추가혜택</p>
          )}
          {nonePlan !== undefined && (
            <div className="flex items-center justify-between text-base">
              <span className="text-muted">기본 요금</span>
              <span className={mobilePlan !== undefined && bundleType === "mobile" ? "text-muted line-through" : "font-semibold text-title"}>
                {formatPrice(nonePlan)}
              </span>
            </div>
          )}
          {mobilePlan !== undefined && (
            <div className="flex items-center justify-between text-base">
              <span className="text-muted">휴대폰 결합 요금</span>
              <span className="font-semibold text-title">{formatPrice(mobilePlan)}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between gap-3 px-5 py-3">
        <div>
          <p className="text-xs text-muted">최종 예상 요금</p>
          <p className="text-lg font-extrabold text-primary">
            {finalPrice !== undefined ? `월 ${formatPrice(finalPrice)}` : "상담 문의"}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Link href="/inquiry/write" className="btn-ghost px-4 py-2 text-base">
            셀프 가입
          </Link>
          <Link href="/inquiry/write" className="btn-primary px-4 py-2 text-base">
            전문상담원 연결
          </Link>
        </div>
      </div>
    </div>
  );
}

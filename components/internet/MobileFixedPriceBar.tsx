"use client";

import { useState } from "react";
import Link from "next/link";
import PriceSummaryDetails from "@/components/internet/PriceSummaryDetails";
import { formatPrice, type BundleType, type GiftRange, type InternetPlan } from "@/datas/internetPricing";

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

// 모바일에서 화면 하단에 항상 고정되는 예상 요금 바.
// 펼치면 PC의 <aside> 요금 요약 카드와 동일한 breakdown(PriceSummaryDetails)이 그대로 보인다.
// fixed bottom-0이라 페이지 최하단(Footer)까지도 계속 겹쳐 보이는 것을 감수하고, 항상 접근 가능하게 둔 것.
export default function MobileFixedPriceBar({
  companyLogo,
  selectedCompanyLabel,
  selectedSpeedLabel,
  selectedProductLabel,
  selectedTvChannel,
  installFee,
  bundleType,
  nonePlan,
  mobilePlan,
  selectedGift,
  selectedPlans,
  finalPrice,
}: {
  companyLogo: { src: string; width: number; height: number };
  selectedCompanyLabel: string | undefined;
  selectedSpeedLabel: string | undefined;
  selectedProductLabel: string | undefined;
  selectedTvChannel: { count: string; label: string } | undefined;
  installFee: { weekday: number; weekend: number };
  bundleType: BundleType;
  nonePlan: number | undefined;
  mobilePlan: number | undefined;
  selectedGift: GiftRange | undefined;
  selectedPlans: InternetPlan[] | undefined;
  finalPrice: number | undefined;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.08)] pc:hidden">
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
        <div className="max-h-[60vh] overflow-y-auto border-b border-black/5 px-5 pb-3">
          <PriceSummaryDetails
            companyLogo={companyLogo}
            selectedCompanyLabel={selectedCompanyLabel}
            selectedSpeedLabel={selectedSpeedLabel}
            selectedProductLabel={selectedProductLabel}
            selectedTvChannel={selectedTvChannel}
            installFee={installFee}
            bundleType={bundleType}
            nonePlan={nonePlan}
            mobilePlan={mobilePlan}
            selectedGift={selectedGift}
            selectedPlans={selectedPlans}
          />
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

import Image from "next/image";
import { formatGiftRange, formatPrice, type BundleType, type GiftRange, type InternetPlan } from "@/datas/internetPricing";

// PC의 <aside> 요금 요약 카드와 모바일 하단 고정바(펼침 상태)가 공유하는 상세 breakdown.
export default function PriceSummaryDetails({
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
}) {
  return (
    <>
      <div className="space-y-4 text-base">
        <div className="flex items-center justify-between">
          <p className="text-black font-semibold">통신사</p>
          <Image
            src={companyLogo.src}
            alt={selectedCompanyLabel ?? ""}
            width={companyLogo.width}
            height={companyLogo.height}
            className="h-5 w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-black font-semibold">가입상품</p>
          <p>
            {selectedSpeedLabel} · {selectedProductLabel}
          </p>
        </div>
        {selectedTvChannel && (
          <div className="flex items-center justify-between">
            <p className="text-black font-semibold">TV 채널</p>
            <p>
              {selectedTvChannel.count} · {selectedTvChannel.label}
            </p>
          </div>
        )}
        <div className="flex items-center justify-between">
          <p className="text-black font-semibold">설치비</p>
          <p>
            평일 {formatPrice(installFee.weekday)} / 주말 {formatPrice(installFee.weekend)}
          </p>
        </div>
      </div>

      <div className="mt-7 space-y-2 rounded-xl bg-white p-4 text-base">
        {nonePlan !== undefined && (
          <p className="flex items-center justify-between text-muted">
            기본요금 (미결합)
            <span className={`font-bold ${bundleType === "mobile" && mobilePlan !== undefined ? "line-through" : ""}`}>
              {formatPrice(nonePlan)}
            </span>
          </p>
        )}
        {mobilePlan !== undefined && (
          <p className="flex items-center justify-between text-body">
            휴대폰 결합 요금
            <span className="font-bold">{formatPrice(mobilePlan)}</span>
          </p>
        )}
        {!selectedPlans && (
          <p className="text-muted">선택하신 조합은 아직 제공되지 않는 상품이에요.</p>
        )}
        {selectedGift && (
          <p className="flex items-center justify-between text-body">
            사은품
            <span className="font-semibold text-primary">{formatGiftRange(selectedGift)}</span>
          </p>
        )}
      </div>
    </>
  );
}

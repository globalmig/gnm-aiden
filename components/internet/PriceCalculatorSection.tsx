import Image from "next/image";
import Link from "next/link";
import {
  BUNDLE_TYPE_OPTIONS,
  COMPANY_OPTIONS,
  PRODUCT_TYPE_OPTIONS,
  SPEED_OPTIONS,
  formatGiftRange,
  formatPrice,
  getLowestPrice,
  getPlans,
  type BundleType,
  type Company,
  type GiftRange,
  type InternetPlan,
  type ProductType,
  type Speed,
} from "@/datas/internetPricing";

const PRODUCT_TYPE_DESC: Record<ProductType, string> = {
  internet: "인터넷만 간편하게 가입",
  internet_tv: "TV 1대 기준",
};

const SPEED_DESC: Record<Speed, string> = {
  "100": "1~2인 가구",
  "500": "3~4인 가구",
  "1000": "게임 · 고화질 스트리밍",
};

const INSTALL_FEE_BY_PRODUCT: Record<ProductType, { weekday: number; weekend: number }> = {
  internet: { weekday: 36000, weekend: 45000 },
  internet_tv: { weekday: 56200, weekend: 71250 },
};

export type TvChannel = "basic" | "light" | "essence";

// 인터넷+TV 가입 시 선택하는 채널 구성 참고가. 최종 청구 금액은 상담을 통해 확정돼요.
const TV_CHANNEL_OPTIONS: { value: TvChannel; count: string; label: string; price: number }[] = [
  { value: "basic", count: "238 채널", label: "베이직", price: 16500 },
  { value: "light", count: "240 채널", label: "라이트", price: 17600 },
  { value: "essence", count: "263 채널", label: "에센스", price: 20900 },
];

const COMPANY_LOGOS: Record<Company, { src: string; width: number; height: number }> = {
  kt: { src: "/images/logo_kt.png", width: 57, height: 47 },
  sk: { src: "/images/logo_sk.png", width: 70, height: 55 },
  lgu: { src: "/images/logo-uplus.png", width: 94, height: 43 },
  "kt-skylife": { src: "/images/logo_skylife.png", width: 88, height: 64 },
  "sk-7mobile": { src: "/images/logo-7mobile.png", width: 108, height: 23 },
  "lg-hellovision": { src: "/images/logo-lg-hellowVision.png", width: 97, height: 49 },
};

function CheckBadge({ checked }: { checked: boolean }) {
  return (
    <span
      className={`absolute top-1/2 right-4 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full border transition-colors ${checked ? "border-primary bg-primary text-white" : "border-black/15 bg-white"
        }`}
    >
      {checked && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="h-3 w-3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </span>
  );
}

function StepCard({ step, title, children }: { step: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0_2px_10px_#dee1ea]">
      <div className="mb-5 flex items-center gap-3">
        <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
          {step}
        </span>
        <h3 className="text-base! font-bold text-title">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function PriceCalculatorSection({
  company,
  productType,
  bundleType,
  speed,
  tvChannel,
  onCompanyChange,
  onProductTypeChange,
  onBundleTypeChange,
  onSpeedChange,
  onTvChannelChange,
  selectedPlans,
  selectedPrice,
  selectedGift,
  nonePlan,
  mobilePlan,
  children,
}: {
  company: Company;
  productType: ProductType;
  bundleType: BundleType;
  speed: Speed;
  tvChannel: TvChannel;
  onCompanyChange: (company: Company) => void;
  onProductTypeChange: (productType: ProductType) => void;
  onBundleTypeChange: (bundleType: BundleType) => void;
  onSpeedChange: (speed: Speed) => void;
  onTvChannelChange: (tvChannel: TvChannel) => void;
  selectedPlans: InternetPlan[] | undefined;
  selectedPrice: number | undefined;
  selectedGift: GiftRange | undefined;
  /** 결합 없음 기준 최저가 (사이드바 비교용) */
  nonePlan: number | undefined;
  /** 휴대폰 결합 기준 최저가 (사이드바 비교용) */
  mobilePlan: number | undefined;
  /** 좌측 750px 컬럼에 STEP1~4 아래로 이어지는 상세 콘텐츠 (예: 요금표 섹션) */
  children?: React.ReactNode;
}) {
  const selectedCompanyLabel = COMPANY_OPTIONS.find((option) => option.value === company)?.label;
  const selectedProductLabel = PRODUCT_TYPE_OPTIONS.find((option) => option.value === productType)?.label;
  const selectedSpeedLabel = SPEED_OPTIONS.find((option) => option.value === speed)?.label;
  const selectedTvChannel = TV_CHANNEL_OPTIONS.find((option) => option.value === tvChannel);
  const installFee = INSTALL_FEE_BY_PRODUCT[productType];

  return (
    <div className="mt-8 flex flex-col gap-8 pc:flex-row pc:gap-x-12.5">
      <div className="space-y-5 pc:space-y-8 pc:flex-1">
        <StepCard step="STEP 01" title="통신사 선택">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {COMPANY_OPTIONS.map((option) => {
              const logo = COMPANY_LOGOS[option.value];
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onCompanyChange(option.value)}
                  className={`flex h-16 items-center justify-center rounded-lg border px-3 transition-colors ${company === option.value
                      ? "border-primary bg-sky-light"
                      : "border-black/10 bg-white hover:border-primary/40"
                    }`}
                >
                  <Image
                    src={logo.src}
                    alt={option.label}
                    width={logo.width}
                    height={logo.height}
                    className="h-auto max-h-7 w-auto max-w-20 object-contain"
                  />
                </button>
              );
            })}
          </div>
        </StepCard>

        <StepCard step="STEP 02" title="가입상품 선택">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {PRODUCT_TYPE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onProductTypeChange(option.value)}
                className={`relative rounded-lg border p-4 text-left transition-colors ${productType === option.value
                    ? "border-primary bg-sky-light"
                    : "border-black/10 bg-white hover:border-primary/40"
                  }`}
              >
                <CheckBadge checked={productType === option.value} />
                <p className="pr-8 text-base font-bold text-title">{option.label}</p>
                <p className="mt-1 text-xs text-muted">{PRODUCT_TYPE_DESC[option.value]}</p>
              </button>
            ))}
          </div>

          <label className="mt-4 flex items-center gap-2 text-base text-body">
            <input
              type="checkbox"
              checked={bundleType === "mobile"}
              onChange={(e) => onBundleTypeChange(e.target.checked ? "mobile" : "none")}
              className="h-4 w-4 rounded border-black/20 accent-primary"
            />
            전화와 함께 ({BUNDLE_TYPE_OPTIONS.find((o) => o.value === "mobile")?.label})
          </label>
        </StepCard>

        <StepCard step="STEP 03" title="인터넷 속도">
          <div className="grid grid-cols-3 gap-3">
            {SPEED_OPTIONS.map((option) => {
              const price = getLowestPrice(getPlans(company, productType, option.value, bundleType));
              const available = price !== undefined;
              const isSelected = speed === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={!available}
                  onClick={() => onSpeedChange(option.value)}
                  className={`relative rounded-lg border p-4 text-left transition-colors ${!available
                      ? "cursor-not-allowed border-black/5 bg-surface"
                      : isSelected
                        ? "border-primary bg-sky-light"
                        : "border-black/10 bg-white hover:border-primary/40"
                    }`}
                >
                  <CheckBadge checked={available && isSelected} />
                  <p className={`pr-8 text-base font-bold ${available ? "text-title" : "text-muted"}`}>
                    {option.label}
                  </p>
                  <p className="mt-1 text-xs text-muted">{available ? SPEED_DESC[option.value] : "제공되지 않음"}</p>
                  <p className={`mt-3 text-base font-bold ${available ? "text-primary" : "text-muted"}`}>
                    {available ? `월 ${formatPrice(price)}` : "-"}
                  </p>
                </button>
              );
            })}
          </div>
        </StepCard>

        <StepCard step="STEP 04" title="TV 채널">
          <div className="grid grid-cols-3 gap-3">
            {TV_CHANNEL_OPTIONS.map((option) => {
              const isSelected = tvChannel === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onTvChannelChange(option.value)}
                  className={`relative rounded-lg border p-4 text-left transition-colors ${isSelected ? "border-primary bg-sky-light" : "border-black/10 bg-white hover:border-primary/40"
                    }`}
                >
                  <CheckBadge checked={isSelected} />
                  <p className="pr-8 text-base font-bold text-title">{option.count}</p>
                  <p className="mt-1 text-xs text-muted">{option.label}</p>
                  <p className="mt-3 text-base font-bold text-primary">월 {formatPrice(option.price)}</p>
                </button>
              );
            })}
          </div>
        </StepCard>

        {children}
      </div>

      <div className="pc:w-100 pc:shrink-0">
        <aside className="rounded-2xl bg-sky-light p-6 pc:sticky pc:top-24 pc:py-10">
          <p className="text-base font-bold text-primary">예상 월 요금</p>

          <div className="mt-6 space-y-4 text-base pc:mt-10">
            <div className="flex items-center justify-between">
              <p className="text-black font-semibold">통신사</p>
              <div>
                <Image
                  src={COMPANY_LOGOS[company].src}
                  alt={selectedCompanyLabel ?? ""}
                  width={COMPANY_LOGOS[company].width}
                  height={COMPANY_LOGOS[company].height}
                  className="h-5 w-auto object-contain"
                />
              </div>
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

          <div className="mt-7 space-y-2 p-4 text-base bg-white pc:rounded-3xl pc:mt-12 pc:space-y-5 pc:py-6">
            {nonePlan !== undefined && (
              <p className="flex items-center justify-between text-muted">
                <span>기본요금 (미결합)</span>
                <span className={`font-bold ${bundleType === "mobile" && mobilePlan !== undefined ? "line-through" : ""}`}>
                  {formatPrice(nonePlan)}
                </span>
              </p>
            )}
            {mobilePlan !== undefined && (
              <p className="flex items-center justify-between text-body">
                <span>휴대폰 결합 요금</span>
                <span className="font-bold">{formatPrice(mobilePlan)}</span>
              </p>
            )}
            {!selectedPlans && (
              <p className="text-muted">선택하신 조합은 아직 제공되지 않는 상품이에요.</p>
            )}
            {selectedGift && (
              <p className="flex items-center justify-between text-body">
                <span>사은품</span>
                <span className="font-semibold text-primary">{formatGiftRange(selectedGift)}</span>
              </p>
            )}
          </div>

          <p className="mt-5 text-right text-2xl font-extrabold text-primary">
            월 {selectedPrice !== undefined ? formatPrice(selectedPrice) : "상담 문의"}
          </p>

          <div className="mt-8 grid grid-cols-1 gap-2">
            <Link href="/inquiry/write" className="btn-ghost w-full">
              빠른 문의
            </Link>
            <Link href="/inquiry/write" className="btn-primary w-full">
              전문 상담원 연결
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

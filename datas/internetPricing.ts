// 인터넷 요금표.txt / 핸드폰까지 결합 시 요금표.txt / 사은품.txt 를 구조화한 데이터

export type Company = "kt" | "sk" | "lgu" | "kt-skylife" | "lg-hellovision";
export type Speed = "100" | "500" | "1000";
export type ProductType = "internet" | "internet_tv";
export type BundleType = "none" | "mobile";

export const COMPANY_OPTIONS: { value: Company; label: string }[] = [
  { value: "kt", label: "KT" },
  { value: "sk", label: "SK" },
  { value: "lgu", label: "LG U+" },
  { value: "kt-skylife", label: "KT스카이라이프" },
  { value: "lg-hellovision", label: "LG헬로비전" },
];

export const SPEED_OPTIONS: { value: Speed; label: string; recommended?: boolean }[] = [
  { value: "100", label: "100Mbps" },
  { value: "500", label: "500Mbps", recommended: true },
  { value: "1000", label: "1Gbps" },
];

export const PRODUCT_TYPE_OPTIONS: { value: ProductType; label: string }[] = [
  { value: "internet", label: "인터넷 단독" },
  { value: "internet_tv", label: "인터넷 + TV" },
];

export const BUNDLE_TYPE_OPTIONS: { value: BundleType; label: string }[] = [
  { value: "none", label: "미결합" },
  { value: "mobile", label: "휴대폰 결합 (1~2대)" },
];

export interface InternetPlan {
  /** 같은 속도 안에 상품이 여러 개인 경우 구분 (예: LG "기본" / "프리미엄 안심") */
  planName: string;
  composition: string;
  setTop?: string;
  price: number;
}

export type PlanKey = `${Company}|${ProductType}|${Speed}|${BundleType}`;

function planKey(company: Company, productType: ProductType, speed: Speed, bundleType: BundleType): PlanKey {
  return `${company}|${productType}|${speed}|${bundleType}`;
}

// 원본 txt에 존재하지 않는 조합(1G 인터넷단독, 100M 단독+휴대폰결합 등)은
// 아예 키를 넣지 않는다 -> getPlans()가 undefined를 반환 -> UI에서 선택 비활성화 처리
// 관리자 화면에서 아직 아무 값도 저장하지 않았거나 API 호출에 실패했을 때 쓰이는 기본값.
export const PRICE_PLANS: Partial<Record<PlanKey, InternetPlan[]>> = {
  // ============== 결합 없음 (인터넷 요금표.txt) ==============
  [planKey("lgu", "internet_tv", "100", "none")]: [
    { planName: "기본", composition: "기본 100M + 기가wifi", setTop: "프리미엄 4K UHD4셋탑", price: 42900 },
  ],
  [planKey("sk", "internet_tv", "100", "none")]: [
    { planName: "기본", composition: "광랜 100M + wifi", setTop: "all 스마트3셋탑", price: 39600 },
  ],
  [planKey("kt-skylife", "internet_tv", "100", "none")]: [
    { planName: "기본", composition: "기본 100M + 스카이wifi", setTop: "iptv 플러스 지니tv STB a셋탑", price: 35200 },
  ],
  [planKey("lg-hellovision", "internet_tv", "100", "none")]: [
    { planName: "기본", composition: "광랜라이트+100M +일반wifi", setTop: "UHD뉴프리미엄 UHD셋탑", price: 37230 },
  ],
  [planKey("kt", "internet_tv", "100", "none")]: [
    { planName: "기본", composition: "100M + 기가와이파이 홈AX", setTop: "모든G 기가지니 a셋탑", price: 46200 },
  ],

  [planKey("lgu", "internet_tv", "500", "none")]: [
    { planName: "기본", composition: "기본 500M + 기가wifi", setTop: "프리미엄 UHD4셋탑", price: 48400 },
    { planName: "프리미엄 안심", composition: "프리미엄 안심 500M wifi", setTop: "프리미엄 구글셋탑(UHD4)셋탑", price: 55000 },
  ],
  [planKey("sk", "internet_tv", "500", "none")]: [
    { planName: "기본", composition: "기가라이트 500M + wifi", setTop: "all스마트3 셋탑", price: 49500 },
  ],
  [planKey("kt-skylife", "internet_tv", "500", "none")]: [
    { planName: "기본", composition: "기본 500M + 스카이wifi", setTop: "IPTV플러스 지니TV STB A셋탑", price: 41800 },
  ],
  [planKey("lg-hellovision", "internet_tv", "500", "none")]: [
    { planName: "기본", composition: "기가라이트 500M +기가wifi", setTop: "UHD뉴프리미엄 UHD셋탑", price: 44990 },
  ],
  [planKey("kt", "internet_tv", "500", "none")]: [
    { planName: "기본", composition: "500M + 기가 와이파이 홈AX", setTop: "모든G 기가지니A셋탑", price: 51700 },
  ],

  [planKey("lgu", "internet", "500", "none")]: [
    { planName: "기본", composition: "기본 500M +기가wifi", price: 33000 },
  ],
  [planKey("sk", "internet", "500", "none")]: [
    { planName: "기본", composition: "기본 500M + 기가wifi", price: 33100 },
  ],
  [planKey("kt", "internet", "500", "none")]: [
    { planName: "기본", composition: "기본 500M + 기가wifi 홈AX", price: 34100 },
  ],
  [planKey("kt-skylife", "internet", "500", "none")]: [
    { planName: "기본", composition: "500M + 스카이wifi", price: 30800 },
  ],
  [planKey("lg-hellovision", "internet", "500", "none")]: [
    { planName: "기본", composition: "기가라이트 500M + 기가wifi", price: 31460 },
  ],

  [planKey("lgu", "internet", "100", "none")]: [
    { planName: "기본", composition: "기본 100M +기가wifi", price: 22000 },
  ],
  [planKey("sk", "internet", "100", "none")]: [
    { planName: "기본", composition: "100M + 기가wifi", price: 23100 },
  ],
  [planKey("kt", "internet", "100", "none")]: [
    { planName: "기본", composition: "100M + 기가wifi 홈AX", price: 23100 },
  ],
  [planKey("kt-skylife", "internet", "100", "none")]: [
    { planName: "기본", composition: "100M + 스카이wifi", price: 24200 },
  ],
  [planKey("lg-hellovision", "internet", "100", "none")]: [
    { planName: "기본", composition: "광랜라이트 100M + 일반wifi", price: 21890 },
  ],

  [planKey("lgu", "internet_tv", "1000", "none")]: [
    { planName: "기본", composition: "기본 1G + 기가wifi", setTop: "프리미엄 UHD4셋탑", price: 53900 },
    { planName: "프리미엄 안심", composition: "프리미엄 안심 1G + wifi", setTop: "프리미엄 구글셋탑(UHD4)셋탑", price: 60500 },
  ],
  [planKey("sk", "internet_tv", "1000", "none")]: [
    { planName: "기본", composition: "1G + 기가wifi", setTop: "all스마트3 셋탑", price: 55000 },
  ],
  [planKey("kt-skylife", "internet_tv", "1000", "none")]: [
    { planName: "기본", composition: "1G + 스카이wifi", setTop: "IPTV플러스 지니TV STB A셋탑", price: 47300 },
  ],
  [planKey("lg-hellovision", "internet_tv", "1000", "none")]: [
    { planName: "기본", composition: "플레티넘 기가 1G +기가wifi", setTop: "UHD뉴프리미엄 UHD셋탑", price: 50490 },
  ],
  [planKey("kt", "internet_tv", "1000", "none")]: [
    { planName: "기본", composition: "1G + 기가 와이파이 홈AX", setTop: "모든G 기가지니A셋탑", price: 57200 },
  ],

  // ============== 휴대폰 결합 (핸드폰까지 결합 시 요금표.txt) ==============
  [planKey("lgu", "internet_tv", "500", "mobile")]: [
    { planName: "기본", composition: "기본 500M + 기가wifi", setTop: "프리미엄 UHD4셋탑", price: 42900 },
    { planName: "프리미엄 안심", composition: "프리미엄 안심 500M wifi", setTop: "프리미엄 구글셋탑(UHD4)셋탑", price: 55000 },
  ],
  [planKey("sk", "internet_tv", "500", "mobile")]: [
    { planName: "기본", composition: "기가라이트 500M + wifi", setTop: "all스마트3 셋탑", price: 42900 },
  ],
  [planKey("kt-skylife", "internet_tv", "500", "mobile")]: [
    { planName: "기본", composition: "기본 500M + 스카이wifi", setTop: "IPTV플러스 지니TV STB A셋탑", price: 41800 },
  ],
  [planKey("lg-hellovision", "internet_tv", "500", "mobile")]: [
    { planName: "기본", composition: "기가라이트 500M +기가wifi (헬로모바일)", setTop: "UHD뉴프리미엄 UHD셋탑", price: 30360 },
  ],
  [planKey("kt", "internet_tv", "500", "mobile")]: [
    { planName: "기본", composition: "500M + 기가 와이파이 홈AX", setTop: "모든G 기가지니3셋탑", price: 42900 },
  ],

  [planKey("lgu", "internet_tv", "100", "mobile")]: [
    { planName: "기본", composition: "기본 100M + 기가wifi", setTop: "프리미엄 4K UHD4셋탑", price: 37400 },
  ],
  [planKey("sk", "internet_tv", "100", "mobile")]: [
    { planName: "기본", composition: "광랜 100M + wifi", setTop: "all 스마트3셋탑", price: 38500 },
  ],
  [planKey("kt-skylife", "internet_tv", "100", "mobile")]: [
    { planName: "기본", composition: "기본 100M + 스카이wifi", setTop: "iptv 플러스 지니tv STB a셋탑", price: 35200 },
  ],
  [planKey("lg-hellovision", "internet_tv", "100", "mobile")]: [
    { planName: "기본", composition: "광랜라이트+100M +일반wifi (헬로모바일)", setTop: "UHD뉴프리미엄 UHD셋탑", price: 29065 },
  ],
  [planKey("kt", "internet_tv", "100", "mobile")]: [
    { planName: "기본", composition: "100M + 기가와이파이 홈AX", setTop: "모든G 기가지니 3셋탑", price: 41800 },
  ],

  [planKey("lgu", "internet_tv", "1000", "mobile")]: [
    { planName: "기본", composition: "기본 1G + 기가wifi", setTop: "프리미엄 UHD4셋탑", price: 48400 },
    { planName: "프리미엄 안심", composition: "프리미엄 안심 1G + wifi", setTop: "프리미엄 구글셋탑(UHD4)셋탑", price: 60500 },
  ],
  [planKey("sk", "internet_tv", "1000", "mobile")]: [
    { planName: "기본", composition: "1G + 기가wifi", setTop: "all스마트3 셋탑", price: 46200 },
  ],
  [planKey("kt-skylife", "internet_tv", "1000", "mobile")]: [
    { planName: "기본", composition: "1G + 스카이wifi", setTop: "IPTV플러스 지니TV STB A셋탑", price: 47300 },
  ],
  [planKey("lg-hellovision", "internet_tv", "1000", "mobile")]: [
    { planName: "기본", composition: "플레티넘 기가 1G +기가wifi", setTop: "UHD뉴프리미엄 UHD셋탑", price: 50490 },
  ],
  [planKey("kt", "internet_tv", "1000", "mobile")]: [
    { planName: "기본", composition: "1G + 기가 와이파이 홈AX", setTop: "모든G 기가지니A셋탑", price: 51700 },
  ],

  [planKey("lgu", "internet", "500", "mobile")]: [
    { planName: "기본", composition: "기본 500M +기가wifi", price: 27500 },
  ],
  [planKey("sk", "internet", "500", "mobile")]: [
    { planName: "기본", composition: "기본 500M + 기가wifi", price: 23100 },
  ],
  [planKey("kt", "internet", "500", "mobile")]: [
    { planName: "기본", composition: "기본 500M + 기가wifi 홈AX", price: 28600 },
  ],
  [planKey("kt-skylife", "internet", "500", "mobile")]: [
    { planName: "기본", composition: "500M + 스카이wifi", price: 30800 },
  ],
  [planKey("lg-hellovision", "internet", "500", "mobile")]: [
    { planName: "기본", composition: "기가라이트 500M + 기가wifi", price: 19965 },
  ],
};

/** 관리자 화면(`/admin/internet-pricing`)에서 편집 가능한, 요금표 전체를 담는 구조. */
export interface InternetPricingConfig {
  plans: Partial<Record<PlanKey, InternetPlan[]>>;
  giftTable: Partial<Record<GiftKey, GiftRange>>;
  usimExtraGift: GiftRange;
}

export function getPlans(
  config: InternetPricingConfig,
  company: Company,
  productType: ProductType,
  speed: Speed,
  bundleType: BundleType
): InternetPlan[] | undefined {
  return config.plans[planKey(company, productType, speed, bundleType)];
}

export function isComboAvailable(
  config: InternetPricingConfig,
  company: Company,
  productType: ProductType,
  speed: Speed,
  bundleType: BundleType
): boolean {
  return !!getPlans(config, company, productType, speed, bundleType);
}

export function getLowestPrice(plans?: InternetPlan[]): number | undefined {
  if (!plans || plans.length === 0) return undefined;
  return Math.min(...plans.map((plan) => plan.price));
}

// ============== 사은품 (사은품.txt) ==============
// SK/LG/KT 셋 모두 동일 범위이며 통신사 구분 없이 상품유형·속도로만 결정된다.
// KT스카이라이프 / LG헬로비전은 자료가 없어 해당 통신사 선택 시 섹션 자체를 숨긴다.

export const GIFT_ELIGIBLE_COMPANIES: Company[] = ["kt", "sk", "lgu"];

export interface GiftRange {
  min: number;
  max: number;
}

export type GiftSpeedTier = "100" | "500_1000";
export type GiftKey = `${ProductType}|${GiftSpeedTier}`;

export const GIFT_TABLE: Partial<Record<GiftKey, GiftRange>> = {
  "internet_tv|500_1000": { min: 40, max: 45 }, // 500M/1G 인터넷+TV
  "internet_tv|100": { min: 27, max: 35 }, // 100M 인터넷+TV
  "internet|500_1000": { min: 10, max: 15 }, // 500M 인터넷 단독
  "internet|100": { min: 7, max: 10 }, // 100M 인터넷 단독
};

/** 유심 결합개통 시 추가되는 사은품 (요금제에 따라 상이) */
export const USIM_BUNDLE_EXTRA_GIFT: GiftRange = { min: 5, max: 15 };

export const DEFAULT_INTERNET_PRICING_CONFIG: InternetPricingConfig = {
  plans: PRICE_PLANS,
  giftTable: GIFT_TABLE,
  usimExtraGift: USIM_BUNDLE_EXTRA_GIFT,
};

export function getGiftRange(
  config: InternetPricingConfig,
  company: Company,
  productType: ProductType,
  speed: Speed
): GiftRange | undefined {
  if (!GIFT_ELIGIBLE_COMPANIES.includes(company)) return undefined;
  if (productType === "internet" && speed === "1000") return undefined; // 1G 인터넷단독 자체가 없음
  const tier: GiftSpeedTier = speed === "100" ? "100" : "500_1000";
  return config.giftTable[`${productType}|${tier}`];
}

export function formatGiftRange(gift?: GiftRange): string {
  if (!gift) return "-";
  return `${gift.min}~${gift.max}만원`;
}

export function formatPrice(price: number): string {
  return `${price.toLocaleString()}원`;
}

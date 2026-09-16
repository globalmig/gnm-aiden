import type { TvProduct } from "@/components/tv/TvProductItem";

export type AffiliateCardOption = {
  id: string;
  label: string;
  discount: number;
};

export const AFFILIATE_CARD_OPTIONS: AffiliateCardOption[] = [
  { id: "hana-rentalpay", label: "BS & 렌탈페이 플러스 하나카드", discount: 23000 },
  { id: "kb-rental", label: "KB국민 렌탈사랑카드", discount: 18000 },
  { id: "samsung-rental", label: "삼성 렌탈플러스카드", discount: 15000 },
  { id: "none", label: "제휴카드 사용 안함", discount: 0 },
];

export type CommitmentOption = { years: number; label: string; priceFactor: number };

export const COMMITMENT_OPTIONS: CommitmentOption[] = [
  { years: 5, label: "5년", priceFactor: 1 },
  { years: 4, label: "4년", priceFactor: 1.06 },
  { years: 3, label: "3년", priceFactor: 1.14 },
  { years: 2, label: "2년", priceFactor: 1.24 },
  { years: 1, label: "1년", priceFactor: 1.38 },
];

export const MANAGEMENT_LABEL = "관리없음";

const TYPE_WEIGHT: Record<string, number> = { LED: 1, QLED: 1.3, OLED: 1.5 };
const TYPE_DEPTH: Record<string, number> = { LED: 60, QLED: 55, OLED: 46 };
const TYPE_WEIGHT_PER_INCH: Record<string, number> = { LED: 0.19, QLED: 0.22, OLED: 0.15 };

function round(value: number, unit: number) {
  return Math.round(value / unit) * unit;
}

export function parseInch(screenSize: string) {
  const n = parseFloat(screenSize);
  return Number.isFinite(n) ? n : 43;
}

function getSizeRangeLabel(inch: number) {
  if (inch < 40) return "40인치 미만";
  if (inch < 50) return "40~49인치";
  if (inch < 60) return "50~59인치";
  if (inch < 70) return "60~69인치";
  if (inch < 80) return "70~79인치";
  return "80인치 이상";
}

function getDisplayFeatures(resolution: string) {
  if (resolution === "4K UHD") return "4K업스케일링, 필름메이커모드";
  if (resolution === "FHD") return "모션향상, 자동밝기조절";
  return "저시력모드, 자동밝기조절";
}

function getSoundChannel(tvType: string) {
  if (tvType === "OLED") return "4.2Ch";
  if (tvType === "QLED") return "2.1Ch";
  return "2.0Ch";
}

function getSoundOutput(tvType: string, inch: number) {
  const base = tvType === "OLED" ? 40 : tvType === "QLED" ? 30 : 20;
  return inch >= 65 ? base + 10 : base;
}

function getSoundFeatures(brand: string) {
  if (brand === "삼성") return "사운드바 동시출력, Q심포니";
  if (brand === "LG전자") return "사운드바 동시출력, WOW 오케스트라";
  return "사운드바 동시출력, 이퀄라이저 프리셋";
}

function getSmartFeatures(product: TvProduct) {
  if (product.brand === "삼성") return "타이젠, 인터넷, 스마트허브";
  if (product.brand === "LG전자") return "웹OS, 인터넷, 씽큐 앱";
  if (product.title.includes("구글")) return "구글 스마트, 인터넷, 크롬캐스트";
  return "인터넷";
}

function getAdditionalFeatures(resolution: string) {
  return resolution === "4K UHD" ? "유튜브, 넷플릭스" : "인터넷 방송 시청";
}

export type TvProductDetail = {
  minRental: number;
  rentalBucketLabel: string;
  dimensions: string;
  weight: string;
  releaseYear: string;
  color: string;
  colorName: string;
  sizeRangeLabel: string;
  panelType: string;
  displayFeatures: string;
  soundChannel: string;
  soundOutput: string;
  soundFeatures: string;
  dolbyAtmos: string;
  additionalFeatures: string;
  smartFeatures: string;
  connectivity: string;
  featureCount: number;
  /** 계산기용 정가 (5년 약정 기준, 할인 전) */
  listRental: number;
};

export function getTvProductDetail(product: TvProduct): TvProductDetail {
  const inch = parseInch(product.specs.screenSize);
  const typeWeight = TYPE_WEIGHT[product.specs.tvType] ?? 1;
  const minRental = round(8000 + inch * 180 * typeWeight, 500);

  const width = inch * 22.2;
  const height = width * 0.578;
  const depth = TYPE_DEPTH[product.specs.tvType] ?? 60;
  const weightPerInch = TYPE_WEIGHT_PER_INCH[product.specs.tvType] ?? 0.19;

  const additionalFeatures = getAdditionalFeatures(product.specs.resolution);
  const smartFeatures = getSmartFeatures(product);
  const connectivity = "블루투스";
  const featureCount =
    additionalFeatures.split(",").length + smartFeatures.split(",").length + connectivity.split(",").length;

  return {
    minRental,
    rentalBucketLabel: `${Math.floor(minRental / 10000)}만원대`,
    dimensions: `${width.toFixed(1)} x ${height.toFixed(1)} x ${depth}mm`,
    weight: (inch * weightPerInch).toFixed(1),
    releaseYear: "2024년형",
    color: "블랙",
    colorName: "블랙",
    sizeRangeLabel: getSizeRangeLabel(inch),
    panelType: product.specs.tvType,
    displayFeatures: getDisplayFeatures(product.specs.resolution),
    soundChannel: getSoundChannel(product.specs.tvType),
    soundOutput: `${getSoundOutput(product.specs.tvType, inch)}W`,
    soundFeatures: getSoundFeatures(product.brand),
    dolbyAtmos: product.specs.tvType === "LED" ? "없음" : "지원",
    additionalFeatures,
    smartFeatures,
    connectivity,
    featureCount,
    listRental: round(minRental * 3.2, 100),
  };
}

export function calcRental(listRental: number, years: number, cardDiscount: number) {
  const tier = COMMITMENT_OPTIONS.find((option) => option.years === years) ?? COMMITMENT_OPTIONS[0];
  const standardRental = round(listRental * tier.priceFactor, 100);
  const benefit = Math.min(cardDiscount, standardRental);
  const monthlyRental = Math.max(standardRental - benefit, 0);
  return { standardRental, benefit, monthlyRental };
}

export function formatWon(value: number) {
  return `${value.toLocaleString("ko-KR")}원`;
}

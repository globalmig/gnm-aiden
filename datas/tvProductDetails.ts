import type { Product } from "@/types/product";

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

/** 상품 specs(Record<string, unknown>)에서 문자열 값을 안전하게 꺼낸다. 관리자가 비워둔 선택 필드는 저장 시 누락될 수 있다. */
export function specStr(specs: Record<string, unknown> | undefined, key: string): string {
  const value = specs?.[key];
  return typeof value === "string" ? value : "";
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

export function getTvProductDetail(product: Product): TvProductDetail {
  const { specs } = product;
  const inch = parseInch(specStr(specs, "screenSize"));

  const additionalFeatures = specStr(specs, "additionalFeatures");
  const smartFeatures = specStr(specs, "smartFeatures");
  const connectivity = specStr(specs, "connectivity");
  const featureCount = [additionalFeatures, smartFeatures, connectivity]
    .filter((value) => value.trim() !== "")
    .reduce((sum, value) => sum + value.split(",").length, 0);

  const listRental = Number(specStr(specs, "listRental")) || round(product.price * 3.2, 100);

  return {
    minRental: product.price,
    rentalBucketLabel: `${Math.floor(product.price / 10000)}만원대`,
    dimensions: specStr(specs, "dimensions"),
    weight: specStr(specs, "weight"),
    releaseYear: specStr(specs, "releaseYear"),
    color: specStr(specs, "color"),
    colorName: specStr(specs, "colorName"),
    sizeRangeLabel: getSizeRangeLabel(inch),
    panelType: specStr(specs, "panelType"),
    displayFeatures: specStr(specs, "displayFeatures"),
    soundChannel: specStr(specs, "soundChannel"),
    soundOutput: specStr(specs, "soundOutput"),
    soundFeatures: specStr(specs, "soundFeatures"),
    dolbyAtmos: specStr(specs, "dolbyAtmos"),
    additionalFeatures,
    smartFeatures,
    connectivity,
    featureCount,
    listRental,
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

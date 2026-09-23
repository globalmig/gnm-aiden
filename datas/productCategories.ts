// 카테고리별 상품 스펙 스키마를 한 곳에서 정의한다.
// 새 가전 카테고리를 추가할 때는 이 배열에 항목 하나만 추가하면
// 관리자 등록/수정 폼과 /admin/products/[category] 라우트가 그대로 동작한다.

import { BUNDLE_TYPE_OPTIONS, COMPANY_OPTIONS, PRODUCT_TYPE_OPTIONS, SPEED_OPTIONS } from "@/datas/internetPricing";

export type SpecFieldType = "text" | "select";

export interface SpecFieldDef {
    key: string;
    label: string;
    type: SpecFieldType;
    options?: string[];
    placeholder?: string;
}

export interface SpecSectionDef {
    title: string;
    fields: SpecFieldDef[];
}

export interface CategoryDef {
    value: string;
    label: string;
    /** 관리자 카드/목록 등에 쓰는 설명 */
    description: string;
    /** "가격" 입력 필드에 붙일 라벨 (카테고리마다 의미가 달라서 분리) */
    priceLabel: string;
    /**
     * 이 카테고리의 구조화된 스펙 입력 필드.
     * 비어 있으면(스키마 미정의) 관리자 폼은 자동으로 raw JSON 입력으로 폴백한다.
     */
    specSections: SpecSectionDef[];
    /** 상품 이미지를 직접 업로드하는 카테고리인지. false면 등록 폼에서 이미지 업로더를 숨긴다. */
    usesImages: boolean;
}

export const PRODUCT_CATEGORIES: CategoryDef[] = [
    {
        value: "tv",
        label: "TV",
        description: "TV 상세페이지 스펙표에 노출되는 항목을 그대로 입력합니다.",
        priceLabel: "최저 렌탈료 (월, 원)",
        usesImages: true,
        specSections: [
            {
                title: "기본 정보",
                fields: [
                    { key: "screenSize", label: "화면크기", type: "text", placeholder: "예: 50.5인치" },
                    { key: "tvType", label: "TV 종류", type: "select", options: ["LED", "QLED", "OLED"] },
                    { key: "resolution", label: "해상도", type: "select", options: ["FHD", "4K UHD", "8K"] },
                    { key: "power", label: "소비전력", type: "text", placeholder: "예: 150W" },
                    { key: "energyGrade", label: "에너지 효율 등급", type: "text", placeholder: "예: 1등급" },
                    { key: "model", label: "모델명", type: "text" },
                    { key: "dimensions", label: "크기 (WDH)", type: "text", placeholder: "예: 1230.0 x 711.1 x 60mm" },
                    { key: "weight", label: "무게 (Kg)", type: "text" },
                    { key: "releaseYear", label: "출시년도", type: "text", placeholder: "예: 2024년형" },
                    { key: "listRental", label: "기준 렌탈료 (5년 약정 정가, 원)", type: "text" },
                ],
            },
            {
                title: "색상",
                fields: [
                    { key: "color", label: "색상", type: "text" },
                    { key: "colorName", label: "색 명칭", type: "text" },
                ],
            },
            {
                title: "화질 & 크기",
                fields: [
                    { key: "panelType", label: "패널타입", type: "text" },
                    { key: "displayFeatures", label: "화질 부가기능", type: "text", placeholder: "예: 4K업스케일링, 필름메이커모드" },
                ],
            },
            {
                title: "사운드",
                fields: [
                    { key: "soundChannel", label: "채널", type: "text", placeholder: "예: 2.1Ch" },
                    { key: "soundOutput", label: "출력", type: "text", placeholder: "예: 30W" },
                    { key: "soundFeatures", label: "사운드 부가기능", type: "text" },
                    { key: "dolbyAtmos", label: "돌비애트모스 유무", type: "select", options: ["지원", "없음"] },
                ],
            },
            {
                title: "편의기능",
                fields: [
                    { key: "additionalFeatures", label: "부가기능", type: "text" },
                    { key: "smartFeatures", label: "스마트기능", type: "text" },
                    { key: "connectivity", label: "연결기능", type: "text" },
                ],
            },
            {
                title: "분류 (필터용)",
                fields: [
                    { key: "productType", label: "제품유형", type: "select", options: ["스탠드형", "벽걸이형"] },
                ],
            },
        ],
    },
    // 인터넷 요금은 "상품 목록"이 아니라 통신사×속도×결합유형 매트릭스라 이 CMS와 구조가 달라
    // 전용 화면(/admin/internet-pricing)에서 따로 관리한다.
    {
        value: "bundle",
        label: "결합상품",
        description: "홈 화면 '가장 많이 찾는 인기 결합 상품' 카드에 노출되는 항목을 입력합니다. 통신사/상품유형/결합유형/속도는 /internet 페이지의 조건 선택과 동일한 값으로 저장되어, '상품 보기' 클릭 시 해당 조건이 자동 선택된 상태로 연결됩니다. 통신사 로고는 선택한 통신사에 맞춰 자동으로 표시되므로 이미지를 따로 업로드하지 않아도 됩니다.",
        priceLabel: "월 예상 요금 (원)",
        usesImages: false,
        specSections: [
            {
                title: "결합 정보",
                fields: [
                    { key: "company", label: "통신사", type: "select", options: COMPANY_OPTIONS.map((option) => option.label) },
                    { key: "speed", label: "속도", type: "select", options: SPEED_OPTIONS.map((option) => option.label) },
                    { key: "type", label: "상품 유형", type: "select", options: PRODUCT_TYPE_OPTIONS.map((option) => option.label) },
                    { key: "bundleType", label: "결합 유형", type: "select", options: BUNDLE_TYPE_OPTIONS.map((option) => option.label) },
                    { key: "extra", label: "부가 구성 (카드 노출용)", type: "text", placeholder: "예: 238채널 · 베이직" },
                ],
            },
        ],
    },
];

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]["value"];

export function getCategoryDef(value: string): CategoryDef | undefined {
    return PRODUCT_CATEGORIES.find((category) => category.value === value);
}

export function isProductCategory(value: string): value is ProductCategory {
    return PRODUCT_CATEGORIES.some((category) => category.value === value);
}

// 사용 가이드의 서브카테고리를 한 곳에서 정의한다.
// 새 가이드를 추가할 때는 이 배열에 항목을 추가하고, datas/guideContent.ts에
// 해당 value로 콘텐츠를 채우면 된다. 콘텐츠가 없으면 "준비 중입니다."가 표시된다.

export interface GuideCategoryDef {
    value: string;
    label: string;
}

export const GUIDE_CATEGORIES: GuideCategoryDef[] = [
    { value: "products", label: "제품 관리" },
    { value: "bundle", label: "인기 결합상품 관리" },
    { value: "internet-pricing", label: "인터넷 요금 관리" },
    { value: "notices", label: "공지사항 관리" },
    { value: "inquiries", label: "문의 관리" },
];

export function isGuideCategory(value: string): boolean {
    return GUIDE_CATEGORIES.some((category) => category.value === value);
}

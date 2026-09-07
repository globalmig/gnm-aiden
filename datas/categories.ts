export const USER_CATEGORY: { [key: string]: { title: string; categories?: { name: string, url: string }[], banner?: string } } = {
    introduction: {
        title: "회사소개",
    },
    internet: {
        title: "인터넷",
    },
    tv: {
        title: "TV",
        categories: [
            { name: "전체", url: "all" },
            { name: "인기상품", url: "popular" },
        ],
    },
    inquiry: {
        title: "문의",
    },
}

export const TV_PRODUCT_CATEGORIES: { name: string; url: string }[] = [
    { name: "스마트TV", url: "smart" },
    { name: "OLED TV", url: "oled" },
    { name: "QLED TV", url: "qled" },
    { name: "일반형 TV", url: "standard" },
];

export const TV_BRAND_CATEGORIES: { name: string; url: string }[] = [
    { name: "삼성전자", url: "samsung" },
    { name: "LG전자", url: "lg" },
    { name: "기타", url: "etc" },
];

export function getTvProductCategoryLabel(slug: string | null) {
    return TV_PRODUCT_CATEGORIES.find((c) => c.url === slug)?.name;
}

export function getTvBrandLabel(slug: string | null) {
    return TV_BRAND_CATEGORIES.find((c) => c.url === slug)?.name;
}

export function getTvListFilterLabel(slug: string | null) {
    return USER_CATEGORY.tv.categories?.find((c) => c.url === slug)?.name;
}

export const PRODUCT_TYPE_BADGE: { [key: string]: { label: string; className: string } } = {
    popular: { label: "인기", className: "bg-blue-600" },
};

export function getProductTypeBadge(productType: string | null) {
    if (!productType) return null;
    return PRODUCT_TYPE_BADGE[productType] ?? null;
}

export const ADMIN_CATEGORY: { [key: string]: { title: string; categories?: { name: string, url: string }[], banner?: string } } = {
    admin: {
        title: "관리자 페이지",
        categories: [
            { name: "제품 관리", url: "products" },
            { name: "문의 관리", url: "inquiries" },
            { name: "사용 가이드", url: "guides" },
        ],
    },
}

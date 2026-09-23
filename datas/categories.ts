export const USER_CATEGORY: { [key: string]: { title: string; categories?: { name: string, url: string }[], banner?: string } } = {
    internet: {
        title: "인터넷",
        categories: [
            { name: "KT", url: "kt" },
            { name: "SK", url: "sk" },
            { name: "LG U+", url: "lgu" },
            { name: "LG헬로비전", url: "lg-hellovision" },
            { name: "KT스카이라이프", url: "kt-skylife" },
        ],
    },
    tv: {
        title: "TV",
    },
    inquiry: {
        title: "질문&답변",
    },
    notice: {
        title: "공지사항",
    },
}

export const TV_PRODUCT_CATEGORIES: { name: string; url: string }[] = [
    { name: "스탠드형", url: "stand" },
    { name: "벽걸이형", url: "wall" },
];

export const TV_BRAND_CATEGORIES: { name: string; url: string }[] = [
    { name: "LG전자", url: "lg" },
    { name: "삼성", url: "samsung" },
    { name: "아남", url: "anam" },
    { name: "더함", url: "deoham" },
    { name: "루컴즈전자", url: "lucoms" },
    { name: "프리즘코리아", url: "prism" },
    { name: "스마트뷰", url: "smartview" },
    { name: "대우써머스", url: "daewoo-summers" },
    { name: "위니아", url: "winia" },
    { name: "인켈", url: "inkel" },
];

export const TV_SIZE_CATEGORIES: { name: string; url: string }[] = [
    { name: "40인치 미만", url: "under-40" },
    { name: "40~49인치", url: "40-49" },
    { name: "50~59인치", url: "50-59" },
    { name: "60~69인치", url: "60-69" },
    { name: "70~79인치", url: "70-79" },
    { name: "80인치 이상", url: "80-plus" },
];

export function getTvProductCategoryLabel(slug: string | null) {
    return TV_PRODUCT_CATEGORIES.find((c) => c.url === slug)?.name;
}

export function getTvBrandLabel(slug: string | null) {
    return TV_BRAND_CATEGORIES.find((c) => c.url === slug)?.name;
}

export function getTvSizeLabel(slug: string | null) {
    return TV_SIZE_CATEGORIES.find((c) => c.url === slug)?.name;
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
            { name: "인터넷 요금 관리", url: "internet-pricing" },
            { name: "공지사항 관리", url: "notices" },
            { name: "문의 관리", url: "inquiries" },
            { name: "사용 가이드", url: "guides" },
        ],
    },
}

"use client";
import { ADMIN_CATEGORY } from "@/datas/categories";
import { PRODUCT_CATEGORIES } from "@/datas/productCategories";
import { GUIDE_CATEGORIES } from "@/datas/guideCategories";
import Link from "next/link";
import { usePathname } from "next/navigation";

// 제품 관리 아이콘 (태그)
function ProductsIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8.5 1.5H2.5C1.94772 1.5 1.5 1.94772 1.5 2.5V8.5L8.79289 15.7929C9.18342 16.1834 9.81658 16.1834 10.2071 15.7929L15.2929 10.7071C15.6834 10.3166 15.6834 9.68342 15.2929 9.29289L8.5 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <circle cx="5" cy="5" r="1" fill="currentColor" />
        </svg>
    );
}

// 인터넷 요금 관리 아이콘 (원화)
function InternetPricingIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M6 5.5h2.5a1.5 1.5 0 0 1 0 3H6m0 0h3M6 8.5h3M7 5.5v6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 공지사항 관리 아이콘 (종)
function NoticesIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 1.5C6.067 1.5 4.5 3.067 4.5 5V7.5C4.5 8.5 4 9.5 3 10.5H13C12 9.5 11.5 8.5 11.5 7.5V5C11.5 3.067 9.933 1.5 8 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M6.5 13C6.5 13.8284 7.17157 14.5 8 14.5C8.82843 14.5 9.5 13.8284 9.5 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

// 문의 관리 아이콘 (말풍선)
function InquiriesIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M1.5 3.5C1.5 2.67157 2.17157 2 3 2H13C13.8284 2 14.5 2.67157 14.5 3.5V9.5C14.5 10.3284 13.8284 11 13 11H6.5L3 14V11H3C2.17157 11 1.5 10.3284 1.5 9.5V3.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    );
}

// 사용 가이드 아이콘 (책)
function GuidesIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 2.5C2 2.5 3.5 1.5 5.5 1.5C7 1.5 8 2.5 8 2.5C8 2.5 9 1.5 10.5 1.5C12.5 1.5 14 2.5 14 2.5V12.5C14 12.5 12.5 11.5 10.5 11.5C9 11.5 8 12.5 8 12.5C8 12.5 7 11.5 5.5 11.5C3.5 11.5 2 12.5 2 12.5V2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M8 2.5V12.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    );
}

const ADMIN_NAV_ICONS: { [key: string]: () => React.ReactElement } = {
    products: ProductsIcon,
    "internet-pricing": InternetPricingIcon,
    notices: NoticesIcon,
    inquiries: InquiriesIcon,
    guides: GuidesIcon,
};

export default function SideMenu() {
    const pathname = usePathname();
    const navItems = ADMIN_CATEGORY.admin.categories ?? [];

    return (
        <aside className="admin-sidebar w-56 shrink-0 min-h-screen">
            <nav className="py-4">
                <ul>
                    {navItems.map((item) => {
                        const href = `/admin/${item.url}`;
                        const active = pathname === href || pathname.startsWith(`${href}/`);
                        const Icon = ADMIN_NAV_ICONS[item.url];

                        return (
                            <li key={item.url}>
                                <Link
                                    href={href}
                                    className={`admin-nav-link ${active ? "admin-nav-link-active" : ""}`}
                                >
                                    {Icon && <Icon />}
                                    {item.name}
                                </Link>

                                {item.url === "products" && active && (
                                    <ul className="border-l border-white/10 py-1 pl-9">
                                        {PRODUCT_CATEGORIES.map((category) => {
                                            const subHref = `/admin/products/${category.value}`;
                                            const subActive = pathname.startsWith(subHref);
                                            return (
                                                <li key={category.value}>
                                                    <Link
                                                        href={subHref}
                                                        className={`admin-nav-sublink ${subActive ? "admin-nav-sublink-active" : ""}`}
                                                    >
                                                        {category.label}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}

                                {item.url === "guides" && active && (
                                    <ul className="border-l border-white/10 py-1 pl-9">
                                        {GUIDE_CATEGORIES.map((category) => {
                                            const subHref = `/admin/guides/${category.value}`;
                                            const subActive = pathname.startsWith(subHref);
                                            return (
                                                <li key={category.value}>
                                                    <Link
                                                        href={subHref}
                                                        className={`admin-nav-sublink ${subActive ? "admin-nav-sublink-active" : ""}`}
                                                    >
                                                        {category.label}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
}

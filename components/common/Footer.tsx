import { COMPANY_INFO } from "@/datas/company";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-100 bg-white pb-32 pc:pb-16">
      <div className="mx-auto max-w-300 space-y-2 px-5 py-10 pc:px-0">
        <p className="text-sm font-semibold text-title">{COMPANY_INFO.name}</p>
        <div className="flex flex-col gap-1 text-xs text-muted pc:flex-row pc:flex-wrap pc:items-center pc:gap-x-3">
          <span>사업자등록번호 {COMPANY_INFO.bizNumber}</span>
          <span className="hidden pc:inline" aria-hidden="true">|</span>
          <span>{COMPANY_INFO.address}</span>
          <span className="hidden pc:inline" aria-hidden="true">|</span>
          <Link href={COMPANY_INFO.phoneHref} className="hover:text-primary">
            {COMPANY_INFO.phone}
          </Link>
          <span className="hidden pc:inline" aria-hidden="true">|</span>
          <Link href={`mailto:${COMPANY_INFO.email}`} className="hover:text-primary">
            {COMPANY_INFO.email}
          </Link>
        </div>
        <p className="text-xs text-muted">{COMPANY_INFO.bizHours}</p>
        <p className="pt-2 text-xs text-muted">
          © {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved.
        </p>
      </div>

      {/* 전화 상담 - 우측 하단 고정 버튼 */}
      <Link
        href={COMPANY_INFO.phoneHref}
        aria-label="전화 상담"
        className="fixed right-5 bottom-24 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-card transition-opacity hover:opacity-90"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 6.75c0 8.284 6.716 15 15 15h1.5a1.5 1.5 0 0 0 1.5-1.5v-2.25a1.5 1.5 0 0 0-1.213-1.472l-3.335-.667a1.5 1.5 0 0 0-1.51.554l-.664.884a12.06 12.06 0 0 1-5.263-5.263l.884-.664a1.5 1.5 0 0 0 .554-1.51l-.667-3.335A1.5 1.5 0 0 0 6.75 4.5H4.5a1.5 1.5 0 0 0-1.5 1.5Z"
          />
        </svg>
      </Link>
    </footer>
  );
}

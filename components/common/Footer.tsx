"use client";

import { useState } from "react";
import { COMPANY_INFO } from "@/datas/company";
import Link from "next/link";
import AgreementModal from "@/components/ui/AgreementModal";
import type { AgreementContent } from "@/datas/agreements";

const INFO_ROWS: { label: string; value: string; href?: string }[] = [
  { label: "사업자명", value: COMPANY_INFO.companyName },
  { label: "대표자", value: COMPANY_INFO.ceo },
  { label: "대표번호", value: COMPANY_INFO.phone.trim(), href: COMPANY_INFO.phoneHref },
  { label: "팩스", value: COMPANY_INFO.fax },
  { label: "사업자등록번호", value: COMPANY_INFO.bizNumber },
  { label: "이메일", value: COMPANY_INFO.email, href: `mailto:${COMPANY_INFO.email}` },
];

const FOOTER_LINKS: { label: string; agreementId: AgreementContent["id"] }[] = [
  { label: "개인정보처리방침", agreementId: "collection" },
  { label: "서비스 이용약관", agreementId: "thirdParty" },
  { label: "마케팅 정보 수신 동의", agreementId: "marketing" },
];

export default function Footer() {
  const [openModal, setOpenModal] = useState<AgreementContent["id"] | null>(null);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-auto bg-sky-light text-sm pc:text-xs">
      <div className="mx-auto max-w-300 px-5 py-10 pc:px-0 pc:py-16">
        <div className="card space-y-4 p-6 pc:p-10">
          <h2 className="font-bold text-title">{COMPANY_INFO.companyName}</h2>
          <div className="border-t border-gray-100" />

          <ul className="space-y-2 pc:grid pc:grid-cols-2 pc:gap-x-10 pc:gap-y-2">
            {INFO_ROWS.map((row) => (
              <li key={row.label}>
                <span className="font-semibold text-title">{row.label}. </span>
                <span className="text-body">
                  {row.href ? (
                    <Link href={row.href} className="hover:text-primary">
                      {row.value}
                    </Link>
                  ) : (
                    row.value
                  )}
                </span>
              </li>
            ))}

            <li className="pc:col-span-2">
              <span className="font-semibold">주소. </span>
              <span>{COMPANY_INFO.address}</span>
            </li>

            <li className="pc:col-span-2">
              <span className="font-semibold">운영시간. </span>
              <span>{COMPANY_INFO.bizHours}</span>
            </li>
          </ul>

          <p className="pt-2 leading-relaxed">{COMPANY_INFO.disclaimer}</p>
        </div>

        <div className="card mt-4 flex flex-col gap-2 p-5 pc:flex-row pc:items-center pc:justify-between">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {FOOTER_LINKS.map((link, index) => (
              <span key={link.agreementId} className="flex items-center gap-x-2">
                {index > 0 && <span aria-hidden="true">|</span>}
                <button type="button" onClick={() => setOpenModal(link.agreementId)} className="hover:text-primary hover:underline">
                  {link.label}
                </button>
              </span>
            ))}
          </div>
          <p>
            Copyright {COMPANY_INFO.name} {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>

      {/* 탑 버튼 - 우측 하단 고정 버튼 */}
      <button
        type="button"
        onClick={handleScrollTop}
        aria-label="맨 위로 이동"
        className="fixed right-5 bottom-24 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-card transition-opacity hover:opacity-90"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75 12 8.25l7.5 7.5" />
        </svg>
      </button>

      {openModal && <AgreementModal agreementId={openModal} onClose={() => setOpenModal(null)} />}
    </footer>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { TvProduct } from "@/components/tv/TvProductItem";
import {
  AFFILIATE_CARD_OPTIONS,
  COMMITMENT_OPTIONS,
  MANAGEMENT_LABEL,
  formatWon,
} from "@/datas/tvProductDetails";

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
    </svg>
  );
}

function AffiliateCardSelect({
  cardId,
  onCardChange,
}: {
  cardId: string;
  onCardChange: (cardId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedCard = AFFILIATE_CARD_OPTIONS.find((card) => card.id === cardId) ?? AFFILIATE_CARD_OPTIONS[0];

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full rounded-xl border border-black/10 px-4 py-3 text-left"
      >
        <span className="block w-full pr-8 text-sm text-title">{selectedCard.label}</span>
        <ChevronIcon
          className={`pointer-events-none absolute top-4 right-4 h-3.5 w-3.5 text-muted transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
        <p className="mt-1 text-base font-bold text-primary">
          {selectedCard.discount > 0 ? `최대 -${formatWon(selectedCard.discount)} 할인` : "할인 없음"}
        </p>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute top-full right-0 left-0 z-10 mt-2 max-h-64 overflow-auto rounded-xl border border-black/10 bg-white py-1 shadow-lg"
        >
          {AFFILIATE_CARD_OPTIONS.map((card) => (
            <li key={card.id} role="option" aria-selected={card.id === cardId}>
              <button
                type="button"
                onClick={() => {
                  onCardChange(card.id);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-surface ${
                  card.id === cardId ? "font-bold text-primary" : "text-body"
                }`}
              >
                <span>{card.label}</span>
                {card.discount > 0 && (
                  <span className="text-xs text-muted">-{formatWon(card.discount)}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function TvOrderPanel({
  product,
  cardId,
  years,
  onCardChange,
  onYearsChange,
  benefit,
  monthlyRental,
}: {
  product: TvProduct;
  cardId: string;
  years: number;
  onCardChange: (cardId: string) => void;
  onYearsChange: (years: number) => void;
  benefit: number;
  monthlyRental: number;
}) {
  return (
    <aside className="rounded-2xl bg-sky-light p-6 pc:sticky pc:top-24 pc:py-10">
      <p className="text-sm text-muted">
        {product.brand} ({product.model})
      </p>
      <h3 className="mt-1 font-bold text-title">{product.title}</h3>

      <div className="mt-6">
        <p className="text-sm font-bold text-title">제휴카드</p>
        <div className="mt-3 bg-white">
          <AffiliateCardSelect cardId={cardId} onCardChange={onCardChange} />
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm font-bold text-title">약정</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {COMMITMENT_OPTIONS.map((option) => (
            <button
              key={option.years}
              type="button"
              onClick={() => onYearsChange(option.years)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                years === option.years
                  ? "border-primary bg-primary text-white"
                  : "border-black/10 bg-white text-body hover:border-primary/40"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm font-bold text-title">관리방법</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="cursor-default rounded-full border border-black/10 bg-surface px-4 py-2 text-sm font-semibold text-muted">
            {MANAGEMENT_LABEL}
          </span>
        </div>
      </div>

      <div className="mt-7 rounded-xl bg-sky-light p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-body">최대 혜택가</span>
          <span className="text-base font-extrabold text-primary">{formatWon(benefit)}</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-body">예상 월 렌탈료</span>
          <span className="text-sm text-title">{formatWon(monthlyRental)}</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-2">
        <Link href="/inquiry/write" className="btn-ghost w-full">
          빠른 문의
        </Link>
        <Link href="/inquiry/write" className="btn-primary w-full">
          전문 상담원 연결
        </Link>
      </div>
    </aside>
  );
}

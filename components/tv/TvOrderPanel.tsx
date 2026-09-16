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
  const selectedCard = AFFILIATE_CARD_OPTIONS.find((card) => card.id === cardId) ?? AFFILIATE_CARD_OPTIONS[0];

  return (
    <aside className="pc:sticky pc:top-28">
      <p className="text-sm text-muted">
        {product.brand} ({product.model})
      </p>
      <h3 className="mt-1 font-bold text-title">{product.title}</h3>

      <div className="mt-6">
        <p className="text-sm font-bold text-title">제휴카드</p>
        <div className="relative mt-3 rounded-xl border border-black/10 px-4 py-3">
          <select
            value={cardId}
            onChange={(e) => onCardChange(e.target.value)}
            className="w-full appearance-none bg-transparent pr-8 text-sm text-title outline-none"
          >
            {AFFILIATE_CARD_OPTIONS.map((card) => (
              <option key={card.id} value={card.id}>
                {card.label}
              </option>
            ))}
          </select>
          <ChevronIcon className="pointer-events-none absolute top-4 right-4 h-3.5 w-3.5 text-muted" />
          <p className="mt-1 text-base font-bold text-primary">
            {selectedCard.discount > 0 ? `최대 -${formatWon(selectedCard.discount)} 할인` : "할인 없음"}
          </p>
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
          <span className="font-bold text-primary">{formatWon(benefit)}</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-body">예상 월 렌탈료</span>
          <span className="text-xl font-extrabold text-title">{formatWon(monthlyRental)}</span>
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

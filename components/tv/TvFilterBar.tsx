"use client";

import { TV_BRAND_CATEGORIES, TV_PRODUCT_CATEGORIES, TV_SIZE_CATEGORIES } from "@/datas/categories";

export const ALL_VALUE = "all";

function FilterRow({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: { name: string; url: string }[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3 bg-[#F3F7FD]/50 px-6 py-4 pc:flex-row pc:items-center pc:gap-0">
      <span className="w-24 shrink-0 text-base font-bold text-title">{label}</span>
      <div className="flex flex-1 flex-wrap items-center gap-x-4 gap-y-2 pc:gap-x-10">
        <button
          type="button"
          onClick={() => onSelect(ALL_VALUE)}
          className={`text-base transition-colors ${
            selected === ALL_VALUE ? "font-bold text-primary" : "text-body hover:text-primary"
          }`}
        >
          전체
        </button>
        {options.map((option) => (
          <button
            key={option.url}
            type="button"
            onClick={() => onSelect(option.url)}
            className={`text-base transition-colors ${
              selected === option.url ? "font-bold text-primary" : "text-body hover:text-primary"
            }`}
          >
            {option.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export interface TvFilterState {
  brand: string;
  productType: string;
  size: string;
}

export const DEFAULT_TV_FILTER: TvFilterState = {
  brand: ALL_VALUE,
  productType: ALL_VALUE,
  size: ALL_VALUE,
};

export default function TvFilterBar({
  value,
  onChange,
}: {
  value: TvFilterState;
  onChange: (value: TvFilterState) => void;
}) {
  const appliedChips = [
    value.brand !== ALL_VALUE && { key: "brand", label: TV_BRAND_CATEGORIES.find((c) => c.url === value.brand)?.name },
    value.productType !== ALL_VALUE && {
      key: "productType",
      label: TV_PRODUCT_CATEGORIES.find((c) => c.url === value.productType)?.name,
    },
    value.size !== ALL_VALUE && { key: "size", label: TV_SIZE_CATEGORIES.find((c) => c.url === value.size)?.name },
  ].filter((chip): chip is { key: string; label: string } => !!chip);

  const hasFilter = appliedChips.length > 0;

  return (
    <div className="border-y border-table-border bg-white">
      <p className="flex items-center gap-2 bg-table-head px-6 py-4 text-base text-black">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 shrink-0">
          <circle cx="11" cy="11" r="7" />
          <path strokeLinecap="round" d="m20 20-3.5-3.5" />
        </svg>
        필터 검색을 통해 원하시는 상품을 찾아보세요.
      </p>

      <div className="divide-y divide-black/5">
        <FilterRow
          label="브랜드"
          options={TV_BRAND_CATEGORIES}
          selected={value.brand}
          onSelect={(brand) => onChange({ ...value, brand })}
        />
        <FilterRow
          label="제품유형"
          options={TV_PRODUCT_CATEGORIES}
          selected={value.productType}
          onSelect={(productType) => onChange({ ...value, productType })}
        />
        <FilterRow
          label="크기(인치)"
          options={TV_SIZE_CATEGORIES}
          selected={value.size}
          onSelect={(size) => onChange({ ...value, size })}
        />
      </div>

      {hasFilter && (
        <div className="flex flex-wrap items-center gap-3 border-t border-black/5 px-6 py-4">
          {appliedChips.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-4 py-1.5 text-base text-title"
            >
              {chip.label}
              <button
                type="button"
                onClick={() => onChange({ ...value, [chip.key]: ALL_VALUE })}
                aria-label={`${chip.label} 필터 해제`}
                className="text-muted hover:text-title"
              >
                ×
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={() => onChange(DEFAULT_TV_FILTER)}
            className="inline-flex items-center gap-1 text-base text-muted hover:text-primary"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 1 1 2.5 5.6M4.5 12V7m0 5h5" />
            </svg>
            설정 초기화
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import CategoryBanner from "@/components/common/CategoryBanner";
import TvProductItem, { type TvProduct } from "@/components/tv/TvProductItem";
import TvFilterBar, { ALL_VALUE, DEFAULT_TV_FILTER, type TvFilterState } from "@/components/tv/TvFilterBar";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { TV_BRAND_CATEGORIES } from "@/datas/categories";
import { parseInch } from "@/datas/tvProductDetails";
import tvProducts from "@/datas/tvProducts.json";

const PRODUCTS = tvProducts as TvProduct[];
const PAGE_SIZE = 8;

const BRAND_SLUG_BY_NAME = new Map(TV_BRAND_CATEGORIES.map((c) => [c.name, c.url]));

function getSizeSlug(inch: number) {
  if (inch < 40) return "under-40";
  if (inch < 50) return "40-49";
  if (inch < 60) return "50-59";
  if (inch < 70) return "60-69";
  if (inch < 80) return "70-79";
  return "80-plus";
}

function getProductTypeSlug(title: string) {
  if (title.includes("벽걸이형")) return "wall";
  if (title.includes("스탠드형")) return "stand";
  return null;
}

function matchesFilter(product: TvProduct, filter: TvFilterState) {
  if (filter.brand !== ALL_VALUE && BRAND_SLUG_BY_NAME.get(product.brand) !== filter.brand) return false;
  if (filter.productType !== ALL_VALUE && getProductTypeSlug(product.title) !== filter.productType) return false;
  if (filter.size !== ALL_VALUE && getSizeSlug(parseInch(product.specs.screenSize)) !== filter.size) return false;
  return true;
}

export default function TvPage() {
  const [filter, setFilter] = useState<TvFilterState>(DEFAULT_TV_FILTER);
  const filteredProducts = useMemo(
    () => PRODUCTS.filter((product) => matchesFilter(product, filter)),
    [filter]
  );
  const { visibleCount, sentinelRef } = useInfiniteScroll(filteredProducts.length, PAGE_SIZE);
  const visibleProducts = filteredProducts.slice(0, visibleCount);

  return (
    <>
      <CategoryBanner title="TV" />

      <section>
        <div>
          <TvFilterBar value={filter} onChange={setFilter} />

          <div className="mt-8 flex items-center justify-between">
            <p className="text-base text-body">
              <span className="text-black">상품</span> 총 <span className="font-bold text-primary">{filteredProducts.length}</span>건
            </p>
            <div className="relative">
              <select
                defaultValue="new"
                className="appearance-none rounded-full border border-black/10 bg-white py-2 pr-9 pl-3 text-base text-title outline-none"
              >
                <option value="new">신상품순</option>
                <option value="price-asc">낮은 가격순</option>
                <option value="price-desc">높은 가격순</option>
              </select>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="pointer-events-none absolute top-1/2 right-3 h-3.5 w-3.5 -translate-y-1/2 text-muted"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>

          {visibleProducts.length > 0 ? (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 pc:grid-cols-4 pc:gap-5">
              {visibleProducts.map((product) => (
                <TvProductItem key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="py-16 text-center text-base text-muted">조건에 맞는 상품이 없습니다.</p>
          )}

          <div ref={sentinelRef} className="h-1" aria-hidden="true" />
        </div>
      </section>
    </>
  );
}

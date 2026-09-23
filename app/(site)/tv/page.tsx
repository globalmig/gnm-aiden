"use client";

import { useEffect, useMemo, useState } from "react";
import CategoryBanner from "@/components/common/CategoryBanner";
import TvProductItem from "@/components/tv/TvProductItem";
import PopularTvProductItem from "@/components/tv/PopularTvProductItem";
import TvFilterBar, { ALL_VALUE, DEFAULT_TV_FILTER, type TvFilterState } from "@/components/tv/TvFilterBar";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { TV_BRAND_CATEGORIES, TV_PRODUCT_CATEGORIES } from "@/datas/categories";
import { parseInch, specStr } from "@/datas/tvProductDetails";
import type { Product } from "@/types/product";

const PAGE_SIZE = 8;

type SortOption = "new" | "popular";

const BRAND_SLUG_BY_NAME = new Map(TV_BRAND_CATEGORIES.map((c) => [c.name, c.url]));
const PRODUCT_TYPE_SLUG_BY_NAME = new Map(TV_PRODUCT_CATEGORIES.map((c) => [c.name, c.url]));

function getSizeSlug(inch: number) {
  if (inch < 40) return "under-40";
  if (inch < 50) return "40-49";
  if (inch < 60) return "50-59";
  if (inch < 70) return "60-69";
  if (inch < 80) return "70-79";
  return "80-plus";
}

function matchesFilter(product: Product, filter: TvFilterState) {
  if (filter.brand !== ALL_VALUE && BRAND_SLUG_BY_NAME.get(product.brand ?? "") !== filter.brand) return false;
  if (
    filter.productType !== ALL_VALUE &&
    PRODUCT_TYPE_SLUG_BY_NAME.get(specStr(product.specs, "productType")) !== filter.productType
  )
    return false;
  if (filter.size !== ALL_VALUE && getSizeSlug(parseInch(specStr(product.specs, "screenSize"))) !== filter.size)
    return false;
  return true;
}

export default function TvPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<TvFilterState>(DEFAULT_TV_FILTER);
  const [sort, setSort] = useState<SortOption>("new");

  useEffect(() => {
    fetch("/api/products?category=tv")
      .then((res) => res.json())
      .then((result) => setProducts(result.data ?? []))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    const base = products.filter((product) => matchesFilter(product, filter));

    if (sort === "popular") {
      return base
        .filter((product) => product.is_popular)
        .sort((a, b) => (a.popular_order ?? Infinity) - (b.popular_order ?? Infinity));
    }

    return [...base].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [products, filter, sort]);

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
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="appearance-none rounded-full border border-black/10 bg-white py-2 pr-9 pl-3 text-base text-title outline-none"
              >
                <option value="new">신상품순</option>
                <option value="popular">인기순</option>
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

          {isLoading ? (
            <p className="py-16 text-center text-base text-muted">불러오는 중...</p>
          ) : visibleProducts.length > 0 ? (
            <>
              <div className="mt-6 flex flex-col gap-4 pc:hidden">
                {visibleProducts.map((product) => (
                  <PopularTvProductItem key={product.id} product={product} />
                ))}
              </div>
              <div className="mt-6 hidden pc:grid pc:grid-cols-4 pc:gap-5">
                {visibleProducts.map((product) => (
                  <TvProductItem key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <p className="py-16 text-center text-base text-muted">조건에 맞는 상품이 없습니다.</p>
          )}

          <div ref={sentinelRef} className="h-1" aria-hidden="true" />
        </div>
      </section>
    </>
  );
}

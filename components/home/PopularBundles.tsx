"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BUNDLE_TYPE_OPTIONS, COMPANY_OPTIONS, PRODUCT_TYPE_OPTIONS, SPEED_OPTIONS, type Company } from "@/datas/internetPricing";
import type { Product } from "@/types/product";

// /internet 페이지(PriceCalculatorSection.tsx)의 통신사 로고와 동일한 이미지를 재사용한다.
// 결합상품은 상품마다 이미지를 업로드하지 않고, specs.company 값으로 정해진 로고를 그린다.
const COMPANY_LOGOS: Record<Company, { src: string; width: number; height: number }> = {
  kt: { src: "/images/logo_kt.png", width: 57, height: 47 },
  sk: { src: "/images/logo_sk.png", width: 70, height: 55 },
  lgu: { src: "/images/logo-uplus.png", width: 94, height: 43 },
  "kt-skylife": { src: "/images/logo_skylife.png", width: 88, height: 64 },
  "lg-hellovision": { src: "/images/logo-lg-hellowVision.png", width: 97, height: 49 },
};

function specStr(specs: Record<string, unknown> | undefined, key: string): string {
  const value = specs?.[key];
  return typeof value === "string" ? value : "";
}

function formatPrice(price: number): string {
  return `${price.toLocaleString()}원`;
}

/** 카드의 스펙 선택값(라벨)을 /internet 페이지가 읽는 쿼리 파라미터 값으로 되돌린다. */
function buildInternetHref(product: Product): string {
  const params = new URLSearchParams();

  const companyValue = COMPANY_OPTIONS.find((option) => option.label === specStr(product.specs, "company"))?.value;
  const speedValue = SPEED_OPTIONS.find((option) => option.label === specStr(product.specs, "speed"))?.value;
  const typeValue = PRODUCT_TYPE_OPTIONS.find((option) => option.label === specStr(product.specs, "type"))?.value;
  const bundleTypeValue = BUNDLE_TYPE_OPTIONS.find((option) => option.label === specStr(product.specs, "bundleType"))?.value;

  if (companyValue) params.set("company", companyValue);
  if (speedValue) params.set("speed", speedValue);
  if (typeValue) params.set("type", typeValue);
  if (bundleTypeValue) params.set("bundle", bundleTypeValue);

  const query = params.toString();
  return query ? `/internet?${query}` : "/internet";
}

function BundleCard({ product }: { product: Product }) {
  const speed = specStr(product.specs, "speed");
  const type = specStr(product.specs, "type");
  const extra = specStr(product.specs, "extra");
  const companyValue = COMPANY_OPTIONS.find((option) => option.label === specStr(product.specs, "company"))?.value;
  const logo = companyValue ? COMPANY_LOGOS[companyValue] : undefined;
  const includesTv = type.includes("TV");

  return (
    <article className="card flex h-full flex-col">
      <div className="p-6 pt-8 pc:p-8">
        <div className="flex items-center justify-center gap-4 pc:gap-6">
          {logo ? (
            <Image
              src={logo.src}
              alt={product.brand ? `${product.brand} 로고` : "통신사 로고"}
              width={logo.width}
              height={logo.height}
              className="h-7 w-auto object-contain pc:h-8.5"
            />
          ) : (
            product.brand && <span className="text-base font-bold text-title">{product.brand}</span>
          )}
          <div className="flex items-center gap-2">
            <div className="flex h-12 w-12 pc:h-16 pc:w-16 items-center justify-center rounded-full bg-sky-light">
              <Image src="/icons/icon_wifi.png" alt="인터넷 아이콘" width={25} height={20} className="h-4 w-auto object-contain pc:h-5" />
            </div>
            {includesTv && (
              <>
                <div className="text-base text-muted pc:text-[1.5rem]">+</div>
                <div className="flex h-12 w-12 pc:h-16 pc:w-16 items-center justify-center rounded-full bg-sky-light">
                  <Image src="/icons/icon_tv.png" alt="TV 아이콘" width={22} height={25} className="h-4 w-auto object-contain pc:h-5" />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-nowrap items-center justify-center gap-1.5 pc:mt-8 pc:gap-2.5">
          {speed && <div className="shrink-0 rounded-full bg-primary px-2 py-1 text-xs font-semibold text-white pc:px-3">{speed}</div>}
          {type && (
            <div className="shrink-0 rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-title pc:px-3">
              {type}
            </div>
          )}
          {extra && <div className="min-w-0 truncate text-xs text-body font-semibold">{extra}</div>}
        </div>

        <p className="mt-5 text-xs text-muted">월 예상 요금</p>
        <p className="mt-1 text-2xl font-bold text-title">{formatPrice(product.price)}</p>

        {product.discount_info && (
          <p className="mt-5 rounded-lg bg-sky-light px-4 py-2 text-center text-xs leading-relaxed text-body pc:mt-8">
            {product.discount_info}
          </p>
        )}
      </div>
      <Link
        href={buildInternetHref(product)}
        className="mt-auto flex items-center border-t border-t-[#eee] justify-center gap-1 p-5 rounded-b-lg text-base font-semibold text-primary"
        style={{ background: "radial-gradient(circle at 50% 0%, #E9F2FF 0%, #FFFFFF 100%)" }}
      >
        상품 보기
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="h-4 w-4 shrink-0 text-primary"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </Link>
    </article>
  );
}

function PopularBundlesBackground() {
  return (
    <>
      <Image
        src="/images/main-product-bg-item1.png"
        alt="인기 결합상품 배경 아이콘"
        width={141}
        height={139}
        className="absolute bottom-0 right-20 w-90 hidden pc:block"
      />
      <Image
        src="/images/main-product-bg-item2.png"
        alt="인기 결합상품 배경 아이콘"
        width={139}
        height={163}
        className="absolute bottom-70 left-0 w-75 hidden pc:block"
      />
      <Image
        src="/images/main-product-bg-item3.png"
        alt="인기 결합상품 배경 아이콘"
        width={502}
        height={316}
        className="absolute top-20 right-5 w-25 hidden pc:block"
      />
      <Image
        src="/images/main-product-bg-item4.png"
        alt="인기 결합상품 배경 아이콘"
        width={402}
        height={498}
        className="absolute top-20 left-50 w-20 hidden pc:block"
      />
      <Image
        src="/images/main-product-bg-item5.png"
        alt="인기 결합상품 배경 아이콘"
        width={143}
        height={139}
        className="absolute bottom-30 left-80 w-20 hidden pc:block"
      />
      <Image
        src="/images/main-product-bg-item6.png"
        alt="인기 결합상품 배경 아이콘"
        width={87}
        height={86}
        className="absolute right-32 bottom-100 w-30 hidden pc:block"
      />
    </>
  );
}

export default function PopularBundles() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products?category=bundle")
      .then((res) => res.json())
      .then((result) => setProducts(result.data ?? []));
  }, []);

  const bundles = products
    .filter((product) => product.is_popular)
    .sort((a, b) => (a.popular_order ?? Infinity) - (b.popular_order ?? Infinity));

  if (bundles.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-sky-light/0 to-sky-light">
      <PopularBundlesBackground />
      <div className="relative">
        <h2 className="text-center font-bold text-title">가장 많이 찾는 인기 결합 상품</h2>
        <p className="mt-3 text-center text-body">라이프스타일에 맞춰 통신사와 속도를 선택해보세요.</p>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 pc:grid-cols-3 pc:gap-6">
          {bundles.map((product) => (
            <BundleCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link href="/internet" className="btn-ghost inline-block w-full px-16 py-3.5 sm:w-auto pc:px-30">
            상품 더보기
          </Link>
        </div>
      </div>
    </section>
  );
}

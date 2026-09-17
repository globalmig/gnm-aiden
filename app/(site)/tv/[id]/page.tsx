"use client";

import { use, useRef, useState } from "react";
import Link from "next/link";
import Skeleton from "@/components/ui/Skeleton";
import { type TvProduct } from "@/components/tv/TvProductItem";
import PopularTvProductItem from "@/components/tv/PopularTvProductItem";
import TvSpecInfoBar from "@/components/tv/TvSpecInfoBar";
import TvSpecTable, { type TvSpecRow } from "@/components/tv/TvSpecTable";
import TvOrderPanel from "@/components/tv/TvOrderPanel";
import TvMobileFixedBar from "@/components/tv/TvMobileFixedBar";
import tvProducts from "@/datas/tvProducts.json";
import {
  AFFILIATE_CARD_OPTIONS,
  COMMITMENT_OPTIONS,
  calcRental,
  formatWon,
  getTvProductDetail,
} from "@/datas/tvProductDetails";

const PRODUCTS = tvProducts as TvProduct[];

export default function TvDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = PRODUCTS.find((item) => item.id === id);

  const [cardId, setCardId] = useState(AFFILIATE_CARD_OPTIONS[0].id);
  const [years, setYears] = useState(COMMITMENT_OPTIONS[0].years);

  const popularScrollRef = useRef<HTMLDivElement>(null);
  const popularDragState = useRef({ isDragging: false, startX: 0, startScrollLeft: 0 });
  const [isPopularDragging, setIsPopularDragging] = useState(false);

  const handlePopularDragStart = (event: React.MouseEvent<HTMLDivElement>) => {
    const track = popularScrollRef.current;
    if (!track) return;

    popularDragState.current = {
      isDragging: true,
      startX: event.pageX,
      startScrollLeft: track.scrollLeft,
    };
    setIsPopularDragging(true);
  };

  const handlePopularDragMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const track = popularScrollRef.current;
    if (!track || !popularDragState.current.isDragging) return;

    event.preventDefault();
    const walked = event.pageX - popularDragState.current.startX;
    track.scrollLeft = popularDragState.current.startScrollLeft - walked;
  };

  const handlePopularDragEnd = () => {
    popularDragState.current.isDragging = false;
    setIsPopularDragging(false);
  };

  if (!product) {
    return (
      <section>
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <p className="text-body">존재하지 않는 상품입니다.</p>
          <Link href="/tv" className="btn-primary">
            TV 상품 목록으로
          </Link>
        </div>
      </section>
    );
  }

  const detail = getTvProductDetail(product);
  const selectedCard = AFFILIATE_CARD_OPTIONS.find((card) => card.id === cardId) ?? AFFILIATE_CARD_OPTIONS[0];
  const { benefit, monthlyRental } = calcRental(detail.listRental, years, selectedCard.discount);

  const relatedProducts = PRODUCTS.filter((item) => item.id !== product.id).slice(0, 8);

  const basicInfoRows: TvSpecRow[] = [
    { label: "브랜드", value: product.brand },
    { label: "제품명", value: product.title },
    { label: "모델명", value: product.model },
    { label: "최저렌탈료", value: formatWon(detail.minRental), bold: true },
    { label: "크기(WDH)", value: detail.dimensions },
    { label: "무게(Kg)", value: detail.weight },
    { label: "에너지 소비효율", value: product.specs.energyGrade },
    { label: "소비전력", value: product.specs.power },
    { label: "출시년도", value: detail.releaseYear },
  ];

  const colorRows: TvSpecRow[] = [
    { label: "색상", value: detail.color },
    { label: "색 명칭", value: detail.colorName },
  ];

  const displayRows: TvSpecRow[] = [
    { label: "크기(인치)", value: detail.sizeRangeLabel },
    { label: "패널타입", value: detail.panelType },
    { label: "해상도", value: product.specs.resolution },
    { label: "화질 부가기능", value: detail.displayFeatures },
  ];

  const soundRows: TvSpecRow[] = [
    { label: "채널", value: detail.soundChannel },
    { label: "출력", value: detail.soundOutput },
    { label: "사운드 부가기능", value: detail.soundFeatures },
    { label: "돌비에트모스 유무", value: detail.dolbyAtmos },
  ];

  const convenienceRows: TvSpecRow[] = [
    { label: "부가기능", value: detail.additionalFeatures },
    { label: "스마트기능", value: detail.smartFeatures },
    { label: "연결기능", value: detail.connectivity },
  ];

  return (
    <>
      <section className="bg-white">
        <div>
          <Link href="/tv" className="text-sm text-muted hover:text-primary">
            {"< 다른 TV상품 둘러보기"}
          </Link>

          <div className="mt-6 flex flex-col gap-10 pc:flex-row pc:gap-x-12.5">
            <div className="space-y-10 pc:flex-1 pc:space-y-14">
              <Skeleton className="mx-auto! my-0! aspect-video w-full max-w-140 rounded-2xl p-0!" />

              <TvSpecInfoBar product={product} detail={detail} />
              <TvSpecTable title="상품 기본 정보" rows={basicInfoRows} />
              <TvSpecTable title="상품 색상" rows={colorRows} />
              <TvSpecTable title="화질 & 크기" rows={displayRows} />
              <TvSpecTable title="사운드" rows={soundRows} />
              <TvSpecTable title="편의기능" rows={convenienceRows} />
            </div>

            <div className="pc:w-100 pc:shrink-0">
              <TvOrderPanel
                product={product}
                cardId={cardId}
                years={years}
                onCardChange={setCardId}
                onYearsChange={setYears}
                benefit={benefit}
                monthlyRental={monthlyRental}
              />
            </div>
          </div>

          <div className="mt-20 pc:mt-25">
            <p className="font-bold text-title">인기 상품 추천</p>
            <div className="relative mt-6">
              <div
                ref={popularScrollRef}
                onMouseDown={handlePopularDragStart}
                onMouseMove={handlePopularDragMove}
                onMouseUp={handlePopularDragEnd}
                onMouseLeave={handlePopularDragEnd}
                className={`no-scrollbar flex gap-4 overflow-x-auto pc:gap-6 ${
                  isPopularDragging ? "cursor-grabbing select-none" : "cursor-grab"
                }`}
              >
                {relatedProducts.map((item) => (
                  <div key={item.id} className="w-70 shrink-0 sm:w-85 pc:w-109.25">
                    <PopularTvProductItem product={item} />
                  </div>
                ))}
              </div>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-white to-transparent pc:w-32" />
            </div>
            <div className="mt-8 text-center">
              <Link href="/tv" className="btn-ghost">
                인기 상품 더보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      <TvMobileFixedBar benefit={benefit} monthlyRental={monthlyRental} />
    </>
  );
}

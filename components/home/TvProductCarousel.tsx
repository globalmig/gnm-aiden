"use client";

import "slick-carousel/slick/slick.css";
import Image from "next/image";
import { useRef } from "react";
import Slider from "react-slick";
import TvProductItem, { type TvProduct } from "@/components/tv/TvProductItem";
import tvProducts from "@/datas/tvProducts.json";

const PRODUCTS = tvProducts as TvProduct[];

export default function TvProductCarousel() {
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: false,
    arrows: false,
    infinite: PRODUCTS.length > 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    swipeToSlide: true,
    autoplay: true,
    autoplaySpeed: 1500,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section>
      <div className="pc:pb-12">
        <h2 className="text-center font-bold text-title">추천 TV 상품</h2>

        <div className="slick-equal-height relative mt-10">
          <button
            type="button"
            onClick={() => sliderRef.current?.slickPrev()}
            aria-label="이전 상품"
            className="absolute top-1/2 left-0 z-20 hidden h-20 w-20 translate-x-[-130%] -translate-y-1/2 items-center justify-center pc:flex"
          >
            <Image src="/icons/icon_arrow.png" alt="이전 상품 보기" width={93} height={92} className="w-22" />
          </button>

          <Slider ref={sliderRef} {...settings}>
            {PRODUCTS.map((product) => (
              <div key={product.id} className="px-2.5 pb-1">
                <TvProductItem product={product} />
              </div>
            ))}
          </Slider>

          <button
            type="button"
            onClick={() => sliderRef.current?.slickNext()}
            aria-label="다음 상품"
            className="absolute top-1/2 right-0 z-20 hidden h-20 w-20 -translate-y-1/2 translate-x-[130%] items-center justify-center pc:flex"
          >
            <Image src="/icons/icon_arrow.png" alt="다음 상품 보기" width={93} height={92} className="w-22 rotate-180" />
          </button>
        </div>

        <div className="mt-20 text-center">
          <button type="button" className="btn-ghost w-full px-16 py-3.5 sm:w-auto pc:px-30">
            상품 더보기
          </button>
        </div>
      </div>
    </section>

  );
}

"use client";

import "slick-carousel/slick/slick.css";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import TvProductItem from "@/components/tv/TvProductItem";
import type { Product } from "@/types/product";

function getSlidesToShow(width: number) {
  if (width <= 640) return 1;
  if (width <= 1024) return 2;
  return 4;
}

export default function TvProductCarousel() {
  const sliderRef = useRef<Slider>(null);
  const [slidesToShow, setSlidesToShow] = useState(4);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products?category=tv")
      .then((res) => res.json())
      .then((result) => setProducts(result.data ?? []));
  }, []);

  useEffect(() => {
    const updateSlidesToShow = () => setSlidesToShow(getSlidesToShow(window.innerWidth));
    updateSlidesToShow();
    window.addEventListener("resize", updateSlidesToShow);
    return () => window.removeEventListener("resize", updateSlidesToShow);
  }, []);

  if (products.length === 0) return null;

  const settings = {
    dots: false,
    arrows: false,
    infinite: products.length > 4,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    swipeToSlide: true,
    autoplay: true,
    autoplaySpeed: 1500,
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
            {products.map((product) => (
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

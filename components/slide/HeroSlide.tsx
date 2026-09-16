"use client";

import "slick-carousel/slick/slick.css";

import Image from "next/image";
import { useRef } from "react";
import Slider from "react-slick";

type HeroSlideItem = {
  id: string;
  mainCopy: string;
  subCopy: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  gradientFrom: string;
  gradientTo: string;
};

const HERO_SLIDES: HeroSlideItem[] = [
  {
    id: "transparent-fee",
    mainCopy: "속임수 없는 100% 투명한 요금,\n받을 수 있는 최대 사은품을 직접 확인하세요",
    subCopy: "매달 나가는 진짜 실 납부금과 당일 지급 사은품을 거짓 없이 솔직하게 공개합니다.",
    image: "/images/hero-item1.png",
    imageWidth: 341,
    imageHeight: 453,
    gradientFrom: "#7BC7FF",
    gradientTo: "#ACDCFF",
  },
  {
    id: "easy-internet",
    mainCopy: "복잡한 인터넷 가입, 머리 아프셨죠?\n고민은 저희가 할게요. 혜택만 챙겨가세요!",
    subCopy: "통신 3사 요금 비교부터 숨은 결합 할인, 최대 현금 사은품까지 알아서 싹 정리해 드립니다.",
    image: "/images/hero-item2.png",
    imageWidth: 470,
    imageHeight: 515,
    gradientFrom: "#7447FF",
    gradientTo: "#9775FF",
  },
  {
    id: "free-consulting",
    mainCopy: "단순 비교 문의도 언제나 환영!\n가입 강요 없이 가장 알뜰한 조건만 찾아드려요",
    subCopy: "혼자 고민하지 마세요. 1:1 맞춤 컨설팅으로 나에게 제일 이득인 통신사를 무료로 확인해 드립니다.",
    image: "/images/hero-item1.png",
    imageWidth: 341,
    imageHeight: 453,
    gradientFrom: "#788EFD",
    gradientTo: "#ACB9FF",
  },
];

export default function HeroSlide() {
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "18%",
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { centerPadding: "10%" },
      },
      {
        breakpoint: 640,
        settings: { centerPadding: "6%" },
      },
    ],
  };

  return (
    <div className="relative w-full max-w-none overflow-hidden">
      <button
        type="button"
        onClick={() => sliderRef.current?.slickPrev()}
        aria-label="이전 슬라이드"
        className="absolute top-1/2 left-1 z-20 flex -translate-y-1/2 items-center justify-center pc:left-70"
      >
        <Image src="/icons/icon_arrow.png" alt="이전 슬라이드 이동" width={93} height={92} className="w-10 pc:w-15 pc:h-auto"/>
      </button>

      <div className="absolute top-0 right-0 w-full h-120 -z-10 bg-sky-light"/>

      <Slider ref={sliderRef} {...settings}>
        {HERO_SLIDES.map((slide) => (
          <div key={slide.id} className="px-2 pc:px-4 mt-15 pc:mt-25">
            <div
              className="relative min-h-80 gap-6 overflow-hidden rounded-[40px] px-8 py-10 pc:max-w-200 pc:mx-auto pc:min-h-125 pc:items-center pc:justify-between pc:py-20"
              style={{ background: `linear-gradient(135deg, ${slide.gradientFrom}, ${slide.gradientTo})` }}
            >
              <div className="relative z-10">
                <p className="whitespace-pre-line text-xl leading-snug font-bold text-white pc:text-3xl">
                  {slide.mainCopy}
                </p>
                <p className="mt-4 text-base text-white/90 pc:text-base">{slide.subCopy}</p>
              </div>

              <div className="relative z-10 flex shrink-0 justify-end">
                <Image
                  src={slide.image}
                  alt=""
                  width={slide.imageWidth}
                  height={slide.imageHeight}
                  className="h-36 w-auto object-contain pc:h-64"
                />
              </div>
            </div>
          </div>
        ))}
      </Slider>

      <button
        type="button"
        onClick={() => sliderRef.current?.slickNext()}
        aria-label="다음 슬라이드"
        className="absolute top-1/2 right-1 z-20 flex w-20 h-auto -translate-y-1/2 items-center justify-center pc:right-70"
      >
        <Image
          src="/icons/icon_arrow.png"
          alt="다음 슬라이드로 이동"
          width={93}
          height={92}
          className="rotate-180 w-10 pc:w-15 pc:h-auto"
        />
      </button>
    </div>
  );
}

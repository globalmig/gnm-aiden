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
    id: "max-support-benefits",
    mainCopy: "지금 받을 수 있는 최대 지원금,\n놓치지 말고 한눈에 확인하세요",
    subCopy: "결합할수록 커지는 추가 할인과 렌탈 지원금을 한눈에 비교해 드립니다.",
    image: "/images/hero-item1.png",
    imageWidth: 341,
    imageHeight: 453,
    gradientFrom: "#788EFD",
    gradientTo: "#ACB9FF",
  },
  {
    id: "transparent-fee",
    mainCopy: "속임수 없는 100% 투명한 요금,\n받을 수 있는 최대 사은품을 직접 확인하세요",
    subCopy: "매달 나가는 진짜 실 납부금과\n당일 지급 사은품을 거짓 없이 솔직하게 공개합니다.",
    image: "/images/hero-item1.png",
    imageWidth: 341,
    imageHeight: 453,
    gradientFrom: "#7BC7FF",
    gradientTo: "#ACDCFF",
  },
  {
    id: "easy-internet",
    mainCopy: "복잡한 인터넷 가입, 머리 아프셨죠?\n고민은 저희가 할게요. 혜택만 챙겨가세요!",
    subCopy: "통신 3사 요금 비교부터 숨은 결합 할인,\n최대 현금 사은품까지 알아서 싹 정리해 드립니다.",
    image: "/images/hero-item2.png",
    imageWidth: 470,
    imageHeight: 515,
    gradientFrom: "#7447FF",
    gradientTo: "#9775FF",
  },
  {
    id: "total-rental-discount",
    mainCopy: "인터넷 · TV · 가전렌탈 최대 할인!\n동시 가입하고 역대급 혜택 챙겨가세요",
    subCopy: "따로 가입하면 손해! 결합할수록 커지는 추가 할인과\n렌탈 지원금 혜택을 한번에 비교해 드립니다.",
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
        // pc(1024px) 미만(모바일)에서는 중앙 정렬 모드 해제 - 슬라이드가 화면을 꽉 채움
        breakpoint: 1024,
        settings: { centerMode: false },
      },
    ],
  };

  return (
    <div className="relative w-full max-w-none overflow-hidden px-[5%] pc:px-0">
      <div className="pointer-events-none absolute inset-x-0 top-[60%] z-20 mx-auto pc:flex w-full max-w-250 -translate-y-1/2 items-center justify-between px-1 hidden">
        <button
          type="button"
          onClick={() => sliderRef.current?.slickPrev()}
          aria-label="이전 슬라이드"
          className="pointer-events-auto flex items-center justify-center"
        >
          <Image src="/icons/icon_arrow.png" alt="이전 슬라이드 이동" width={93} height={92} className="w-10 pc:w-15 pc:h-auto"/>
        </button>

        <button
          type="button"
          onClick={() => sliderRef.current?.slickNext()}
          aria-label="다음 슬라이드"
          className="pointer-events-auto flex items-center justify-center"
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

      <div className="hidden pc:block absolute top-0 right-0 w-full h-140 -z-10 bg-sky-light"/>

      <Slider ref={sliderRef} {...settings}>
        {HERO_SLIDES.map((slide) => (
          <div key={slide.id} className="px-2 pc:px-4 mt-25 pc:mt-40">
            <div
              className="relative h-70 gap-6 overflow-hidden rounded-3xl pc:rounded-[40px] px-4 py-6 pc:h-auto pc:max-w-200 pc:mx-auto pc:min-h-125 pc:items-center pc:justify-between pc:px-8 pc:py-15"
              style={{ background: `linear-gradient(135deg, ${slide.gradientFrom}, ${slide.gradientTo})` }}
            >
              <div className="relative z-10 mb-10 pc:mb-0">
                <h1 className="whitespace-pre-line font-esamanru-light text-xl leading-snug font-bold text-white pc:text-4xl">
                  {slide.mainCopy}
                </h1>
                <p className="mt-2 hidden pc:block text-white/90 pc:mt-4 pc:text-xl">{slide.subCopy}</p>
              </div>

              <div className="absolute right-2 bottom-2 pc:right-10 pc:bottom-5">
                <Image
                  src={slide.image}
                  alt="배너 아이콘"
                  width={slide.imageWidth}
                  height={slide.imageHeight}
                  className="h-36 w-auto object-contain pc:h-64"
                />
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

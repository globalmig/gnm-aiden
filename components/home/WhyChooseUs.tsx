"use client";

import "slick-carousel/slick/slick.css";

import Slider from "react-slick";

type Reason = {
  id: string;
  title: string;
  highlight: string;
  desc: string;
};

const REASONS: Reason[] = [
  {
    id: "consulting",
    title: "1:1 전담 베테랑 상담",
    highlight: "답답함 없는 친절하고 빠른 피드백",
    desc: "통신 전문 컨설턴트가 가입 상담부터 개통, 사은품 수령까지 1:1로 책임지고 가이드해 드립니다.",
  },
  {
    id: "compare",
    title: "3사 요금 원스톱 비교",
    highlight: "SKT · KT · LGU+ 한눈에 비교",
    desc: "여기저기 사이트를 다 돌아다닐 필요 없이, 클릭 한 번으로 통신 3사의 혜택과 요금을 객관적으로 비교해 드립니다.",
  },
  {
    id: "install",
    title: "빠른 설치 & 일정 케어",
    highlight: "원하는 날짜에 맞춘 신속 개통",
    desc: "희망하는 일정에 맞춰 가장 빠른 엔지니어 출동 예약을 대신 진행해 드립니다.",
  },
  {
    id: "gift",
    title: "법정 최대 사은품 보장",
    highlight: "단 1원도 손해보지 않는 당일지급",
    desc: "경품고시제 기준 법정 최고 한도 사은품을 100% 보장하며, 개통 확인 후 빠르게 지급해 드립니다.",
  },
  {
    id: "price",
    title: "100% 실 납부금 정찰제",
    highlight: "눈속임 없는 진짜 월 요금 공개",
    desc: "눈속임용 할인가가 아닌, 부가세와 장비 임대료까지 모두 포함된 진짜 매달 내는 정확한 금액만 안내합니다.",
  },
  {
    id: "no-force",
    title: "가입강요 ZERO",
    highlight: "쓸데없는 고가 요금제 유도 금지",
    desc: "불필요하게 비싼 요금제나 추가 부가서비스 가입 강요 없이, 고객님의 실제 사용 패턴에 딱 맞는 상품만 추천합니다.",
  },
  {
    id: "mvno",
    title: "알뜰폰 결합 맞춤 안내",
    highlight: "알뜰폰 사용자도 놓치지 않는 결합 할인",
    desc: "알뜰폰을 쓰더라도 적용 가능한 통신사별 결합 할인을 꼼꼼히 찾아 매월 고정 통신비를 대폭 낮춰드립니다.",
  },
];

export default function WhyChooseUs() {
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    swipeToSlide: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 640, settings: { slidesToShow: 2 } },
    ],
  };

  return (
    <div className="w-full px-[5%] py-17.5 pc:px-0 pc:py-37.5 bg-sky-light">
      <h2 className="text-center font-bold text-title">왜 수많은 고객이 선택했을까요?</h2>
      <p className="mt-3 text-center text-body">비교는 저희가, 혜택은 고객님이! 차원이 다른 7가지 특별함을 확인하세요.</p>

      <div className="mt-10">
        <Slider {...settings}>
          {REASONS.map((reason) => (
            <div key={reason.id} className="px-3 py-4">
              <div
                className="group relative flex h-64 flex-col overflow-hidden rounded-xl bg-[radial-gradient(circle_180px_at_50%_50%,#e9f2ff_0%,#ffffff_100%)] p-6 shadow-[0_2px_10px_rgba(222,225,234,0.8)] transition-[background,transform] duration-300 hover:z-10 hover:rotate-[-5.56deg] hover:bg-[linear-gradient(135deg,#1c3de6_0%,#99aaff_100%)]"
              >
                <h4 className="font-bold text-title group-hover:text-white">{reason.title}</h4>
                <p className="mt-2 text-sm font-semibold text-primary group-hover:text-white">{reason.highlight}</p>
                <p className="mt-20 text-base leading-relaxed text-body group-hover:text-white">{reason.desc}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

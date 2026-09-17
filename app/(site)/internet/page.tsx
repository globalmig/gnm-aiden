"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import InternetPriceTable from "@/components/internet/InternetPriceTable";
import PriceCalculatorSection, { type TvChannel } from "@/components/internet/PriceCalculatorSection";
import {
  COMPANY_OPTIONS,
  SPEED_OPTIONS,
  getGiftRange,
  getLowestPrice,
  getPlans,
  isComboAvailable,
  type BundleType,
  type Company,
  type ProductType,
  type Speed,
} from "@/datas/internetPricing";

const KAKAO_CHANNEL_URL = "http://pf.kakao.com/_LHiAX/chat";

function isCompany(value: string | null): value is Company {
  return COMPANY_OPTIONS.some((option) => option.value === value);
}

const DISCOUNT_CARDS = [
  {
    title: "신규 가입 혜택",
    headline: "최대 47만원 현금+상품권 지원",
    desc: "3년 약정 기준 신규 가입 시 제공되는 최대 사은품 혜택입니다. 현금 입금 및 택배/모바일 상품권으로 지급됩니다.",
    audience: "타사 이용 중 통신사를 변경하거나 신규로 인터넷을 설치하시는 분",
    image: "/images/신규가입.png",
    imageWidth: 181,
    imageHeight: 217,
    className: "bg-linear-to-br from-benefit-new to-benefit-new-dark text-white",
  },
  {
    title: "제휴카드 청구할인",
    headline: "매월 7,000원 ~ 최대 28,000원 추가 청구할인",
    desc: "제휴 카드 이용 실적에 따라 매월 통신비가 청구할인됩니다. 기존 결합 할인과 중복 적용 가능하여 최저 요금으로 이용 가능합니다.",
    audience: "카드 생활비 이용 계획이 있고 매달 통신비를 대폭 줄이고 싶은 분",
    image: "/images/제휴카드할인.png",
    imageWidth: 169,
    imageHeight: 213,
    className: "bg-linear-to-br from-benefit-card to-benefit-card-light text-white",
  },
  {
    title: "잘 쉬운 가족결합",
    headline: "인터넷 월 최대 13,200원 할인! + 모바일 회선당 추가 할인",
    desc: "인터넷 속도(100M/500M/1G)에 따라 인터넷 요금이 차등 할인됩니다. KT 밴드를 사용하는 모바일 회선도 할인 가능하여 가성비가 뛰어납니다.",
    audience: "본인 또는 가족이 KT 모바일이나 KT 알뜰폰을 사용 중인 분",
    image: "/images/가족결합.png",
    imageWidth: 207,
    imageHeight: 185,
    className: "bg-linear-to-br from-benefit-family to-benefit-family-light text-white",
  },
  {
    title: "투게더 결합",
    headline: "모바일 최대 월 20,000원 ↓ + 인터넷 월 11,000원 ↓",
    desc: "모바일 무제한 요금제(85,000원 이상) 이용자가 모두 요금 혜택 적용가능하며, 가족뿐만 아니라 지인, 친구와도 묶어서 결합할인 받을 수 있습니다.",
    audience: "무제한 데이터 요금제를 사용하는 가족이나 지인이 있는 분",
    image: "/images/투게더결합.png",
    imageWidth: 204,
    imageHeight: 213,
    className: "bg-linear-to-br from-benefit-together to-benefit-together-dark text-title",
    headlineClassName: "text-[#FF5900]",
  },
  {
    title: "신혼부부 특별할인",
    headline: "모바일 6개월 요금 무료! + 월 최대 22,850원 할인",
    desc: "예비 부부(결혼) or 예식장 계약이나 신혼부부확인서(관련증빙서류) 등이 있는 분들이 대상입니다. 신혼용 인터넷 설치 시 통신비 부담을 확 줄이도록 도와드립니다.",
    audience: "신규로 입주 첫 인터넷/TV 신규 설치를 준비 중인 신혼부부",
    image: "/images/신혼혜택.png",
    imageWidth: 195,
    imageHeight: 218,
    bgImage: "/images/신혼-bg.png",
    className: "text-title",
  },
];

const INSTALL_FEE_ROWS: { label: string; internet: string; internet_tv: string; tvOnlyAdd: string }[] = [
  { label: "평일", internet: "36,000원 ~ 36,300원", internet_tv: "56,100원 ~ 56,200원", tvOnlyAdd: "15,400원 ~ 22,000원" },
  { label: "주말·야간 할증", internet: "45,000원 ~ 45,375원", internet_tv: "70,125원 ~ 71,250원", tvOnlyAdd: "19,250원 ~ 27,500원" },
];

const INSTALL_GUIDE = [
  { title: "청구 방식 : ", desc: "설치 비용은 첫 통신요금에 합산되어 1회 청구됩니다. (설치 당일 현금 결제 X)" },
  { title: "할증 기준 : ", desc: "주간, 공휴일 및 평일 야간 설치 시 25% 할증 요금이 적용됩니다." },
  { title: "동시 설치 권장 : ", desc: "TV를 함께 이용하시려면 인터넷과 TV 동시 설치 신청 시 출동비를 절약하실 수 있습니다." },
];

function InternetPageContent() {
  const searchParams = useSearchParams();
  const companyParam = searchParams.get("company");

  const [company, setCompany] = useState<Company>(isCompany(companyParam) ? companyParam : "kt");
  const [productType, setProductType] = useState<ProductType>("internet");
  const [bundleType, setBundleType] = useState<BundleType>("none");
  const [speed, setSpeed] = useState<Speed>("500");
  const [tvChannel, setTvChannel] = useState<TvChannel>("basic");

  // 홈 화면 등에서 통신사 파라미터를 바꿔 재진입해도(라우터 캐시로 리마운트 없이) 선택이 동기화되도록 처리
  useEffect(() => {
    if (isCompany(companyParam) && companyParam !== company) {
      setCompany(companyParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyParam]);

  // 통신사·상품유형·결합여부를 바꿔서 현재 속도 조합에 데이터가 없어지면, 있는 속도로 자동 대체해서 보여준다
  const effectiveSpeed = isComboAvailable(company, productType, speed, bundleType)
    ? speed
    : (SPEED_OPTIONS.find((option) => isComboAvailable(company, productType, option.value, bundleType))?.value ?? speed);

  const selectedCompanyLabel = COMPANY_OPTIONS.find((option) => option.value === company)?.label;
  const selectedPlans = getPlans(company, productType, effectiveSpeed, bundleType);
  const selectedPrice = getLowestPrice(selectedPlans);
  const selectedGift = getGiftRange(company, productType, effectiveSpeed);
  const nonePlan = getLowestPrice(getPlans(company, productType, effectiveSpeed, "none"));
  const mobilePlan = getLowestPrice(getPlans(company, productType, effectiveSpeed, "mobile"));

  return (
    <>
      <section className="bg-white">
        <div>
          <h1 className="font-bold text-title">원하시는 조건을 골라 예상 월 요금을 확인해보세요.</h1>

          <PriceCalculatorSection
            company={company}
            productType={productType}
            bundleType={bundleType}
            speed={effectiveSpeed}
            tvChannel={tvChannel}
            onCompanyChange={setCompany}
            onProductTypeChange={setProductType}
            onBundleTypeChange={setBundleType}
            onSpeedChange={setSpeed}
            onTvChannelChange={setTvChannel}
            selectedPlans={selectedPlans}
            selectedPrice={selectedPrice}
            selectedGift={selectedGift}
            nonePlan={nonePlan}
            mobilePlan={mobilePlan}
          >
            <div className="card rounded-2xl mt-20 pc:mt-25">

              {/* hero title */}
              <div className="rounded-tr-2xl rounded-tl-2xl border py-9 px-5 pc:p-9 text-center text-white bg-[linear-gradient(135deg,#1C3DE6_0%,#95A6FE_100%)]">
                <p className="text-base font-semibold">속도별 실제 납부 금액부터 체크, <br className="pc:hidden"/> 설치 전 미리보기</p>
                <h3 className="mt-2 font-bold text-xl pc:text-3xl">
                  머리 아픈 가입 조건은 싹 줄이고
                  <br />
                  꼭 필요한 핵심만 담았습니다.
                </h3>
              </div>

              <div className="px-2.5 pc:p-12.5 space-y-20 pc:space-y-25">
                {/* 인터넷 요금표 한눈에 보기 */}
                <div>
                  <div className="mt-8 text-center">
                    <p className="caption font-semibold">{selectedCompanyLabel} 인터넷 요금표 한눈에 보기</p>
                  </div>
                  <div className="mt-8">
                    <InternetPriceTable company={company} />
                  </div>
                </div>

                {/* 할인 혜택 */}
                <div>
                  <div>
                    <div className="text-center">
                      <span className="caption font-semibold">인터넷 + TV 결합 할인 체크</span>
                      <h2 className="mt-8 font-bold text-title">놓치면 손해보는 {selectedCompanyLabel} 전용 결합 할인 혜택!</h2>
                      <p className="mt-4 text-body">내 상황에 딱 맞는 할인 항목을 선택해 월 통신비를 최소화해보세요.</p>
                    </div>

                    <div className="mt-10 space-y-4 pc:space-y-6">
                      {DISCOUNT_CARDS.map((card) => (
                        <div
                          key={card.title}
                          style={card.bgImage ? { backgroundImage: `url(${card.bgImage})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
                          className={`relative overflow-hidden rounded-2xl p-6 pc:py-10 ${card.className}`}
                        >
                          <div className="flex justify-between">
                            <div className="hidden pc:flex w-1/4 shrink-0 items-center justify-center self-stretch">
                              <Image
                                src={card.image}
                                alt={card.title}
                                width={card.imageWidth}
                                height={card.imageHeight}
                                className="h-auto w-full object-contain"
                              />
                            </div>
                            <div className="w-full pc:w-2/3">
                              <p className="text-xs font-bold opacity-80">{card.title}</p>
                              <h3 className={`mt-1 text-lg font-bold pc:text-2xl ${card.headlineClassName ?? ""}`}>
                                {card.headline}
                              </h3>
                              <ul className="mt-2 space-y-1">
                                {card.desc.split(/(?<=\.)\s+/).map((sentence) => (
                                  <li key={sentence} className="flex gap-2 text-sm opacity-90 pc:text-base">
                                    <span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-current pc:mt-3" />
                                    {sentence}
                                  </li>
                                ))}
                              </ul>
                              <p className="mt-4 text-xs font-semibold pc:text-sm">추천대상</p>
                              <p className="text-sm opacity-90 pc:text-base">{card.audience}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <ul className="mt-6 space-y-2 p-5 bg-sky-light rounded-2xl text-sm">
                      <li className="list-disc list-inside">모든 할인 혜택은 3년 약정 기준이며, 중도 해지 시 위약금이 발생할 수 있습니다.</li>
                      <li className="list-disc list-inside">결합 할인 및 제휴카드 할인 등 고객님의 사용 조건(요금제, 카드 실적 등)에 따라 최종 청구 금액이 달라질 수 있으므로, 전문 상담원을 통해 정확한 안내를 받아보시는 것을 권장합니다.</li>
                    </ul>
                  </div>
                </div>

                {/* 설치 비용 및 안내 */}
                <div>
                  <div className="text-center">
                    <span className="caption font-semibold">설치 안내 및 비용</span>
                    <h2 className="mt-8 font-bold text-title">설치 전 꼭 체크해야할 비용 안내</h2>
                    <p className="mt-4 text-body">당일 결제 없이, 첫 요금서에서 깔끔하게 확인하세요.</p>
                  </div>

                  <div className="mt-8 table-scroll">
                    <table className="w-full min-w-125 border-collapse text-center">
                      <thead>
                        <tr className="border-b border-black/10 text-base text-title">
                          <th className="py-3 pr-4 font-semibold">구분</th>
                          <th className="px-2 py-3 font-semibold">인터넷 단독</th>
                          <th className="px-2 py-3 font-semibold">인터넷+TV</th>
                          <th className="px-2 py-3 font-semibold">TV 1대 추가</th>
                        </tr>
                      </thead>
                      <tbody>
                        {INSTALL_FEE_ROWS.map((row) => (
                          <tr key={row.label} className="border-b border-black/5 text-body">
                            <td className="py-4 pr-4 text-base">{row.label}</td>
                            <td className="px-2 py-4">{row.internet}</td>
                            <td className="px-2 py-4">{row.internet_tv}</td>
                            <td className="px-2 py-4">{row.tvOnlyAdd}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <ul className="mt-6 space-y-2 p-5 bg-sky-light rounded-2xl text-sm">
                    {INSTALL_GUIDE.map((item) => (
                      <li key={item.title} className="list-disc list-inside text-sm">
                        <span className="font-bold">{item.title}</span> {item.desc}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 하단 문의 CTA */}
                <div
                  className="text-center pb-10"
                >
                  <h2 className="font-bold text-title">
                    더 궁금하신 사항이 있으시다면
                    <br />
                    부담없이 문의주세요!
                  </h2>
                  <p className="mt-4 text-body">복잡한 조건 비교부터 나에게 맞는 결합 할인까지<br />전문 상담원이 알기 쉽게 찾아드립니다.</p>
                  <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link href="/inquiry/write" className="bg-[rgba(185,213,254,0.5)] text-primary font-semibold rounded-full px-8 py-3">
                      전문 상담원 연결
                    </Link>
                    <Link
                      href={KAKAO_CHANNEL_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full bg-[#FFE41B] px-8 py-3 text-base font-semibold text-[#3c1e1e]"
                    >
                      카카오톡 상담
                    </Link>
                  </div>
                </div>

              </div>

            </div>

          </PriceCalculatorSection>
        </div>
      </section>
    </>
  );
}

export default function InternetPage() {
  return (
    <Suspense fallback={null}>
      <InternetPageContent />
    </Suspense>
  );
}

import HeroSlide from "@/components/slide/HeroSlide";
import TelecomShortcuts from "@/components/home/TelecomShortcuts";
import CustomerReviews from "@/components/home/CustomerReviews";
import PopularBundles from "@/components/home/PopularBundles";
import TvProductCarousel from "@/components/home/TvProductCarousel";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Link from "next/link";

export default function Home() {
  return (
    <>

      <main>
        <HeroSlide />
      </main>

      {/* 통신사별 인터넷 페이지로 이동하기 */}
      <div className="w-full mt-20 pc:max-w-300 pc:mx-auto">
        <TelecomShortcuts />
      </div>

      {/* 왜 수많은 고객이 선택했을까요? */}
      <div className="mt-20">
        <WhyChooseUs />
      </div>

      {/* 실제 이용 고객님들의 솔직한 후기 */}
      <CustomerReviews />

      {/* 가장 많이 찾는 인기 결합 상품 */}
      <PopularBundles />

      {/* 추천 TV 상품 */}
      <TvProductCarousel />

      {/* CTA */}
      <div className="w-full mt-20 px-[5%] pb-25 pc:max-w-300 pc:mx-auto pc:px-0">
        <div
          className="rounded-3xl bg-cover bg-center px-8 py-10 text-white pc:flex pc:items-end pc:justify-between"
          style={{ backgroundImage: "url('/images/cta-bg.png')" }}
        >
          <div>
            <h2 className="text-xl font-bold pc:text-2xl">내 월 요금과 최대 혜택을 바로 확인하세요.</h2>
            <p className="mt-3 text-base text-white/90 pc:text-base pc:mb-10">
              복잡한 조건 없이 1분만에 문의하세요.
              <br />
              365일 24시간 언제나 열려있습니다.
            </p>
          </div>
          <Link
            href="#"
            className="mt-6 flex w-full items-center justify-center rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-title pc:mt-0 pc:w-auto pc:shrink-0"
          >
            지금 내 맞춤 혜택 조회하기
          </Link>
        </div>
      </div>
    </>
  );
}

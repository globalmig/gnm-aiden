import Image from "next/image";
import Link from "next/link";

type Bundle = {
  id: string;
  speed: string;
  type: string;
  extra: string;
  price: string;
  desc: string;
};

const BUNDLES: Bundle[] = [
  {
    id: "kt-family",
    speed: "500Mbps",
    type: "인터넷 + TV",
    extra: "238채널 · 베이직",
    price: "36,000원",
    desc: "온 가족 KT 모바일 사용자라면 필수 선택!",
  },
  {
    id: "kt-4people",
    speed: "500Mbps",
    type: "인터넷 + TV",
    extra: "238채널 · 베이직",
    price: "36,000원",
    desc: "3~4인 가구 및 OTT/유튜브 시청이 많은 가구 추천",
  },
  {
    id: "kt-family-discount",
    speed: "500Mbps",
    type: "인터넷 + TV",
    extra: "238채널 · 베이직",
    price: "36,000원",
    desc: "온가족할인/요금회선 결합 시 매월 대폭 할인",
  },
  {
    id: "kt-single",
    speed: "500Mbps",
    type: "인터넷 + TV",
    extra: "238채널 · 베이직",
    price: "36,000원",
    desc: "자취생 & 원룸 거주자를 위한 최적의 실속형",
  },
  {
    id: "kt-speed",
    speed: "500Mbps",
    type: "인터넷 + TV",
    extra: "238채널 · 베이직",
    price: "36,000원",
    desc: "끊김 없는 빠른 속도! 게임 & 대용량 다운로드 전용",
  },
  {
    id: "kt-newlywed",
    speed: "500Mbps",
    type: "인터넷 + TV",
    extra: "238채널 · 베이직",
    price: "36,000원",
    desc: "신혼집 입주 필수! 와이파이 음영 없이 빵빵하게",
  },
];

function BundleCard({ bundle }: { bundle: Bundle }) {
  return (
    <article className="card flex h-full flex-col">
      <div className="p-6 pc:p-8">
        <div className="flex items-center gap-4 pc:justify-center pc:gap-6">
          <Image src="/images/logo_kt.png" alt="KT" width={57} height={47} className="h-7 w-auto object-contain pc:h-8.5" />
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 pc:h-16 pc:w-16 items-center justify-center rounded-full bg-sky-light">
              <Image src="/icons/icon_wifi.png" alt="인터넷 아이콘" width={25} height={20} className="h-4 w-auto object-contain pc:h-5" />
            </span>
            <span className="text-base text-muted pc:text-[1.5rem]">+</span>
            <span className="flex h-9 w-9 pc:h-16 pc:w-16 items-center justify-center rounded-full bg-sky-light">
              <Image src="/icons/icon_tv.png" alt="TV 아이콘" width={22} height={25} className="h-4 w-auto object-contain pc:h-5" />
            </span>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 pc:mt-8 pc:gap-4 pc:justify-center">
          <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-white pc:px-4">{bundle.speed}</span>
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-title pc:px-4">
            {bundle.type}
          </span>
          <span className="text-xs text-body font-semibold">{bundle.extra}</span>
        </div>

        <p className="mt-5 text-xs text-muted">월 예상 요금</p>
        <p className="mt-1 text-2xl font-bold text-title">{bundle.price}</p>

        <p className="mt-5 rounded-lg bg-sky-light px-4 py-2 text-center text-xs leading-relaxed text-body pc:mt-8">
          {bundle.desc}
        </p>
      </div>
      <Link
        href="#"
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
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-sky-light/0 to-sky-light">
      <PopularBundlesBackground />
      <div className="relative">
        <h2 className="text-center font-bold text-title">가장 많이 찾는 인기 결합 상품</h2>
        <p className="mt-3 text-center text-body">라이프스타일에 맞춰 통신사와 속도를 선택해보세요.</p>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 pc:grid-cols-3 pc:gap-6">
          {BUNDLES.map((bundle) => (
            <BundleCard key={bundle.id} bundle={bundle} />
          ))}
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

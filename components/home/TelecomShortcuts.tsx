import Image from "next/image";
import Link from "next/link";

const TELECOM_LINKS: { key: string; name: string; logo: string; width: number; height: number }[] = [
  { key: "kt", name: "KT", logo: "/images/logo_kt.png", width: 57, height: 47 },
  { key: "sk", name: "SK", logo: "/images/logo_sk.png", width: 70, height: 55 },
  { key: "lgu", name: "LG U+", logo: "/images/logo-uplus.png", width: 94, height: 43 },
  { key: "kt-skylife", name: "KT스카이라이프", logo: "/images/logo_skylife.png", width: 88, height: 64 },
  { key: "lg-hellovision", name: "LG헬로비전", logo: "/images/logo-lg-hellowVision.png", width: 97, height: 49 },
];

export default function TelecomShortcuts() {
  return (
    <ul className="flex flex-wrap justify-center gap-x-5 gap-y-6 pc:flex-nowrap pc:justify-between pc:gap-0">
      {TELECOM_LINKS.map((item) => (
        <li key={item.key} className="shrink-0">
          <Link href={`/internet?company=${item.key}`} className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-card transition-shadow duration-300 hover:shadow-[0_2.6px_20px_0_rgb(222_225_234/0.8)] pc:h-30 pc:w-30">
              <Image
                src={item.logo}
                alt={item.name}
                width={item.width}
                height={item.height}
                className="h-auto max-h-8 w-auto max-w-14 object-contain pc:max-h-9 pc:max-w-16"
              />
            </div>
            <p className="text-base font-medium text-body">{item.name}</p>
          </Link>
        </li>
      ))}

      <li className="shrink-0">
        <Link href="/tv" className="flex flex-col items-center gap-3 text-center">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-card pc:h-30 pc:w-30">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <p className="animate-float inline-block rounded-full bg-point px-2 py-0.5 text-[10px] font-bold whitespace-nowrap text-white pc:text-base pc:px-4">
                NEW
              </p>
            </div>
            <Image
              src="/images/icon-menu-tv.png"
              alt=""
              width={92}
              height={61}
              className="h-auto max-h-8 w-auto max-w-12 object-contain"
            />
          </div>
          <span className="text-base font-medium text-body">TV 상품 둘러보기</span>
        </Link>
      </li>
    </ul>
  );
}

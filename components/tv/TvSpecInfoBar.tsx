import Image from "next/image";
import type { TvProduct } from "@/components/tv/TvProductItem";
import type { TvProductDetail } from "@/datas/tvProductDetails";

export default function TvSpecInfoBar({
  product,
  detail,
}: {
  product: TvProduct;
  detail: TvProductDetail;
}) {
  const items = [
    { icon: "/icons/icon-렌탈료.svg", label: "렌탈료", value: detail.rentalBucketLabel },
    { icon: "/icons/icon-tv종류.svg", label: "TV종류", value: product.specs.tvType },
    { icon: "/icons/icon-화면크기.svg", label: "TV 화면크기", value: product.specs.screenSize },
    { icon: "/icons/icon-편의기능.svg", label: "편의기능 개수", value: `${detail.featureCount}개` },
    { icon: "/icons/icon-해상도.svg", label: "해상도", value: product.specs.resolution },
    { icon: "/icons/icon-사운드.svg", label: "사운드 채널/출력", value: `${detail.soundChannel}/${detail.soundOutput}` },
  ];

  return (
    <div>
      <p className="font-bold text-title">스펙 정보</p>
      <div className="mt-4 grid grid-cols-3 gap-y-6 rounded-2xl border border-black/5 bg-white p-6 shadow-card sm:grid-cols-6">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-2 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-light">
              <Image src={item.icon} alt="" width={20} height={20} className="h-5 w-5" />
            </span>
            <p className="text-sm font-bold text-title">{item.label}</p>
            <p className="text-xs text-muted">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

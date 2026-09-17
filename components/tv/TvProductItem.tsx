import Link from "next/link";
import Skeleton from "@/components/ui/Skeleton";

export type TvProductSpecs = {
  screenSize: string;
  tvType: string;
  resolution: string;
  power: string;
  energyGrade: string;
};

export type TvProduct = {
  id: string;
  brand: string;
  title: string;
  model: string;
  specs: TvProductSpecs;
};

const SPEC_LABELS: { key: keyof TvProductSpecs; label: string }[] = [
  { key: "screenSize", label: "화면크기" },
  { key: "tvType", label: "TV 종류" },
  { key: "resolution", label: "해상도" },
  { key: "power", label: "소비전력" },
  { key: "energyGrade", label: "에너지 효율 등급" },
];

export default function TvProductItem({ product }: { product: TvProduct }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-[#ccc] p-6">
      <Skeleton className="m-0! h-36 w-full rounded-xl p-0!" />

      <p className="mt-5 text-xs text-body">{product.brand}</p>
      <p className="mt-1 truncate text-xl leading-snug font-semibold text-title">{product.title}</p>
      <p className="mt-1 text-xs text-muted pc:mt-2">{product.model}</p>

      <ul className="mt-4 flex flex-col">
        {SPEC_LABELS.map(({ key, label }) => (
          <li
            key={key}
            className="flex items-center justify-between border-b border-gray-100 py-2.5 text-base last:border-b-0"
          >
            <p className="font-medium text-title">{label}</p>
            <span className="text-muted">{product.specs[key]}</span>
          </li>
        ))}
      </ul>

      <Link href={`/tv/${product.id}`} className="btn-primary mt-6 w-full py-2.5 text-base">
        자세히 보기
      </Link>
    </div>
  );
}

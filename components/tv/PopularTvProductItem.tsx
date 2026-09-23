import Link from "next/link";
import Skeleton from "@/components/ui/Skeleton";
import { specStr } from "@/datas/tvProductDetails";
import type { Product } from "@/types/product";

export default function PopularTvProductItem({ product }: { product: Product }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[#ccc] p-4 pc:gap-6 pc:px-5 pc:py-7.5">
      <Skeleton className="m-0! aspect-square w-28 shrink-0 rounded-xl p-0! sm:w-36 pc:w-45" />

      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted pc:text-sm">{product.brand}</p>
        <p className="mt-1 line-clamp-2 text-base leading-snug font-bold text-title pc:mt-2 pc:text-xl">
          {product.name}
        </p>
        <p className="mt-1 truncate text-xs text-muted pc:text-sm">{specStr(product.specs, "model")}</p>

        <Link
          href={`/tv/${product.id}`}
          className="btn-primary mt-3 rounded-full px-6 py-2 text-sm pc:mt-4 pc:px-8 pc:py-2.5 pc:text-base"
        >
          자세히 보기
        </Link>
      </div>
    </div>
  );
}

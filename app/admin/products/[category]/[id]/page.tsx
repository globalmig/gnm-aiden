"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Skeleton from "@/components/ui/Skeleton";
import TvSpecInfoBar from "@/components/tv/TvSpecInfoBar";
import TvSpecTable, { type TvSpecRow } from "@/components/tv/TvSpecTable";
import { getCategoryDef } from "@/datas/productCategories";
import { getTvProductDetail, specStr } from "@/datas/tvProductDetails";
import type { Product } from "@/types/product";

function TvDetailSections({ product }: { product: Product }) {
    const detail = getTvProductDetail(product);

    const basicInfoRows: TvSpecRow[] = [
        { label: "브랜드", value: product.brand },
        { label: "제품명", value: product.name },
        { label: "모델명", value: specStr(product.specs, "model") },
        { label: "최저렌탈료", value: `${product.price.toLocaleString()}원`, bold: true },
        { label: "크기(WDH)", value: detail.dimensions },
        { label: "무게(Kg)", value: detail.weight },
        { label: "에너지 소비효율", value: specStr(product.specs, "energyGrade") },
        { label: "소비전력", value: specStr(product.specs, "power") },
        { label: "출시년도", value: detail.releaseYear },
    ];

    const colorRows: TvSpecRow[] = [
        { label: "색상", value: detail.color },
        { label: "색 명칭", value: detail.colorName },
    ];

    const displayRows: TvSpecRow[] = [
        { label: "크기(인치)", value: detail.sizeRangeLabel },
        { label: "패널타입", value: detail.panelType },
        { label: "해상도", value: specStr(product.specs, "resolution") },
        { label: "화질 부가기능", value: detail.displayFeatures },
    ];

    const soundRows: TvSpecRow[] = [
        { label: "채널", value: detail.soundChannel },
        { label: "출력", value: detail.soundOutput },
        { label: "사운드 부가기능", value: detail.soundFeatures },
        { label: "돌비에트모스 유무", value: detail.dolbyAtmos },
    ];

    const convenienceRows: TvSpecRow[] = [
        { label: "부가기능", value: detail.additionalFeatures },
        { label: "스마트기능", value: detail.smartFeatures },
        { label: "연결기능", value: detail.connectivity },
    ];

    return (
        <>
            <TvSpecInfoBar product={product} detail={detail} />
            <TvSpecTable title="상품 기본 정보" rows={basicInfoRows} />
            <TvSpecTable title="상품 색상" rows={colorRows} />
            <TvSpecTable title="화질 & 크기" rows={displayRows} />
            <TvSpecTable title="사운드" rows={soundRows} />
            <TvSpecTable title="편의기능" rows={convenienceRows} />
        </>
    );
}

function GenericDetailSections({ product }: { product: Product }) {
    const rows: TvSpecRow[] = [
        { label: "브랜드", value: product.brand },
        { label: "제품명", value: product.name },
        { label: "가격", value: `${product.price.toLocaleString()}원`, bold: true },
        ...Object.entries(product.specs).map(([key, value]) => ({ label: key, value: String(value ?? "") })),
    ];

    return <TvSpecTable title="상품 정보" rows={rows} />;
}

export default function AdminProductDetailPage({ params }: { params: Promise<{ category: string; id: string }> }) {
    const { category, id } = use(params);
    const categoryDef = getCategoryDef(category);

    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        setIsError(false);
        fetch(`/api/products/${id}`)
            .then((res) => res.json())
            .then((result) => setProduct(result.data))
            .catch(() => setIsError(true))
            .finally(() => setIsLoading(false));
    }, [id]);

    if (!categoryDef) notFound();

    return (
        <div className="card p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <Link href={`/admin/products/${category}`} className="text-sm text-muted hover:text-primary">
                        {"< 목록으로"}
                    </Link>
                    <h1 className="mt-1 text-lg font-bold text-title">{categoryDef.label} 상품 상세</h1>
                </div>
                <Link href={`/admin/products/${category}/${id}/edit`} className="admin-btn-primary">
                    수정하기
                </Link>
            </div>

            {isLoading && <p className="mt-6 text-base text-muted">불러오는 중...</p>}
            {isError && <p className="mt-6 text-base text-red-400">상품을 불러오지 못했습니다.</p>}

            {product && (
                <div className="mt-8 space-y-10">
                    <Skeleton className="mx-auto! my-0! aspect-video w-full max-w-140 rounded-2xl p-0!" />
                    {category === "tv" ? <TvDetailSections product={product} /> : <GenericDetailSections product={product} />}
                </div>
            )}
        </div>
    );
}

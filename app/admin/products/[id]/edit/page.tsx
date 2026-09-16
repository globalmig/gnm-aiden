"use client";

import { use, useEffect, useState } from "react";
import ProductForm from "@/components/form/ProductForm";
import type { Product } from "@/types/product";

export default function AdminProductEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        fetch(`/api/products/${id}`)
            .then((res) => res.json())
            .then((result) => setProduct(result.data))
            .catch(() => setIsError(true))
            .finally(() => setIsLoading(false));
    }, [id]);

    return (
        <div>
            <h1 className="mb-6 text-lg font-bold text-title">상품 수정</h1>

            {isLoading && <p className="text-base text-muted">불러오는 중...</p>}
            {isError && <p className="text-base text-red-400">상품을 불러오지 못했습니다.</p>}
            {product && <ProductForm editId={id} initialData={product} />}
        </div>
    );
}
